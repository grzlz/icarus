/*
 * A/B testing schema. One data model for the three granularities:
 *
 *   experiments.kind — 'pagina'  (whole-page layout swap)
 *                      'seccion' (one section/component swap)
 *                      'ajuste'  (copy/price/config knobs, editable from the dashboard)
 *
 * A variant's `payload` is JSON: for 'ajuste' it holds the knob values; for
 * 'pagina'/'seccion' the variant *key* selects a snippet in code, so payload
 * is usually empty. Weights are integer percentages that must sum to 100.
 *
 * An `assignments` row IS the exposure: it's only written when a real visitor
 * hits the experiment's route while the experiment is active, so exposures =
 * COUNT(*) per variant. Conversions are `ab_events` rows joined by vid where
 * the event happens at-or-after the assignment.
 *
 * Timestamps in server localtime — same convention as the ERP.
 */
import db from '../db.js';

db.exec(`
  CREATE TABLE IF NOT EXISTS experiments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    hypothesis TEXT,
    kind TEXT NOT NULL DEFAULT 'seccion',
    path TEXT NOT NULL DEFAULT '/',
    target TEXT,
    metric TEXT NOT NULL DEFAULT 'registro',
    status TEXT NOT NULL DEFAULT 'borrador',
    winner TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    started_at TEXT,
    ended_at TEXT
  );

  CREATE TABLE IF NOT EXISTS variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    experiment_id INTEGER NOT NULL REFERENCES experiments(id),
    key TEXT NOT NULL,
    name TEXT NOT NULL,
    weight INTEGER NOT NULL DEFAULT 50,
    is_control INTEGER NOT NULL DEFAULT 0,
    payload TEXT NOT NULL DEFAULT '{}',
    UNIQUE (experiment_id, key)
  );

  CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vid TEXT NOT NULL,
    experiment_id INTEGER NOT NULL REFERENCES experiments(id),
    variant_key TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    UNIQUE (vid, experiment_id)
  );
  CREATE INDEX IF NOT EXISTS idx_assignments_experiment
    ON assignments (experiment_id, variant_key);

  CREATE TABLE IF NOT EXISTS ab_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vid TEXT NOT NULL,
    name TEXT NOT NULL,
    value REAL,
    path TEXT,
    meta TEXT,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );
  CREATE INDEX IF NOT EXISTS idx_ab_events_vid ON ab_events (vid, name);
  CREATE INDEX IF NOT EXISTS idx_ab_events_name ON ab_events (name, created_at);

  CREATE TABLE IF NOT EXISTS ab_meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

/* Migrations for columns added after the tables shipped. */
const expCols = db
	.prepare('PRAGMA table_info(experiments)')
	.all()
	.map((c) => c.name);
if (!expCols.includes('weights_changed_at')) {
	db.exec('ALTER TABLE experiments ADD COLUMN weights_changed_at TEXT');
}

export default db;
