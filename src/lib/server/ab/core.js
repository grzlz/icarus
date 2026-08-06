/*
 * Assignment engine. A visitor (vid cookie) hitting a route with active
 * experiments gets a variant per experiment:
 *
 *   1. A stored assignment always wins — weights can be edited mid-flight
 *      without reshuffling visitors who were already bucketed.
 *   2. New visitors are bucketed by FNV-1a hash of vid:slug against the
 *      variant weights — deterministic, so concurrent requests agree.
 *
 * Everything reads/writes through prepared statements; with WAL this is
 * microseconds per request, so there's no cache to invalidate.
 */
import db from './schema.js';

/* Conversion events the dashboard can pick as an experiment's primary metric.
 * 'tiempo' (seconds on page) is continuous, not a conversion — it's always
 * reported as a secondary stat instead. */
export const METRICS = [
	{ id: 'registro', label: 'Suscripción al correo' },
	{ id: 'whatsapp', label: 'Click a WhatsApp (intención de compra)' },
	{ id: 'producto', label: 'Interacción con producto' },
	{ id: 'filtro', label: 'Uso de filtros' }
];

export const EVENT_NAME_RE = /^[a-z][a-z0-9-]{0,31}$/;

const BOT_RE =
	/bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|preview|curl|wget|python|httpx|headless|lighthouse|pingdom|uptime/i;

export const isBot = (ua) => !ua || BOT_RE.test(ua);

/* FNV-1a 32-bit → bucket 0..9999. Stable across processes and restarts. */
export function bucket(vid, slug) {
	const str = `${vid}:${slug}`;
	let h = 0x811c9dc5;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
	}
	return (h >>> 0) % 10000;
}

const activeForPath = db.prepare(`
	SELECT id, slug, kind, path, metric FROM experiments
	WHERE status = 'activo' AND path = ?
`);
const variantsOf = db.prepare(`
	SELECT key, name, weight, is_control, payload FROM variants
	WHERE experiment_id = ? ORDER BY is_control DESC, key
`);
const getAssignment = db.prepare(`
	SELECT variant_key FROM assignments WHERE vid = ? AND experiment_id = ?
`);
const putAssignment = db.prepare(`
	INSERT OR IGNORE INTO assignments (vid, experiment_id, variant_key) VALUES (?, ?, ?)
`);

function pickVariant(vid, experiment, variants) {
	const b = bucket(vid, experiment.slug);
	const total = variants.reduce((s, v) => s + v.weight, 0) || 1;
	let acc = 0;
	for (const v of variants) {
		acc += (v.weight / total) * 10000;
		if (b < acc) return v;
	}
	return variants[0];
}

function parsePayload(json) {
	try {
		const p = JSON.parse(json);
		return p && typeof p === 'object' ? p : {};
	} catch {
		return {};
	}
}

/*
 * Assign the visitor to every active experiment on this path. Returns
 * { [slug]: { variant, kind, payload } } — what pages read via page data.
 * The INSERT is the exposure record.
 */
export function assignAll(vid, path) {
	const result = {};
	for (const exp of activeForPath.all(path)) {
		const variants = variantsOf.all(exp.id);
		if (!variants.length) continue;
		let key = getAssignment.get(vid, exp.id)?.variant_key;
		let variant = key && variants.find((v) => v.key === key);
		if (!variant) {
			variant = pickVariant(vid, exp, variants);
			putAssignment.run(vid, exp.id, variant.key);
		}
		result[exp.slug] = {
			variant: variant.key,
			kind: exp.kind,
			payload: parsePayload(variant.payload)
		};
	}
	return result;
}

const insertEvent = db.prepare(`
	INSERT INTO ab_events (vid, name, value, path, meta) VALUES (?, ?, ?, ?, ?)
`);

export function recordEvent(vid, { name, value = null, path = null, meta = null }) {
	if (!vid || !EVENT_NAME_RE.test(name ?? '')) return false;
	const num = value === null || value === undefined ? null : Number(value);
	if (num !== null && (!Number.isFinite(num) || Math.abs(num) > 1e9)) return false;
	insertEvent.run(
		String(vid).slice(0, 64),
		name,
		num,
		path ? String(path).slice(0, 128) : null,
		meta ? String(meta).slice(0, 256) : null
	);
	return true;
}
