import { fail } from '@sveltejs/kit';
import {
	saveFunnelMonth,
	deleteFunnelMonth,
	listFunnelMonths,
	funnelSince,
	CHANNELS
} from '$lib/server/erp/contabilidad.js';
import { equilibrio } from '$lib/server/erp/equilibrio.js';
import { funnelRates } from '$lib/finanzas.js';
import { monthKey } from '$lib/admin/format.js';

const MONTH = /^\d{4}-\d{2}$/;
const whole = (v) => {
	const n = Number(v);
	return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
};

export function load() {
	const eq = equilibrio();
	/* Rates come from the last 6 months so a single bad month doesn't set the
	 * forecast, and stale numbers from a year ago don't either. */
	const recent = funnelSince(monthKey(-5));

	return {
		rows: listFunnelMonths(60),
		channels: CHANNELS,
		thisMonth: monthKey(),
		rates: funnelRates(recent),
		/* Fixed base for the scenario EXCLUDES ad spend — the budget is the lever. */
		fixedCents: eq.fixed.total,
		marketingFixed: eq.fixed.recurring
			.filter((c) => c.category === 'marketing')
			.reduce((s, c) => s + c.amount_cents, 0),
		contributionPct: eq.blended.contributionPct,
		blendedGross: Math.round(eq.blended.gross),
		blendedContribution: Math.round(eq.blended.contribution),
		mixSource: eq.blended.source
	};
}

export const actions = {
	save: async ({ request }) => {
		const data = await request.formData();
		const month = data.get('month')?.toString();
		const channel = data.get('channel')?.toString();
		if (!MONTH.test(month ?? '')) return fail(400, { error: 'Mes inválido (usa AAAA-MM)' });
		if (!CHANNELS.includes(channel)) return fail(400, { error: 'Canal inválido' });

		const nums = {
			clicks: whole(data.get('clicks')),
			sessions: whole(data.get('sessions')),
			checkouts: whole(data.get('checkouts')),
			orders: whole(data.get('orders'))
		};
		const spend = Number(data.get('spend'));
		const revenue = Number(data.get('revenue'));
		if (Object.values(nums).some((n) => n === null))
			return fail(400, { error: 'Los conteos deben ser enteros ≥ 0' });
		if (!(spend >= 0) || !(revenue >= 0)) return fail(400, { error: 'Montos inválidos' });

		saveFunnelMonth({
			month,
			channel,
			...nums,
			spend_cents: Math.round(spend * 100),
			revenue_cents: Math.round(revenue * 100)
		});
		return { ok: `Embudo de ${month} · ${channel} guardado` };
	},

	remove: async ({ request }) => {
		const data = await request.formData();
		const { changes } = deleteFunnelMonth(Number(data.get('row_id')));
		if (!changes) return fail(400, { error: 'El registro no existe' });
		return { ok: 'Registro eliminado' };
	}
};
