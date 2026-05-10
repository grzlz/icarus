<script>
	import { reveal } from '$lib/actions/reveal.js';

	let formName = $state('');
	let formEmail = $state('');
	let formMessage = $state('');
	let formStatus = $state('idle');

	async function handleSubmit(e) {
		e.preventDefault();
		formStatus = 'sending';
		try {
			const res = await fetch('https://formspree.io/f/xpwzgkvl', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: formName, email: formEmail, message: formMessage })
			});
			if (res.ok) {
				formStatus = 'sent';
				formName = '';
				formEmail = '';
				formMessage = '';
			} else {
				formStatus = 'error';
			}
		} catch {
			formStatus = 'error';
		}
	}

	const products = [
		{ name: 'Chamarra de Campo', detail: 'Lona encerada · clima frío', tone: 'bg-forest-700' },
		{ name: 'Pantalón de Trabajo', detail: 'Algodón pesado · refuerzos', tone: 'bg-stone-700' },
		{ name: 'Camisa de Franela', detail: 'Lana mexicana · tejido grueso', tone: 'bg-rust-600' },
		{ name: 'Sombrero de Ala', detail: 'Fieltro natural · resistente al sol', tone: 'bg-sand-500' }
	];

	const journal = [
		{
			kicker: 'Diario',
			title: 'Sierra Norte: tres días con la chamarra de campo',
			excerpt: 'Niebla, lluvia y caminos de tierra. Lo que aguantó y lo que aprendimos.'
		},
		{
			kicker: 'Taller',
			title: 'Quién cose nuestras camisas en Aguascalientes',
			excerpt: 'Una visita al taller donde se hace cada prenda, una a la vez.'
		},
		{
			kicker: 'Tierra',
			title: 'Por qué dejamos de usar poliéster virgen',
			excerpt: 'La decisión de cambiar materiales y lo que costó hacerla bien.'
		}
	];
</script>

<svelte:head>
	<title>Icarus · Ropa hecha para durar</title>
	<meta
		name="description"
		content="Ropa de campo y trabajo hecha en México para durar. Materiales honestos, prendas pensadas, respeto por la tierra."
	/>

	<meta property="og:type" content="website" />
	<meta property="og:title" content="Icarus · Ropa hecha para durar" />
	<meta
		property="og:description"
		content="Ropa de campo y trabajo hecha en México para durar. Materiales honestos, prendas pensadas, respeto por la tierra."
	/>
	<meta property="og:url" content="https://icarus.mx" />
	<meta property="og:site_name" content="Icarus" />
	<meta property="og:locale" content="es_MX" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Icarus · Ropa hecha para durar" />
	<meta name="twitter:description" content="Ropa de campo y trabajo hecha en México para durar." />
</svelte:head>

<!-- Hero -->
<section class="relative">
	<!-- Landscape placeholder: layered earth-tone gradient stands in for hero photography -->
	<div
		class="from-forest-900 to-rust-600 relative h-[78vh] min-h-[560px] w-full overflow-hidden bg-gradient-to-br via-stone-700"
	>
		<div class="from-charcoal-900/60 absolute inset-0 bg-gradient-to-t to-transparent"></div>
		<div
			class="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-16 md:px-10 md:pb-24"
		>
			<p class="text-cream-100/80 hero-animate text-xs font-medium tracking-[0.3em] uppercase">
				Otoño 2026 · Hecho en México
			</p>
			<h1
				class="text-cream-50 hero-animate hero-animate-1 mt-4 max-w-3xl text-5xl leading-[0.95] font-extrabold tracking-tight md:text-7xl lg:text-8xl"
			>
				Vestir el campo<br />sin ponerle precio.
			</h1>
			<p
				class="text-cream-100/85 hero-animate hero-animate-2 mt-6 max-w-xl text-lg leading-relaxed md:text-xl"
			>
				Prendas hechas con materiales honestos, pensadas para aguantar más de una temporada y
				reparar cuando haga falta.
			</p>
			<div class="hero-animate hero-animate-3 mt-10">
				<a
					href="/tienda"
					class="bg-cream-50 text-charcoal-900 hover:bg-cream-200 inline-block px-8 py-4 text-sm font-bold tracking-widest uppercase transition-colors"
				>
					Ver tienda
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Mission strip -->
<section class="bg-cream-100 border-b border-stone-600/15">
	<div class="mx-auto max-w-5xl px-6 py-20 text-center md:px-10 md:py-28">
		<p use:reveal class="text-forest-700 text-xs font-bold tracking-[0.3em] uppercase">
			Nuestra misión
		</p>
		<p
			use:reveal={{ delay: 100 }}
			class="text-charcoal-900 mt-6 text-2xl leading-snug font-medium md:text-4xl"
		>
			Hacemos ropa que se compra una vez y se hereda. Sin temporada de moda, sin costuras flojas,
			sin discursos vacíos.
		</p>
		<a
			use:reveal={{ delay: 200 }}
			href="/mision"
			class="text-forest-700 hover:text-charcoal-900 mt-8 inline-block text-sm font-semibold tracking-wide underline-offset-4 hover:underline"
		>
			Leer la misión completa →
		</a>
	</div>
