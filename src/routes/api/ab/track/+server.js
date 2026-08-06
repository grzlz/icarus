/*
 * First-party event ingestion. Fired via navigator.sendBeacon from
 * $lib/ab/client.js — hence the 204s (a beacon never reads the response).
 * Identity comes from the httpOnly vid cookie, never from the body.
 */
import { json } from '@sveltejs/kit';
import { recordEvent, isBot } from '$lib/server/ab/core.js';

export async function POST({ request, cookies }) {
	const vid = cookies.get('icarus_vid');
	if (!vid || isBot(request.headers.get('user-agent'))) {
		return new Response(null, { status: 204 });
	}
	if (Number(request.headers.get('content-length')) > 2048) {
		return json({ error: 'Payload muy grande' }, { status: 413 });
	}
	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'JSON inválido' }, { status: 400 });
	}
	recordEvent(vid, body ?? {});
	return new Response(null, { status: 204 });
}
