<script>
	/*
	 * "Vista 3D" band for /tienda: interactive preview of the selected product.
	 * Shirt3DView handles the lazy three.js load and the flat fallback.
	 */
	import Shirt3DView from '$lib/components/Shirt3DView.svelte';
	import { garmentLabel } from '$lib/shirt.js';

	let { product } = $props();
</script>

<section id="vista-3d" class="bg-bone-100 border-ink-950/8 border-b">
	<div
		class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-12 md:grid-cols-2 md:items-center md:px-10 md:py-16"
	>
		<div
			class="bg-bone-50 border-ink-950/10 relative aspect-square w-full overflow-hidden rounded-2xl border"
		>
			<Shirt3DView
				phrase={product.phrase}
				garment={product.garment}
				technique={product.technique}
			/>
		</div>

		<div>
			<p class="text-grey-600 font-mono text-[11px] font-semibold tracking-widest uppercase">
				Vista 3D
			</p>
			<h2 class="text-ink-950 mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
				"{product.phrase.replace(/\n/g, ' ')}"
			</h2>
			<p class="text-grey-600 mt-2 text-sm">
				{product.type}
				{garmentLabel(product.garment)} · {product.technique}
				{#if product.type === 'Sudadera'}
					· vista previa en playera
				{/if}
			</p>
			<p class="text-ink-950 mt-4 text-2xl font-extrabold">{product.price}</p>
			<p class="text-grey-600 mt-6 max-w-md text-sm leading-relaxed">
				Elige cualquier pieza del catálogo para verla aquí. Gírala como si la trajeras en la mano.
			</p>
		</div>
	</div>
</section>
