<script>
	import { reveal } from '$lib/actions/reveal.js';
	import ShirtMockup from '$lib/components/ShirtMockup.svelte';

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
			phrase: 'gpi a \nun gpu',
			type: 'Playera',
			price: '$299',
			garment: 'black',
			tag: 'Best seller'
		},
		{
			phrase: 'no es bug\nes feature',
			type: 'Playera',
			price: '$299',
			garment: 'black',
			tag: 'Best seller'
		},
		{
			phrase: 'deploys\nlos\nviernes',
			type: 'Playera',
			price: '$299',
			garment: 'white',
			tag: 'Nuevo'
		},
		{
			phrase: 'bottleneck-in-the-loop',
			type: 'Playera',
			price: '$299',
			garment: 'black',
			tag: null
		},
		{
			phrase: 'systemctl\nto-major-tom',
			type: 'Sudadera',
			price: '$899',
			garment: 'grey',
			tag: null
		},
		{
			phrase: 'git commit -am\n"some changes"',
			type: 'Playera',
			price: '$299',
			garment: 'white',
			tag: null
		},
		{
			phrase: 'funciona en mi local',
			type: 'Playera',
			price: '$299',
			garment: 'black',
			tag: 'Nuevo'
		},
		{
			phrase: 'qué raro',
			type: 'Sudadera',
			price: '$899',
			garment: 'black',
			tag: null
		}
	];

	// Featured hero shirt — pulled out so we can swap in a real photo later.
	const hero = {
		phrase: 'no es\nbug\nes feature',
		garment: 'black',
		image: null,
		tag: 'Hot'
	};
</script>

<svelte:head>
	<title>Icarus · Mercancía para quienes viven en la terminal</title>
	<meta
		name="description"
		content="Ropa y sudaderas con frases para quienes viven en la terminal. Estampado a serigrafía o bordado a máquina, hecho en México."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Icarus · Mercancía para quienes viven en la terminal" />
	<meta
		property="og:description"
		content="Ropa y sudaderas con frases para quienes viven en la terminal. Estampado o bordado, hecho en México."
	/>
	<meta property="og:url" content="https://icarus.mx" />
	<meta property="og:site_name" content="Icarus" />
	<meta property="og:locale" content="es_MX" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Icarus · Mercancía para quienes viven en la terminal" />
</svelte:head>

<!-- ───────────────── HERO ───────────────── -->
<section class="bg-bone-50 border-ink-950/8 border-b">
	<div
		class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-16 md:grid-cols-2 md:gap-16 md:px-10 md:py-24"
	>
		<div>
			<p
				class="hero-animate bg-ink-950 text-bone-50 inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[10px] font-semibold tracking-wider uppercase"
			>
				<span class="bg-tomato-500 h-1.5 w-1.5 rounded-full"></span>
				Drop 01 · ya disponible
			</p>
			<h1
				class="hero-animate hero-animate-1 text-ink-950 mt-6 text-5xl leading-[0.95] font-extrabold tracking-tight md:text-6xl lg:text-7xl"
			>
				Ropa para<br />quienes viven<br />
				<span class="text-tomato-500">en la terminal.</span>
			</h1>
			<p class="hero-animate hero-animate-2 text-grey-600 mt-6 max-w-md text-lg">
				Algodón pesado, estampado a serigrafía o bordado a máquina, hecho en México. Para quienes
				programan, debugan y siguen creyendo.
			</p>
			<div class="hero-animate hero-animate-3 mt-8 flex flex-wrap items-center gap-4">
				<a
					href="#mercancia"
					class="bg-ink-950 text-bone-50 hover:bg-ink-800 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-colors"
				>
					Ver mercancía →
				</a>
				<a
					href="#sobre"
					class="text-ink-950 inline-flex items-center gap-2 px-3 py-3.5 text-sm font-semibold underline-offset-4 hover:underline"
				>
					¿Qué es esto?
				</a>
			</div>
		</div>

		<!-- Hero shirt: the featured "no es bug es feature" tee -->
		<div class="hero-animate hero-animate-2 relative">
			<div
				class="from-bone-100 to-bone-200 aspect-square w-full overflow-hidden rounded-3xl bg-gradient-to-br p-6 md:p-10"
			>
				<ShirtMockup
					phrase={hero.phrase}
					garment={hero.garment}
					technique="estampado"
					image={hero.image}
					tag={hero.tag}
					size="hero"
				/>
			</div>
			<div class="mt-4 flex items-end justify-between">
				<div>
					<p class="text-grey-600 font-mono text-[10px] font-semibold tracking-widest uppercase">
						Featured · Playera negra
					</p>
					<p class="text-ink-950 mt-1 text-base font-bold">"no es bug es feature"</p>
				</div>
				<p class="text-ink-950 text-2xl font-extrabold">$299</p>
			</div>
		</div>
	</div>
</section>

