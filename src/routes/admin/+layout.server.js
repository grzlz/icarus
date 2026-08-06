import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

/*
 * Gate for everything under /admin. Auth is a single shared key (ADMIN_KEY
 * env var) held in an httpOnly cookie — one operator, self-hosted box.
 * In dev with no ADMIN_KEY set, the gate is open.
 */
export function load({ cookies, url }) {
	if (url.pathname === '/admin/acceso') return {};
	const key = env.ADMIN_KEY;
	if (!key && dev) return {};
	if (!key || cookies.get('admin_key') !== key) {
		throw redirect(303, '/admin/acceso');
	}
	return {};
}
