<script>
	/*
	 * Variant renderer for 'seccion' and 'pagina' experiments. Declare one
	 * snippet per variant key; the visitor's assigned snippet renders, and
	 * everyone else (no assignment, experiment paused/finished) sees `a`:
	 *
	 *   <Experiment slug="hero-2026">
	 *     {#snippet a()}<HeroActual />{/snippet}
	 *     {#snippet b()}<HeroNuevo />{/snippet}
	 *   </Experiment>
	 */
	import { page } from '$app/state';

	let { slug, children, ...variants } = $props();

	let key = $derived(page.data.ab?.[slug]?.variant ?? 'a');
	let snippet = $derived(variants[key] ?? variants.a ?? children);
</script>

{#if snippet}
	{@render snippet()}
{/if}
