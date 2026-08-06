/*
 * CRUD + aggregation for the experiments dashboard. Lifecycle is a strict
 * state machine — weights and 'ajuste' payloads stay editable while running
 * (assignments are sticky, so edits never reshuffle bucketed visitors), but
 * structure (variants, route, metric) freezes once an experiment leaves
 * borrador.
 */
import db from './schema.js';
import { compareVariants } from './stats.js';

export const KINDS = ['pagina', 'seccion', 'ajuste'];
export const TRANSITIONS = {
	borrador: ['activo'],
	activo: ['pausado', 'terminado'],
	pausado: ['activo', 'terminado'],
	terminado: []
};

export const slugify = (s) =>
	s
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 48);

export function listExperiments() {
	return db
		.prepare(
			`SELECT e.*,
			  (SELECT COUNT(*) FROM assignments a WHERE a.experiment_id = e.id) AS expuestos,
			  (SELECT COUNT(*) FROM variants v WHERE v.experiment_id = e.id) AS n_variantes
			 FROM experiments e
			 ORDER BY CASE e.status
			   WHEN 'activo' THEN 0 WHEN 'pausado' THEN 1 WHEN 'borrador' THEN 2 ELSE 3
			 END, e.created_at DESC`
		)
		.all();
}

export function getExperiment(slug) {
	const exp = db.prepare('SELECT * FROM experiments WHERE slug = ?').get(slug);
	if (!exp) return null;
	exp.variants = db
		.prepare(
			'SELECT key, name, weight, is_control, payload FROM variants WHERE experiment_id = ? ORDER BY is_control DESC, key'
		)
		.all(exp.id);
	return exp;
}

/* variants: [{ key, name, weight, is_control, payload }] — validated by caller. */
export const createExperiment = db.transaction((exp, variants) => {
	const { lastInsertRowid } = db
		.prepare(
			`INSERT INTO experiments (slug, name, hypothesis, kind, path, target, metric)
			 VALUES (@slug, @name, @hypothesis, @kind, @path, @target, @metric)`
		)
		.run(exp);
	const insert = db.prepare(
		`INSERT INTO variants (experiment_id, key, name, weight, is_control, payload)
		 VALUES (?, @key, @name, @weight, @is_control, @payload)`
	);
	for (const v of variants) insert.run(lastInsertRowid, v);
	return lastInsertRowid;
});

export function setStatus(slug, next) {
	const exp = db.prepare('SELECT id, status FROM experiments WHERE slug = ?').get(slug);
	if (!exp || !TRANSITIONS[exp.status]?.includes(next)) return false;
	db.prepare(
		`UPDATE experiments SET status = ?,
		   started_at = CASE WHEN ? = 'activo' AND started_at IS NULL
		     THEN datetime('now','localtime') ELSE started_at END,
		   ended_at = CASE WHEN ? = 'terminado'
		     THEN datetime('now','localtime') ELSE ended_at END
		 WHERE id = ?`
	).run(next, next, next, exp.id);
	return true;
}

export function declareWinner(slug, key) {
	const exp = getExperiment(slug);
	if (!exp || !exp.variants.some((v) => v.key === key)) return false;
	if (!['activo', 'pausado'].includes(exp.status)) return false;
	db.prepare(
		`UPDATE experiments SET status = 'terminado', winner = ?,
		   ended_at = datetime('now','localtime') WHERE id = ?`
	).run(key, exp.id);
	return true;
}

/* weights: { [key]: percent } — must cover every variant and sum to 100. */
export function updateWeights(slug, weights) {
	const exp = getExperiment(slug);
	if (!exp || exp.status === 'terminado') return false;
	const values = exp.variants.map((v) => Math.round(Number(weights[v.key])));
	if (values.some((w) => !Number.isFinite(w) || w < 0 || w > 100)) return false;
	if (values.reduce((s, w) => s + w, 0) !== 100) return false;
	const update = db.prepare('UPDATE variants SET weight = ? WHERE experiment_id = ? AND key = ?');
	db.transaction(() => {
		exp.variants.forEach((v, i) => update.run(values[i], exp.id, v.key));
	})();
	return true;
}

