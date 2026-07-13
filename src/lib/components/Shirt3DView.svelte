<script>
	/*
	 * Reusable interactive 3D garment. Lazy-loads the three.js scene on mount and
	 * shows the flat ShirtMockup as a fallback until it arrives (and during SSR),
	 * so nothing jumps. Fills its parent — give the parent a defined size
	 * (e.g. `aspect-square`).
	 *
	 * `type` picks the 3D model ($lib/models3d.js). While the sudadera GLB
	 * isn't deployed, sudaderas render on the tee with a small notice.
	 */
	import { onMount } from 'svelte';
	import ShirtMockup from '$lib/components/ShirtMockup.svelte';
	import { sudaderaAvailable } from '$lib/models3d.js';

	let {
		phrase,
		garment = 'black',
		technique = 'estampado',
		type = 'Playera',
		hint = true
	} = $props();

	let Shirt3D = $state(null);
	onMount(async () => {
		Shirt3D = (await import('$lib/components/Shirt3D.svelte')).default;
	});

	// Effective model type: sudaderas fall back to the tee until the GLB exists.
	let modelType = $state('Playera');
	$effect(() => {
		if (type !== 'Sudadera') {
			modelType = type;
			return;
		}
		let stale = false;
		sudaderaAvailable().then((ok) => {
			if (!stale) modelType = ok ? 'Sudadera' : 'Playera';
		});
		return () => (stale = true);
	});
</script>

<div class="relative h-full w-full">
	{#if Shirt3D}
		<Shirt3D {phrase} {garment} {technique} type={modelType} />
	{:else}
		<ShirtMockup {phrase} {garment} {technique} size="hero" />
	{/if}

	{#if type === 'Sudadera' && modelType === 'Playera'}
		<span
			class="text-grey-500 pointer-events-none absolute top-3 right-3 font-mono text-[10px] tracking-widest uppercase"
		>
			vista previa en playera
		</span>
	{/if}

	{#if hint}
		<span
			class="text-grey-500 pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest whitespace-nowrap uppercase"
		>
			arrastra para girar
		</span>
	{/if}
</div>
