<script>
	import { reveal } from '$lib/actions/reveal.js';
</script>

<svelte:head>
	<title>Creta | icarus.mx</title>
	<meta name="description" content="Guías prácticas para que empieces a contribuir a los proyectos de icarus.mx. Paso a paso, desde cero hasta tu primer aporte." />

	<meta property="og:type" content="website" />
	<meta property="og:title" content="Creta | icarus.mx" />
	<meta property="og:description" content="Guías prácticas para que empieces a contribuir a los proyectos de icarus.mx. Paso a paso." />
	<meta property="og:image" content="https://icarus.mx/creta/creta_og.png?v=2" />
	<meta property="og:url" content="https://icarus.mx/creta" />
	<meta property="og:site_name" content="icarus.mx" />

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://icarus.mx/creta" />
	<meta property="twitter:title" content="Creta | icarus.mx" />
	<meta property="twitter:description" content="Guías prácticas para que empieces a contribuir a los proyectos de icarus.mx. Paso a paso." />
	<meta property="twitter:image" content="https://icarus.mx/creta/creta_og.png?v=2" />
</svelte:head>

<!-- Hero -->
<section class="py-24 px-6">
	<div class="max-w-4xl mx-auto">
		<p class="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-4 hero-animate">Aprende haciendo</p>
		<h1 class="text-3xl md:text-5xl font-black text-primary-100 leading-tight mb-6 hero-animate hero-animate-1">
			Empieza aquí tu ruta<br/>
			<span class="text-primary-400">de aprendizaje</span>
		</h1>
		<p class="text-lg md:text-xl text-primary-300 max-w-2xl leading-relaxed hero-animate hero-animate-2">
			Guías prácticas que te acompañan en tu camino. Cada una te lleva paso a paso, desde cero hasta tu primer aporte opensource.
		</p>
	</div>
</section>

<!-- Artifacts Grid -->
<section class="pb-24 px-6">
	<div class="max-w-4xl mx-auto">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<a
				use:reveal={{ delay: 0 }}
				href="/proyectos/como-hacer-prs"
				class="flex flex-col bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-400/5 hover:border-emerald-400/20 group"
			>
				<div class="flex items-center gap-4 mb-4">
					<span class="text-3xl font-black text-emerald-400/60 leading-none shrink-0">01</span>
					<h2 class="text-xl font-bold text-primary-100 group-hover:text-emerald-400 transition-colors duration-200">
						¿Cómo hacer PRs?
					</h2>
				</div>
				<p class="text-primary-200/70 leading-relaxed mb-6">
					Guía paso a paso para hacer tu primer Pull Request. Desde el fork hasta el merge.
				</p>
				<div class="mt-auto flex items-center gap-3">
					<span class="text-xs font-medium bg-emerald-400/10 text-emerald-400 px-3 py-1 rounded-full">Principiante</span>
					<span class="text-xs text-primary-400">~15 min</span>
				</div>
			</a>

			<a
				use:reveal={{ delay: 100 }}
				href="/proyectos/como-personalizar-tus-comandos"
				class="flex flex-col bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] hover:bg-amber-400/5 hover:border-amber-400/20 group"
			>
				<div class="flex items-center gap-4 mb-4">
					<span class="text-3xl font-black text-amber-400/60 leading-none shrink-0">02</span>
					<h2 class="text-xl font-bold text-primary-100 group-hover:text-amber-400 transition-colors duration-200">
						¿Cómo personalizar tus comandos?
					</h2>
				</div>
				<p class="text-primary-200/70 leading-relaxed mb-6">
					Crea aliases y funciones en tu terminal para dejar de repetir lo mismo todos los días.
				</p>
				<div class="mt-auto flex items-center gap-3">
					<span class="text-xs font-medium bg-amber-400/10 text-amber-400 px-3 py-1 rounded-full">Principiante</span>
					<span class="text-xs text-primary-400">~10 min</span>
				</div>
			</a>

			<a
				use:reveal={{ delay: 200 }}
				href="/proyectos/que-significa-head-en-git"
				class="flex flex-col bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] hover:bg-cyan-400/5 hover:border-cyan-400/20 group"
			>
				<div class="flex items-center gap-4 mb-4">
					<span class="text-3xl font-black text-cyan-400/60 leading-none shrink-0">03</span>
					<h2 class="text-xl font-bold text-primary-100 group-hover:text-cyan-400 transition-colors duration-200">
						¿Qué significa HEAD en Git?
					</h2>
				</div>
				<p class="text-primary-200/70 leading-relaxed mb-6">
					Entiende qué es HEAD, cómo se mueve entre commits y por qué es clave para navegar tu historial.
				</p>
				<div class="mt-auto flex items-center gap-3">
					<span class="text-xs font-medium bg-cyan-400/10 text-cyan-400 px-3 py-1 rounded-full">Principiante</span>
					<span class="text-xs text-primary-400">~10 min</span>
				</div>
			</a>

			<a
				use:reveal={{ delay: 300 }}
				href="/creta/init"
				class="flex flex-col bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] hover:bg-violet-400/5 hover:border-violet-400/20 group"
			>
				<div class="flex items-center gap-4 mb-4">
					<span class="text-3xl font-black text-violet-400/60 leading-none shrink-0">04</span>
					<h2 class="text-xl font-bold text-primary-100 group-hover:text-violet-400 transition-colors duration-200">
						Continúa aprendiendo
					</h2>
				</div>
				<p class="text-primary-200/70 leading-relaxed mb-6">
				También tenemos  taller de software que es completamente gratuito.<br>Da click aquí para saber más.
				</p>
				<div class="mt-auto flex items-center gap-3">
					<span class="text-xs font-medium bg-violet-400/10 text-violet-400 px-3 py-1 rounded-full">Comunidad</span>
					<span class="text-xs text-primary-400">Entra a Creta -></span>
				</div>
			</a>
		</div>
	</div>
</section>