</section>

<!-- Featured collection -->
<section id="coleccion" class="bg-cream-50">
	<div class="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
		<div use:reveal class="mb-12 flex items-end justify-between">
			<div>
				<p class="text-xs font-bold tracking-[0.3em] text-stone-700 uppercase">Colección</p>
				<h2 class="text-charcoal-900 mt-3 text-3xl font-extrabold md:text-5xl">Trabajo y campo</h2>
			</div>
			<a
				href="/tienda"
				class="text-charcoal-900 hover:text-forest-700 hidden text-sm font-semibold transition-colors md:inline-block"
			>
				Ver todo →
			</a>
		</div>

		<div class="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
			{#each products as product, i (product.name)}
				<a href="/tienda" use:reveal={{ delay: i * 80 }} class="group block">
					<div class="aspect-[3/4] w-full overflow-hidden {product.tone} relative">
						<div
							class="absolute inset-0 bg-gradient-to-b from-transparent to-black/15 opacity-0 transition-opacity group-hover:opacity-100"
						></div>
					</div>
					<h3 class="text-charcoal-900 mt-4 text-base font-semibold">{product.name}</h3>
					<p class="mt-1 text-sm text-stone-700">{product.detail}</p>
					<p class="text-forest-700 mt-2 text-xs font-semibold tracking-widest uppercase">
						Próximamente
					</p>
				</a>
			{/each}
		</div>

		<div class="mt-12 text-center md:hidden">
			<a
				href="/tienda"
				class="text-charcoal-900 hover:text-forest-700 text-sm font-semibold transition-colors"
			>
				Ver todo →
			</a>
		</div>
	</div>
</section>

<!-- Field journal teaser -->
<section class="bg-cream-100">
	<div class="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
		<div use:reveal class="mb-12">
			<p class="text-xs font-bold tracking-[0.3em] text-stone-700 uppercase">Diario de campo</p>
			<h2 class="text-charcoal-900 mt-3 text-3xl font-extrabold md:text-5xl">
				Lo que probamos, lo que aprendimos.
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
			{#each journal as story, i (story.title)}
				<a href="/diario" use:reveal={{ delay: i * 100 }} class="group block">
					<div
						class="aspect-[4/3] w-full overflow-hidden bg-stone-600 {i === 0
							? 'bg-forest-500'
							: i === 1
								? 'bg-sand-500'
								: 'bg-rust-400'}"
					></div>
					<p class="mt-5 text-xs font-bold tracking-[0.25em] text-stone-700 uppercase">
						{story.kicker}
					</p>
					<h3
						class="text-charcoal-900 group-hover:text-forest-700 mt-2 text-xl leading-tight font-bold transition-colors md:text-2xl"
					>
						{story.title}
					</h3>
					<p class="mt-3 text-sm leading-relaxed text-stone-700">{story.excerpt}</p>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Contact / Newsletter -->
<section id="contacto" class="bg-forest-900 text-cream-50">
	<div
		class="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-2 md:px-10 md:py-28"
	>
		<div use:reveal>
			<p class="text-cream-100/70 text-xs font-bold tracking-[0.3em] uppercase">Mantente cerca</p>
			<h2 class="mt-4 text-3xl leading-tight font-extrabold md:text-5xl">
				Una carta breve, cuando hay algo que contar.
			</h2>
			<p class="text-cream-100/80 mt-6 text-base leading-relaxed">
				Lanzamientos, notas del taller y reportes desde el campo. Sin promociones, sin spam.
			</p>
		</div>

		<form use:reveal={{ delay: 150 }} onsubmit={handleSubmit} class="flex flex-col gap-4">
			<input
				type="text"
				bind:value={formName}
				required
				placeholder="Nombre"
				class="text-cream-50 placeholder-cream-100/50 focus:border-cream-50 border-cream-100/30 w-full border-b bg-transparent px-1 py-3 focus:outline-none"
			/>
			<input
				type="email"
				bind:value={formEmail}
				required
				placeholder="Correo"
				class="text-cream-50 placeholder-cream-100/50 focus:border-cream-50 border-cream-100/30 w-full border-b bg-transparent px-1 py-3 focus:outline-none"
			/>
			<textarea
				bind:value={formMessage}
				rows="3"
				placeholder="Mensaje (opcional)"
				class="text-cream-50 placeholder-cream-100/50 focus:border-cream-50 border-cream-100/30 w-full resize-none border-b bg-transparent px-1 py-3 focus:outline-none"
			></textarea>
			<button
				type="submit"
				disabled={formStatus === 'sending'}
				class="bg-cream-50 text-charcoal-900 hover:bg-cream-200 mt-4 w-fit px-8 py-3.5 text-sm font-bold tracking-widest uppercase transition-colors disabled:opacity-60"
			>
				{#if formStatus === 'sending'}Enviando…
				{:else if formStatus === 'sent'}Recibido
				{:else if formStatus === 'error'}Reintentar
				{:else}Enviar{/if}
			</button>
		</form>
	</div>
</section>
