<script>
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte'

	let { children } = $props();
</script>

<div class="bg-primary-950 flex flex-col min-h-screen font-primary">
<Navbar />
	{@render children()}
</div>
