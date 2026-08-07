/*
 * Finance math for the Contabilidad module. Pure functions, no DB, no Svelte —
 * so the server can precompute and the scenario page can recompute live while
 * you drag the inputs, off the same code.
 *
 * Money is integer cents (MXN) everywhere, same as the ERP.
 *
 * IVA convention (decided 2026-08-07): catalog prices are gross, IVA incluido.
 * The books run on NET revenue — the 16% is collected for the SAT, it was never
 * income. Costs are counted as you actually pay them (gross out of pocket),
 * because not every proveedor gives factura. That's the conservative direction:
 * it understates margin slightly rather than flattering it.
 */

export const IVA_RATE = 0.16;

/* Per-sale variable costs that aren't part of the garment itself. Overridable
 * from /admin/contabilidad/costos and stored in `finance_params`. */
export const DEFAULT_PARAMS = {
	comision_pct: 3.6, // pasarela de pago, cobrada sobre el bruto
	envio_cents: 0, // envío promedio absorbido por venta
	iva_rate: IVA_RATE
};

/* Gross (IVA incluido) → net. */
export const netOf = (grossCents, rate = IVA_RATE) => grossCents / (1 + rate);

/*
 * Unit economics for one product. `contribution` is the margen de contribución:
 * what each unit puts toward covering the fixed costs. Break-even is entirely
 * driven by this number, which is why a product with cost_cents = 0 is flagged
 * — it would claim a 100% margin and make break-even look trivially close.
 */
export function unitEconomics(product, params = DEFAULT_PARAMS) {
	const rate = params.iva_rate ?? IVA_RATE;
	const gross = product.price_cents ?? 0;
	const net = netOf(gross, rate);
	const commission = Math.round(gross * ((params.comision_pct ?? 0) / 100));
	const shipping = params.envio_cents ?? 0;
	const unitCost = product.cost_cents ?? 0;
	const variable = unitCost + commission + shipping;
	const contribution = net - variable;

	return {
		id: product.id,
		slug: product.slug,
		name: product.name,
		category: product.category,
		gross,
		net,
		unitCost,
		commission,
		shipping,
		variable,
		contribution,
		contributionPct: net > 0 ? contribution / net : 0,
		hasCost: unitCost > 0
	};
}

/*
 * Blended unit economics across the catalog. Weighted by what actually sold
 * when there's history, by equal weights when there isn't — `source` says
 * which, so the UI can be honest about it instead of implying a real mix.
 */
export function blendedEconomics(items, mix = new Map()) {
	if (items.length === 0) {
		return { gross: 0, net: 0, variable: 0, contribution: 0, contributionPct: 0, source: 'vacio' };
	}

	const soldTotal = items.reduce((s, it) => s + (mix.get(it.id) ?? 0), 0);
	const useMix = soldTotal > 0;
	const weight = (it) => (useMix ? (mix.get(it.id) ?? 0) / soldTotal : 1 / items.length);

	const blend = (pick) => items.reduce((s, it) => s + pick(it) * weight(it), 0);
	const gross = blend((it) => it.gross);
	const net = blend((it) => it.net);
	const variable = blend((it) => it.variable);
	const contribution = net - variable;

	return {
		gross,
		net,
		variable,
		contribution,
		contributionPct: net > 0 ? contribution / net : 0,
		source: useMix ? 'ventas' : 'catalogo'
	};
}

/*
 * How many units clear the fixed costs. Returns nulls when the blended
 * contribution is <= 0 — at that point no volume ever breaks even, and a
 * number would be a lie rather than a big number.
 */
export function breakEven(fixedCents, blended) {
	if (!(blended.contribution > 0)) {
		return { units: null, netRevenue: null, grossRevenue: null, viable: false };
	}
	const units = Math.ceil(fixedCents / blended.contribution);
	return {
		units,
		netRevenue: Math.round(units * blended.net),
		grossRevenue: Math.round(units * blended.gross),
		viable: true
	};
}

/* Units needed if that single product carried the whole month alone. */
export const unitsToCover = (fixedCents, item) =>
	item.contribution > 0 ? Math.ceil(fixedCents / item.contribution) : null;

/*
 * Collapse captured funnel months into rates. Every rate is null when its
 * denominator is zero, so the UI shows "—" instead of a fabricated 0%.
 */
export function funnelRates(rows) {
	const sum = (k) => rows.reduce((s, r) => s + (r[k] ?? 0), 0);
	const spend = sum('spend_cents');
	const clicks = sum('clicks');
	const sessions = sum('sessions');
	const checkouts = sum('checkouts');
	const orders = sum('orders');
	const revenue = sum('revenue_cents');
	const ratio = (a, b) => (b > 0 ? a / b : null);

	return {
		spend,
		clicks,
		sessions,
		checkouts,
		orders,
		revenue,
		months: rows.length,
		cpc: clicks > 0 ? Math.round(spend / clicks) : null,
		sessionRate: ratio(sessions, clicks),
		checkoutRate: ratio(checkouts, sessions),
		closeRate: ratio(orders, checkouts),
		convRate: ratio(orders, clicks),
		ticket: orders > 0 ? Math.round(revenue / orders) : null,
		cac: orders > 0 ? Math.round(spend / orders) : null,
		roas: spend > 0 ? revenue / spend : null
	};
}

/*
 * Scenario forecast. `fixedCents` must EXCLUDE ad spend — `spendCents` is added
 * separately so the marketing budget stays a lever you can drag rather than a
 * number buried in the fixed base (and so it can't get counted twice).
 */
export function projectMonth({
	spendCents = 0,
	cpcCents = 0,
	convRate = 0,
	ticketCents = 0,
	fixedCents = 0,
	contributionPct = 0,
	rate = IVA_RATE
}) {
	const clicks = cpcCents > 0 ? spendCents / cpcCents : 0;
	const orders = clicks * convRate;
	const grossRevenue = orders * ticketCents;
	const netRevenue = netOf(grossRevenue, rate);
	const contribution = netRevenue * contributionPct;
	const totalFixed = fixedCents + spendCents;

	return {
		clicks: Math.round(clicks),
		orders: Math.round(orders),
		grossRevenue: Math.round(grossRevenue),
		netRevenue: Math.round(netRevenue),
		contribution: Math.round(contribution),
		totalFixed,
		profit: Math.round(contribution - totalFixed),
		cac: orders > 0 ? Math.round(spendCents / orders) : null,
		roas: spendCents > 0 ? grossRevenue / spendCents : null
	};
}
