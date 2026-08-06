import { error, fail, redirect } from '@sveltejs/kit';
import { METRICS } from '$lib/server/ab/core.js';
import {
	experimentStats,
	setStatus,
	declareWinner,
	updateWeights,
	updatePayload,
	deleteExperiment
} from '$lib/server/ab/queries.js';

export function load({ params }) {
	const exp = experimentStats(params.slug);
	if (!exp) error(404, 'Experimento no encontrado');
	return { exp, metrics: METRICS };
}

const STATUS_MSG = {
	activo: 'Experimento activo — ya se están repartiendo visitantes',
	pausado: 'Pausado — nadie nuevo entra, los datos se conservan',
	terminado: 'Terminado'
};

export const actions = {
	estado: async ({ params, request }) => {
		const next = (await request.formData()).get('next')?.toString();
		if (!setStatus(params.slug, next)) {
			return fail(400, { error: 'Transición de estado inválida' });
		}
		return { ok: STATUS_MSG[next] ?? 'Estado actualizado' };
	},

	ganador: async ({ params, request }) => {
		const key = (await request.formData()).get('key')?.toString();
		if (!declareWinner(params.slug, key)) {
			return fail(400, { error: 'No se pudo declarar ganadora' });
		}
		return { ok: `Variante ${key?.toUpperCase()} declarada ganadora — experimento terminado` };
	},

	pesos: async ({ params, request }) => {
		const data = await request.formData();
		const keys = data.getAll('v_key').map(String);
		const values = data.getAll('v_weight').map(String);
		const weights = Object.fromEntries(keys.map((k, i) => [k, values[i]]));
		if (!updateWeights(params.slug, weights)) {
			return fail(400, { error: 'Pesos inválidos: deben ser 0–100 y sumar exactamente 100' });
		}
		return { ok: 'Pesos actualizados — los visitantes ya asignados no cambian' };
	},

	ajustes: async ({ params, request }) => {
		// Inputs arrive as knob:<variantKey>:<knobKey> — rebuild each payload.
		const data = await request.formData();
		const byVariant = {};
		for (const [name, value] of data.entries()) {
			const m = /^knob:([a-h]):(.+)$/.exec(name);
			if (!m) continue;
			(byVariant[m[1]] ??= {})[m[2]] = value.toString();
		}
		for (const [key, payload] of Object.entries(byVariant)) {
			if (!updatePayload(params.slug, key, JSON.stringify(payload))) {
				return fail(400, { error: `No se pudieron guardar los ajustes de ${key.toUpperCase()}` });
			}
		}
		return { ok: 'Ajustes guardados — visibles en el sitio de inmediato' };
	},

	eliminar: async ({ params }) => {
		if (!deleteExperiment(params.slug)) {
			return fail(400, { error: 'Solo se pueden eliminar borradores' });
		}
		redirect(303, '/admin/experimentos');
	}
};
