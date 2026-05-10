<script>
	import { reveal } from '$lib/actions/reveal.js';

	// Each product has:
	// - phrase: the printed/embroidered text (newlines render as line breaks)
	// - type: 'Playera' | 'Sudadera'
	// - garment: 'black' | 'white' | 'grey' | 'olive' (shirt color)
	// - technique: 'estampado' | 'bordado'
	// - price: display string
	// - tag: optional badge (Hot, Nuevo, etc.)
	const products = [
		{
			phrase: 'no es bug\nes feature',
			type: 'Playera',
			garment: 'black',
			technique: 'estampado',
			price: '$390',
			tag: 'Hot'
		},
		{
			phrase: 'rm -rf\n/lunes',
			type: 'Sudadera',
			garment: 'black',
			technique: 'estampado',
			price: '$890',
			tag: null
		},
		{
			phrase: 'deploys\nlos\nviernes',
			type: 'Playera',
			garment: 'white',
			technique: 'estampado',
			price: '$390',
			tag: 'Nuevo'
		},
		{
			phrase: "i'm the\nbottleneck",
			type: 'Playera',
			garment: 'black',
			technique: 'estampado',
			price: '$390',
			tag: null
		},
		{
			phrase: '404\nmotivación\nno encontrada',
			type: 'Sudadera',
			garment: 'grey',
			technique: 'estampado',
			price: '$890',
			tag: null
		},
		{
			phrase: 'git commit -m\n"some\nchanges"',
			type: 'Playera',
			garment: 'white',
			technique: 'estampado',
			price: '$390',
			tag: null
		},
		{
			phrase: 'soy junior\npero cobro\ncomo senior',
			type: 'Playera',
			garment: 'black',
			technique: 'estampado',
			price: '$390',
			tag: 'Nuevo'
		},
		{
			phrase: 'works on\nmi máquina',
			type: 'Sudadera',
			garment: 'black',
			technique: 'estampado',
			price: '$890',
			tag: null
		},
		// Bordado pieces — discreet patches, premium price, more "uniform" feel
		{
			phrase: ':wq',
			type: 'Playera',
			garment: 'black',
			technique: 'bordado',
			price: '$490',
			tag: null
		},
		{
			phrase: '$ git',
			type: 'Playera',
			garment: 'white',
			technique: 'bordado',
			price: '$490',
			tag: 'Nuevo'
		},
		{
			phrase: '// TODO',
			type: 'Sudadera',
			garment: 'olive',
			technique: 'bordado',
			price: '$990',
			tag: null
		},
		{
			phrase: 'console\n.log(ñ)',
			type: 'Playera',
			garment: 'black',
			technique: 'bordado',
			price: '$490',
			tag: null
		},
		{
			phrase: '404',
			type: 'Sudadera',
			garment: 'black',
			technique: 'bordado',
			price: '$990',
			tag: null
		},
		{
			phrase: '</icarus>',
			type: 'Playera',
			garment: 'olive',
			technique: 'bordado',
			price: '$490',
			tag: 'Nuevo'
		},
		{
			// Illustration: bottle with stick figures stacked inside, top one waving from the neck. Discreet "← yo" accent embroidered.
			phrase: '← yo',
			type: 'Playera',
			garment: 'black',
			technique: 'bordado',
			price: '$590',
			tag: 'Nuevo'
		}
	];

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

	let filtered = $derived(
		products.filter((p) => {
			if (active === 'todo') return true;
			if (active === 'playeras') return p.type === 'Playera';
			if (active === 'sudaderas') return p.type === 'Sudadera';
			if (active === 'estampado') return p.technique === 'estampado';
			if (active === 'bordado') return p.technique === 'bordado';
			return true;
		})
	);

	// Shirt placeholders use literal colors so the card always represents
	// the actual garment color, regardless of light/dark UI theme.
	function shirtBg(g) {
		if (g === 'white') return 'bg-[oklch(0.96_0.008_75)]';
		if (g === 'grey') return 'bg-[oklch(0.62_0.008_270)]';
		if (g === 'olive') return 'bg-[oklch(0.4_0.05_115)]';
		return 'bg-[oklch(0.16_0.012_250)]';
	}
	function shirtText(g) {
		if (g === 'white' || g === 'grey') return 'text-[oklch(0.16_0.012_250)]';
		return 'text-[oklch(0.96_0.008_75)]';
	}
	function garmentLabel(g) {
		if (g === 'white') return 'blanca';
		if (g === 'grey') return 'gris';
		if (g === 'olive') return 'olivo';
		return 'negra';
	}
	// Embroidery thread color: contrast against the literal shirt color
	function bordadoColor(g) {
		if (g === 'white') return 'text-[oklch(0.16_0.012_250)]';
		if (g === 'grey') return 'text-[oklch(0.16_0.012_250)]';
		if (g === 'olive') return 'text-[oklch(0.92_0.08_95)]';
		return 'text-[oklch(0.92_0.08_95)]'; // cream-on-black
	}
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

