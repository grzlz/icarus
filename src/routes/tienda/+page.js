// The shop lives at `/` now. Old links (and /tienda#bordado-style filter
// anchors — browsers reapply the hash after the redirect) land on the homepage.
import { redirect } from '@sveltejs/kit';

export function load() {
	redirect(301, '/');
}
