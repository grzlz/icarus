<script>
	import { reveal } from '$lib/actions/reveal.js';
	import ShirtMockup from '$lib/components/ShirtMockup.svelte';
	import TiendaVista3D from '$lib/components/TiendaVista3D.svelte';
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

	// Product shown in the 3D viewer; clicking any card loads it there.
	let selected = $state(products[0]);

	function selectProduct(product) {
		selected = product;
		document.getElementById('vista-3d')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
			Toda la mercancía.<br />Elige tu frase.
		</h1>
		<p use:reveal={{ delay: 160 }} class="text-grey-600 mt-5 max-w-xl text-base">
			Estampado o bordado — mismo algodón, dos volúmenes.
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

<!-- ───────────────── VISTA 3D ───────────────── -->
<TiendaVista3D product={selected} />

<!-- ───────────────── PRODUCT GRID ───────────────── -->
<section class="bg-bone-50">
	<div class="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
		{#if filtered.length === 0}
			<p class="text-grey-600 py-20 text-center font-mono text-sm">
				grep: 0 resultados. Prueba otro filtro.
			</p>
		{:else}
			<div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each filtered as product, i (product.slug)}
					<button
						type="button"
						onclick={() => selectProduct(product)}
						use:reveal={{ delay: Math.min(i * 50, 300) }}
						class="group block w-full cursor-pointer text-left"
					>
						<div
							class="aspect-square w-full transition-transform duration-300 group-hover:-translate-y-1"
						>
							<ShirtMockup
								phrase={product.phrase}
								garment={product.garment}
								technique={product.technique}
								image={product.image ?? null}
								tag={product.tag}
							/>
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
									“{product.phrase.replace(/\n/g, ' ')}”
								</p>
							</div>
							<p class="text-ink-950 text-base font-extrabold whitespace-nowrap">{product.price}</p>
						</div>
					</button>
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
				Dos técnicas, la misma línea.
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
				<h3 class="text-ink-950 mt-5 text-2xl font-extrabold">Frases en comunidad.</h3>
				<p class="text-grey-600 mt-3 text-sm leading-relaxed">
					Serigrafía a mano en CDMX. La frase se lee de lejos: alguien la reconoce, pregunta, y ya
					son dos.
				</p>
				<ul class="text-ink-950 mt-6 space-y-2 text-sm">
					<li>· Tinta suave al tacto, nada plastificada</li>
					<li>· No se cuartea ni se pela con las lavadas</li>
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
				<h3 class="text-bone-50 mt-5 text-2xl font-extrabold">Playeras en infraestructura.</h3>
				<p class="text-grey-400 mt-3 text-sm leading-relaxed">
					Parche bordado, discreto. Cada pieza vendida suma para el cluster de GPUs.
				</p>
				<ul class="text-bone-100 mt-6 space-y-2 text-sm">
					<li>· Hilo de algodón, relieve que se siente</li>
					<li>· No se destiñe: dura más que la playera</li>
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
			El Drop 02 ya se<br />está cocinando.
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
