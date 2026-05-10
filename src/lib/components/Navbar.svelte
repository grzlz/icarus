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
		{ label: 'Colecciones', href: '/tienda#colecciones' },
		{ label: 'Diario', href: '/diario' },
		{ label: 'Misión', href: '/mision' },
		{ label: 'Contacto', href: '/#contacto' }
	];
</script>

<nav
	class="sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 {scrolled
		? 'bg-cream-100/95 border-b border-stone-600/15 shadow-sm'
		: 'border-b border-transparent bg-transparent'}"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
		<a
			href="/"
			class="text-charcoal-900 hover:text-forest-700 text-xl font-extrabold tracking-[0.18em] uppercase transition-colors"
		>
			Icarus
		</a>

		<!-- Desktop menu -->
		<ul class="hidden items-center gap-8 md:flex">
			{#each links as link (link.href)}
				<li>
					<a
						href={link.href}
						class="text-charcoal-800 hover:text-forest-700 text-sm font-medium tracking-wide transition-colors"
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>

		<!-- Mobile toggle -->
		<button
			onclick={() => (mobileOpen = !mobileOpen)}
			class="text-charcoal-900 md:hidden"
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
		class="bg-cream-100 flex flex-col border-b border-stone-600/15 md:hidden"
		in:slide={{ duration: 300 }}
		out:slide={{ duration: 300 }}
	>
		{#each links as link (link.href)}
			<li class="border-t border-stone-600/10">
				<a
					href={link.href}
					class="text-charcoal-900 hover:bg-cream-200 flex items-center justify-between px-6 py-4 text-base font-medium"
					onclick={() => (mobileOpen = false)}
				>
					<span>{link.label}</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 text-stone-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				</a>
			</li>
		{/each}
	</ul>
{/if}
