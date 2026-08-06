import { fail } from '@sveltejs/kit';
import {
	createExpense,
	deleteExpense,
	recentExpenses,
	EXPENSE_CATEGORIES
} from '$lib/server/erp/queries.js';

export function load() {
	return {
		expenses: recentExpenses(50),
		categories: EXPENSE_CATEGORIES
	};
}

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const category = data.get('category')?.toString();
		const description = data.get('description')?.toString().trim();
		const amount = Number(data.get('amount'));
		if (!EXPENSE_CATEGORIES.includes(category)) return fail(400, { error: 'Categoría inválida' });
		if (!description) return fail(400, { error: 'Describe el gasto' });
		if (!(amount > 0)) return fail(400, { error: 'Monto inválido' });
		createExpense({ category, description, amount_cents: Math.round(amount * 100) });
		return { ok: 'Gasto registrado' };
	},

	remove: async ({ request }) => {
		const data = await request.formData();
		const { changes } = deleteExpense(Number(data.get('expense_id')));
		if (!changes) return fail(400, { error: 'El gasto no existe' });
		return { ok: 'Gasto eliminado' };
	}
};
