import { fail, redirect } from '@sveltejs/kit';
import { METRICS } from '$lib/server/ab/core.js';
import { KINDS, createExperiment, getExperiment, slugify } from '$lib/server/ab/queries.js';

/* Rutas de la tienda donde puede correr un experimento. */
const ROUTES = ['/', '/taller'];
const KEYS = 'abcdefgh';

export function load() {
	return { metrics: METRICS, kinds: KINDS, routes: ROUTES };
}

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const hypothesis = data.get('hypothesis')?.toString().trim() || null;
		const kind = data.get('kind')?.toString();
		const path = data.get('path')?.toString().trim() || '/';
		const target = data.get('target')?.toString().trim() || null;
		const metric = data.get('metric')?.toString();

		if (!name) return fail(400, { error: 'Falta el nombre' });
		if (!KINDS.includes(kind)) return fail(400, { error: 'Tipo inválido' });
		if (!METRICS.some((m) => m.id === metric)) return fail(400, { error: 'Métrica inválida' });
		if (!path.startsWith('/')) return fail(400, { error: 'La ruta debe empezar con /' });

		const names = data.getAll('v_name').map((s) => s.toString().trim());
		const weights = data.getAll('v_weight').map((s) => Math.round(Number(s)));
		const payloads = data.getAll('v_payload').map((s) => s.toString().trim() || '{}');

		if (names.length < 2 || names.length > KEYS.length) {
			return fail(400, { error: 'Se necesitan entre 2 y 8 variantes' });
		}
		if (names.some((n) => !n)) return fail(400, { error: 'Cada variante necesita nombre' });
		if (weights.some((w) => !Number.isFinite(w) || w < 0 || w > 100)) {
			return fail(400, { error: 'Pesos inválidos' });
		}
		if (weights.reduce((s, w) => s + w, 0) !== 100) {
			return fail(400, { error: 'Los pesos deben sumar 100%' });
		}
		const variants = [];
		for (let i = 0; i < names.length; i++) {
			let payload;
			try {
				payload = JSON.parse(payloads[i]);
				if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error();
			} catch {
				return fail(400, { error: `Ajustes inválidos en la variante ${KEYS[i].toUpperCase()}` });
			}
			variants.push({
				key: KEYS[i],
				name: names[i],
				weight: weights[i],
				is_control: i === 0 ? 1 : 0,
				payload: JSON.stringify(payload)
			});
		}

		const slug = slugify(name);
		if (!slug) return fail(400, { error: 'El nombre no genera un identificador válido' });
		if (getExperiment(slug)) {
			return fail(400, { error: `Ya existe un experimento con el identificador "${slug}"` });
		}

		createExperiment({ slug, name, hypothesis, kind, path, target, metric }, variants);
		redirect(303, `/admin/experimentos/${slug}`);
	}
};
