import Database from 'better-sqlite3';
import { resolve } from 'path';

/* ICARUS_DB lets tests and one-off scripts run against a copy instead of the
 * live database. Unset in normal operation. */
const DB_PATH = resolve(process.env.ICARUS_DB ?? 'data/icarus.db');

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

export default db;