<!-- ───────────────── HEADER ───────────────── -->
<section class="bg-bone-50 border-ink-950/8 border-b">
	<div class="mx-auto max-w-7xl px-5 pt-14 pb-10 md:px-10 md:pt-20 md:pb-14">
		<p
			use:reveal
			class="text-grey-600 font-mono text-[11px] font-semibold tracking-widest uppercase"
		>
			Drop 01 · {products.length} piezas
		</p>
		<h1
			use:reveal={{ delay: 80 }}
			class="text-ink-950 mt-3 max-w-3xl text-4xl leading-[0.95] font-extrabold tracking-tight md:text-6xl"
		>
			Toda la mercancía,<br />en un solo lugar.
		</h1>
		<p use:reveal={{ delay: 160 }} class="text-grey-600 mt-5 max-w-xl text-base">
			Estampado a serigrafía o bordado en máquina. Algodón pesado, hecho en México, en lotes chicos.
			Cuando se acaba un drop, se acaba.
		</p>
	</div>

	<!-- Filters -->
	<div class="mx-auto max-w-7xl px-5 pb-6 md:px-10">
		<div class="-mx-1 flex flex-wrap gap-2">
			{#each filters as filter (filter.id)}
				<button
					onclick={() => setFilter(filter.id)}
					class="rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors {active ===
					filter.id
						? 'border-ink-950 bg-ink-950 text-bone-50'
						: 'border-ink-950/15 bg-bone-50 text-ink-950 hover:bg-bone-100'}"
				>
					{filter.label}
				</button>
			{/each}
			<span
				class="text-grey-600 ml-auto self-center font-mono text-[11px] tracking-widest uppercase"
			>
				{filtered.length}
				{filtered.length === 1 ? 'pieza' : 'piezas'}
			</span>
		</div>
	</div>
</section>

