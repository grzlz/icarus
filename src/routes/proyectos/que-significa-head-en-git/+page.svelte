<svelte:head>
	<title>¿Qué significa HEAD en Git? | Proyectos | icarus.mx</title>
	<meta name="description" content="Entiende qué es HEAD en Git, cómo se mueve entre commits y por qué es clave para navegar tu historial." />

	<meta property="og:type" content="article" />
	<meta property="og:title" content="¿Qué significa HEAD en Git? | icarus.mx" />
	<meta property="og:description" content="Entiende qué es HEAD en Git, cómo se mueve entre commits y por qué es clave para navegar tu historial." />
	<meta property="og:image" content="https://icarus.mx/logo_zoomed.png" />
	<meta property="og:url" content="https://icarus.mx/proyectos/que-significa-head-en-git" />
	<meta property="og:site_name" content="icarus.mx" />

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://icarus.mx/proyectos/que-significa-head-en-git" />
	<meta property="twitter:title" content="¿Qué significa HEAD en Git? | icarus.mx" />
	<meta property="twitter:description" content="Entiende qué es HEAD en Git, cómo se mueve entre commits y por qué es clave para navegar tu historial." />
	<meta property="twitter:image" content="https://icarus.mx/logo_zoomed.png" />
</svelte:head>

<section class="py-24 px-6">
	<div class="max-w-3xl mx-auto">
		<!-- Back link -->
		<a href="/creta" class="inline-flex items-center gap-2 text-primary-400 hover:text-red-400 transition-colors duration-200 mb-12 text-sm font-medium">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
			Volver a Creta
		</a>

		<!-- Header -->
		<div class="mb-16">
			<div class="flex items-center gap-3 mb-4">
				<span class="text-xs font-medium bg-red-400/10 text-red-400 px-3 py-1 rounded-full">Principiante</span>
				<span class="text-xs text-primary-400">~10 min</span>
			</div>
			<h1 class="text-3xl md:text-5xl font-black text-primary-100 leading-tight mb-6">
				¿Qué significa HEAD en Git?
			</h1>
			<p class="text-lg text-primary-300 leading-relaxed">
				HEAD es un puntero que le dice a Git "estás aquí". Apunta al commit en el que te encuentras en este momento. Entenderlo te da control total sobre tu historial.
			</p>
		</div>

		<!-- Steps -->
		<div class="space-y-16">
			<!-- Step 1 -->
			<div class="flex gap-6 items-start">
				<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">01</span>
				<div class="space-y-4">
					<h2 class="text-xl font-bold text-primary-100">HEAD es un puntero</h2>
					<p class="text-primary-300/80 leading-relaxed">
						En Git, HEAD es una referencia que apunta al commit actual en tu rama. Piensa en él como un marcador de "estás aquí" en un mapa.
					</p>
					<p class="text-primary-300/80 leading-relaxed">
						Normalmente HEAD apunta a una rama (como <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">main</code>), y esa rama apunta al último commit. Cuando haces un nuevo commit, la rama avanza y HEAD se mueve con ella.
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 overflow-x-auto">
						<p>git log --oneline -1</p>
						<p class="text-primary-400 mt-1"># a1b2c3d (HEAD -> main) último commit</p>
					</div>
				</div>
			</div>

			<div class="w-full h-px bg-white/10"></div>

			<!-- Step 2 -->
			<div class="flex gap-6 items-start">
				<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">02</span>
				<div class="space-y-4">
					<h2 class="text-xl font-bold text-primary-100">HEAD se mueve cuando cambias de rama</h2>
					<p class="text-primary-300/80 leading-relaxed">
						Cada vez que haces <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">git switch</code> o <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">git checkout</code>, HEAD se mueve a apuntar a la nueva rama.
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 space-y-1 overflow-x-auto">
						<p>git switch main</p>
						<p class="text-primary-400"># HEAD -> main</p>
						<p class="mt-2">git switch feature</p>
						<p class="text-primary-400"># HEAD -> feature</p>
					</div>
					<p class="text-primary-400 text-sm">
						HEAD siempre sabe en qué rama estás. Por eso <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">git branch</code> marca con asterisco la rama actual.
					</p>
				</div>
			</div>

			<div class="w-full h-px bg-white/10"></div>

			<!-- Step 3 -->
			<div class="flex gap-6 items-start">
				<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">03</span>
				<div class="space-y-4">
					<h2 class="text-xl font-bold text-primary-100">Detached HEAD — cuando HEAD no apunta a una rama</h2>
					<p class="text-primary-300/80 leading-relaxed">
						Si haces checkout a un commit específico (no a una rama), HEAD se "despega" — deja de seguir a una rama y apunta directo al commit.
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 space-y-1 overflow-x-auto">
						<p>git checkout a1b2c3d</p>
						<p class="text-primary-400"># HEAD está en a1b2c3d (detached)</p>
					</div>
					<p class="text-primary-300/80 leading-relaxed">
						En este estado puedes explorar el código en ese punto del tiempo. Si quieres guardar cambios desde aquí, crea una rama:
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 overflow-x-auto">
						<p>git switch -c nueva-rama</p>
					</div>
				</div>
			</div>

			<div class="w-full h-px bg-white/10"></div>

			<!-- Step 4 -->
			<div class="flex gap-6 items-start">
				<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">04</span>
				<div class="space-y-4">
					<h2 class="text-xl font-bold text-primary-100">Usando HEAD como referencia</h2>
					<p class="text-primary-300/80 leading-relaxed">
						HEAD es útil en comandos porque te deja referirte a commits relativos sin saber sus hashes.
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 space-y-1 overflow-x-auto">
						<p class="text-primary-400"># Ver el commit anterior</p>
						<p>git show HEAD~1</p>
						<p class="mt-2 text-primary-400"># Comparar con 3 commits atrás</p>
						<p>git diff HEAD~3</p>
						<p class="mt-2 text-primary-400"># Deshacer el último commit (manteniendo cambios)</p>
						<p>git reset HEAD~1</p>
					</div>
					<p class="text-primary-400 text-sm">
						<code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">HEAD~1</code> = un commit antes. <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">HEAD~2</code> = dos commits antes. Y así.
					</p>
				</div>
			</div>
		</div>

		<!-- Recap -->
		<div class="mt-24 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8">
			<h2 class="text-2xl font-bold text-primary-100 mb-6">Resumen</h2>
			<ul class="space-y-3">
				{#each [
					'HEAD es un puntero a tu posición actual en el historial',
					'Normalmente apunta a una rama, que apunta al último commit',
					'Se mueve cuando cambias de rama o haces checkout',
					'Detached HEAD = apuntando a un commit directamente, sin rama',
					'HEAD~N te deja referenciar commits anteriores sin hashes'
				] as item}
					<li class="flex items-start gap-3 text-primary-300/80">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
						{item}
					</li>
				{/each}
			</ul>
		</div>

		<!-- CTA -->
		<div class="mt-16 text-center">
			<p class="text-primary-300 mb-6">¿Quieres seguir aprendiendo?</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a
					href="/proyectos/como-hacer-prs"
					class="inline-block bg-red-400 hover:bg-red-500 text-primary-950 font-bold px-8 py-3 rounded-lg transition-all duration-300"
				>
					Aprende a hacer PRs
				</a>
				<a
					href="/creta"
					class="inline-block bg-white/5 border border-white/10 hover:bg-white/10 text-primary-200 font-medium px-8 py-3 rounded-lg transition-all duration-300"
				>
					Más guías
				</a>
			</div>
		</div>
	</div>
</section>
