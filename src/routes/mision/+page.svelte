<script>
	import { reveal } from '$lib/actions/reveal.js';

	const principles = [
		{
			n: '01',
			title: 'Hecho para durar',
			body: 'Una prenda barata es cara dos veces. Cosemos para que dure años, no temporadas. Los refuerzos, los hilos y las costuras no son detalle: son el producto.'
		},
		{
			n: '02',
			title: 'Materiales honestos',
			body: 'Algodón, lana, lona, cuero. Sin químicos innecesarios, sin etiquetas que no podamos respaldar. Si no entendemos de dónde viene un material, no lo usamos.'
		},
		{
			n: '03',
			title: 'Hecho en México',
			body: 'Cosemos en talleres mexicanos con gente que cobra lo que su trabajo vale. Vemos cada taller con frecuencia y firmamos con su nombre lo que hacen.'
		},
		{
			n: '04',
			title: 'Reparar antes que reemplazar',
			body: 'Toda prenda Icarus se repara gratis durante su primer año, y a costo después. Tirar ropa para vender ropa nueva es el opuesto de lo que queremos ser.'
		},
		{
			n: '05',
			title: 'Respeto por la tierra',
			body: 'No vamos a fingir que somos perfectos. Vamos a publicar lo que usamos, lo que descartamos y lo que estamos cambiando. La transparencia es parte del producto.'
		}
	];
</script>

<svelte:head>
	<title>Misión · Icarus</title>
	<meta
		name="description"
		content="Por qué existe Icarus. Ropa hecha para durar, materiales honestos, talleres mexicanos y respeto por la tierra."
	/>

	<meta property="og:type" content="website" />
	<meta property="og:title" content="Misión · Icarus" />
	<meta
		property="og:description"
		content="Por qué existe Icarus. Ropa hecha para durar, materiales honestos, talleres mexicanos y respeto por la tierra."
	/>
	<meta property="og:url" content="https://icarus.mx/mision" />
	<meta property="og:locale" content="es_MX" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Misión · Icarus" />
	<meta name="twitter:description" content="Por qué existe Icarus. Ropa hecha para durar." />
</svelte:head>

<section class="bg-cream-100 border-b border-stone-600/15">
	<div class="mx-auto max-w-4xl px-6 py-24 md:px-10 md:py-32">
		<p use:reveal class="text-forest-700 text-xs font-bold tracking-[0.3em] uppercase">Misión</p>
		<h1
			use:reveal={{ delay: 100 }}
			class="text-charcoal-900 mt-6 text-4xl leading-[1.05] font-extrabold md:text-7xl"
		>
			Hacer ropa que valga la pena heredar.
		</h1>
		<p
			use:reveal={{ delay: 200 }}
			class="mt-8 max-w-2xl text-lg leading-relaxed text-stone-700 md:text-xl"
		>
			Icarus nace de una idea simple: la mayoría de la ropa hoy se hace mal, se vende rápido y se
			tira pronto. Nosotros queremos hacer lo contrario.
		</p>
	</div>
</section>

<section class="bg-cream-50">
	<div class="mx-auto max-w-4xl px-6 py-20 md:px-10 md:py-28">
		<div use:reveal class="text-charcoal-900 prose prose-stone max-w-none text-lg leading-relaxed">
			<p>
				Crecimos viendo a nuestros padres usar las mismas chamarras durante quince años. Esa ropa no
				era cara, era buena. Resistía. Se reparaba. Se quedaba.
			</p>
			<p class="mt-6">
				Hoy hay menos ropa así. La industria cambió: tirajes enormes, materiales malos, costuras que
				no aguantan dos lavadas. Compramos más, tiramos más, y al final pagamos más.
			</p>
			<p class="mt-6">
				Icarus es un intento honesto de devolver el valor a la prenda. No queremos vender mil
				camisas. Queremos vender cien que duren diez años cada una.
			</p>
		</div>
	</div>
</section>

<section class="bg-cream-100">
	<div class="mx-auto max-w-5xl px-6 py-20 md:px-10 md:py-28">
		<h2 use:reveal class="text-charcoal-900 text-3xl font-extrabold md:text-5xl">
			Cómo trabajamos
		</h2>

		<div class="mt-14 space-y-12">
			{#each principles as p, i (p.n)}
				<div
					use:reveal={{ delay: i * 80 }}
					class="grid grid-cols-1 gap-6 border-t border-stone-600/15 pt-12 md:grid-cols-[auto_1fr] md:gap-12"
				>
					<p class="text-5xl font-extrabold text-stone-600">{p.n}</p>
					<div>
						<h3 class="text-charcoal-900 text-2xl font-bold">{p.title}</h3>
						<p class="mt-3 max-w-2xl text-base leading-relaxed text-stone-700 md:text-lg">
							{p.body}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="bg-forest-900 text-cream-50">
	<div class="mx-auto max-w-3xl px-6 py-24 text-center md:px-10 md:py-32">
		<p use:reveal class="text-cream-100/70 text-xs font-bold tracking-[0.3em] uppercase">
			Trabajo en curso
		</p>
		<p use:reveal={{ delay: 100 }} class="mt-6 text-2xl leading-snug font-medium md:text-4xl">
			No tenemos todas las respuestas todavía. Pero estamos haciendo las preguntas correctas.
		</p>
		<a
			use:reveal={{ delay: 200 }}
			href="/diario"
			class="bg-cream-50 text-charcoal-900 hover:bg-cream-200 mt-10 inline-block px-8 py-4 text-sm font-bold tracking-widest uppercase transition-colors"
		>
			Leer el diario
		</a>
	</div>
</section>
