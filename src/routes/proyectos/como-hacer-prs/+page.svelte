<svelte:head>
	<title>¿Cómo hacer PRs? | Proyectos | icarus.mx</title>
	<meta name="description" content="Guía paso a paso para hacer tu primer Pull Request en GitHub. Aprende a contribuir a proyectos open source." />

	<meta property="og:type" content="article" />
	<meta property="og:title" content="¿Cómo hacer PRs? | icarus.mx" />
	<meta property="og:description" content="Guía paso a paso para hacer tu primer Pull Request en GitHub." />
	<meta property="og:image" content="https://icarus.mx/logo_zoomed.png" />
	<meta property="og:url" content="https://icarus.mx/proyectos/como-hacer-prs" />
	<meta property="og:site_name" content="icarus.mx" />

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://icarus.mx/proyectos/como-hacer-prs" />
	<meta property="twitter:title" content="¿Cómo hacer PRs? | icarus.mx" />
	<meta property="twitter:description" content="Guía paso a paso para hacer tu primer Pull Request en GitHub." />
	<meta property="twitter:image" content="https://icarus.mx/logo_zoomed.png" />
</svelte:head>

<section class="py-24 px-6">
	<div class="max-w-3xl mx-auto">
		<!-- Back link -->
		<a href="/proyectos" class="inline-flex items-center gap-2 text-primary-400 hover:text-red-400 transition-colors duration-200 mb-12 text-sm font-medium">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
			Volver a Proyectos
		</a>

		<!-- Header -->
		<div class="mb-16">
			<div class="flex items-center gap-3 mb-4">
				<span class="text-xs font-medium bg-red-400/10 text-red-400 px-3 py-1 rounded-full">Principiante</span>
				<span class="text-xs text-primary-400">~15 min</span>
			</div>
			<h1 class="text-3xl md:text-5xl font-black text-primary-100 leading-tight mb-6">
				¿Cómo hacer PRs?
			</h1>
			<p class="text-lg text-primary-300 leading-relaxed">
				Un Pull Request (PR) es la forma en que propones cambios a un proyecto. Esta guía te lleva desde clonar el repo hasta el merge, paso a paso.
			</p>
		</div>

		<!-- Steps -->
		<div class="space-y-16">
			<!-- Step 1 -->
			<div class="flex gap-6 items-start">
				<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">01</span>
				<div class="space-y-4">
					<h2 class="text-xl font-bold text-primary-100">Clonar y crear rama</h2>
					<p class="text-primary-300/80 leading-relaxed">
						Clona el repositorio a tu máquina local y crea una rama nueva para tus cambios. Nunca trabajes directo en <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">main</code>.
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 space-y-1 overflow-x-auto">
						<p>git clone https://github.com/icarus-mx/el-repo.git</p>
						<p>cd el-repo</p>
						<p>git switch -c "42-add-search-feature"</p>
					</div>
					<p class="text-primary-400 text-sm">
						Incluye el número del issue de GitHub al inicio de la rama para tracking: <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">42-add-search-feature</code>, <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">15-fix-login-bug</code>, etc.
					</p>
				</div>
			</div>

			<div class="w-full h-px bg-white/10"></div>

			<!-- Step 3 -->
			<div class="flex gap-6 items-start">
				<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">02</span>
				<div class="space-y-4">
					<h2 class="text-xl font-bold text-primary-100">Hacer cambios y commits</h2>
					<p class="text-primary-300/80 leading-relaxed">
						Haz tus cambios en el código. Cuando estés listo, agrega los archivos y crea un commit con un mensaje claro.
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 space-y-1 overflow-x-auto">
						<p>git add archivo-modificado.js</p>
						<p>git commit -m "fix: corregir validación en formulario de login"</p>
					</div>
					<p class="text-primary-300/80 leading-relaxed">
						Usa <a href="https://www.conventionalcommits.org" target="_blank" class="text-red-400 hover:underline">Conventional Commits</a> cuando sea posible: <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">feat:</code>, <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">fix:</code>, <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">docs:</code>, etc.
					</p>
				</div>
			</div>

			<div class="w-full h-px bg-white/10"></div>

			<!-- Step 4 -->
			<div class="flex gap-6 items-start">
				<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">03</span>
				<div class="space-y-4">
					<h2 class="text-xl font-bold text-primary-100">Push y abrir el PR</h2>
					<p class="text-primary-300/80 leading-relaxed">
						Sube tu rama a GitHub y abre el Pull Request desde ahí.
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 overflow-x-auto">
						<p>git push origin 42-add-search-feature</p>
					</div>
					<p class="text-primary-300/80 leading-relaxed">
						GitHub te mostrará un banner para crear el PR. En la descripción, explica:
					</p>
					<ul class="text-primary-300/80 leading-relaxed list-disc list-inside space-y-1 ml-2">
						<li><strong class="text-primary-100">Qué</strong> cambiaste</li>
						<li><strong class="text-primary-100">Por qué</strong> lo cambiaste</li>
						<li><strong class="text-primary-100">Cómo</strong> probarlo</li>
					</ul>
				</div>
			</div>

			<div class="w-full h-px bg-white/10"></div>

			<!-- Step 5 -->
			<div class="flex gap-6 items-start">
				<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">04</span>
				<div class="space-y-4">
					<h2 class="text-xl font-bold text-primary-100">El ciclo de review</h2>
					<p class="text-primary-300/80 leading-relaxed">
						Un colaborador revisará tu código. Es normal recibir comentarios y solicitudes de cambios. No es personal — es parte del proceso.
					</p>
					<p class="text-primary-300/80 leading-relaxed">
						Para hacer cambios después del review, simplemente haz más commits en la misma rama y sube:
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 space-y-1 overflow-x-auto">
						<p>git add .</p>
						<p>git commit -m "fix: aplicar cambios del review"</p>
						<p>git push origin 42-add-search-feature</p>
					</div>
					<p class="text-primary-400 text-sm">
						El PR se actualiza automáticamente con cada push a la rama.
					</p>
				</div>
			</div>

			<div class="w-full h-px bg-white/10"></div>

			<!-- Step 6 -->
			<div class="flex gap-6 items-start">
				<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">05</span>
				<div class="space-y-4">
					<h2 class="text-xl font-bold text-primary-100">Merge</h2>
					<p class="text-primary-300/80 leading-relaxed">
						Cuando un colaborador aprueba tu PR, lo mergea al proyecto principal. Tu código ya es parte del proyecto. Felicidades.
					</p>
					<p class="text-primary-300/80 leading-relaxed">
						Después del merge, puedes limpiar tu rama local:
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 space-y-1 overflow-x-auto">
						<p>git switch main</p>
						<p>git pull origin main</p>
						<p>git branch -d 42-add-search-feature</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Recap -->
		<div class="mt-24 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8">
			<h2 class="text-2xl font-bold text-primary-100 mb-6">Resumen</h2>
			<ul class="space-y-3">
				{#each [
					'Clonar + rama — espacio aislado con número de issue',
					'Commits — snapshots descriptivos de tu trabajo',
					'Push + PR — proponer tus cambios al proyecto',
					'Review — iterar con el equipo',
					'Merge — tu código es parte del proyecto'
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
			<p class="text-primary-300 mb-6">¿Listo para contribuir?</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a
					href="https://github.com/icarus-mx"
					target="_blank"
					class="inline-block bg-red-400 hover:bg-red-500 text-primary-950 font-bold px-8 py-3 rounded-lg transition-all duration-300"
				>
					Ir a GitHub
				</a>
				<a
					href="/proyectos"
					class="inline-block bg-white/5 border border-white/10 hover:bg-white/10 text-primary-200 font-medium px-8 py-3 rounded-lg transition-all duration-300"
				>
					Más guías
				</a>
			</div>
		</div>
	</div>
</section>
