<svelte:head>
	<title>Instala Ariadna | Proyectos | icarus.mx</title>
	<meta name="description" content="Instala Ariadna, la distribución de Neovim de icarus.mx. Configuración profesional lista en 3 minutos." />

	<meta property="og:type" content="article" />
	<meta property="og:title" content="Instala Ariadna | icarus.mx" />
	<meta property="og:description" content="Instala Ariadna, la distribución de Neovim de icarus.mx. Configuración profesional lista en 3 minutos." />
	<meta property="og:image" content="https://icarus.mx/logo_zoomed.png" />
	<meta property="og:url" content="https://icarus.mx/proyectos/instala-ariadna" />
	<meta property="og:site_name" content="icarus.mx" />

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://icarus.mx/proyectos/instala-ariadna" />
	<meta property="twitter:title" content="Instala Ariadna | icarus.mx" />
	<meta property="twitter:description" content="Instala Ariadna, la distribución de Neovim de icarus.mx. Configuración profesional lista en 3 minutos." />
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
				<span class="text-xs text-primary-400">~5 min</span>
			</div>
			<h1 class="text-3xl md:text-5xl font-black text-primary-100 leading-tight mb-6">
				Instala Ariadna
			</h1>
			<p class="text-lg text-primary-300 leading-relaxed">
				Ariadna es la distribución de Neovim de icarus.mx. LSP servers, tema, plugins y keybindings — todo listo para que solo abras tu terminal y empieces a programar.
			</p>
		</div>

		<!-- Steps -->
		<div class="space-y-16">
			<!-- Step 1 -->
			<div class="flex gap-6 items-start">
				<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">01</span>
				<div class="space-y-4">
					<h2 class="text-xl font-bold text-primary-100">Requisitos</h2>
					<p class="text-primary-300/80 leading-relaxed">
						Antes de instalar, asegúrate de tener estas herramientas en tu máquina. El instalador verifica por ti, pero es bueno saberlo.
					</p>
					<div class="space-y-3">
						<div class="flex items-center gap-3 text-primary-300/80">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<span><strong class="text-primary-100">Git</strong> — para clonar y contribuir</span>
						</div>
						<div class="flex items-center gap-3 text-primary-300/80">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<span><strong class="text-primary-100">Node.js</strong> — necesario para los LSP servers</span>
						</div>
						<div class="flex items-center gap-3 text-primary-300/80">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							<span><strong class="text-primary-100">Neovim 0.10+</strong> — el instalador lo instala si no lo tienes</span>
						</div>
					</div>
				</div>
			</div>

			<div class="w-full h-px bg-white/10"></div>

			<!-- Step 2 -->
			<div class="flex gap-6 items-start">
				<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">02</span>
				<div class="space-y-4">
					<h2 class="text-xl font-bold text-primary-100">Ejecuta el instalador</h2>
					<p class="text-primary-300/80 leading-relaxed">
						Un solo comando. El script respalda tu configuración actual, descarga Ariadna e instala todos los plugins automáticamente.
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 overflow-x-auto">
						<p>bash &lt;(curl -fsSL https://icarus.mx/ariadna/install.sh)</p>
					</div>
					<p class="text-primary-400 text-sm">
						En Windows usa PowerShell: <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">irm https://icarus.mx/ariadna/install.ps1 | iex</code>
					</p>
					<div class="bg-yellow-400/5 border border-yellow-400/20 rounded-lg p-4 text-sm text-yellow-200/80">
						No uses <code class="text-yellow-400 bg-white/5 px-1.5 py-0.5 rounded">sudo</code>. El instalador te lo advierte — ejecutar con sudo causa problemas de permisos.
					</div>
				</div>
			</div>

			<div class="w-full h-px bg-white/10"></div>

			<!-- Step 3 -->
			<div class="flex gap-6 items-start">
				<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">03</span>
				<div class="space-y-4">
					<h2 class="text-xl font-bold text-primary-100">Abre Neovim</h2>
					<p class="text-primary-300/80 leading-relaxed">
						Una vez que el instalador termine, abre Neovim. La primera vez, Mason instalará los LSP servers automáticamente (~1 min). Después reinicia Neovim y ya estás listo.
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 space-y-1 overflow-x-auto">
						<p>nvim</p>
						<p class="text-primary-400"># Espera a que Mason termine, luego cierra y abre de nuevo</p>
						<p>nvim</p>
					</div>
				</div>
			</div>

			<div class="w-full h-px bg-white/10"></div>

			<!-- Step 4 -->
			<div class="flex gap-6 items-start">
				<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">04</span>
				<div class="space-y-4">
					<h2 class="text-xl font-bold text-primary-100">Keybindings esenciales</h2>
					<p class="text-primary-300/80 leading-relaxed">
						Ariadna usa <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">Space</code> como tecla líder. Con eso ya puedes hacer casi todo.
					</p>
					<div class="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-primary-200 overflow-x-auto">
						<div class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
							<span class="text-red-400">Space Space</span>
							<span>Buscar archivos</span>
							<span class="text-red-400">Space e</span>
							<span>Explorador de archivos</span>
							<span class="text-red-400">Space h</span>
							<span>Ayuda</span>
							<span class="text-red-400">Space /</span>
							<span>Buscar texto en el proyecto</span>
						</div>
					</div>
					<p class="text-primary-400 text-sm">
						Escribe <code class="text-red-400 bg-white/5 px-1.5 py-0.5 rounded text-sm">Space</code> y espera — Neovim te muestra todas las opciones disponibles.
					</p>
				</div>
			</div>
		</div>

		<!-- Recap -->
		<div class="mt-24 bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8">
			<h2 class="text-2xl font-bold text-primary-100 mb-6">Resumen</h2>
			<ul class="space-y-3">
				{#each [
					'Requisitos — Git, Node.js y Neovim 0.10+',
					'Un comando — el instalador hace todo por ti',
					'Mason — instala LSP servers en el primer arranque',
					'Space — tu tecla líder para navegar todo'
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
