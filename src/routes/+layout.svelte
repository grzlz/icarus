<script>
	import '../app.css';
	import { page } from '$app/state';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	let { children } = $props();

	let canonicalUrl = $derived(`https://icarus.mx${page.url.pathname}`);
	// /admin brings its own chrome — no store navbar/footer there.
	let isAdmin = $derived(page.url.pathname.startsWith('/admin'));
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
