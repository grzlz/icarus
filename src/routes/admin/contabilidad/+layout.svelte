<script>
	import { page } from '$app/state';
	let { children } = $props();

	const tabs = [
		{ href: '/admin/contabilidad', label: 'Punto de equilibrio' },
		{ href: '/admin/contabilidad/costos', label: 'Estructura de costos' },
		{ href: '/admin/contabilidad/embudo', label: 'Embudo y pronóstico' }
	];

	let current = $derived(page.url.pathname);
	const isActive = (href) =>
		href === '/admin/contabilidad' ? current === href : current.startsWith(href);
</script>

<div class="mb-6 flex flex-wrap items-center gap-4">
	<h1 class="text-ink-950 text-2xl font-bold">Contabilidad</h1>
	<nav class="flex flex-wrap gap-1 text-sm font-medium">
		{#each tabs as tab (tab.href)}
			<a
				href={tab.href}
				class="rounded-full px-3 py-1 transition
				{isActive(tab.href) ? 'bg-tomato-500/10 text-tomato-600' : 'text-grey-500 hover:text-ink-950'}"
			>
				{tab.label}
			</a>
		{/each}
	</nav>
</div>

{@render children()}
