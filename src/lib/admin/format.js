/* Client-safe formatters for the admin panel. Amounts travel as cents. */

const mxn = new Intl.NumberFormat('es-MX', {
	style: 'currency',
	currency: 'MXN',
	maximumFractionDigits: 0
});
const mxnExact = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

export const money = (cents) => mxn.format(cents / 100);
export const moneyExact = (cents) => mxnExact.format(cents / 100);

/* Signed % delta vs a previous period; null when there's no base to compare. */
export function delta(current, previous) {
	if (!previous) return null;
	return Math.round(((current - previous) / previous) * 100);
}

const dateFmt = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' });
const dateTimeFmt = new Intl.DateTimeFormat('es-MX', {
	day: 'numeric',
	month: 'short',
	hour: 'numeric',
	minute: '2-digit'
});

/* SQLite 'YYYY-MM-DD HH:MM:SS' (localtime) → 'Date' without TZ re-interpretation. */
const parse = (sqliteDate) => new Date(sqliteDate.replace(' ', 'T'));
export const shortDate = (d) => dateFmt.format(parse(d));
export const shortDateTime = (d) => dateTimeFmt.format(parse(d));

const MONTHS = [
	'enero',
	'febrero',
	'marzo',
	'abril',
	'mayo',
	'junio',
	'julio',
	'agosto',
	'septiembre',
	'octubre',
	'noviembre',
	'diciembre'
];
/* '2026-08' → 'agosto 2026' */
export const monthName = (key) => {
	const [y, m] = key.split('-');
	return `${MONTHS[Number(m) - 1]} ${y}`;
};
