<script>
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
</script>

<svelte:head>
	<title>icarus.mx | Desarrollo de software a la medida en México</title>
	<meta name="description" content="Herramientas y comunidad para desarrolladores en México. Aprende, colabora y crece con nosotros." />

	<meta property="og:type" content="website" />
	<meta property="og:title" content="icarus.mx | Herramientas para desarrolladores" />
	<meta property="og:description" content="Herramientas y comunidad para desarrolladores en México. Aprende, colabora y crece con nosotros." />
	<meta property="og:image" content="https://icarus.mx/logo_zoomed.png" />
	<meta property="og:url" content="https://icarus.mx" />
	<meta property="og:site_name" content="icarus.mx" />

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://icarus.mx" />
	<meta property="twitter:title" content="icarus.mx | Herramientas para desarrolladores" />
	<meta property="twitter:description" content="Herramientas y comunidad para desarrolladores en México. Aprende, colabora y crece con nosotros." />
	<meta property="twitter:image" content="https://icarus.mx/logo_zoomed.png" />
</svelte:head>

<!-- Hero -->
<section class="text-primary-50 min-h-[90vh] flex items-center justify-center relative overflow-hidden">
	<div class="max-w-4xl mx-auto px-6 md:px-10 text-center relative z-10">
		<div class="space-y-2">
			<h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight">
				Entregamos <span class="text-red-400 relative inline-block">
					software
					<div class="absolute -bottom-1 md:-bottom-2 left-0 w-full h-0.5 md:h-1 bg-red-400 rounded"></div>
				</span>
			</h1>
			<h2 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight text-primary-600">
				a tiempo
			</h2>
		</div>

		<div class="mt-12 space-y-6">
			<p class="text-lg sm:text-xl md:text-2xl lg:text-3xl text-primary-200 max-w-3xl mx-auto leading-relaxed">
				Nos cuidamos de volar muy cerca del sol
			</p>

			<div class="mt-16 flex justify-center">
				<a
					href="https://wa.me/525548017016?text=Hola%2C%20quiero%20más%20información"
					target="_blank"
					class="inline-block bg-transparent border-2 border-primary-400 text-primary-400 hover:bg-red-400 hover:border-red-400 hover:text-primary-950 font-bold text-lg px-12 py-4 rounded-lg transition-all duration-300"
				>
					Contáctanos
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Servicios -->
<section id="servicios" class="py-24 px-6">
	<div class="max-w-6xl mx-auto">
		<h2 class="text-3xl md:text-4xl font-bold text-center text-primary-100 mb-16">
			Nuestros servicios
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<!-- Desarrollo de software -->
			<div class="flex flex-col bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:border-white/20">
				<div class="flex items-center gap-4 mb-4">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
					</svg>
					<h3 class="text-2xl font-bold text-primary-100">Desarrollo de software</h3>
				</div>
				<p class="text-primary-200/70 leading-relaxed mb-6">
					Aplicaciones web, iOS y Android.<br/>Software a la medida de tus necesidades.
				</p>
				<a
					href="https://wa.me/525548017016?text=Hola%2C%20me%20interesa%20desarrollo%20de%20software"
					target="_blank"
					class="mt-auto inline-block text-red-400 hover:text-red-500 font-semibold transition-colors duration-200"
				>
					Platiquemos →
				</a>
			</div>

			<!-- Consultoría -->
			<div class="flex flex-col bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:border-white/20">
				<div class="flex items-center gap-4 mb-4">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
					</svg>
					<h3 class="text-2xl font-bold text-primary-100">Consultoría</h3>
				</div>
				<p class="text-primary-200/70 leading-relaxed mb-6">
					Consultoría técnica, revisión de arquitectura<br/>y asesoría estratégica para tu equipo.
				</p>
				<a
					href="https://wa.me/525548017016?text=Hola%2C%20me%20interesa%20consultor%C3%ADa%20t%C3%A9cnica"
					target="_blank"
					class="mt-auto inline-block text-red-400 hover:text-red-500 font-semibold transition-colors duration-200"
				>
					Platiquemos →
				</a>
			</div>

			<!-- Capacitación -->
			<div class="flex flex-col bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:border-white/20">
				<div class="flex items-center gap-4 mb-4">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
					</svg>
					<h3 class="text-2xl font-bold text-primary-100">Capacitación</h3>
				</div>
				<p class="text-primary-200/70 leading-relaxed mb-6">
					Talleres, cursos y mentoría para equipos de desarrollo.<br/>Aprendemos haciendo.
				</p>
				<a
					href="https://wa.me/525548017016?text=Hola%2C%20me%20interesa%20capacitaci%C3%B3n%20para%20mi%20equipo"
					target="_blank"
					class="mt-auto inline-block text-red-400 hover:text-red-500 font-semibold transition-colors duration-200"
				>
					Platiquemos →
				</a>
			</div>

			<!-- Hosting -->
			<div class="flex flex-col bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:border-white/20">
				<div class="flex items-center gap-4 mb-4">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z" />
					</svg>
					<h3 class="text-2xl font-bold text-primary-100">Icarus Cloud</h3>
				</div>
				<p class="text-primary-200/70 leading-relaxed mb-6">
				Despliega tus aplicaciones en nuestra plataforma.<br/>La infraestructura es propia y está alojada en México.
				</p>
				<a
					href="/cloud"
					class="mt-auto inline-block text-red-400 hover:text-red-500 font-semibold transition-colors duration-200"
				>
					Saber más →
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Nuestra Promesa -->
<section class="py-24 px-6">
	<div class="max-w-6xl mx-auto">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
			<!-- Left: Statement -->
			<div>
				<p class="text-red-400 font-semibold text-sm uppercase tracking-widest mb-4">Cómo trabajamos</p>
				<h2 class="text-3xl md:text-5xl font-black text-primary-100 leading-tight">
					Proceso claro,<br/>
					<span class="text-primary-400">resultados reales.</span>
				</h2>
				<p class="text-primary-300 text-lg mt-6 leading-relaxed max-w-md">
					Cada proyecto tiene un responsable directo, fechas reales y comunicación constante.
				</p>
			</div>

			<!-- Right: 3 Promises -->
			<div class="space-y-8">
				<div class="flex gap-6 items-start">
					<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">01</span>
					<div>
						<h3 class="text-xl font-bold text-primary-100 mb-1">Fechas que se cumplen</h3>
						<p class="text-primary-300/70 leading-relaxed">Planeamos con margen real y cumplimos lo acordado.</p>
					</div>
				</div>

				<div class="w-full h-px bg-white/10"></div>

				<div class="flex gap-6 items-start">
					<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">02</span>
					<div>
						<h3 class="text-xl font-bold text-primary-100 mb-1">Comunicación directa</h3>
						<p class="text-primary-300/70 leading-relaxed">Hablas con quien construye tu proyecto. Así de simple.</p>
					</div>
				</div>

				<div class="w-full h-px bg-white/10"></div>

				<div class="flex gap-6 items-start">
					<span class="text-4xl font-black text-red-400/30 leading-none shrink-0">03</span>
					<div>
						<h3 class="text-xl font-bold text-primary-100 mb-1">Código que se mantiene</h3>
						<p class="text-primary-300/70 leading-relaxed">Software limpio, documentado y listo para escalar.</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Contacto -->
