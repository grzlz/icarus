import { fail } from '@sveltejs/kit';
import {
	listProducts,
	getProduct,
	createSale,
	cancelSale,
	recentSales,
	sizeStock,
	SIZES,
	SALE_CHANNELS
} from '$lib/server/erp/queries.js';

export function load() {
	return {
		products: listProducts(),
		sales: recentSales(30),
		sizes: SIZES,
		channels: SALE_CHANNELS
	};
}

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const product_id = Number(data.get('product_id'));
		const size = data.get('size')?.toString();
		const qty = Number(data.get('qty'));
		const price = Number(data.get('price'));
		const channel = data.get('channel')?.toString();
		const customer = data.get('customer')?.toString().trim();
		const note = data.get('note')?.toString().trim();

		const product = getProduct(product_id);
		if (!product) return fail(400, { error: 'Producto inválido' });
		if (!SIZES.includes(size)) return fail(400, { error: 'Talla inválida' });
		if (!SALE_CHANNELS.includes(channel)) return fail(400, { error: 'Canal inválido' });
		if (!Number.isInteger(qty) || qty <= 0) return fail(400, { error: 'Cantidad inválida' });
		if (!(price > 0)) return fail(400, { error: 'Precio inválido' });

		const available = sizeStock(product_id, size);
		if (available < qty) {
			return fail(400, {
				error: `Stock insuficiente: hay ${available} de ${product.name} talla ${size}`
			});
		}

		createSale({
			channel,
			customer,
			note,
			items: [{ product_id, size, qty, unit_price_cents: Math.round(price * 100) }]
		});
		return { ok: 'Venta registrada' };
	},

	cancel: async ({ request }) => {
		const data = await request.formData();
		const ok = cancelSale(Number(data.get('sale_id')));
		if (!ok) return fail(400, { error: 'La venta no existe o ya estaba cancelada' });
		return { ok: 'Venta cancelada — stock devuelto' };
	}
};
