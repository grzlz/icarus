<script>
	import { track } from '@vercel/analytics/sveltekit';
	import { onMount } from 'svelte';

	// Replace with your actual Discord invite link
	const DISCORD_INVITE = 'https://discord.gg/YOUR_INVITE_CODE';

	onMount(() => {
		// Track Discord link visit
		track('discord-visit', {
			source: 'direct_link',
			timestamp: new Date().toISOString()
		});

		// Auto-redirect after 2 seconds
		const timeout = setTimeout(() => {
			window.location.href = DISCORD_INVITE;
		}, 2000);

		return () => clearTimeout(timeout);
	});
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>Únete a Creta | Comunidad de Aprendizaje Icarus</title>
	<meta name="title" content="Únete a Creta | Comunidad de Aprendizaje Icarus" />
	<meta name="description" content="Creta es el laberinto de aprendizaje de Icarus. Gana sickles navegando desafíos y conviértelos en tokens SCYTHE. Visitante → Aprendiz → Constructor → Maestro." />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://icarus.mx/discord" />
	<meta property="og:title" content="Únete a Creta | Comunidad de Aprendizaje Icarus" />
	<meta property="og:description" content="Creta es el laberinto de aprendizaje de Icarus. Gana sickles navegando desafíos y conviértelos en tokens SCYTHE. Visitante → Aprendiz → Constructor → Maestro." />
	<meta property="og:image" content="https://icarus.mx/creta-og.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:site_name" content="Icarus" />
	<meta property="og:locale" content="es_MX" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://icarus.mx/discord" />
	<meta property="twitter:title" content="Únete a Creta | Comunidad de Aprendizaje Icarus" />
	<meta property="twitter:description" content="Creta es el laberinto de aprendizaje de Icarus. Gana sickles navegando desafíos y conviértelos en tokens SCYTHE. Visitante → Aprendiz → Constructor → Maestro." />
	<meta property="twitter:image" content="https://icarus.mx/creta-og.png" />

	<!-- Additional SEO -->
	<meta name="keywords" content="Creta, Icarus, Discord, aprendizaje, programación, SCYTHE, sickles, comunidad" />
	<meta name="author" content="Icarus" />
	<link rel="canonical" href="https://icarus.mx/discord" />
</svelte:head>

<section class="bg-gradient-to-b from-primary-950 via-primary-900 to-primary-700 text-primary-50 min-h-screen flex items-center justify-center">
	<div class="max-w-2xl mx-auto px-6 text-center">
		<!-- Logo or Icon -->
		<div class="mb-8">
			<div class="w-24 h-24 mx-auto bg-red-500 rounded-full flex items-center justify-center text-4xl">
				🏛️
			</div>
		</div>

		<!-- Heading -->
		<h1 class="text-5xl md:text-6xl font-black mb-6">
			Bienvenido a <span class="text-red-400">Creta</span>
		</h1>

		<!-- Description -->
		<p class="text-xl md:text-2xl text-primary-200 mb-8 leading-relaxed">
			El laberinto de aprendizaje donde navegas desafíos, ganas <span class="font-bold">sickles</span>,
			y los conviertes en tokens <span class="font-bold text-red-400">SCYTHE</span>.
		</p>

		<!-- Redirect Message -->
		<div class="bg-primary-800/50 border border-primary-600 rounded-lg p-6 mb-8">
			<p class="text-lg text-primary-300">
				Redirigiendo a Discord...
			</p>
			<div class="mt-4 flex justify-center">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400"></div>
			</div>
		</div>

		<!-- Manual Link (in case auto-redirect fails) -->
		<a
			href={DISCORD_INVITE}
			class="inline-block bg-red-500 hover:bg-red-400 text-white font-bold text-lg px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
		>
			Ir a Discord ahora
		</a>

		<!-- Info -->
		<div class="mt-12 text-sm text-primary-400">
			<p>Visitante → Aprendiz → Constructor → Maestro</p>
		</div>
	</div>
</section>
