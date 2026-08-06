<script>
	import { reveal } from '$lib/actions/reveal.js';
	import ShirtMockup from '$lib/components/ShirtMockup.svelte';
	import Shirt3DView from '$lib/components/Shirt3DView.svelte';
	import { garmentLabel } from '$lib/shirt.js';
	import { products } from '$lib/products.js';

	const filters = [
		{ id: 'todo', label: 'Todo' },
		{ id: 'playeras', label: 'Playeras' },
		{ id: 'sudaderas', label: 'Sudaderas' },
		{ id: 'estampado', label: 'Estampado' },
		{ id: 'bordado', label: 'Bordado' }
	];

	let active = $state('todo');

	// Sync active filter with URL hash so /tienda#bordado works from anywhere
	$effect(() => {
		const fromHash = window.location.hash.replace('#', '');
		if (fromHash && filters.find((f) => f.id === fromHash)) {
			active = fromHash;
		}
	});

	function setFilter(id) {
		active = id;
		if (typeof history !== 'undefined') {
			history.replaceState(null, '', id === 'todo' ? '/tienda' : `/tienda#${id}`);
		}
	}

	function matchesFilter(p, id) {
		if (id === 'todo') return true;
		if (id === 'playeras') return p.type === 'Playera';
		if (id === 'sudaderas') return p.type === 'Sudadera';
		return p.technique === id;
	}

	let filtered = $derived(products.filter((p) => matchesFilter(p, active)));

	// Product on the center stage; clicking any tile swaps it in place.
	// $state.raw: it's only ever reassigned, and identity comparisons against
	// catalog entries (selected === product, filtered.includes) must hold.
	let selected = $state.raw(products[0]);

	// If a filter hides the selected piece, hand the stage to the first visible one.
	$effect(() => {
		if (filtered.length && !filtered.includes(selected)) {
			selected = filtered[0];
		}
	});
</script>

<svelte:head>
	<title>Tienda · Icarus</title>
	<meta
		name="description"
		content="Playeras y sudaderas con frases para los que viven en la terminal. Estampado y bordado, hecho en México."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Tienda · Icarus" />
	<meta
		property="og:description"
		content="Playeras y sudaderas con frases para los que viven en la terminal. Estampado y bordado, hecho en México."
	/>
	<meta property="og:url" content="https://icarus.mx/tienda" />
	<meta property="og:locale" content="es_MX" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Tienda · Icarus" />
</svelte:head>

<!-- ───────────────── HEADER: one line, no prose ───────────────── -->
<section class="bg-bone-50">
	<div
		class="mx-auto flex max-w-7xl flex-wrap items-baseline gap-x-8 gap-y-3 px-5 pt-12 pb-5 md:px-10 md:pt-16 md:pb-6"
	>
		<h1 class="text-ink-950 text-2xl font-extrabold tracking-tight md:text-3xl">Drop 01</h1>
		<nav class="flex flex-wrap items-baseline gap-x-5 gap-y-2" aria-label="Filtros">
			{#each filters as filter (filter.id)}
				<button
					onclick={() => setFilter(filter.id)}
					class="cursor-pointer font-mono text-[11px] font-semibold tracking-widest uppercase transition-colors {active ===
					filter.id
						? 'text-tomato-600 underline decoration-2 underline-offset-4'
						: 'text-grey-500 hover:text-ink-950'}"
				>
					{filter.label}
				</button>
			{/each}
		</nav>
		<span class="text-grey-500 ml-auto font-mono text-[11px] tracking-widest uppercase">
			{filtered.length}
			{filtered.length === 1 ? 'pieza' : 'piezas'}
		</span>
	</div>
</section>

