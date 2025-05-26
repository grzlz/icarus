<script>
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte'
	import Footer from '$lib/components/Footer.svelte';
	import { injectAnalytics } from '@vercel/analytics/sveltekit'

	injectAnalytics();


	let { children } = $props();


	const year = new Date().getFullYear();
</script>


<div class="bg-primary-950 flex flex-col min-h-screen font-primary">
	<Navbar />
	
	{@render children()}

	<Footer />
</div>