<!-- ───────────────── PRODUCT GRID ───────────────── -->
<section class="bg-bone-50">
	<div class="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
		{#if filtered.length === 0}
			<p class="text-grey-600 py-20 text-center">Nada por aquí. Prueba otro filtro.</p>
		{:else}
			<div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each filtered as product, i (product.phrase + product.technique)}
					<a href="/tienda" use:reveal={{ delay: Math.min(i * 50, 300) }} class="group block">
						<div
							class="relative aspect-square w-full overflow-hidden rounded-2xl {shirtBg(
								product.garment
							)} p-5 transition-transform duration-300 group-hover:-translate-y-1"
						>
							{#if product.tag}
								<span
									class="bg-tomato-500 text-bone-50 absolute top-3 left-3 z-10 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest uppercase"
								>
									{product.tag}
								</span>
							{/if}

							{#if product.technique === 'estampado'}
								<!-- Big centered screen-print -->
								<div class="flex h-full w-full items-center justify-center">
									<div class="print {shirtText(product.garment)} text-2xl md:text-3xl">
										{#each product.phrase.split('\n') as line, idx (idx)}
											<div>{line}</div>
										{/each}
									</div>
								</div>
							{:else}
								<!-- Bordado: small "patch" up on the chest area, dashed border for stitch feel -->
								<div class="flex h-full w-full items-start justify-start pt-2 pl-2 md:pt-4 md:pl-4">
									<div
										class="rounded-md border border-dashed {product.garment === 'white' ||
										product.garment === 'grey'
											? 'border-[oklch(0.16_0.012_250/0.35)]'
											: 'border-[oklch(0.96_0.008_75/0.4)]'} px-2.5 py-1.5"
									>
										<div class="print {bordadoColor(product.garment)} text-sm md:text-base">
											{#each product.phrase.split('\n') as line, idx (idx)}
												<div>{line}</div>
											{/each}
										</div>
									</div>
								</div>
							{/if}
						</div>

						<div class="mt-3 flex items-start justify-between gap-3">
							<div class="min-w-0">
								<div class="flex items-center gap-1.5">
									<p
										class="text-grey-500 font-mono text-[10px] font-semibold tracking-widest uppercase"
									>
										{product.type} · {garmentLabel(product.garment)}
									</p>
									<span
										class="rounded-sm px-1 py-px font-mono text-[9px] font-bold tracking-widest uppercase {product.technique ===
										'bordado'
											? 'bg-ink-950 text-bone-50'
											: 'bg-tomato-500/15 text-tomato-600'}"
									>
										{product.technique}
									</span>
								</div>
								<p class="text-ink-950 mt-1 truncate text-sm font-bold">
									"{product.phrase.replace(/\n/g, ' ')}"
								</p>
							</div>
							<p class="text-ink-950 text-base font-extrabold whitespace-nowrap">{product.price}</p>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- ───────────────── TÉCNICAS ───────────────── -->
<section class="bg-bone-100 border-ink-950/8 border-t">
	<div class="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
		<div use:reveal class="mb-10 max-w-2xl">
			<p class="text-grey-600 font-mono text-[11px] font-semibold tracking-widest uppercase">
				Técnicas
			</p>
			<h2 class="text-ink-950 mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
				Dos formas de poner una frase en una prenda.
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
			<div use:reveal class="bg-bone-50 rounded-2xl p-6 md:p-8">
				<div class="flex items-center justify-between">
					<span
						class="bg-tomato-500/15 text-tomato-600 rounded-full px-3 py-1 font-mono text-[10px] font-bold tracking-widest uppercase"
					>
						Estampado
					</span>
					<span class="text-grey-500 font-mono text-[10px] tracking-widest uppercase">
						01 / Serigrafía
					</span>
				</div>
				<h3 class="text-ink-950 mt-5 text-2xl font-extrabold">Frase grande, presencia clara.</h3>
				<p class="text-grey-600 mt-3 text-sm leading-relaxed">
					Serigrafía a mano en CDMX. Tinta suave al tacto, no se cuartea al primer ciclo. Para
					cuando la frase es la prenda.
				</p>
				<ul class="text-ink-950 mt-6 space-y-2 text-sm">
					<li>· Hasta 4 colores por diseño</li>
					<li>· Tirajes desde 30 piezas</li>
					<li>· Algodón pesado 220 g/m²</li>
				</ul>
			</div>

			<div use:reveal={{ delay: 100 }} class="bg-ink-950 text-bone-50 rounded-2xl p-6 md:p-8">
				<div class="flex items-center justify-between">
					<span
						class="bg-bone-50 text-ink-950 rounded-full px-3 py-1 font-mono text-[10px] font-bold tracking-widest uppercase"
					>
						Bordado
					</span>
					<span class="text-grey-400 font-mono text-[10px] tracking-widest uppercase">
						02 / Máquina industrial
					</span>
				</div>
				<h3 class="text-bone-50 mt-5 text-2xl font-extrabold">Detalle discreto, larga vida.</h3>
				<p class="text-grey-400 mt-3 text-sm leading-relaxed">
					Bordado en máquina industrial. Hilo de algodón, parche al pecho o manga. Para cuando la
					prenda es lo serio y la frase es el guiño.
				</p>
				<ul class="text-bone-100 mt-6 space-y-2 text-sm">
					<li>· Hilo en hasta 6 colores</li>
					<li>· Tirajes desde 20 piezas</li>
					<li>· Mismo algodón pesado 220 g/m²</li>
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- ───────────────── CTA ───────────────── -->
<section class="bg-bone-50 border-ink-950/8 border-t">
	<div class="mx-auto max-w-4xl px-5 py-16 text-center md:px-10 md:py-20">
		<p
			use:reveal
			class="text-grey-600 font-mono text-[11px] font-semibold tracking-widest uppercase"
		>
			Drop 02 · próximamente
		</p>
		<h2
			use:reveal={{ delay: 100 }}
			class="text-ink-950 mt-4 text-3xl leading-tight font-extrabold tracking-tight md:text-5xl"
		>
			Avísame cuando salga<br />algo nuevo.
		</h2>
		<a
			use:reveal={{ delay: 200 }}
			href="/#contacto"
			class="bg-ink-950 text-bone-50 hover:bg-ink-800 mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-colors"
		>
			Avísame →
		</a>
	</div>
</section>
