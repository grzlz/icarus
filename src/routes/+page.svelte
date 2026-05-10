<script>
	import { reveal } from '$lib/actions/reveal.js';

	let email = $state('');
	let formStatus = $state('idle');

	async function handleSubmit(e) {
		e.preventDefault();
		formStatus = 'sending';
		try {
			const res = await fetch('https://formspree.io/f/xpwzgkvl', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});
			formStatus = res.ok ? 'sent' : 'error';
			if (res.ok) email = '';
		} catch {
			formStatus = 'error';
		}
	}

	// Each "product" is a printed phrase. The phrase IS the product.
	// `garment` controls the simulated tee color in the placeholder card.
	const drops = [
		{
			phrase: 'le pegué\ngripa\na un GPU',
			type: 'Playera',
			price: '$390',
			garment: 'black',
			tag: 'Best seller'
		},
		{
			phrase: 'rm -rf\n/lunes',
			type: 'Sudadera',
			price: '$890',
			garment: 'black',
			tag: null
		},
		{
			phrase: 'deploys\nlos\nviernes',
			type: 'Playera',
			price: '$390',
			garment: 'white',
			tag: 'Nuevo'
		},
		{
			phrase: 'ctrl + Z\nmi vida',
			type: 'Playera',
			price: '$390',
			garment: 'black',
			tag: null
		},
		{
			phrase: '404\nmotivación\nno encontrada',
			type: 'Sudadera',
			price: '$890',
			garment: 'grey',
			tag: null
		},
		{
			phrase: 'sudo\napt-get\ntortillas',
			type: 'Playera',
			price: '$390',
			garment: 'white',
			tag: null
		},
		{
			phrase: 'soy junior\npero cobro\ncomo senior',
			type: 'Playera',
			price: '$390',
			garment: 'black',
			tag: 'Nuevo'
		},
		{
			phrase: 'works on\nmi máquina',
			type: 'Sudadera',
			price: '$890',
			garment: 'black',
			tag: null
		}
	];

	function shirtBg(g) {
		if (g === 'white') return 'bg-bone-100';
		if (g === 'grey') return 'bg-grey-400/30';
		return 'bg-ink-950';
	}
	function shirtText(g) {
		if (g === 'white' || g === 'grey') return 'text-ink-950';
		return 'text-bone-50';
	}
</script>

<svelte:head>
	<title>Icarus · Mercancía para los que viven en la terminal</title>
	<meta
		name="description"
		content="Playeras y sudaderas con frases para los que programan, debugan y siguen creyendo. Mercancía sencilla, hecha en México."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Icarus · Mercancía para los que viven en la terminal" />
	<meta
		property="og:description"
		content="Playeras y sudaderas con frases para los que programan, debugan y siguen creyendo."
	/>
	<meta property="og:url" content="https://icarus.mx" />
	<meta property="og:site_name" content="Icarus" />
	<meta property="og:locale" content="es_MX" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Icarus · Mercancía para los que viven en la terminal" />
</svelte:head>

