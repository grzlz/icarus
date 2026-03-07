<script>
	const DISCORD_INVITE = 'https://discord.gg/KXdwbP5yX';
</script>

<svelte:head>
  <!-- Primary Meta Tags -->
  <title>Entra a Creta</title>
  <meta name="title" content="Únete a Creta" />
  <meta name="description" content="Creta es el taller de software de icarus.mx. <br>Aquí encontrarás un laberinto y la ruta para transitarlo." />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://icarus.mx/creta/init" />
  <meta property="og:title" content="Únete a Creta" />
  <meta property="og:description" content="Creta es el taller de software de icarus.mx. Aquí encontrarás un laberinto y la ruta para transitarlo." />
  <meta property="og:image" content="https://icarus.mx/creta/creta_og.png?v=2" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Icarus" />
  <meta property="og:locale" content="es_MX" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://icarus.mx/creta/init" />
  <meta property="twitter:title" content="Únete a Creta" />
  <meta property="twitter:description" content="Creta es el taller de software de icarus.mx. Aquí encontrarás un laberinto y la ruta para transitarlo." />
  <meta property="twitter:image" content="https://icarus.mx/creta/creta_og.png?v=2" />

  <!-- Additional SEO -->
  <meta name="keywords" content="Creta, Icarus, Discord, aprendizaje, programación, SCYTHE, sickles, comunidad" />
  <meta name="author" content="Icarus" />
  <link rel="canonical" href="https://icarus.mx/creta/init" />
</svelte:head>

<section class="bg-gradient-to-b from-primary-950 via-primary-900 to-primary-700 text-primary-50 min-h-screen flex items-start md:items-center justify-center pt-24 md:pt-0">
	<div class="max-w-2xl mx-auto px-6 text-left">
		<!-- Hero -->
		<h1 class="text-5xl md:text-6xl font-black mb-6">
			Bienvenido a <span class="text-primary-400">Creta</span>
		</h1>

		<!-- What it is -->
		<p class="text-xl md:text-2xl text-primary-200 mb-4 leading-relaxed">
			El taller de software de icarus.mx.
		</p>
		<p class="text-lg text-primary-300 mb-10 leading-relaxed">
		Una ruta de aprendizaje estructurada para la nueva generación de desarrolladores, impulsados por <i>agentic AI</i>. Aprende construyendo, acompañado de una comunidad comprometida con tu desarrollo.
		</p>

		<!-- Who it's for -->
		<div class="mb-10">
			<h2 class="text-sm uppercase tracking-widest text-primary-400 mb-3">Para quienes quieren</h2>
			<ul class="space-y-2 text-primary-200 text-lg">
				<li>Aprender a construir software de la forma moderna</li>
				<li>Contribuir a proyectos reales closed y open source</li>
				<li>Crecer junto a otros desarrolladores</li>
			</ul>
		</div>

		<!-- Learning path -->
		<div class="mb-12">
			<h2 class="text-sm uppercase tracking-widest text-primary-400 mb-4">Detalles</h2>
			<p class="text-lg text-primary-300 mb-4 leading-relaxed">
				Esto no es para venderte un curso. Es una invitación para unirte a nuestro taller de software, donde entran aprendices y salen maestros en el oficio de la construcción de software asistida con agentes.
			</p>
			<p class="text-lg text-primary-300 mb-6 leading-relaxed">
				El oficio se aprende como siempre se ha aprendido: a través de trabajo y práctica deliberada.
			</p>
			<!-- CTA -->
			<a
				href={DISCORD_INVITE}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-block border-2 border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-primary-950 font-bold text-lg px-8 py-4 rounded-lg transition-colors mb-8"
			>
				Entrar a Creta
			</a>
			<div class="flex items-center gap-3 text-lg">
				<span class="text-primary-200 font-semibold">Aprendiz</span>
				<span class="text-primary-500">→</span>
				<span class="text-primary-200 font-semibold">Constructor</span>
				<span class="text-primary-500">→</span>
				<span class="text-primary-200 font-semibold">Maestro</span>
			</div>
		</div>
	</div>
</section>
