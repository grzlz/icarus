/*
 * Two jobs, both of which must happen before any route code runs:
 *
 * 1. Admin gate. Layout `load` guards do NOT run for form actions in
 *    SvelteKit, so this hook is the only reliable barrier for /admin —
 *    it covers every method on every admin route, ERP and experiments alike.
 *    /admin/acceso stays open (it's the login).
 *
 * 2. A/B assignment, server-side so variants render in the SSR pass with
 *    zero flicker. Every page GET from a non-bot gets a signed `icarus_vid`
 *    cookie (httpOnly, 1 year) and a variant per active experiment on the
 *    requested path; pages read them via +layout.server.js → page.data.ab.
 *    Data requests for client-side navigations come through here too.
 */
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { assignAll, isBot, mintVid, verifyVid } from '$lib/server/ab/core.js';

const YEAR = 60 * 60 * 24 * 365;
const SKIP = ['/api', '/admin', '/ariadna'];

export async function handle({ event, resolve }) {
	const { pathname } = event.url;

	if (pathname.startsWith('/admin') && pathname !== '/admin/acceso') {
		const key = env.ADMIN_KEY;
		const authed = (!key && dev) || (key && event.cookies.get('admin_key') === key);
		if (!authed) {
			if (event.request.method === 'GET' || event.request.method === 'HEAD') {
				redirect(303, '/admin/acceso');
			}
			return new Response('No autorizado', { status: 403 });
		}
	}

	event.locals.ab = {};

	const isPage =
		event.request.method === 'GET' &&
		event.route.id !== null &&
		!SKIP.some((p) => pathname.startsWith(p));

	if (isPage && !isBot(event.request.headers.get('user-agent'))) {
		let vid = verifyVid(event.cookies.get('icarus_vid'));
		if (!vid) {
			const minted = mintVid();
			vid = minted.id;
			event.cookies.set('icarus_vid', minted.cookie, {
				path: '/',
				maxAge: YEAR,
				httpOnly: true,
				sameSite: 'lax'
			});
		}
		event.locals.ab = assignAll(vid, pathname);
	}

	return resolve(event);
}
