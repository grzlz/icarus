/*
 * Contabilidad tables: the inputs the ERP had no home for.
 *
 *   fixed_costs   — recurring monthly commitments (dominio, ads con tope,
 *                   almacenamiento). Captured once with a start month; they
 *                   count themselves every month until you close them out.
 *                   No `created_at`-per-month rows to remember to enter.
 *   funnel_months — one row per (mes × canal) of marketing reality: gasto,
 *                   clics, sesiones, checkouts, ventas. Typed in monthly from
 *                   the ads dashboards, because the site has no checkout to
 *                   instrument yet.
 *   finance_params — per-sale variable costs that aren't in the garment:
 *                   comisión de pasarela y envío promedio.
 *
 * Money is integer cents, timestamps localtime — same as the rest of the ERP.
 */
import db from './schema.js';
import { DEFAULT_PARAMS } from '$lib/finanzas.js';

db.exec(`
  CREATE TABLE IF NOT EXISTS fixed_costs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'otro',
    amount_cents INTEGER NOT NULL,
    starts_on TEXT NOT NULL,
    ends_on TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS funnel_months (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month TEXT NOT NULL,
    channel TEXT NOT NULL,
    spend_cents INTEGER NOT NULL DEFAULT 0,
    clicks INTEGER NOT NULL DEFAULT 0,
    sessions INTEGER NOT NULL DEFAULT 0,
    checkouts INTEGER NOT NULL DEFAULT 0,
    orders INTEGER NOT NULL DEFAULT 0,
    revenue_cents INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    UNIQUE (month, channel)
  );
  CREATE INDEX IF NOT EXISTS idx_funnel_month ON funnel_months (month);

  CREATE TABLE IF NOT EXISTS finance_params (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

export const FIXED_CATEGORIES = ['marketing', 'plataforma', 'almacen', 'equipo', 'otro'];
export const CHANNELS = ['meta', 'google', 'organico', 'instagram', 'evento', 'otro'];

/* Expense categories that are already priced per-unit (in cost_cents and in
 * finance_params.envio_cents) and must NOT be added again to the fixed base. */
const PER_UNIT_CATEGORIES = ['produccion', 'envio'];

// ---------- parámetros ----------

const readParamsStmt = db.prepare('SELECT key, value FROM finance_params');
const writeParamStmt = db.prepare(
	'INSERT INTO finance_params (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
);

export function getParams() {
	const stored = Object.fromEntries(readParamsStmt.all().map((r) => [r.key, Number(r.value)]));
	return { ...DEFAULT_PARAMS, ...stored };
}

export const setParams = db.transaction((patch) => {
	for (const [key, value] of Object.entries(patch)) writeParamStmt.run(key, String(value));
});

// ---------- costos fijos ----------

const insertFixedStmt = db.prepare(`
  INSERT INTO fixed_costs (name, category, amount_cents, starts_on, ends_on)
  VALUES (@name, @category, @amount_cents, @starts_on, @ends_on)
`);
export const createFixedCost = (c) => insertFixedStmt.run({ ends_on: null, ...c });

const deleteFixedStmt = db.prepare('DELETE FROM fixed_costs WHERE id = ?');
export const deleteFixedCost = (id) => deleteFixedStmt.run(id);

const closeFixedStmt = db.prepare('UPDATE fixed_costs SET ends_on = ? WHERE id = ?');
export const closeFixedCost = (id, month) => closeFixedStmt.run(month, id);

const listFixedStmt = db.prepare('SELECT * FROM fixed_costs ORDER BY ends_on IS NOT NULL, name');
export const listFixedCosts = () => listFixedStmt.all();

/* Costs live in a month when it falls inside [starts_on, ends_on]. */
const activeFixedStmt = db.prepare(`
  SELECT * FROM fixed_costs
  WHERE starts_on <= @month AND (ends_on IS NULL OR ends_on >= @month)
  ORDER BY amount_cents DESC
`);
export const activeFixedCosts = (month) => activeFixedStmt.all({ month });

/* One-off gastos of the month that behave like fixed costs — everything except
 * the per-unit categories, which are already inside the contribution margin. */
const monthOtherExpensesStmt = db.prepare(`
  SELECT category, SUM(amount_cents) AS total
  FROM expenses
  WHERE strftime('%Y-%m', created_at) = ?
    AND category NOT IN (${PER_UNIT_CATEGORIES.map(() => '?').join(',')})
  GROUP BY category
`);
export const monthOtherExpenses = (month) =>
	monthOtherExpensesStmt.all(month, ...PER_UNIT_CATEGORIES);

// ---------- embudo ----------

const upsertFunnelStmt = db.prepare(`
  INSERT INTO funnel_months (month, channel, spend_cents, clicks, sessions, checkouts, orders, revenue_cents)
  VALUES (@month, @channel, @spend_cents, @clicks, @sessions, @checkouts, @orders, @revenue_cents)
  ON CONFLICT(month, channel) DO UPDATE SET
    spend_cents = excluded.spend_cents,
    clicks = excluded.clicks,
    sessions = excluded.sessions,
    checkouts = excluded.checkouts,
    orders = excluded.orders,
    revenue_cents = excluded.revenue_cents
`);
export const saveFunnelMonth = (r) => upsertFunnelStmt.run(r);

const deleteFunnelStmt = db.prepare('DELETE FROM funnel_months WHERE id = ?');
export const deleteFunnelMonth = (id) => deleteFunnelStmt.run(id);

const listFunnelStmt = db.prepare(
	'SELECT * FROM funnel_months ORDER BY month DESC, channel LIMIT ?'
);
export const listFunnelMonths = (limit = 60) => listFunnelStmt.all(limit);

const funnelSinceStmt = db.prepare('SELECT * FROM funnel_months WHERE month >= ?');
export const funnelSince = (month) => funnelSinceStmt.all(month);

const funnelSpendStmt = db.prepare(
	'SELECT COALESCE(SUM(spend_cents), 0) AS total FROM funnel_months WHERE month = ?'
);
export const funnelSpend = (month) => funnelSpendStmt.get(month).total;

// ---------- mezcla de ventas ----------

/* Units sold per product over the last `days`, for weighting the blended
 * margin. Empty until there are real sales, and blendedEconomics falls back
 * to equal weights rather than pretending. */
const salesMixStmt = db.prepare(`
  SELECT i.product_id, SUM(i.qty) AS units
  FROM sale_items i JOIN sales s ON s.id = i.sale_id
  WHERE s.status = 'completada' AND s.created_at >= date('now', 'localtime', ?)
  GROUP BY i.product_id
`);
export const salesMix = (days = 90) =>
	new Map(salesMixStmt.all(`-${days} days`).map((r) => [r.product_id, r.units]));
