import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

export function load() {
	if (!env.ADMIN_KEY && dev) throw redirect(303, '/admin');
	return {};
}

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const key = data.get('key')?.toString() ?? '';
		if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
			return fail(401, { error: 'Clave incorrecta' });
		}
		cookies.set('admin_key', key, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 30
		});
		throw redirect(303, '/admin');
	}
};