<!-- ───────────────── MERCANCÍA / GRID ───────────────── -->
<section id="mercancia" class="bg-bone-50">
	<div class="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
		<div use:reveal class="mb-10 flex items-end justify-between">
			<div>
				<p class="text-grey-600 font-mono text-[11px] font-semibold tracking-widest uppercase">
					Drop 01 · 8 piezas
				</p>
				<h2 class="text-ink-950 mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
					Toda la mercancía
				</h2>
			</div>
			<a
				href="/tienda"
				class="text-ink-950 hidden text-sm font-semibold underline-offset-4 hover:underline md:inline-block"
			>
				Ver tienda completa →
			</a>
		</div>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each drops as drop, i (drop.phrase)}
				<a href="/tienda" use:reveal={{ delay: i * 60 }} class="group block">
					<div
						class="aspect-square w-full transition-transform duration-300 group-hover:-translate-y-1"
					>
						<ShirtMockup
							phrase={drop.phrase}
							garment={drop.garment}
							technique="estampado"
							image={drop.image ?? null}
							tag={drop.tag}
						/>
					</div>
					<div class="mt-3 flex items-start justify-between gap-3">
						<div>
							<p
								class="text-grey-500 font-mono text-[10px] font-semibold tracking-widest uppercase"
							>
								{drop.type} · {drop.garment === 'white'
									? 'blanca'
									: drop.garment === 'grey'
										? 'gris'
										: 'negra'}
							</p>
							<p class="text-ink-950 mt-1 text-sm font-bold">"{drop.phrase.replace(/\n/g, ' ')}"</p>
						</div>
						<p class="text-ink-950 text-base font-extrabold whitespace-nowrap">{drop.price}</p>
					</div>
				</a>
			{/each}
		</div>

		<div class="mt-10 text-center md:hidden">
			<a
				href="/tienda"
				class="text-ink-950 text-sm font-semibold underline-offset-4 hover:underline"
			>
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
			class="text-tomato-500 font-mono text-[11px] font-semibold tracking-widest uppercase"
		>
			Sobre Icarus
		</p>
		<p use:reveal={{ delay: 100 }} class="mt-6 text-2xl leading-snug font-medium md:text-4xl">
			Mercancía sencilla con frases que entiende quien las entiende. Sin colecciones cápsula, sin
			marketing, sin drama. Una playera, un chiste, algodón bueno.
		</p>
		<div
			use:reveal={{ delay: 200 }}
			class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
		>
			<div class="bg-ink-900 rounded-2xl p-6 text-left">
				<p class="text-grey-400 font-mono text-[10px] font-semibold tracking-widest uppercase">
					01 · Tela
				</p>
				<p class="text-bone-100 mt-3 text-base">
					Algodón pesado 220 g/m². Aguanta lavadas y miércoles intensos.
				</p>
			</div>
			<div class="bg-ink-900 rounded-2xl p-6 text-left">
				<p class="text-grey-400 font-mono text-[10px] font-semibold tracking-widest uppercase">
					02 · Estampado
				</p>
				<p class="text-bone-100 mt-3 text-base">
					Serigrafía a mano en CDMX. Frase grande, presencia clara.
				</p>
			</div>
			<div class="bg-ink-900 rounded-2xl p-6 text-left">
				<p class="text-grey-400 font-mono text-[10px] font-semibold tracking-widest uppercase">
					03 · Bordado
				</p>
				<p class="text-bone-100 mt-3 text-base">
					Bordado en máquina, hilo de algodón. Detalle discreto, larga vida.
				</p>
			</div>
			<div class="bg-ink-900 rounded-2xl p-6 text-left">
				<p class="text-grey-400 font-mono text-[10px] font-semibold tracking-widest uppercase">
					04 · Hecho en
				</p>
				<p class="text-bone-100 mt-3 text-base">
					México, en lotes chicos. Cuando se acaba un drop, se acaba.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- ───────────────── NEWSLETTER ───────────────── -->
<section id="contacto" class="bg-bone-100 border-ink-950/8 border-t">
	<div
		class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 py-20 md:grid-cols-2 md:px-10"
	>
		<div use:reveal>
			<p class="text-grey-600 font-mono text-[11px] font-semibold tracking-widest uppercase">
				Próximo drop
			</p>
			<h2
				class="text-ink-950 mt-3 text-3xl leading-tight font-extrabold tracking-tight md:text-5xl"
			>
				Avísame cuando salga<br />algo nuevo.
			</h2>
			<p class="text-grey-600 mt-5 max-w-md text-base">
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
				class="border-ink-950/15 bg-bone-50 text-ink-950 placeholder-grey-500 focus:border-ink-950 flex-1 rounded-full border px-5 py-3.5 text-sm focus:outline-none"
			/>
			<button
				type="submit"
				disabled={formStatus === 'sending'}
				class="bg-ink-950 text-bone-50 hover:bg-ink-800 rounded-full px-7 py-3.5 text-sm font-bold transition-colors disabled:opacity-60"
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
