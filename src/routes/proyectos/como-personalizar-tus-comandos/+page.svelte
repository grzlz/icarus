<svelte:head>
	<title>¿Cómo personalizar tus comandos? | Proyectos | icarus.mx</title>
	<meta name="description" content="Aprende a crear aliases y funciones en tu terminal para automatizar tareas repetitivas." />

	<meta property="og:type" content="article" />
	<meta property="og:title" content="¿Cómo personalizar tus comandos? | icarus.mx" />
	<meta property="og:description" content="Aprende a crear aliases y funciones en tu terminal para automatizar tareas repetitivas." />
	<meta property="og:image" content="https://icarus.mx/logo_zoomed.png" />
	<meta property="og:url" content="https://icarus.mx/proyectos/como-personalizar-tus-comandos" />
	<meta property="og:site_name" content="icarus.mx" />

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://icarus.mx/proyectos/como-personalizar-tus-comandos" />
	<meta property="twitter:title" content="¿Cómo personalizar tus comandos? | icarus.mx" />
	<meta property="twitter:description" content="Aprende a crear aliases y funciones en tu terminal para automatizar tareas repetitivas." />
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
				<span class="text-xs text-primary-400">~10 min</span>
			</div>
			<h1 class="text-3xl md:text-5xl font-black text-primary-100 leading-tight mb-6">
				¿Cómo personalizar tus comandos?
			</h1>
			<p class="text-lg text-primary-300 leading-relaxed">
				Si hay algo que escribes seguido en la terminal, no lo repitas — créate un atajo. Aquí aprendes a hacer aliases y funciones en bash para que tu terminal trabaje para ti.
			</p>
		</div>

		<!-- Steps -->
		<div class="space-y-16">
			<!-- Step 1 -->
			<div class="flex gap-6 items-start">
				<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">01</span>
				<div class="space-y-4">
					<h2 class="text-xl font-bold text-primary-100">Tu primer alias</h2>
					<p class="text-primary-300/80 leading-relaxed">
						Un alias es un atajo para un comando largo. Lo defines con <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">alias</code> y listo — funciona como cualquier otro comando.
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 space-y-1 overflow-x-auto">
						<p>alias gs='git status'</p>
						<p>alias ll='ls -la'</p>
						<p>alias dev='npm run dev'</p>
					</div>
					<p class="text-primary-400 text-sm">
						Pruébalo: escribe <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">gs</code> en tu terminal y verás el resultado de <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">git status</code>.
					</p>
				</div>
			</div>

			<div class="w-full h-px bg-white/10"></div>

			<!-- Step 2 -->
			<div class="flex gap-6 items-start">
				<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">02</span>
				<div class="space-y-4">
					<h2 class="text-xl font-bold text-primary-100">Hacerlos permanentes</h2>
					<p class="text-primary-300/80 leading-relaxed">
						Si solo escribes el alias en la terminal, se pierde al cerrarla. Para que sobreviva, agrégalo a tu archivo de configuración.
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 space-y-1 overflow-x-auto">
						<p class="text-primary-400"># Si usas bash:</p>
						<p>echo "alias gs='git status'" >> ~/.bashrc</p>
						<p></p>
						<p class="text-primary-400"># Si usas zsh:</p>
						<p>echo "alias gs='git status'" >> ~/.zshrc</p>
					</div>
					<p class="text-primary-300/80 leading-relaxed">
						Después de agregar el alias, recarga tu configuración para que tome efecto:
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 overflow-x-auto">
						<p>source ~/.bashrc</p>
					</div>
				</div>
			</div>

			<div class="w-full h-px bg-white/10"></div>

			<!-- Step 3 -->
			<div class="flex gap-6 items-start">
				<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">03</span>
				<div class="space-y-4">
					<h2 class="text-xl font-bold text-primary-100">Funciones para cosas más complejas</h2>
					<p class="text-primary-300/80 leading-relaxed">
						Cuando necesitas pasar argumentos o encadenar varios comandos, un alias se queda corto. Usa una función.
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 space-y-1 overflow-x-auto">
						<p class="text-primary-400"># Crear rama y cambiarte a ella</p>
						<p>nueva_rama() {'{'}</p>
						<p>  git switch -c "$1"</p>
						<p>{'}'}</p>
					</div>
					<p class="text-primary-300/80 leading-relaxed">
						Ahora puedes escribir <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">nueva_rama mi-feature</code> y se ejecuta <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">git switch -c mi-feature</code>. El <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">$1</code> es el primer argumento que le pases.
					</p>
				</div>
			</div>

			<div class="w-full h-px bg-white/10"></div>

			<!-- Step 4 -->
			<div class="flex gap-6 items-start">
				<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">04</span>
				<div class="space-y-4">
					<h2 class="text-xl font-bold text-primary-100">Ejemplo real: commit rápido</h2>
					<p class="text-primary-300/80 leading-relaxed">
						Juntemos todo. Esta función agrega cambios, hace commit y push en un solo comando:
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 space-y-1 overflow-x-auto">
						<p class="text-primary-400"># Agregar a tu ~/.bashrc o ~/.zshrc</p>
						<p>shipit() {'{'}</p>
						<p>  git add .</p>
						<p>  git commit -m "$1"</p>
						<p>  git push</p>
						<p>{'}'}</p>
					</div>
					<p class="text-primary-300/80 leading-relaxed">
						Uso:
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 overflow-x-auto">
						<p>shipit "feat: agregar barra de búsqueda"</p>
					</div>
					<p class="text-primary-400 text-sm">
						Tres comandos en uno. Esa es la idea.
					</p>
				</div>
			</div>
		</div>

		<!-- Recap -->
		<div class="mt-24 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8">
			<h2 class="text-2xl font-bold text-primary-100 mb-6">Resumen</h2>
			<ul class="space-y-3">
				{#each [
					'alias — atajos para comandos que usas seguido',
					'.bashrc / .zshrc — donde viven tus alias permanentes',
					'source — recarga tu configuración sin cerrar la terminal',
					'funciones — para comandos con argumentos o lógica',
					'shipit — ejemplo real de automatización útil'
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
					href="/proyectos"
					class="inline-block bg-white/5 border border-white/10 hover:bg-white/10 text-primary-200 font-medium px-8 py-3 rounded-lg transition-all duration-300"
				>
					Más guías
				</a>
			</div>
		</div>
	</div>
</section>
