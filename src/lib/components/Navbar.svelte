<script>
	import { slide } from 'svelte/transition';

	let mobileOpen = $state(false);
	let scrolled = $state(false);

	$effect(() => {
		function onScroll() {
			scrolled = window.scrollY > 40;
		}
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	const links = [
		{ label: 'Tienda', href: '/tienda' },
		{ label: 'Sobre', href: '/#sobre' },
		{ label: 'Contacto', href: '/#contacto' }
	];
</script>

<nav
	class="sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 {scrolled
		? 'border-b border-ink-950/8 bg-bone-50/85 backdrop-blur-md'
		: 'border-b border-transparent bg-transparent'}"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
		<a
			href="/"
			class="flex items-center gap-2.5 text-ink-950 transition-opacity hover:opacity-70"
			aria-label="Icarus"
		>
			<img src="/logo.png" alt="" class="h-7 w-auto" />
			<span class="text-lg font-extrabold tracking-tight">Icarus</span>
		</a>

		<!-- Desktop menu -->
		<ul class="hidden items-center gap-8 md:flex">
			{#each links as link (link.href)}
				<li>
					<a
						href={link.href}
						class="text-sm font-semibold text-ink-950 transition-opacity hover:opacity-60"
					>
						{link.label}
					</a>
				</li>
			{/each}
			<li>
				<a
					href="/tienda"
					class="rounded-full bg-ink-950 px-5 py-2 text-sm font-bold text-bone-50 transition-colors hover:bg-ink-800"
				>
					Comprar
				</a>
			</li>
		</ul>

		<!-- Mobile toggle -->
		<button
			onclick={() => (mobileOpen = !mobileOpen)}
			class="text-ink-950 md:hidden"
			aria-label="Abrir menú"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				{#if mobileOpen}
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				{:else}
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h16M4 17h16" />
				{/if}
			</svg>
		</button>
	</div>
</nav>

<!-- Mobile menu -->
{#if mobileOpen}
	<ul
		class="flex flex-col border-b border-ink-950/8 bg-bone-50 md:hidden"
		in:slide={{ duration: 250 }}
		out:slide={{ duration: 250 }}
	>
		{#each links as link (link.href)}
			<li class="border-t border-ink-950/8">
				<a
					href={link.href}
					class="flex items-center justify-between px-5 py-4 text-base font-semibold text-ink-950 hover:bg-bone-100"
					onclick={() => (mobileOpen = false)}
				>
					<span>{link.label}</span>
					<span aria-hidden="true" class="text-grey-500">→</span>
				</a>
			</li>
		{/each}
		<li class="border-t border-ink-950/8 p-4">
			<a
				href="/tienda"
				class="flex items-center justify-center rounded-full bg-ink-950 px-5 py-3 text-sm font-bold text-bone-50"
				onclick={() => (mobileOpen = false)}
			>
				Comprar
			</a>
		</li>
	</ul>
{/if}
