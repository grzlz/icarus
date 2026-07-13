<script>
	/*
	 * Client-only wrapper: Threlte <Canvas> + the shirt scene. Import this
	 * lazily (see TiendaVista3D.svelte) so three.js never lands in the initial
	 * bundle or runs during SSR.
	 *
	 * NoToneMapping keeps the garment colors true to the brand oklch tokens —
	 * Threlte's AgX default washes them toward grey.
	 */
	import { Canvas } from '@threlte/core';
	import { NoToneMapping } from 'three';
	import ShirtScene from './ShirtScene.svelte';

	let { phrase, garment = 'black', technique = 'estampado' } = $props();
</script>

<Canvas toneMapping={NoToneMapping}>
	<ShirtScene {phrase} {garment} {technique} />
</Canvas>
