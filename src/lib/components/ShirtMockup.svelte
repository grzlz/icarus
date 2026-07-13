<script>
	/*
	 * Renders a product card image. When `image` is provided it's a finished
	 * product photo (print already on the shirt — e.g. generated via /taller or
	 * a real flat-lay), shown as-is. Without `image`, falls back to the colored
	 * placeholder block with the phrase rendered as a simulated print.
	 */
	import { fallbackBg, printColor, threadColor } from '$lib/shirt.js';

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
	const thread = $derived(threadColor(garment));

	const printSize = $derived(
		size === 'hero' ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-2xl md:text-3xl'
	);
</script>

<!-- ring-ink-950/5 is a hairline that adapts via the dark token swap: faint
     dark line on bone, faint light line on the dark gradient. -->
<div
	class="ring-ink-950/5 relative h-full w-full overflow-hidden rounded-2xl ring-1 ring-inset"
	style="background-color: {bg};"
>
	{#if tag}
		<span
			class="bg-tomato-500 text-bone-50 absolute top-3 left-3 z-10 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest uppercase"
		>
			{tag}
		</span>
	{/if}

	{#if image}
		<img
			src={image}
			alt="{technique === 'bordado' ? 'Bordado' : 'Estampado'} «{phrase.replace(/\n/g, ' ')}»"
			loading="lazy"
			class="absolute inset-0 h-full w-full object-cover"
		/>
	{:else}
		<!-- Icarus wing on the wearer's-left chest; a real photo brings its own. -->
		<img
			src="/logo.png"
			alt=""
			class="pointer-events-none absolute top-[19%] right-[21%] z-10 w-[13%]"
		/>

		{#if technique === 'estampado'}
			<!-- Big chest print, centered. -->
			<div class="absolute inset-0 flex items-center justify-center px-5">
				<div class="print {printSize}" style:color={ink}>
					{#each phrase.split('\n') as line, idx (idx)}
						<div>{line}</div>
					{/each}
				</div>
			</div>
		{:else}
			<!-- Bordado: small chest patch, upper-left, dashed outline. -->
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
	{/if}
</div>
