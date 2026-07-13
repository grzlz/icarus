<script>
	/*
	 * Threlte scene for the 3D shirt: camera, studio lights, and the GLB mesh
	 * with the phrase projected as a chest decal. Must live inside <Canvas>
	 * (see Shirt3D.svelte) so Threlte's context hooks resolve.
	 *
	 * The mesh is ~0.55 × 0.61 units centered at the origin, chest front at
	 * z ≈ 0.14 — camera and decal numbers below assume that.
	 */
	import { T } from '@threlte/core';
	import { OrbitControls, Decal, useGltf } from '@threlte/extras';
	import { CanvasTexture, SRGBColorSpace, TextureLoader } from 'three';
	import { paintDecal } from '$lib/printDecal.js';
	import { fallbackBg } from '$lib/shirt.js';

	let { phrase, garment = 'black', technique = 'estampado' } = $props();

	// CC0 tee from the pmndrs market (see static/models/README.md).
	const gltf = useGltf('/models/shirt.glb');

	// The Icarus wing (same mark as Navbar/Footer), printed on every shirt at
	// its true brand blue — the Decal's material is unlit, so studio lights
	// don't shift the color. Loaded once; this scene is client-only.
	const logo = new TextureLoader().load('/logo.png');
	logo.colorSpace = SRGBColorSpace;
	logo.anisotropy = 8;

	// shirt.js speaks oklch; three.js doesn't parse it. Paint 1px and read it
	// back so shirt.js stays the single source of truth for garment colors.
	function cssToHex(css) {
		const ctx = document.createElement('canvas').getContext('2d');
		ctx.canvas.width = ctx.canvas.height = 1;
		ctx.fillStyle = css;
		ctx.fillRect(0, 0, 1, 1);
		const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
		return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
	}

	const fabric = $derived(cssToHex(fallbackBg(garment)));

	// Repaint the decal texture whenever the product changes. paintDecal is
	// async (font loading), so guard against out-of-order resolutions.
	let texture = $state(null);
	$effect(() => {
		const config = { phrase, garment, technique };
		let stale = false;
		paintDecal(config).then((canvas) => {
			if (stale) return;
			const next = new CanvasTexture(canvas);
			next.colorSpace = SRGBColorSpace;
			next.anisotropy = 8;
			texture?.dispose();
			texture = next;
		});
		return () => (stale = true);
	});

	const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
</script>

<T.PerspectiveCamera makeDefault position={[0, 0.08, 2.1]} fov={25}>
	<OrbitControls
		enableZoom={false}
		enablePan={false}
		enableDamping
		autoRotate={!reducedMotion}
		autoRotateSpeed={-1.4}
		target={[0, -0.04, 0]}
	/>
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.85} />
<T.DirectionalLight position={[2.5, 2.5, 3]} intensity={1.1} />
<T.DirectionalLight position={[-2.5, 1, -2]} intensity={0.4} />

{#await gltf then { nodes, materials }}
	<T.Mesh
		geometry={nodes.T_Shirt_male.geometry}
		material={materials.lambert1}
		material.color={fabric}
		material.roughness={1}
	>
		{#if texture}
			{#if technique === 'bordado'}
				<!-- Small patch, wearer's-right chest — mirrors the bordado card. -->
				<Decal
					src={texture}
					position={[-0.08, 0.1, 0.12]}
					rotation={[0, 0, 0]}
					scale={[0.14, 0.14, 0.12]}
				/>
			{:else}
				<!-- Big centered chest print. -->
				<Decal
					src={texture}
					position={[0, 0.04, 0.12]}
					rotation={[0, 0, 0]}
					scale={[0.3, 0.3, 0.15]}
				/>
			{/if}
		{/if}

		<!-- Brand wing, small, wearer's-left chest (opposite the bordado patch).
		     polygonOffset pulls it in front where it grazes the phrase print. -->
		<Decal
			src={logo}
			position={[0.1, 0.14, 0.12]}
			rotation={[0, 0, 0]}
			scale={[0.075, 0.075, 0.1]}
			polygonOffsetFactor={-20}
		/>
	</T.Mesh>
{/await}
