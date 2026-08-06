/*
 * Client-side API of the A/B framework. Components read variants from
 * page.data.ab (assigned server-side in hooks.server.js) with these helpers,
 * and report events with track() — sendBeacon so events survive the tab
 * closing, fetch(keepalive) as fallback.
 *
 *   track('producto', { meta: slug })
 *   variantOf(page.data.ab, 'hero-2026')          → 'a' | 'b' | ...
 *   knob(page.data.ab, 'precios-drop01', 'titulo', 'Drop 01')
 */
import { browser } from '$app/environment';

export function track(name, { value = null, path = null, meta = null } = {}) {
	if (!browser) return;
	const body = JSON.stringify({ name, value, meta, path: path ?? location.pathname });
	const blob = new Blob([body], { type: 'application/json' });
	if (!navigator.sendBeacon?.('/api/ab/track', blob)) {
		fetch('/api/ab/track', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body,
			keepalive: true
		}).catch(() => {});
	}
}

export const variantOf = (ab, slug) => ab?.[slug]?.variant ?? 'a';

export function knob(ab, slug, key, fallback) {
	const v = ab?.[slug]?.payload?.[key];
	return v === undefined ? fallback : v;
}
