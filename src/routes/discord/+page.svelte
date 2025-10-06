<script>
	import { track } from '@vercel/analytics/sveltekit';
	import { onMount } from 'svelte';

	// Replace with your actual Discord invite link
	const DISCORD_INVITE = 'https://discord.gg/KXdwbP5yX';

	let countdown = $state(10);

	onMount(() => {
		// Track Discord link visit
		track('discord-visit', {
			source: 'direct_link',
			timestamp: new Date().toISOString()
		});

		// Countdown interval
		const interval = setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				clearInterval(interval);
				window.location.href = DISCORD_INVITE;
			}
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
  <!-- Primary Meta Tags -->
  <title>Entra a Creta</title>
  <meta name="title" content="Únete a Creta" />
  <meta name="description" content="Creta es el taller de software de icarus.mx. Aquí encontrarás un laberinto y la ruta para transitarlo." />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://icarus.mx/discord" />
  <meta property="og:title" content="Únete a Creta" />
  <meta property="og:description" content="Creta es el taller de software de icarus.mx. Aquí encontrarás un laberinto y la ruta para transitarlo." />
  <meta property="og:image" content="https://icarus.mx/creta/creta_og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Icarus" />
  <meta property="og:locale" content="es_MX" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://icarus.mx/discord" />
  <meta property="twitter:title" content="Únete a Creta" />
  <meta property="twitter:description" content="Creta es el taller de software de icarus.mx. Aquí encontrarás un laberinto y la ruta para transitarlo." />
  <meta property="twitter:image" content="https://icarus.mx/creta/creta_og.png" />

  <!-- Additional SEO -->
  <meta name="keywords" content="Creta, Icarus, Discord, aprendizaje, programación, SCYTHE, sickles, comunidad" />
  <meta name="author" content="Icarus" />
  <link rel="canonical" href="https://icarus.mx/discord" />
</svelte:head>


<section class="bg-gradient-to-b from-primary-950 via-primary-900 to-primary-700 text-primary-50 min-h-screen flex items-start md:items-center justify-center pt-24 md:pt-0">
	<div class="max-w-2xl mx-auto px-6 text-left">
		<!-- Heading -->
		<h1 class="text-5xl md:text-6xl font-black mb-6">
			Bienvenido a <span class="text-primary-400">Creta</span> 🏛️
		</h1>

		<!-- Description -->
		<p class="text-xl md:text-2xl text-primary-200 mb-8 leading-relaxed">
			Creta es el taller de software de icarus.mx <br />
			Aquí encontrarás un laberinto y la ruta para transitarlo.
		</p>

		<!-- Redirect Message -->
		<div class="mb-8 flex items-center gap-4">
			<p class="text-2xl md:text-3xl text-primary-300">
				> Entrando a Creta...
			</p>
			<span class="text-3xl md:text-4xl font-black text-primary-400">{countdown}</span>
		</div>

		<!-- Info -->
		<div class="mt-12 text-sm text-primary-400">
			<p>→ Aprendiz → Constructor → Maestro</p>
		</div>
	</div>
</section>
