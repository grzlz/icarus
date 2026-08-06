/*
 * ERP schema: contabilidad + inventario. Money is stored as integer cents
 * (MXN, IVA incluido — same convention as the catalog: neto = bruto / 1.16).
 * Timestamps are stored in server localtime so monthly cutoffs match the
 * business day in Mexico, not UTC.
 *
 * Stock is never a column — it's SUM(qty) over inventory_movements, so every
 * unit that enters or leaves has an auditable row (compra, venta, ajuste,
 * merma, devolución).
 */
import db from '../db.js';
import { products as catalog } from '$lib/products.js';

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'playera',
    price_cents INTEGER NOT NULL DEFAULT 0,
    cost_cents INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS inventory_movements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL REFERENCES products(id),
    size TEXT NOT NULL DEFAULT 'UNI',
    qty INTEGER NOT NULL,
    reason TEXT NOT NULL,
    sale_id INTEGER,
    note TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );
  CREATE INDEX IF NOT EXISTS idx_movements_product
    ON inventory_movements (product_id, size);

  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    channel TEXT NOT NULL DEFAULT 'directa',
    customer TEXT,
    total_cents INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'completada',
    note TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS sale_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER NOT NULL REFERENCES sales(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    size TEXT NOT NULL DEFAULT 'UNI',
    qty INTEGER NOT NULL,
    unit_price_cents INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL DEFAULT 'otro',
    description TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );
`);

/* Catalog products auto-appear in the ERP so the store and the books can't
 * drift. Prices sync on every boot (catalog is the source of truth for price);
 * cost is owned by the ERP and never touched here. */
const priceToCents = (display) => Math.round(parseFloat(display.replace(/[$,]/g, '')) * 100);

const upsertCatalog = db.prepare(`
  INSERT INTO products (slug, name, category, price_cents)
  VALUES (@slug, @name, @category, @price_cents)
  ON CONFLICT(slug) DO UPDATE SET
    name = excluded.name,
    category = excluded.category,
    price_cents = excluded.price_cents
`);

db.transaction(() => {
	for (const p of catalog) {
		upsertCatalog.run({
			slug: p.slug,
			name: p.phrase.replace(/\n/g, ' '),
			category: p.type.toLowerCase(),
			price_cents: priceToCents(p.price)
		});
	}
})();

export default db;
