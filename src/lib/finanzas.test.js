import { describe, it, expect } from 'vitest';
import {
	netOf,
	unitEconomics,
	blendedEconomics,
	breakEven,
	unitsToCover,
	funnelRates,
	projectMonth
} from './finanzas.js';

/* A playera at the catalog price, costing $185 to make. */
const playera = {
	id: 1,
	slug: 'p',
	name: 'playera',
	category: 'playera',
	price_cents: 46900,
	cost_cents: 18500
};
const sudadera = {
	id: 2,
	slug: 's',
	name: 'sudadera',
	category: 'sudadera',
	price_cents: 104900,
	cost_cents: 42000
};
const params = { comision_pct: 3.6, envio_cents: 5000, iva_rate: 0.16 };

describe('netOf', () => {
	it('strips IVA from a gross price', () => {
		expect(Math.round(netOf(46900))).toBe(40431); // $469 → $404.31
	});
});

describe('unitEconomics', () => {
	const e = unitEconomics(playera, params);

	it('charges the pasarela commission on the gross, not the net', () => {
		expect(e.commission).toBe(Math.round(46900 * 0.036)); // 1688
	});

	it('sums cost + commission + shipping into the variable cost', () => {
		expect(e.variable).toBe(18500 + 1688 + 5000);
	});

	it('contributes net revenue minus variable cost', () => {
		expect(Math.round(e.contribution)).toBe(Math.round(netOf(46900) - (18500 + 1688 + 5000)));
	});

	it('flags a product with no cost captured', () => {
		expect(unitEconomics({ ...playera, cost_cents: 0 }, params).hasCost).toBe(false);
		expect(e.hasCost).toBe(true);
	});

	it('never divides by zero on a free product', () => {
		const free = unitEconomics({ ...playera, price_cents: 0 }, params);
		expect(free.contributionPct).toBe(0);
	});
});

describe('blendedEconomics', () => {
	const items = [playera, sudadera].map((p) => unitEconomics(p, params));

	it('falls back to equal weights with no sales history', () => {
		const b = blendedEconomics(items, new Map());
		expect(b.source).toBe('catalogo');
		expect(b.gross).toBeCloseTo((46900 + 104900) / 2, 5);
	});

	it('weights by units actually sold when there is history', () => {
		const b = blendedEconomics(
			items,
			new Map([
				[1, 9],
				[2, 1]
			])
		);
		expect(b.source).toBe('ventas');
		expect(b.gross).toBeCloseTo(46900 * 0.9 + 104900 * 0.1, 5);
	});

	it('ignores a mix that sums to zero', () => {
		expect(blendedEconomics(items, new Map([[1, 0]])).source).toBe('catalogo');
	});

	it('survives an empty catalog', () => {
		expect(blendedEconomics([]).contribution).toBe(0);
	});
});

describe('breakEven', () => {
	it('rounds units up — you cannot sell a fraction of a playera', () => {
		expect(breakEven(100000, { contribution: 30000, net: 40431, gross: 46900 }).units).toBe(4);
	});

	it('refuses to answer when contribution is negative', () => {
		const r = breakEven(100000, { contribution: -500, net: 40431, gross: 46900 });
		expect(r.viable).toBe(false);
		expect(r.units).toBeNull();
	});

	it('refuses to answer when contribution is exactly zero', () => {
		expect(breakEven(100000, { contribution: 0, net: 1, gross: 1 }).viable).toBe(false);
	});

	it('reports the revenue those units represent, net and gross', () => {
		const r = breakEven(100000, { contribution: 30000, net: 40431, gross: 46900 });
		expect(r.netRevenue).toBe(4 * 40431);
		expect(r.grossRevenue).toBe(4 * 46900);
	});
});

describe('unitsToCover', () => {
	it('is null for a product that loses money on every unit', () => {
		expect(unitsToCover(100000, { contribution: -1 })).toBeNull();
	});
});

describe('funnelRates', () => {
	const rows = [
		{
			spend_cents: 200000,
			clicks: 840,
			sessions: 610,
			checkouts: 12,
			orders: 4,
			revenue_cents: 187600
		}
	];

	it('derives CPC, conversion, ticket and CAC', () => {
		const r = funnelRates(rows);
		expect(r.cpc).toBe(Math.round(200000 / 840));
		expect(r.convRate).toBeCloseTo(4 / 840, 10);
		expect(r.ticket).toBe(Math.round(187600 / 4));
		expect(r.cac).toBe(Math.round(200000 / 4));
	});

	it('sums across months', () => {
		expect(funnelRates([...rows, ...rows]).clicks).toBe(1680);
	});

	it('returns null rates instead of inventing zeros with no data', () => {
		const r = funnelRates([]);
		expect(r.cpc).toBeNull();
		expect(r.convRate).toBeNull();
		expect(r.ticket).toBeNull();
		expect(r.roas).toBeNull();
	});
});

describe('projectMonth', () => {
	const scenario = {
		spendCents: 200000,
		cpcCents: 238,
		convRate: 0.0065,
		ticketCents: 46900,
		fixedCents: 53000,
		contributionPct: 0.4
	};

	it('walks budget → clicks → orders → revenue', () => {
		const p = projectMonth(scenario);
		expect(p.clicks).toBe(Math.round(200000 / 238));
		expect(p.orders).toBe(Math.round((200000 / 238) * 0.0065));
	});

	it('counts ad spend as a cost on top of the fixed base, not inside it', () => {
		expect(projectMonth(scenario).totalFixed).toBe(53000 + 200000);
	});

	it('reports a loss when contribution does not cover fixed + spend', () => {
		expect(projectMonth(scenario).profit).toBeLessThan(0);
	});

	it('turns a profit once conversion is high enough', () => {
		expect(projectMonth({ ...scenario, convRate: 0.05 }).profit).toBeGreaterThan(0);
	});

	it('does not divide by zero when CPC is unknown', () => {
		const p = projectMonth({ ...scenario, cpcCents: 0 });
		expect(p.clicks).toBe(0);
		expect(p.orders).toBe(0);
		expect(p.cac).toBeNull();
	});
});
