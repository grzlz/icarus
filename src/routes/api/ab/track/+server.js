/*
 * First-party event ingestion. Fired via navigator.sendBeacon from
 * $lib/ab/client.js — hence the 204s (a beacon never reads the response).
 * Identity comes from the HMAC-signed vid cookie, never from the body:
 * forged vids are dropped, and recordEvent caps events per vid per day.
 */
import { json } from '@sveltejs/kit';
import { recordEvent, verifyVid, isBot } from '$lib/server/ab/core.js';

export async function POST({ request, cookies }) {
	const vid = verifyVid(cookies.get('icarus_vid'));
	if (!vid || isBot(request.headers.get('user-agent'))) {
		return new Response(null, { status: 204 });
	}
	const raw = await request.text();
	if (raw.length > 2048) {
		return json({ error: 'Payload muy grande' }, { status: 413 });
	}
	let body;
	try {
		body = JSON.parse(raw);
	} catch {
		return json({ error: 'JSON inválido' }, { status: 400 });
	}
	recordEvent(vid, body ?? {});
	return new Response(null, { status: 204 });
}
