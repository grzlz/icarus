/*
 * Prepared statements for the ERP. Every write that touches stock goes
 * through a movement row; sales are the only writers of reason='venta'.
 */
import db from './schema.js';

export const SIZES = ['CH', 'M', 'G', 'XG', 'UNI'];
export const MOVE_REASONS = ['compra', 'ajuste', 'merma', 'devolucion'];
export const SALE_CHANNELS = ['directa', 'web', 'evento'];
export const EXPENSE_CATEGORIES = ['produccion', 'envio', 'marketing', 'equipo', 'otro'];
export const LOW_STOCK_THRESHOLD = 3;

// ---------- productos ----------

const listProductsStmt = db.prepare(`
  SELECT p.*, COALESCE(s.stock, 0) AS stock
  FROM products p
  LEFT JOIN (
    SELECT product_id, SUM(qty) AS stock
    FROM inventory_movements GROUP BY product_id
  ) s ON s.product_id = p.id
  WHERE p.active = 1
  ORDER BY p.category, p.name
`);
export const listProducts = () => listProductsStmt.all();

const stockBySizeStmt = db.prepare(`
  SELECT product_id, size, SUM(qty) AS stock
  FROM inventory_movements
  GROUP BY product_id, size
  HAVING SUM(qty) != 0
`);
export const stockBySize = () => stockBySizeStmt.all();

const getProductStmt = db.prepare('SELECT * FROM products WHERE id = ?');
export const getProduct = (id) => getProductStmt.get(id);

const insertProductStmt = db.prepare(`
  INSERT INTO products (name, category, price_cents, cost_cents)
  VALUES (@name, @category, @price_cents, @cost_cents)
`);
export const createProduct = (p) => insertProductStmt.run(p);

const updateCostStmt = db.prepare('UPDATE products SET cost_cents = ? WHERE id = ?');
export const setProductCost = (id, costCents) => updateCostStmt.run(costCents, id);

// ---------- movimientos de inventario ----------

const insertMovementStmt = db.prepare(`
  INSERT INTO inventory_movements (product_id, size, qty, reason, sale_id, note)
  VALUES (@product_id, @size, @qty, @reason, @sale_id, @note)
`);
export const addMovement = (m) => insertMovementStmt.run({ sale_id: null, note: null, ...m });

const recentMovementsStmt = db.prepare(`
  SELECT m.*, p.name AS product_name
  FROM inventory_movements m JOIN products p ON p.id = m.product_id
  ORDER BY m.id DESC LIMIT ?
`);
export const recentMovements = (limit = 20) => recentMovementsStmt.all(limit);

const sizeStockStmt = db.prepare(`
  SELECT COALESCE(SUM(qty), 0) AS stock
  FROM inventory_movements WHERE product_id = ? AND size = ?
`);
export const sizeStock = (productId, size) => sizeStockStmt.get(productId, size).stock;

// ---------- ventas ----------

const insertSaleStmt = db.prepare(`
  INSERT INTO sales (channel, customer, total_cents, note)
  VALUES (@channel, @customer, @total_cents, @note)
`);
const insertSaleItemStmt = db.prepare(`
  INSERT INTO sale_items (sale_id, product_id, size, qty, unit_price_cents)
  VALUES (@sale_id, @product_id, @size, @qty, @unit_price_cents)
`);

/* items: [{ product_id, size, qty, unit_price_cents }] */
export const createSale = db.transaction(({ channel, customer, note, items }) => {
	const total_cents = items.reduce((sum, it) => sum + it.qty * it.unit_price_cents, 0);
	const { lastInsertRowid: saleId } = insertSaleStmt.run({
		channel,
		customer: customer || null,
		note: note || null,
		total_cents
	});
	for (const it of items) {
		insertSaleItemStmt.run({ ...it, sale_id: saleId });
		insertMovementStmt.run({
			product_id: it.product_id,
			size: it.size,
			qty: -it.qty,
			reason: 'venta',
			sale_id: saleId,
			note: null
		});
	}
	return saleId;
});

const cancelSaleStmt = db.prepare(
	"UPDATE sales SET status = 'cancelada' WHERE id = ? AND status = 'completada'"
);
const saleItemsStmt = db.prepare('SELECT * FROM sale_items WHERE sale_id = ?');

/* Cancelling restores stock with devolución movements, keeping the audit trail. */
export const cancelSale = db.transaction((saleId) => {
	const { changes } = cancelSaleStmt.run(saleId);
	if (!changes) return false;
	for (const it of saleItemsStmt.all(saleId)) {
		insertMovementStmt.run({
			product_id: it.product_id,
			size: it.size,
			qty: it.qty,
			reason: 'devolucion',
			sale_id: saleId,
			note: 'venta cancelada'
		});
	}
	return true;
});

const recentSalesStmt = db.prepare(`
  SELECT s.*,
    (SELECT GROUP_CONCAT(p.name || ' ' || i.size || ' ×' || i.qty, ' · ')
     FROM sale_items i JOIN products p ON p.id = i.product_id
     WHERE i.sale_id = s.id) AS summary
  FROM sales s ORDER BY s.id DESC LIMIT ?
`);
export const recentSales = (limit = 30) => recentSalesStmt.all(limit);

// ---------- gastos ----------

const insertExpenseStmt = db.prepare(`
  INSERT INTO expenses (category, description, amount_cents)
  VALUES (@category, @description, @amount_cents)
`);
export const createExpense = (e) => insertExpenseStmt.run(e);

const deleteExpenseStmt = db.prepare('DELETE FROM expenses WHERE id = ?');
export const deleteExpense = (id) => deleteExpenseStmt.run(id);

const recentExpensesStmt = db.prepare('SELECT * FROM expenses ORDER BY id DESC LIMIT ?');
export const recentExpenses = (limit = 50) => recentExpensesStmt.all(limit);