<section id="contacto" class="py-24 px-6">
	<div class="max-w-5xl mx-auto">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-16">
			<!-- Left: Copy + WhatsApp -->
			<div class="flex flex-col justify-center">
				<h2 class="text-3xl md:text-4xl font-bold text-primary-100 mb-4">
					¿Listo para trabajar juntos?
				</h2>
				<p class="text-primary-300 text-lg mb-8 leading-relaxed">
					Cuéntanos sobre tu proyecto.
				</p>
				<a
					href="https://wa.me/525548017016?text=Hola%2C%20quiero%20más%20información"
					target="_blank"
					class="flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl px-6 py-4 text-primary-100 hover:border-green-500/40 hover:text-green-400 transition-all duration-300 w-fit"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-6 h-6 text-green-500 fill-current shrink-0" aria-label="WhatsApp">
						<path d="M16 .396c-8.837 0-16 7.163-16 16 0 2.82.735 5.59 2.13 8.031L0 32l7.745-2.021c2.355 1.29 5.028 1.97 7.794 1.97 8.837 0 16-7.163 16-16S24.837.396 16 .396zm0 29.202c-2.475 0-4.9-.661-7.03-1.916l-.506-.295-4.6 1.201 1.226-4.48-.313-.515a13.393 13.393 0 01-2.08-7.094c0-7.433 6.048-13.481 13.481-13.481S29.481 7.963 29.481 15.396 23.433 29.598 16 29.598zm7.458-10.553c-.408-.204-2.408-1.188-2.782-1.325-.375-.14-.65-.204-.926.204-.277.409-1.063 1.325-1.304 1.6-.24.277-.48.307-.888.102-.408-.204-1.719-.633-3.275-2.02-1.21-1.079-2.021-2.408-2.261-2.816-.24-.408-.026-.63.18-.834.184-.183.409-.48.612-.72.204-.24.271-.408.409-.68.136-.272.068-.51-.034-.714-.102-.204-.926-2.24-1.27-3.067-.334-.804-.676-.696-.926-.71l-.79-.014c-.272 0-.71.102-1.082.51-.372.408-1.418 1.385-1.418 3.38 0 1.995 1.454 3.923 1.656 4.196.204.273 2.86 4.375 6.93 6.133.968.417 1.723.666 2.311.853.971.308 1.855.264 2.556.161.78-.117 2.408-.984 2.748-1.933.34-.95.34-1.766.238-1.933-.102-.17-.373-.272-.78-.477z"/>
					</svg>
					<span class="font-medium">O escríbenos por WhatsApp</span>
				</a>
			</div>

			<!-- Right: Form -->
			<form onsubmit={handleSubmit} class="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 space-y-5">
				<div>
					<label for="name" class="block text-sm font-medium text-primary-200 mb-2">Nombre</label>
					<input
						id="name"
						type="text"
						bind:value={formName}
						required
						class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-primary-100 placeholder-primary-400/50 focus:outline-none focus:border-red-400/50 transition-colors"
						placeholder="Tu nombre"
					/>
				</div>
				<div>
					<label for="email" class="block text-sm font-medium text-primary-200 mb-2">Correo</label>
					<input
						id="email"
						type="email"
						bind:value={formEmail}
						required
						class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-primary-100 placeholder-primary-400/50 focus:outline-none focus:border-red-400/50 transition-colors"
						placeholder="tu@correo.com"
					/>
				</div>
				<div>
					<label for="message" class="block text-sm font-medium text-primary-200 mb-2">Mensaje</label>
					<textarea
						id="message"
						bind:value={formMessage}
						required
						rows="4"
						class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-primary-100 placeholder-primary-400/50 focus:outline-none focus:border-red-400/50 transition-colors resize-none"
						placeholder="Cuéntanos sobre tu proyecto..."
					></textarea>
				</div>
				<button
					type="submit"
					disabled={formStatus === 'sending'}
					class="w-full bg-primary-400 hover:bg-primary-300 disabled:opacity-50 text-primary-950 font-bold py-3 rounded-lg transition-all duration-300 cursor-pointer"
				>
					{#if formStatus === 'sending'}
						Enviando...
					{:else if formStatus === 'sent'}
						Mensaje enviado
					{:else if formStatus === 'error'}
						Error, intenta de nuevo
					{:else}
						Enviar mensaje
					{/if}
				</button>
			</form>
		</div>
	</div>
</section>
