/*
 * Integration test for the Contabilidad SQL. Runs against a throwaway copy of
 * the live database (ICARUS_DB), never the real one — the catalog seeds itself
 * on import, so this exercises the same rows the panel will see.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

let contab, equilibrio, queries, db;
const MONTH = '2026-08';

beforeAll(async () => {
	process.env.ICARUS_DB = join(mkdtempSync(join(tmpdir(), 'icarus-test-')), 'test.db');
	db = (await import('../db.js')).default;
	queries = await import('./queries.js');
	contab = await import('./contabilidad.js');
	equilibrio = (await import('./equilibrio.js')).equilibrio;
});

describe('contabilidad schema', () => {
	it('creates its three tables', () => {
		const tables = db
			.prepare("SELECT name FROM sqlite_master WHERE type='table'")
			.all()
			.map((r) => r.name);
		expect(tables).toEqual(
			expect.arrayContaining(['fixed_costs', 'funnel_months', 'finance_params'])
		);
	});

	it('falls back to the default per-sale params before anything is saved', () => {
		expect(contab.getParams().comision_pct).toBe(3.6);
	});

	it('round-trips saved params over the defaults', () => {
		contab.setParams({ comision_pct: 4.5, envio_cents: 5000 });
		const p = contab.getParams();
		expect(p.comision_pct).toBe(4.5);
		expect(p.envio_cents).toBe(5000);
		expect(p.iva_rate).toBe(0.16); // untouched default still present
	});
});

describe('fixed costs windowing', () => {
	beforeAll(() => {
		contab.createFixedCost({
			name: 'dominio',
			category: 'plataforma',
			amount_cents: 18000,
			starts_on: '2026-01'
		});
		contab.createFixedCost({
			name: 'almacen viejo',
			category: 'almacen',
			amount_cents: 35000,
			starts_on: '2026-01',
			ends_on: '2026-06'
		});
		contab.createFixedCost({
			name: 'futuro',
			category: 'otro',
			amount_cents: 99900,
			starts_on: '2026-12'
		});
	});

	it('counts only the costs live in that month', () => {
		const names = contab.activeFixedCosts(MONTH).map((c) => c.name);
		expect(names).toEqual(['dominio']);
	});

	it('includes a closed cost in a month before it ended', () => {
		expect(
			contab
				.activeFixedCosts('2026-05')
				.map((c) => c.name)
				.sort()
		).toEqual(['almacen viejo', 'dominio']);
	});

	it('closing a cost stops it counting the following month', () => {
		const dominio = contab.listFixedCosts().find((c) => c.name === 'dominio');
		contab.closeFixedCost(dominio.id, MONTH);
		expect(contab.activeFixedCosts(MONTH).map((c) => c.name)).toEqual(['dominio']);
		expect(contab.activeFixedCosts('2026-09')).toEqual([]);
		contab.closeFixedCost(dominio.id, null); // reopen for the tests below
	});
});

describe('gastos sueltos', () => {
	it('excludes the per-unit categories already inside the margin', () => {
		queries.createExpense({ category: 'marketing', description: 'volantes', amount_cents: 25000 });
		queries.createExpense({ category: 'produccion', description: 'blancos', amount_cents: 90000 });
		queries.createExpense({ category: 'envio', description: 'guías', amount_cents: 40000 });

		const rows = contab.monthOtherExpenses(contab.getParams() && MONTH);
		const cats = rows.map((r) => r.category);
		expect(cats).toContain('marketing');
		expect(cats).not.toContain('produccion');
		expect(cats).not.toContain('envio');
	});
});

describe('funnel capture', () => {
	it('overwrites the same month+channel instead of duplicating it', () => {
		contab.saveFunnelMonth({
			month: MONTH,
			channel: 'meta',
			spend_cents: 100000,
			clicks: 400,
			sessions: 300,
			checkouts: 6,
			orders: 2,
			revenue_cents: 93800
		});
		contab.saveFunnelMonth({
			month: MONTH,
			channel: 'meta',
			spend_cents: 200000,
			clicks: 840,
			sessions: 610,
			checkouts: 12,
			orders: 4,
			revenue_cents: 187600
		});
		const meta = contab.listFunnelMonths().filter((r) => r.channel === 'meta' && r.month === MONTH);
		expect(meta).toHaveLength(1);
		expect(meta[0].clicks).toBe(840);
	});

	it('sums the month spend for the double-count check', () => {
		expect(contab.funnelSpend(MONTH)).toBe(200000);
	});
});

describe('equilibrio', () => {
	it('assembles a break-even from real rows', () => {
		const products = queries.listProducts();
		expect(products.length).toBeGreaterThan(0);
		for (const p of products) queries.setProductCost(p.id, Math.round(p.price_cents * 0.4));

		const eq = equilibrio(MONTH);

		expect(eq.fixed.recurringTotal).toBe(18000); // dominio only
		expect(eq.fixed.otherTotal).toBe(25000); // marketing volantes only
		expect(eq.fixed.total).toBe(43000);
		expect(eq.blended.contribution).toBeGreaterThan(0);
		expect(eq.breakEven.viable).toBe(true);
		expect(eq.breakEven.units).toBe(Math.ceil(43000 / eq.blended.contribution));
		expect(eq.warnings.missingCost).toEqual([]);
	});

	it('warns when ad money is captured on both sides', () => {
		contab.createFixedCost({
			name: 'Meta Ads (tope)',
			category: 'marketing',
			amount_cents: 200000,
			starts_on: '2026-01'
		});
		expect(equilibrio(MONTH).warnings.doubleCountedAds).toEqual({
			marketingFixed: 200000,
			adSpendCaptured: 200000
		});
	});

	it('flags products with no cost captured and refuses a negative-margin answer', () => {
		for (const p of queries.listProducts()) queries.setProductCost(p.id, 0);
		let eq = equilibrio(MONTH);
		expect(eq.warnings.missingCost.length).toBe(queries.listProducts().length);

		/* Costs above the net price → every unit loses money. */
		for (const p of queries.listProducts()) queries.setProductCost(p.id, p.price_cents * 2);
		eq = equilibrio(MONTH);
		expect(eq.blended.contribution).toBeLessThan(0);
		expect(eq.breakEven.viable).toBe(false);
		expect(eq.breakEven.units).toBeNull();
		expect(eq.warnings.negativeMargin).toBe(true);
	});
});
