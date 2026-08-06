/* Reading url.pathname registers it as a dependency, so this re-runs on every
 * client-side navigation and page.data.ab always matches the current route. */
export function load({ locals, url }) {
	return { ab: locals.ab ?? {}, path: url.pathname };
}
