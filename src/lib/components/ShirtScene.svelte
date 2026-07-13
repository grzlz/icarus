<script>
	/*
	 * Threlte scene for the 3D garment: camera, studio lights, and the GLB mesh
	 * with the phrase projected as a chest decal. Must live inside <Canvas>
	 * (see Shirt3D.svelte) so Threlte's context hooks resolve.
	 *
	 * Which GLB, and where the decals land, comes from $lib/models3d.js keyed
	 * by the catalog `type`. Shirt3D remounts this component when `type`
	 * changes ({#key}), so the model is fixed for the life of the instance —
	 * useGltf has to run during init anyway.
	 */
	import { T } from '@threlte/core';
	import { OrbitControls, Decal, useGltf } from '@threlte/extras';
	import { CanvasTexture, SRGBColorSpace, TextureLoader } from 'three';
	import { paintDecal } from '$lib/printDecal.js';
	import { fallbackBg } from '$lib/shirt.js';
	import { modelFor } from '$lib/models3d.js';

	let { phrase, garment = 'black', technique = 'estampado', type = 'Playera' } = $props();

	const model = modelFor(type);
	const gltf = useGltf(model.url);

	// The Icarus wing (same mark as Navbar/Footer), printed on every garment at
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

	// Named node when we know it (the tee), else first mesh in the scene so an
	// asset can be dropped in without knowing its node names.
	function resolveMesh({ nodes, scene }) {
		if (model.node && nodes[model.node]) return nodes[model.node];
		let mesh = null;
		scene.traverse((o) => {
			if (!mesh && o.isMesh) mesh = o;
		});
		return mesh;
	}

	// Fit an arbitrary asset to the tee's footprint: scale to `model.fit`
	// units tall, centered at the origin. `local`/`localScale` map the
	// post-fit decal numbers in models3d.js back into mesh-local space.
	function fitTransform(geometry) {
		if (!model.fit) {
			return { scale: 1, offset: [0, 0, 0], local: (v) => v, localScale: (v) => v };
		}
		geometry.computeBoundingBox();
		const { min, max } = geometry.boundingBox;
		const s = model.fit / (max.y - min.y);
		const c = [(min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2];
		return {
			scale: s,
			offset: [-c[0] * s, -c[1] * s, -c[2] * s],
			local: (v) => [v[0] / s + c[0], v[1] / s + c[1], v[2] / s + c[2]],
			localScale: (v) => [v[0] / s, v[1] / s, v[2] / s]
		};
	}

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

{#await gltf then data}
	{@const mesh = resolveMesh(data)}
	{@const f = fitTransform(mesh.geometry)}
	<T.Group scale={f.scale} position={f.offset}>
		<T.Mesh
			geometry={mesh.geometry}
			material={Array.isArray(mesh.material) ? mesh.material[0] : mesh.material}
			material.color={fabric}
			material.roughness={1}
		>
			{#if texture}
				{#if technique === 'bordado'}
					<!-- Small patch, wearer's-right chest — mirrors the bordado card. -->
					<Decal
						src={texture}
						position={f.local(model.patch.position)}
						rotation={[0, 0, 0]}
						scale={f.localScale(model.patch.scale)}
					/>
				{:else}
					<!-- Big centered chest print. -->
					<Decal
						src={texture}
						position={f.local(model.print.position)}
						rotation={[0, 0, 0]}
						scale={f.localScale(model.print.scale)}
					/>
				{/if}
			{/if}

			<!-- Brand wing, small, wearer's-left chest (opposite the bordado patch).
			     polygonOffset pulls it in front where it grazes the phrase print. -->
			<Decal
				src={logo}
				position={f.local(model.logo.position)}
				rotation={[0, 0, 0]}
				scale={f.localScale(model.logo.scale)}
				polygonOffsetFactor={-20}
			/>
		</T.Mesh>
	</T.Group>
{/await}
