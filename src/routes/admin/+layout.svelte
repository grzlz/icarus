<script>
	import { page } from '$app/state';
	let { children } = $props();

	const tabs = [
		{ href: '/admin', label: 'Panel' },
		{ href: '/admin/inventario', label: 'Inventario' },
		{ href: '/admin/ventas', label: 'Ventas' },
		{ href: '/admin/gastos', label: 'Gastos' },
		{ href: '/admin/contabilidad', label: 'Contabilidad' },
		{ href: '/admin/experimentos', label: 'Experimentos' }
	];

	let current = $derived(page.url.pathname);
	const isActive = (href) => (href === '/admin' ? current === '/admin' : current.startsWith(href));
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-16 sm:px-6">
	{#if current !== '/admin/acceso'}
		<header class="mb-8 flex flex-wrap items-center justify-between gap-4">
			<a href="/" class="font-mono text-lg font-bold lowercase">
				icarus<span class="text-tomato-500">/admin</span>
			</a>
			<nav class="bg-bone-100 flex gap-1 rounded-full p-1 text-sm font-medium">
				{#each tabs as tab (tab.href)}
					<a
						href={tab.href}
						class="rounded-full px-4 py-1.5 transition
						{isActive(tab.href) ? 'bg-ink-950 text-bone-50' : 'text-grey-600 hover:text-ink-950'}"
					>
						{tab.label}
					</a>
				{/each}
			</nav>
		</header>
	{/if}

	{@render children()}
</div>
