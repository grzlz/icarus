<script>
	import { reveal } from '$lib/actions/reveal.js';

	const posts = [
		{
			kicker: 'Campo',
			date: '02 Mayo 2026',
			title: 'Sierra Norte: tres días con la chamarra de campo',
			excerpt:
				'Niebla en la mañana, sol al mediodía, lluvia en la tarde. La prenda salió viva. Estas son las notas que tomamos.',
			tone: 'bg-forest-700'
		},
		{
			kicker: 'Taller',
			date: '21 Abril 2026',
			title: 'Quién cose nuestras camisas en Aguascalientes',
			excerpt:
				'Una visita al taller de doña Estela. Cuarenta años cosiendo, todavía revisa cada costura con la mano.',
			tone: 'bg-rust-600'
		},
		{
			kicker: 'Tierra',
			date: '08 Abril 2026',
			title: 'Por qué dejamos de usar poliéster virgen',
			excerpt:
				'Un cambio de material que costó más, tomó más tiempo y vale la pena explicar a detalle.',
			tone: 'bg-stone-700'
		},
		{
			kicker: 'Materiales',
			date: '17 Marzo 2026',
			title: 'Lana criolla: el rebaño que casi no queda',
			excerpt:
				'Trabajamos con dos rebaños en Hidalgo para recuperar una raza que cabe perfecta en una franela.',
			tone: 'bg-sand-500'
		},
		{
			kicker: 'Reporte',
			date: '02 Marzo 2026',
			title: 'Reparar antes que reemplazar',
			excerpt:
				'Cómo armamos el programa de reparación gratuita y por qué es parte central del producto.',
			tone: 'bg-forest-500'
		},
		{
			kicker: 'Camino',
			date: '14 Febrero 2026',
			title: 'De Real de Catorce al Pacífico, en lona',
			excerpt:
				'Un viaje de prueba. Lo que aguantó, lo que falló, y lo que vamos a corregir antes de lanzar.',
			tone: 'bg-rust-400'
		}
	];
</script>

<svelte:head>
	<title>Diario · Icarus</title>
	<meta
		name="description"
		content="Notas de campo, visitas al taller y reportes de uso. El diario de Icarus, sin filtros ni promociones."
	/>

	<meta property="og:type" content="website" />
	<meta property="og:title" content="Diario · Icarus" />
	<meta
		property="og:description"
		content="Notas de campo, visitas al taller y reportes de uso. El diario de Icarus, sin filtros ni promociones."
	/>
	<meta property="og:url" content="https://icarus.mx/diario" />
	<meta property="og:locale" content="es_MX" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Diario · Icarus" />
	<meta name="twitter:description" content="Notas de campo, visitas al taller y reportes de uso." />
</svelte:head>

<section class="bg-cream-100">
	<div class="mx-auto max-w-5xl px-6 py-20 md:px-10 md:py-28">
		<p use:reveal class="text-xs font-bold tracking-[0.3em] text-stone-700 uppercase">
			Diario de campo
		</p>
		<h1
			use:reveal={{ delay: 100 }}
			class="text-charcoal-900 mt-4 text-4xl leading-tight font-extrabold md:text-6xl"
		>
			Crónicas, talleres y notas de uso.
		</h1>
		<p use:reveal={{ delay: 200 }} class="mt-6 max-w-2xl text-lg leading-relaxed text-stone-700">
			Lo que probamos, dónde lo probamos y qué aprendimos. Sin storytelling de agencia.
		</p>
	</div>
</section>

<section class="bg-cream-50">
	<div class="mx-auto max-w-5xl px-6 py-20 md:px-10 md:py-28">
		<div class="space-y-16">
			{#each posts as post, i (post.title)}
				<article
					use:reveal={{ delay: i * 60 }}
					class="grid grid-cols-1 gap-8 border-b border-stone-600/15 pb-16 last:border-b-0 md:grid-cols-[1fr_2fr]"
				>
					<div class="aspect-[4/3] w-full {post.tone}"></div>

					<div>
						<div class="flex items-center gap-3 text-xs font-bold tracking-[0.25em] uppercase">
							<span class="text-forest-700">{post.kicker}</span>
							<span class="text-stone-600">·</span>
							<span class="text-stone-600">{post.date}</span>
						</div>
						<h2 class="text-charcoal-900 mt-4 text-2xl leading-tight font-extrabold md:text-3xl">
							{post.title}
						</h2>
						<p class="mt-4 text-base leading-relaxed text-stone-700">{post.excerpt}</p>
						<p class="text-forest-700 mt-6 text-sm font-semibold tracking-wide">Próximamente →</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>