export function updatePayload(slug, key, payloadJson) {
	const exp = getExperiment(slug);
	if (!exp || exp.status === 'terminado') return false;
	try {
		const parsed = JSON.parse(payloadJson);
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return false;
		db.prepare('UPDATE variants SET payload = ? WHERE experiment_id = ? AND key = ?').run(
			JSON.stringify(parsed),
			exp.id,
			key
		);
		return true;
	} catch {
		return false;
	}
}

export function deleteExperiment(slug) {
	const exp = db.prepare('SELECT id, status FROM experiments WHERE slug = ?').get(slug);
	if (!exp || exp.status !== 'borrador') return false;
	db.transaction(() => {
		db.prepare('DELETE FROM variants WHERE experiment_id = ?').run(exp.id);
		db.prepare('DELETE FROM experiments WHERE id = ?').run(exp.id);
	})();
	return true;
}

/*
 * Everything the detail page needs: per-variant exposures, conversions on the
 * primary metric (distinct visitors, event at-or-after assignment), Bayesian
 * comparison, time-on-page, full event breakdown, and daily exposure trend.
 */
export function experimentStats(slug) {
	const exp = getExperiment(slug);
	if (!exp) return null;

	const exposures = db
		.prepare(
			`SELECT variant_key AS key, COUNT(*) AS exposed
			 FROM assignments WHERE experiment_id = ? GROUP BY variant_key`
		)
		.all(exp.id);
	const conversions = db
		.prepare(
			`SELECT a.variant_key AS key, COUNT(DISTINCT e.vid) AS converted
			 FROM assignments a
			 JOIN ab_events e ON e.vid = a.vid AND e.name = ? AND e.created_at >= a.created_at
			 WHERE a.experiment_id = ? GROUP BY a.variant_key`
		)
		.all(exp.metric, exp.id);
	const tiempo = db
		.prepare(
			`SELECT a.variant_key AS key, AVG(e.value) AS avg_seconds, COUNT(*) AS n
			 FROM assignments a
			 JOIN ab_events e ON e.vid = a.vid AND e.name = 'tiempo'
			   AND e.path = ? AND e.created_at >= a.created_at
			 WHERE a.experiment_id = ? GROUP BY a.variant_key`
		)
		.all(exp.path, exp.id);
	const breakdown = db
		.prepare(
			`SELECT a.variant_key AS key, e.name, COUNT(*) AS total, COUNT(DISTINCT e.vid) AS visitors
			 FROM assignments a
			 JOIN ab_events e ON e.vid = a.vid AND e.created_at >= a.created_at
			 WHERE a.experiment_id = ? AND e.name != 'tiempo'
			 GROUP BY a.variant_key, e.name ORDER BY e.name`
		)
		.all(exp.id);
	const daily = db
		.prepare(
			`SELECT date(created_at) AS day, COUNT(*) AS n FROM assignments
			 WHERE experiment_id = ? GROUP BY day ORDER BY day DESC LIMIT 14`
		)
		.all(exp.id)
		.reverse();

	const byKey = (list) => Object.fromEntries(list.map((r) => [r.key, r]));
	const conv = byKey(conversions);
	const expo = byKey(exposures);
	const time = byKey(tiempo);

	const rows = exp.variants.map((v) => ({
		key: v.key,
		is_control: v.is_control,
		exposed: expo[v.key]?.exposed ?? 0,
		converted: conv[v.key]?.converted ?? 0
	}));
	const bayes = byKey(compareVariants(rows));

	const variants = exp.variants.map((v, i) => ({
		...v,
		exposed: rows[i].exposed,
		converted: rows[i].converted,
		...bayes[v.key],
		avgSeconds: time[v.key]?.avg_seconds ?? null,
		timeSamples: time[v.key]?.n ?? 0
	}));

	return { ...exp, variants, breakdown, daily };
}
