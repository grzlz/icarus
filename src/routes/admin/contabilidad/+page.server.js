import { equilibrio } from '$lib/server/erp/equilibrio.js';
import { monthKey } from '$lib/admin/format.js';

export function load({ url }) {
	const month = /^\d{4}-\d{2}$/.test(url.searchParams.get('mes') ?? '')
		? url.searchParams.get('mes')
		: monthKey();
	return { eq: equilibrio(month), months: [0, -1, -2, -3, -4, -5].map(monthKey) };
}
