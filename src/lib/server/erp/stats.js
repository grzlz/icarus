/*
 * Dashboard aggregations. All amounts are cents, IVA incluido; the IVA
 * component of a gross amount is gross - gross/1.16.
 */
import db from './schema.js';
import { LOW_STOCK_THRESHOLD } from './queries.js';
import { monthKey } from '$lib/admin/format.js';

const monthIncomeStmt = db.prepare(`
  SELECT COALESCE(SUM(total_cents), 0) AS total
  FROM sales
  WHERE status = 'completada' AND strftime('%Y-%m', created_at) = ?
`);
const monthExpensesStmt = db.prepare(`
  SELECT COALESCE(SUM(amount_cents), 0) AS total
  FROM expenses WHERE strftime('%Y-%m', created_at) = ?
`);
const monthUnitsStmt = db.prepare(`
  SELECT COALESCE(SUM(i.qty), 0) AS units
  FROM sale_items i JOIN sales s ON s.id = i.sale_id
  WHERE s.status = 'completada' AND strftime('%Y-%m', s.created_at) = ?
`);

const inventoryStmt = db.prepare(`
  SELECT COALESCE(SUM(s.stock), 0) AS units,
         COALESCE(SUM(s.stock * p.cost_cents), 0) AS value_cents
  FROM (
    SELECT product_id, SUM(qty) AS stock
    FROM inventory_movements GROUP BY product_id
    HAVING SUM(qty) > 0
  ) s JOIN products p ON p.id = s.product_id
`);

const lowStockStmt = db.prepare(`
  SELECT p.id, p.name, m.size, SUM(m.qty) AS stock
  FROM inventory_movements m JOIN products p ON p.id = m.product_id
  WHERE p.active = 1
  GROUP BY p.id, m.size
  HAVING SUM(m.qty) <= ?
  ORDER BY stock ASC
  LIMIT 8
`);

const weeklyIncomeStmt = db.prepare(`
  SELECT date(created_at, 'weekday 0', '-6 days') AS week_start,
         SUM(total_cents) AS total
  FROM sales
  WHERE status = 'completada' AND created_at >= date('now', 'localtime', ?)
  GROUP BY week_start ORDER BY week_start
`);

const cumulativeProfitStmt = db.prepare(`
  SELECT
    (SELECT COALESCE(SUM(total_cents), 0) FROM sales WHERE status = 'completada')
    - (SELECT COALESCE(SUM(amount_cents), 0) FROM expenses) AS total
`);

/* Last `n` weeks of gross income as a dense series (missing weeks = 0). */
function weeklySeries(n = 12) {
	const rows = weeklyIncomeStmt.all(`-${n * 7} days`);
	const byWeek = new Map(rows.map((r) => [r.week_start, r.total]));
	const series = [];
	const now = new Date();
	const monday = new Date(now);
	monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
	for (let i = n - 1; i >= 0; i--) {
		const d = new Date(monday);
		d.setDate(monday.getDate() - i * 7);
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
		series.push({ week_start: key, total: byWeek.get(key) ?? 0 });
	}
	return series;
}

export function dashboardStats() {
	const thisMonth = monthKey(0);
	const prevMonth = monthKey(-1);

	const income = monthIncomeStmt.get(thisMonth).total;
	const incomePrev = monthIncomeStmt.get(prevMonth).total;
	const expenses = monthExpensesStmt.get(thisMonth).total;
	const expensesPrev = monthExpensesStmt.get(prevMonth).total;
	const inventory = inventoryStmt.get();

	return {
		month: thisMonth,
		income,
		incomePrev,
		ivaInIncome: Math.round(income - income / 1.16),
		expenses,
		expensesPrev,
		profit: income - expenses,
		profitPrev: incomePrev - expensesPrev,
		unitsSold: monthUnitsStmt.get(thisMonth).units,
		inventoryUnits: inventory.units,
		inventoryValue: inventory.value_cents,
		gpuFund: cumulativeProfitStmt.get().total,
		lowStock: lowStockStmt.all(LOW_STOCK_THRESHOLD),
		weekly: weeklySeries(12)
	};
}
