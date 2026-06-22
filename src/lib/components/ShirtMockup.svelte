<script>
	/*
	 * Renders a product card image: real shirt photo when `image` is provided,
	 * colored placeholder block otherwise. Phrase is overlaid on top.
	 *
	 * Drop a flat-lay PNG in /static/shirts/ and pass `image="/shirts/foo.png"`
	 * on the product. Estampado uses mix-blend-mode so the print "soaks into"
	 * the fabric texture; bordado renders as an opaque patch sitting on top.
	 */
	import { fallbackBg, printColor, blendMode, threadColor } from '$lib/shirt.js';

	let {
		phrase,
		garment = 'black',
		technique = 'estampado',
		image = null,
		tag = null,
		size = 'card' // 'card' | 'hero'
	} = $props();

	const bg = $derived(fallbackBg(garment));
	const ink = $derived(printColor(garment));
	const blend = $derived(blendMode(garment));
	const thread = $derived(threadColor(garment));

	const printSize = $derived(
		size === 'hero' ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-2xl md:text-3xl'
	);
</script>

<div class="relative h-full w-full overflow-hidden rounded-2xl" style="background-color: {bg};">
	{#if image}
		<img src={image} alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover" />
	{/if}

	{#if tag}
		<span
			class="bg-tomato-500 text-bone-50 absolute top-3 left-3 z-10 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest uppercase"
		>
			{tag}
		</span>
	{/if}

	{#if technique === 'estampado'}
		<!-- Big chest print, centered. Blend mode lets fabric texture leak through. -->
		<div
			class="absolute inset-0 flex items-center justify-center px-5"
			style:mix-blend-mode={image ? blend : 'normal'}
		>
			<div class="print {printSize}" style:color={ink} style:opacity={image ? 0.92 : 1}>
				{#each phrase.split('\n') as line, idx (idx)}
					<div>{line}</div>
				{/each}
			</div>
		</div>
	{:else}
		<!-- Bordado: small chest patch. No blend mode — embroidery sits on top of fabric. -->
		<div class="absolute inset-0 flex items-start justify-start pt-[26%] pl-[24%]">
			<div
				class="rounded-md border border-dashed px-2.5 py-1.5"
				style="border-color: color-mix(in oklch, {thread} 45%, transparent);"
			>
				<div class="print text-sm md:text-base" style:color={thread}>
					{#each phrase.split('\n') as line, idx (idx)}
						<div>{line}</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