<!-- ───────────────── MOSAIC: silent tiles around a floating 3D stage ───────────────── -->
<section class="bg-bone-50">
	<div class="mx-auto max-w-7xl px-5 pb-16 md:px-10 md:pb-24">
		{#if filtered.length === 0}
			<p class="text-grey-600 py-20 text-center font-mono text-sm">
				grep: 0 resultados. Prueba otro filtro.
			</p>
		{:else}
			<div class="grid grid-flow-dense grid-cols-2 gap-1.5 lg:grid-cols-4">
				<!-- Center stage: the selected piece floats and spins mid-grid. -->
				<div
					class="from-bone-100 to-bone-200 relative col-span-2 row-span-2 row-start-2 aspect-square overflow-hidden bg-gradient-to-br lg:col-start-2"
				>
					<div class="stage-float absolute inset-0">
						<Shirt3DView
							phrase={selected.phrase}
							garment={selected.garment}
							technique={selected.technique}
							type={selected.type}
							hint={false}
							rounded=""
						/>
					</div>

					{#if selected.tag}
						<span
							class="bg-tomato-500 text-bone-50 absolute top-3 left-3 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest uppercase"
						>
							{selected.tag}
						</span>
					{/if}

					<!-- Frosted bar so the caption reads over the 3D scene, a product
					     photo, or the dark flat fallback alike. -->
					<div
						class="bg-bone-50/85 pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 backdrop-blur-sm md:p-5"
					>
						<div class="min-w-0">
							<p
								class="text-grey-600 font-mono text-[10px] font-semibold tracking-widest uppercase"
							>
								{selected.type} · {garmentLabel(selected.garment)} · {selected.technique}
							</p>
							<p class="text-ink-950 mt-1 truncate text-base font-extrabold md:text-lg">
								“{selected.phrase.replace(/\n/g, ' ')}”
							</p>
						</div>
						<p class="text-ink-950 text-xl font-extrabold whitespace-nowrap md:text-2xl">
							{selected.price}
						</p>
					</div>

					{#if selected.type === 'Sudadera'}
						<!-- CC BY 4.0 attribution for the hoodie mesh (the tee is CC0). -->
						<p class="text-grey-500 absolute top-3 right-3 font-mono text-[9px] tracking-wide">
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
				</div>

				{#each filtered as product, i (product.slug)}
					<button
						type="button"
						onclick={() => (selected = product)}
						use:reveal={{ delay: Math.min(i * 40, 240) }}
						aria-pressed={selected === product}
						class="group focus-visible:outline-tomato-500 relative aspect-square cursor-pointer overflow-hidden text-left focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2"
					>
						<div class="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
							<ShirtMockup
								phrase={product.phrase}
								garment={product.garment}
								technique={product.technique}
								image={product.image ?? null}
								tag={product.tag}
								rounded=""
							/>
						</div>

						<!-- Phrase + price only on hover/focus: the mosaic stays silent. -->
						<div
							class="from-ink-950/70 via-ink-950/25 absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
						>
							<p class="text-bone-50 truncate text-xs font-bold">
								“{product.phrase.replace(/\n/g, ' ')}”
							</p>
							<p class="text-bone-50 font-mono text-[10px] font-semibold whitespace-nowrap">
								{product.price}
							</p>
						</div>

						{#if selected === product}
							<span class="bg-tomato-500 absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full"
							></span>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- ───────────────── TÉCNICAS: one line each ───────────────── -->
<section class="bg-ink-950 text-bone-50">
	<div
		class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-12 md:grid-cols-2 md:gap-12 md:px-10 md:py-16"
	>
		<div use:reveal>
			<p class="text-tomato-500 font-mono text-[10px] font-semibold tracking-widest uppercase">
				Estampado
			</p>
			<p class="text-bone-100 mt-2 text-lg font-medium">
				Serigrafía a mano en CDMX. Tinta suave que aguanta las lavadas.
			</p>
		</div>
		<div use:reveal={{ delay: 80 }}>
			<p class="text-grey-400 font-mono text-[10px] font-semibold tracking-widest uppercase">
				Bordado
			</p>
			<p class="text-bone-100 mt-2 text-lg font-medium">
				Hilo de algodón, puntada por puntada. Cada pieza suma al cluster de GPUs.
			</p>
		</div>
	</div>
</section>

<!-- ───────────────── CTA: one row ───────────────── -->
<section class="bg-bone-50 border-ink-950/8 border-t">
	<div
		class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5 py-12 md:px-10"
	>
		<h2 use:reveal class="text-ink-950 text-2xl font-extrabold tracking-tight md:text-3xl">
			El Drop 02 ya se está cocinando.
		</h2>
		<a
			use:reveal={{ delay: 100 }}
			href="/#contacto"
			class="bg-ink-950 text-bone-50 hover:bg-ink-800 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-colors"
		>
			Avísame →
		</a>
	</div>
</section>

<style>
	.stage-float {
		animation: stage-float 6s ease-in-out infinite;
	}

	@keyframes stage-float {
		0%,
		100% {
			transform: translateY(6px);
		}
		50% {
			transform: translateY(-6px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.stage-float {
			animation: none;
		}
	}
</style>