<!-- ───────────────── HERO ───────────────── -->
<section class="bg-bone-50 border-b border-ink-950/8">
	<div
		class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-16 md:grid-cols-2 md:gap-16 md:px-10 md:py-24"
	>
		<div>
			<p
				class="hero-animate inline-flex items-center gap-2 rounded-full bg-ink-950 px-3 py-1 font-mono text-[10px] font-semibold tracking-wider text-bone-50 uppercase"
			>
				<span class="h-1.5 w-1.5 rounded-full bg-tomato-500"></span>
				Drop 01 · ya disponible
			</p>
			<h1
				class="hero-animate hero-animate-1 mt-6 text-5xl leading-[0.95] font-extrabold tracking-tight text-ink-950 md:text-6xl lg:text-7xl"
			>
				Playeras para<br />los que viven<br />
				<span class="text-tomato-500">en la terminal.</span>
			</h1>
			<p class="hero-animate hero-animate-2 mt-6 max-w-md text-lg text-grey-600">
				Algodón pesado, estampado en serigrafía, hecho en México. Para los que programan, debugan
				y siguen creyendo.
			</p>
			<div class="hero-animate hero-animate-3 mt-8 flex flex-wrap items-center gap-4">
				<a
					href="#mercancia"
					class="inline-flex items-center gap-2 rounded-full bg-ink-950 px-7 py-3.5 text-sm font-bold text-bone-50 transition-colors hover:bg-ink-800"
				>
					Ver mercancía →
				</a>
				<a
					href="#sobre"
					class="inline-flex items-center gap-2 px-3 py-3.5 text-sm font-semibold text-ink-950 underline-offset-4 hover:underline"
				>
					¿Qué es esto?
				</a>
			</div>
		</div>

		<!-- Hero shirt: the featured "gpi a un gpu" tee -->
		<div class="hero-animate hero-animate-2 relative">
			<div
				class="aspect-square w-full overflow-hidden rounded-3xl bg-gradient-to-br from-bone-100 to-bone-200 p-6 md:p-10"
			>
				<!-- Simulated shirt placeholder -->
				<div
					class="relative flex h-full w-full items-center justify-center rounded-2xl bg-ink-950 p-8"
				>
					<div class="print text-bone-50 text-4xl md:text-5xl lg:text-6xl">
						gpi<br />a un<br />gpu
					</div>
					<span
						class="absolute top-4 left-4 rounded-full bg-tomato-500 px-2.5 py-1 font-mono text-[9px] font-bold tracking-widest text-bone-50 uppercase"
					>
						Hot
					</span>
				</div>
			</div>
			<div class="mt-4 flex items-end justify-between">
				<div>
					<p class="font-mono text-[10px] font-semibold tracking-widest text-grey-600 uppercase">
						Featured · Playera negra
					</p>
					<p class="mt-1 text-base font-bold text-ink-950">"gpi a un gpu"</p>
				</div>
				<p class="text-2xl font-extrabold text-ink-950">$390</p>
			</div>
		</div>
	</div>
</section>

