import { dashboardStats } from '$lib/server/erp/stats.js';
import { recentSales } from '$lib/server/erp/queries.js';

export function load() {
	return {
		stats: dashboardStats(),
		sales: recentSales(8)
	};
}
