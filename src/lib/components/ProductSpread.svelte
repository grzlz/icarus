<script>
	/*
	 * One catalog entry set like a magazine spread: the product photo as the
	 * plate, the phrase as the headline, one line of facts, two quiet actions.
	 *
	 * The 3D render is opt-in. `spinning` is owned by the page so only one
	 * WebGL canvas is ever alive; the plate swaps between photo and render in
	 * place, same box, no layout shift.
	 */
	import ShirtMockup from '$lib/components/ShirtMockup.svelte';
	import Shirt3DView from '$lib/components/Shirt3DView.svelte';
	import { garmentLabel } from '$lib/shirt.js';

	let { product, index, total, spinning = false, onspin, onorder } = $props();

	const folio = $derived(String(index + 1).padStart(2, '0'));
	const oneLine = $derived(product.phrase.replace(/\n/g, ' '));
	const garment = $derived(`${product.type} ${garmentLabel(product.garment)}`);
	const whatsapp = $derived(
		`https://wa.me/525548017016?text=${encodeURIComponent(
			`Hola, quiero la ${product.type.toLowerCase()} “${oneLine}” (${product.technique}).`
		)}`
	);
</script>

<article class="grid gap-5 md:gap-7">
	<!-- Plate. Photos already carry a bone studio background, so they sit on the
	     page without a frame; the placeholder block is the frame. -->
	<div class="bg-bone-100 relative aspect-square overflow-hidden rounded-2xl">
		{#if spinning}
			<Shirt3DView
				phrase={product.phrase}
				garment={product.garment}
				technique={product.technique}
				type={product.type}
				rounded=""
			/>
		{:else}
			<ShirtMockup
				phrase={product.phrase}
				garment={product.garment}
				technique={product.technique}
				image={product.image ?? null}
				size="hero"
				rounded=""
			/>
		{/if}

		<span class="label text-grey-500 absolute top-4 left-4">
			{folio}<span class="text-grey-400">/{total}</span>
		</span>

		{#if spinning && product.type === 'Sudadera'}
			<!-- CC BY 4.0 requires a visible credit for the hoodie mesh (the tee is CC0). -->
			<p
				class="text-grey-600 bg-bone-100/85 absolute top-10 left-2.5 rounded-full px-1.5 py-0.5 font-mono text-[10px] tracking-wide"
			>
				<a
					href="https://sketchfab.com/3d-models/hoodie-5ffe31a324a6452c8c4ada71daa12da9"
					class="underline decoration-dotted underline-offset-2"
					target="_blank"
					rel="noopener">"hoodie" por pokoponmaru</a
				>
				·
				<a
					href="https://creativecommons.org/licenses/by/4.0/"
					class="underline decoration-dotted underline-offset-2"
					target="_blank"
					rel="noopener">CC BY 4.0</a
				>
			</p>
		{/if}

		{#if product.tag}
			<span
				class="label bg-icarus-500 absolute top-3.5 right-4 rounded-full px-2.5 py-1 text-white"
			>
				{product.tag}
			</span>
		{/if}
	</div>

	<!-- Caption. Left-aligned, the phrase gets the size. -->
	<div class="grid gap-4">
		<h2 class="display text-ink-950 text-[clamp(1.9rem,3.4vw,3rem)]">
			“{oneLine}”
		</h2>

		<div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
			<p class="label text-grey-600">
				{garment} · {product.technique}
			</p>
			<p class="text-ink-950 font-mono text-base font-bold tabular-nums">{product.price}</p>
		</div>

		<div class="rule flex flex-wrap items-center gap-x-6 gap-y-2 border-t pt-4">
			<a
				href={whatsapp}
				target="_blank"
				rel="noopener"
				onclick={() => onorder?.(product)}
				class="text-ink-950 hover:text-icarus-500 text-sm font-semibold transition-colors"
			>
				Pedir por WhatsApp <span aria-hidden="true">↗</span>
			</a>
			<button
				type="button"
				onclick={() => onspin?.(spinning ? null : product)}
				aria-pressed={spinning}
				class="label text-grey-600 hover:text-ink-950 cursor-pointer transition-colors {spinning
					? 'text-icarus-500'
					: ''}"
			>
				{spinning ? 'ver foto' : 'girar en 3d'}
			</button>
		</div>
	</div>
</article>