<!-- ───────────────── MERCANCÍA / GRID ───────────────── -->
<section id="mercancia" class="bg-bone-50">
	<div class="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
		<div use:reveal class="mb-10 flex items-end justify-between">
			<div>
				<p class="font-mono text-[11px] font-semibold tracking-widest text-grey-600 uppercase">
					Drop 01 · 8 piezas
				</p>
				<h2 class="mt-3 text-3xl font-extrabold tracking-tight text-ink-950 md:text-5xl">
					Toda la mercancía
				</h2>
			</div>
			<a
				href="/tienda"
				class="hidden text-sm font-semibold text-ink-950 underline-offset-4 hover:underline md:inline-block"
			>
				Ver tienda completa →
			</a>
		</div>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each drops as drop, i (drop.phrase)}
				<a
					href="/tienda"
					use:reveal={{ delay: i * 60 }}
					class="group block"
				>
					<div
						class="relative aspect-square w-full overflow-hidden rounded-2xl {shirtBg(drop.garment)} p-5 transition-transform duration-300 group-hover:-translate-y-1"
					>
						{#if drop.tag}
							<span
								class="absolute top-3 left-3 z-10 rounded-full bg-tomato-500 px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest text-bone-50 uppercase"
							>
								{drop.tag}
							</span>
						{/if}
						<div class="flex h-full w-full items-center justify-center">
							<div class="print {shirtText(drop.garment)} text-2xl md:text-3xl">
								{#each drop.phrase.split('\n') as line, idx (idx)}
									<div>{line}</div>
								{/each}
							</div>
						</div>
					</div>
					<div class="mt-3 flex items-start justify-between gap-3">
						<div>
							<p class="font-mono text-[10px] font-semibold tracking-widest text-grey-500 uppercase">
								{drop.type} · {drop.garment === 'white' ? 'blanca' : drop.garment === 'grey' ? 'gris' : 'negra'}
							</p>
							<p class="mt-1 text-sm font-bold text-ink-950">"{drop.phrase.replace(/\n/g, ' ')}"</p>
						</div>
						<p class="text-base font-extrabold whitespace-nowrap text-ink-950">{drop.price}</p>
					</div>
				</a>
			{/each}
		</div>

		<div class="mt-10 text-center md:hidden">
			<a href="/tienda" class="text-sm font-semibold text-ink-950 underline-offset-4 hover:underline">
				Ver tienda completa →
			</a>
		</div>
	</div>
</section>

<!-- ───────────────── SOBRE / EXPLAINER ───────────────── -->
<section id="sobre" class="bg-ink-950 text-bone-50">
	<div class="mx-auto max-w-5xl px-5 py-20 text-center md:px-10 md:py-28">
		<p
			use:reveal
			class="font-mono text-[11px] font-semibold tracking-widest text-tomato-500 uppercase"
		>
			Sobre Icarus
		</p>
		<p
			use:reveal={{ delay: 100 }}
			class="mt-6 text-2xl leading-snug font-medium md:text-4xl"
		>
			Mercancía sencilla con frases que entiende quien las entiende. Sin colecciones cápsula, sin
			marketing, sin drama. Una playera, un chiste, algodón bueno.
		</p>
		<div use:reveal={{ delay: 200 }} class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-2xl bg-ink-900 p-6 text-left">
				<p class="font-mono text-[10px] font-semibold tracking-widest text-grey-400 uppercase">
					01 · Tela
				</p>
				<p class="mt-3 text-base text-bone-100">
					Algodón pesado 220 g/m². Aguanta lavadas y miércoles intensos.
				</p>
			</div>
			<div class="rounded-2xl bg-ink-900 p-6 text-left">
				<p class="font-mono text-[10px] font-semibold tracking-widest text-grey-400 uppercase">
					02 · Estampado
				</p>
				<p class="mt-3 text-base text-bone-100">
					Serigrafía a mano en CDMX. Frase grande, presencia clara.
				</p>
			</div>
			<div class="rounded-2xl bg-ink-900 p-6 text-left">
				<p class="font-mono text-[10px] font-semibold tracking-widest text-grey-400 uppercase">
					03 · Bordado
				</p>
				<p class="mt-3 text-base text-bone-100">
					Bordado en máquina, hilo de algodón. Detalle discreto, larga vida.
				</p>
			</div>
			<div class="rounded-2xl bg-ink-900 p-6 text-left">
				<p class="font-mono text-[10px] font-semibold tracking-widest text-grey-400 uppercase">
					04 · Hecho en
				</p>
				<p class="mt-3 text-base text-bone-100">
					México, en lotes chicos. Cuando se acaba un drop, se acaba.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- ───────────────── NEWSLETTER ───────────────── -->
<section id="contacto" class="bg-bone-100 border-t border-ink-950/8">
	<div
		class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 py-20 md:grid-cols-2 md:px-10"
	>
		<div use:reveal>
			<p class="font-mono text-[11px] font-semibold tracking-widest text-grey-600 uppercase">
				Próximo drop
			</p>
			<h2 class="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-ink-950 md:text-5xl">
				Avísame cuando salga<br />algo nuevo.
			</h2>
			<p class="mt-5 max-w-md text-base text-grey-600">
				Un correo cuando hay drop nuevo. Sin promociones, sin spam, sin nada raro.
			</p>
		</div>

		<form
			use:reveal={{ delay: 150 }}
			onsubmit={handleSubmit}
			class="flex flex-col gap-3 sm:flex-row"
		>
			<input
				type="email"
				bind:value={email}
				required
				placeholder="tucorreo@dominio.mx"
				class="flex-1 rounded-full border border-ink-950/15 bg-bone-50 px-5 py-3.5 text-sm text-ink-950 placeholder-grey-500 focus:border-ink-950 focus:outline-none"
			/>
			<button
				type="submit"
				disabled={formStatus === 'sending'}
				class="rounded-full bg-ink-950 px-7 py-3.5 text-sm font-bold text-bone-50 transition-colors hover:bg-ink-800 disabled:opacity-60"
			>
				{#if formStatus === 'sending'}
					Enviando…
				{:else if formStatus === 'sent'}
					✓ Listo
				{:else if formStatus === 'error'}
					Reintentar
				{:else}
					Avísame →
				{/if}
			</button>
		</form>
	</div>
</section>
