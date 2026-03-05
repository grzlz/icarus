<script>
	import '../app.css';
	import { page } from '$app/state';
	import Navbar from '$lib/components/Navbar.svelte'
	import Footer from '$lib/components/Footer.svelte';
	let { children } = $props();

	const year = new Date().getFullYear();
	let canonicalUrl = $derived(`https://icarus.mx${page.url.pathname}`);
</script>

<svelte:head>
	<link rel="canonical" href={canonicalUrl} />
</svelte:head>

<div class="app-gradient flex flex-col min-h-screen font-primary">
	<Navbar />
	
	{@render children()}

	<Footer />
</div>