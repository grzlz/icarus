<script>
	import { reveal } from '$lib/actions/reveal.js';
	import ProductSpread from '$lib/components/ProductSpread.svelte';
	import { products } from '$lib/products.js';
	import { knob, track } from '$lib/ab/client.js';
	import { page } from '$app/state';

	const filters = [
		{ id: 'todo', label: 'Todo' },
		{ id: 'playeras', label: 'Playeras' },
		{ id: 'sudaderas', label: 'Sudaderas' },
		{ id: 'estampado', label: 'Estampado' },
		{ id: 'bordado', label: 'Bordado' }
	];

	let active = $state('todo');

	// Sync the active filter with the URL hash so /#bordado works from anywhere —
	// on load (/tienda#bordado redirects here, hash intact) and on same-page
	// hash clicks like the footer's filter links, which only fire hashchange.
	function applyHash() {
		const fromHash = window.location.hash.replace('#', '');
		if (filters.some((f) => f.id === fromHash)) active = fromHash;
	}
	$effect(() => applyHash());

	function setFilter(id) {
		active = id;
		track('filtro', { meta: id });
		history.replaceState(null, '', id === 'todo' ? '/' : `/#${id}`);
	}

	function matchesFilter(p, id) {
		if (id === 'todo') return true;
		if (id === 'playeras') return p.type === 'Playera';
		if (id === 'sudaderas') return p.type === 'Sudadera';
		return p.technique === id;
	}

	// The catalog reads top to bottom from the joke anyone gets to the deep
	// terminal cut — the `nerd` score is the running order.
	const ordered = [...products].sort((a, b) => (a.nerd ?? 3) - (b.nerd ?? 3));
	let visible = $derived(ordered.filter((p) => matchesFilter(p, active)));

	// At most one live WebGL canvas: the spread whose slug is here shows the render.
	let spinning = $state(null);
	function spin(product) {
		spinning = product?.slug ?? null;
		if (product) track('producto', { meta: product.slug });
	}
</script>

<svelte:window onhashchange={applyHash} />

<svelte:head>
	<title>Icarus · Playeras y sudaderas para los que viven en la terminal</title>
	<meta
		name="description"
		content="Playeras y sudaderas con frases para los que viven en la terminal. Estampado a serigrafía o bordado a máquina, hecho en México."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Icarus · Para los que viven en la terminal" />
	<meta
		property="og:description"
		content="Playeras y sudaderas con frases para los que viven en la terminal. Estampado o bordado, hecho en México."
	/>
	<meta property="og:url" content="https://icarus.mx" />
	<meta property="og:site_name" content="Icarus" />
	<meta property="og:locale" content="es_MX" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Icarus · Para los que viven en la terminal" />
</svelte:head>

<!-- ───────────── MASTHEAD: the statement, set big, no image ───────────── -->
<header class="mx-auto max-w-[1400px] px-5 pt-14 pb-10 md:px-10 md:pt-24 md:pb-16">
	<p class="label text-grey-600">
		{knob(page.data.ab, 'titulo-drop', 'Drop 01')} · Hecho en México
	</p>
	<h1 class="display text-ink-950 mt-5 max-w-[15ch] text-[clamp(2.75rem,8.5vw,8.5rem)]">
		Playeras y sudaderas para los que viven en la <em class="text-icarus-500 not-italic"
			>terminal</em
		>.
	</h1>
	<p class="text-grey-600 mt-8 max-w-md text-base leading-relaxed md:text-lg">
		Algodón bueno, una frase por pieza. Estampado a serigrafía o bordado a máquina. Sin colecciones
		cápsula, sin drama.
	</p>
</header>

<!-- ───────────── INDEX LINE: filters + running order, one rule above and below ───────────── -->
<div id="catalogo" class="mx-auto max-w-[1400px] px-5 md:px-10">
	<div class="rule flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-y py-4">
		<nav class="flex flex-wrap items-baseline gap-x-5 gap-y-2" aria-label="Filtros">
			{#each filters as filter (filter.id)}
				<button
					onclick={() => setFilter(filter.id)}
					aria-pressed={active === filter.id}
					class="label cursor-pointer transition-colors {active === filter.id
						? 'text-ink-950 decoration-icarus-500 underline decoration-2 underline-offset-[6px]'
						: 'text-grey-500 hover:text-ink-950'}"
				>
					{filter.label}
				</button>
			{/each}
		</nav>
		<p class="label text-grey-500">
			{visible.length}
			{visible.length === 1 ? 'pieza' : 'piezas'} · de lo más serio a lo más nerd
		</p>
	</div>
</div>

<!-- ───────────── CATALOG: spreads on a 12-col editorial grid ─────────────
     Desktop: pairs alternate a 7/5 then 5/7 split, and the narrow plate drops
     a little so the eye zigzags down the page instead of scanning rows.
     Mobile: one column, full width, nothing hidden. -->
<section class="mx-auto max-w-[1400px] px-5 pt-10 pb-24 md:px-10 md:pt-16 md:pb-32">
	{#if visible.length === 0}
		<p class="text-grey-600 py-24 font-mono text-sm">grep: 0 resultados. Prueba otro filtro.</p>
	{:else}
		<div class="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-12 md:gap-y-28">
			{#each visible as product, i (product.slug)}
				{@const wide = i % 4 === 0 || i % 4 === 3}
				<div
					use:reveal={{ delay: (i % 2) * 90 }}
					class="{wide ? 'md:col-span-7' : 'md:col-span-5 md:pt-24'} {i % 4 === 2
						? 'md:col-start-1'
						: ''}"
				>
					<ProductSpread
						{product}
						index={i}
						total={visible.length}
						spinning={spinning === product.slug}
						onspin={spin}
						onorder={(p) => track('whatsapp', { meta: p.slug })}
					/>
				</div>
			{/each}
		</div>
	{/if}
</section>

<!-- ───────────── TÉCNICAS + DROP 02: three columns of type, hairlines, no dark band ───────────── -->
<section class="mx-auto max-w-[1400px] px-5 pb-8 md:px-10">
	<div class="rule grid grid-cols-1 gap-10 border-t pt-10 md:grid-cols-3 md:gap-12 md:pt-14">
		<div use:reveal>
			<p class="label text-icarus-500">Estampado</p>
			<p class="display text-ink-950 mt-3 text-2xl md:text-3xl">
				Serigrafía a mano en CDMX. Tinta suave que aguanta las lavadas.
			</p>
		</div>
		<div use:reveal={{ delay: 80 }}>
			<p class="label text-grey-600">Bordado</p>
			<p class="display text-ink-950 mt-3 text-2xl md:text-3xl">
				Hilo de algodón, puntada por puntada. Cada pieza suma al cluster de GPUs.
			</p>
		</div>
		<div use:reveal={{ delay: 160 }}>
			<p class="label text-grey-600">Drop 02</p>
			<!-- Punto de ajuste 'drop02-texto': editable en vivo desde /admin/experimentos -->
			<p class="display text-ink-950 mt-3 text-2xl md:text-3xl">
				{knob(page.data.ab, 'drop02-texto', 'Ya se está cocinando.')}
			</p>
		</div>
	</div>
</section>
