<script>
	import { reveal } from '$lib/actions/reveal.js';

	const collections = [
		{
			id: 'campo',
			name: 'Campo',
			items: [
				{ name: 'Chamarra de Campo', detail: 'Lona encerada', tone: 'bg-forest-700' },
				{ name: 'Anorak de Lluvia', detail: 'Algodón tratado', tone: 'bg-stone-700' },
				{ name: 'Chaleco Acolchado', detail: 'Relleno reciclado', tone: 'bg-sand-500' },
				{ name: 'Sudadera Pesada', detail: 'Tejido grueso', tone: 'bg-rust-400' }
			]
		},
		{
			id: 'trabajo',
			name: 'Trabajo',
			items: [
				{ name: 'Pantalón de Trabajo', detail: 'Algodón doble', tone: 'bg-stone-600' },
				{ name: 'Camisa de Franela', detail: 'Lana mexicana', tone: 'bg-rust-600' },
				{ name: 'Overol Clásico', detail: 'Mezclilla pesada', tone: 'bg-charcoal-800' },
				{ name: 'Mandil de Taller', detail: 'Lona reforzada', tone: 'bg-sand-500' }
			]
		},
		{
			id: 'accesorios',
			name: 'Accesorios',
			items: [
				{ name: 'Sombrero de Ala', detail: 'Fieltro natural', tone: 'bg-stone-700' },
				{ name: 'Bandana', detail: 'Algodón orgánico', tone: 'bg-rust-400' },
				{ name: 'Cinturón de Lona', detail: 'Hebilla de latón', tone: 'bg-forest-500' },
				{ name: 'Mochila de Día', detail: 'Lona y cuero', tone: 'bg-stone-600' }
			]
		}
	];
</script>

<svelte:head>
	<title>Tienda · Icarus</title>
	<meta
		name="description"
		content="Colección Icarus. Ropa de campo, trabajo y accesorios hechos en México para durar más de una temporada."
	/>

	<meta property="og:type" content="website" />
	<meta property="og:title" content="Tienda · Icarus" />
	<meta
		property="og:description"
		content="Colección Icarus. Ropa de campo, trabajo y accesorios hechos en México para durar más de una temporada."
	/>
	<meta property="og:url" content="https://icarus.mx/tienda" />
	<meta property="og:locale" content="es_MX" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Tienda · Icarus" />
	<meta
		name="twitter:description"
		content="Colección Icarus. Ropa de campo, trabajo y accesorios hechos en México."
	/>
</svelte:head>

<section class="bg-cream-100">
	<div class="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
		<p use:reveal class="text-xs font-bold tracking-[0.3em] text-stone-700 uppercase">Tienda</p>
		<h1
			use:reveal={{ delay: 100 }}
			class="text-charcoal-900 mt-4 max-w-3xl text-4xl leading-tight font-extrabold md:text-6xl"
		>
			Colección actual.<br />Pocas piezas, bien hechas.
		</h1>
		<p use:reveal={{ delay: 200 }} class="mt-6 max-w-xl text-base leading-relaxed text-stone-700">
			Estamos abriendo la primera temporada. Cada prenda se hace en talleres mexicanos en tirajes
			cortos. Si te interesa una pieza, suscríbete y te avisamos cuando salga.
		</p>
	</div>
</section>

<section id="colecciones" class="bg-cream-50">
	<div class="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
		{#each collections as collection, ci (collection.id)}
			<div id={collection.id} class="mb-20 last:mb-0">
				<div
					use:reveal
					class="mb-10 flex items-end justify-between border-b border-stone-600/20 pb-4"
				>
					<h2 class="text-charcoal-900 text-2xl font-extrabold tracking-tight md:text-4xl">
						{collection.name}
					</h2>
					<p class="text-xs font-bold tracking-[0.25em] text-stone-700 uppercase">
						0{ci + 1} / 0{collections.length}
					</p>
				</div>

				<div class="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
					{#each collection.items as item, i (item.name)}
						<div use:reveal={{ delay: i * 70 }} class="group">
							<div class="aspect-[3/4] w-full {item.tone} relative">
								<div class="absolute top-3 left-3">
									<span
										class="bg-cream-50 text-charcoal-900 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase"
										>Próx.</span
									>
								</div>
							</div>
							<h3 class="text-charcoal-900 mt-4 text-base font-semibold">{item.name}</h3>
							<p class="mt-1 text-sm text-stone-700">{item.detail}</p>
						</div>
					{/each}
				</div>
			</div>
		{/each}

		<div use:reveal class="mt-16 border-t border-stone-600/20 pt-12 text-center">
			<p class="text-charcoal-900 text-xl font-medium md:text-2xl">¿Quieres ser de los primeros?</p>
			<p class="mt-3 text-sm text-stone-700">Te avisamos cuando abra la tienda.</p>
			<a
				href="/#contacto"
				class="bg-forest-700 hover:bg-forest-500 text-cream-50 mt-6 inline-block px-8 py-3.5 text-sm font-bold tracking-widest uppercase transition-colors"
			>
				Avísame
			</a>
		</div>
	</div>
</section>
