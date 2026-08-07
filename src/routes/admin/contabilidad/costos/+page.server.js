import { fail } from '@sveltejs/kit';
import { listProducts, setProductCost } from '$lib/server/erp/queries.js';
import {
	getParams,
	setParams,
	listFixedCosts,
	createFixedCost,
	deleteFixedCost,
	closeFixedCost,
	FIXED_CATEGORIES
} from '$lib/server/erp/contabilidad.js';
import { unitEconomics } from '$lib/finanzas.js';
import { monthKey } from '$lib/admin/format.js';

const MONTH = /^\d{4}-\d{2}$/;

export function load() {
	const params = getParams();
	return {
		params,
		items: listProducts().map((p) => unitEconomics(p, params)),
		fixed: listFixedCosts(),
		categories: FIXED_CATEGORIES,
		thisMonth: monthKey()
	};
}

export const actions = {
	/* Per-unit cost of one garment — everything you pay to have it ready to ship
	 * except the pasarela commission and el envío, which are global params. */
	cost: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('product_id'));
		const cost = Number(data.get('cost'));
		if (!Number.isInteger(id) || id <= 0) return fail(400, { error: 'Producto inválido' });
		if (!(cost >= 0)) return fail(400, { error: 'Costo inválido' });
		setProductCost(id, Math.round(cost * 100));
		return { ok: 'Costo actualizado' };
	},

	params: async ({ request }) => {
		const data = await request.formData();
		const comision = Number(data.get('comision_pct'));
		const envio = Number(data.get('envio'));
		if (!(comision >= 0 && comision < 100)) return fail(400, { error: 'Comisión inválida' });
		if (!(envio >= 0)) return fail(400, { error: 'Envío inválido' });
		setParams({ comision_pct: comision, envio_cents: Math.round(envio * 100) });
		return { ok: 'Variables por venta guardadas' };
	},

	fixed: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const category = data.get('category')?.toString();
		const amount = Number(data.get('amount'));
		const starts_on = data.get('starts_on')?.toString();
		if (!name) return fail(400, { error: 'Ponle nombre al costo fijo' });
		if (!FIXED_CATEGORIES.includes(category)) return fail(400, { error: 'Categoría inválida' });
		if (!(amount > 0)) return fail(400, { error: 'Monto inválido' });
		if (!MONTH.test(starts_on ?? '')) return fail(400, { error: 'Mes de inicio inválido' });
		createFixedCost({ name, category, amount_cents: Math.round(amount * 100), starts_on });
		return { ok: 'Costo fijo dado de alta' };
	},

	close: async ({ request }) => {
		const data = await request.formData();
		const month = data.get('month')?.toString();
		if (!MONTH.test(month ?? '')) return fail(400, { error: 'Mes inválido' });
		const { changes } = closeFixedCost(Number(data.get('fixed_id')), month);
		if (!changes) return fail(400, { error: 'El costo fijo no existe' });
		return { ok: 'Costo fijo cerrado — deja de contar después de ese mes' };
	},

	remove: async ({ request }) => {
		const data = await request.formData();
		const { changes } = deleteFixedCost(Number(data.get('fixed_id')));
		if (!changes) return fail(400, { error: 'El costo fijo no existe' });
		return { ok: 'Costo fijo eliminado' };
	}
};
