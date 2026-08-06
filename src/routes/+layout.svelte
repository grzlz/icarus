<script>
	import '../app.css';
	import { page } from '$app/state';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { track } from '$lib/ab/client.js';
	let { children } = $props();

	let canonicalUrl = $derived(`https://icarus.mx${page.url.pathname}`);
	// /admin brings its own chrome — no store navbar/footer there.
	let isAdmin = $derived(page.url.pathname.startsWith('/admin'));

	// Seconds on page per route, for the experiment dashboards. Flushes once
	// per path view — on navigation, tab-hide, or close (sendBeacon survives).
	$effect(() => {
		const path = page.url.pathname;
		if (path.startsWith('/admin')) return;
		const start = Date.now();
		let sent = false;
		const flush = () => {
			if (sent) return;
			sent = true;
			const seconds = Math.round((Date.now() - start) / 1000);
			if (seconds >= 2 && seconds < 3600) track('tiempo', { value: seconds, path });
		};
		const onVisibility = () => document.visibilityState === 'hidden' && flush();
		document.addEventListener('visibilitychange', onVisibility);
		window.addEventListener('pagehide', flush);
		return () => {
			flush();
			document.removeEventListener('visibilitychange', onVisibility);
			window.removeEventListener('pagehide', flush);
		};
	});
</script>

<svelte:head>
	<link rel="canonical" href={canonicalUrl} />
</svelte:head>

<div class="bg-bone-50 text-ink-950 font-primary flex min-h-screen flex-col">
	{#if !isAdmin}
		<Navbar />
	{/if}

	{@render children()}

	{#if !isAdmin}
		<Footer />
	{/if}
</div>

<ThemeToggle />
