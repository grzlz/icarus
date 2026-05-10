<script>
	import '../app.css';
	import { page } from '$app/state';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	let { children } = $props();

	let canonicalUrl = $derived(`https://icarus.mx${page.url.pathname}`);
</script>

<svelte:head>
	<link rel="canonical" href={canonicalUrl} />
</svelte:head>

<div class="bg-bone-50 text-ink-950 font-primary flex min-h-screen flex-col">
	<Navbar />

	{@render children()}

	<Footer />
</div>

<ThemeToggle />
