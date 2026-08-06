/*
 * Visitor identity + A/B assignment, server-side so variants render in the
 * SSR pass with zero flicker. Every page GET from a non-bot gets a `vid`
 * cookie (httpOnly, 1 year) and a variant for each active experiment on the
 * requested path; pages read them via +layout.server.js → page.data.ab.
 * Data requests for client-side navigations come through here too, so
 * assignment works the same on soft navigations.
 */
import { assignAll, isBot } from '$lib/server/ab/core.js';

const YEAR = 60 * 60 * 24 * 365;
const SKIP = ['/api', '/admin', '/ariadna'];

export async function handle({ event, resolve }) {
	event.locals.ab = {};

	const { pathname } = event.url;
	const isPage =
		event.request.method === 'GET' &&
		event.route.id !== null &&
		!SKIP.some((p) => pathname.startsWith(p));

	if (isPage && !isBot(event.request.headers.get('user-agent'))) {
		let vid = event.cookies.get('icarus_vid');
		if (!vid) {
			vid = crypto.randomUUID();
			event.cookies.set('icarus_vid', vid, {
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
