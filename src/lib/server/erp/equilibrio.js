/*
 * Punto de equilibrio: assembles the break-even picture for one month out of
 * the four inputs the Contabilidad module captures — precios (catálogo),
 * costos unitarios (products.cost_cents), variables por venta (finance_params)
 * y costos fijos (fixed_costs + gastos sueltos del mes).
 *
 * All the arithmetic lives in $lib/finanzas.js and is unit-tested there; this
 * file only feeds it rows and reports what's missing.
 */
import db from './schema.js';
import { listProducts } from './queries.js';
import {
	getParams,
	activeFixedCosts,
	monthOtherExpenses,
	funnelSpend,
	salesMix
} from './contabilidad.js';
import { unitEconomics, blendedEconomics, breakEven, netOf } from '$lib/finanzas.js';
import { monthKey } from '$lib/admin/format.js';

/* Gross sold per product this month, for the month-to-date contribution. */
const monthSoldStmt = db.prepare(`
  SELECT i.product_id, SUM(i.qty) AS qty, SUM(i.qty * i.unit_price_cents) AS gross
  FROM sale_items i JOIN sales s ON s.id = i.sale_id
  WHERE s.status = 'completada' AND strftime('%Y-%m', s.created_at) = ?
  GROUP BY i.product_id
`);

export function equilibrio(month = monthKey()) {
	const params = getParams();
	const products = listProducts();
	const items = products
		.map((p) => unitEconomics(p, params))
		.sort((a, b) => b.contribution - a.contribution);

	const blended = blendedEconomics(items, salesMix(90));

	const recurring = activeFixedCosts(month);
	const recurringTotal = recurring.reduce((s, c) => s + c.amount_cents, 0);
	const otherRows = monthOtherExpenses(month);
	const otherTotal = otherRows.reduce((s, r) => s + r.total, 0);
	const fixedTotal = recurringTotal + otherTotal;

	/* Month-to-date: real contribution earned against the same fixed base. */
	const costByProduct = new Map(products.map((p) => [p.id, p.cost_cents]));
	let soldUnits = 0;
	let earned = 0;
	for (const row of monthSoldStmt.all(month)) {
		const commission = row.gross * ((params.comision_pct ?? 0) / 100);
		const variable = row.qty * ((costByProduct.get(row.product_id) ?? 0) + params.envio_cents);
		soldUnits += row.qty;
		earned += netOf(row.gross, params.iva_rate) - variable - commission;
	}

	const be = breakEven(fixedTotal, blended);
	const missingCost = items.filter((it) => !it.hasCost);

	/* Ad money can be captured twice — once as a recurring marketing fixed cost,
	 * once as gasto in the embudo. Surface the overlap instead of silently
	 * double-counting it into the break-even. */
	const marketingFixed = recurring
		.filter((c) => c.category === 'marketing')
		.reduce((s, c) => s + c.amount_cents, 0);
	const adSpendCaptured = funnelSpend(month);

	return {
		month,
		params,
		items,
		blended,
		fixed: {
			recurring,
			recurringTotal,
			other: otherRows,
			otherTotal,
			total: fixedTotal
		},
		breakEven: be,
		progress: {
			units: soldUnits,
			contribution: Math.round(earned),
			pct: be.units ? Math.min(soldUnits / be.units, 1) : null,
			remaining: be.units ? Math.max(be.units - soldUnits, 0) : null
		},
		warnings: {
			missingCost: missingCost.map((it) => ({ id: it.id, name: it.name })),
			noProducts: items.length === 0,
			negativeMargin: !be.viable,
			doubleCountedAds:
				marketingFixed > 0 && adSpendCaptured > 0 ? { marketingFixed, adSpendCaptured } : null
		}
	};
}
