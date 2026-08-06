import { fail } from '@sveltejs/kit';
import {
	listProducts,
	stockBySize,
	getProduct,
	createProduct,
	setProductCost,
	addMovement,
	recentMovements,
	sizeStock,
	SIZES,
	MOVE_REASONS
} from '$lib/server/erp/queries.js';

export function load() {
	return {
		products: listProducts(),
		stock: stockBySize(),
		movements: recentMovements(15),
		sizes: SIZES,
		reasons: MOVE_REASONS
	};
}

export const actions = {
	move: async ({ request }) => {
		const data = await request.formData();
		const product_id = Number(data.get('product_id'));
		const size = data.get('size')?.toString();
		const reason = data.get('reason')?.toString();
		const note = data.get('note')?.toString().trim() || null;
		let qty = Number(data.get('qty'));

		if (!getProduct(product_id)) return fail(400, { error: 'Producto inválido' });
		if (!SIZES.includes(size)) return fail(400, { error: 'Talla inválida' });
		if (!MOVE_REASONS.includes(reason)) return fail(400, { error: 'Motivo inválido' });
		if (!Number.isInteger(qty) || qty === 0) return fail(400, { error: 'Cantidad inválida' });

		// Compra siempre suma; merma siempre resta; ajuste respeta el signo capturado.
		if (reason === 'compra' || reason === 'devolucion') qty = Math.abs(qty);
		if (reason === 'merma') qty = -Math.abs(qty);
		if (qty < 0 && sizeStock(product_id, size) + qty < 0) {
			return fail(400, { error: 'No hay stock suficiente para esa salida' });
		}

		addMovement({ product_id, size, qty, reason, note });
		return { ok: `Movimiento registrado (${reason})` };
	},

	addProduct: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const category = data.get('category')?.toString() || 'playera';
		const price = Number(data.get('price'));
		const cost = Number(data.get('cost') || 0);
		if (!name) return fail(400, { error: 'El producto necesita nombre' });
		if (!(price > 0)) return fail(400, { error: 'Precio inválido' });
		createProduct({
			name,
			category,
			price_cents: Math.round(price * 100),
			cost_cents: Math.round(cost * 100)
		});
		return { ok: `Producto «${name}» creado` };
	},

	setCost: async ({ request }) => {
		const data = await request.formData();
		const id = Number(data.get('product_id'));
		const cost = Number(data.get('cost'));
		if (!getProduct(id)) return fail(400, { error: 'Producto inválido' });
		if (!(cost >= 0)) return fail(400, { error: 'Costo inválido' });
		setProductCost(id, Math.round(cost * 100));
		return { ok: 'Costo actualizado' };
	}
};
