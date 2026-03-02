import { json } from '@sveltejs/kit';
import db from '$lib/server/db.js';

export async function POST({ request }) {
	const { email } = await request.json();

	if (!email || !email.includes('@')) {
		return json({ error: 'Correo inválido' }, { status: 400 });
	}

	try {
		db.prepare('INSERT INTO subscribers (email) VALUES (?)').run(email);
		return json({ ok: true });
	} catch (err) {
		if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
			return json({ error: 'Ya estás suscrito' }, { status: 409 });
		}
		return json({ error: 'Error interno' }, { status: 500 });
	}
}
