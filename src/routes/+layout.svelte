<script>
	import '../app.css';
	import { page } from '$app/state';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	let { children } = $props();

	let canonicalUrl = $derived(`https://icarus.mx${page.url.pathname}`);
</script>

<svelte:head>
	<link rel="canonical" href={canonicalUrl} />
</svelte:head>

<div class="bg-cream-100 text-charcoal-900 font-primary flex min-h-screen flex-col">
	<Navbar />

	{@render children()}

	<Footer />
</div>
