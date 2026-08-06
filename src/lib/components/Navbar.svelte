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

	const links = [{ label: 'Contacto', href: '/#contacto' }];
</script>

<!-- Mobile: no bar — just the hamburger floating over the render. The bar is md+. -->
<nav
	class="fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 md:sticky {mobileOpen
		? 'bg-bone-50'
		: 'bg-transparent'} {scrolled
		? 'md:border-ink-950/8 md:bg-bone-50/85 md:border-b md:backdrop-blur-md'
		: 'md:border-b md:border-transparent'}"
>
	<div
		class="mx-auto flex max-w-7xl items-center justify-end px-5 py-4 md:justify-between md:px-10"
	>
		<a
			href="/"
			class="text-ink-950 hidden items-center gap-2.5 transition-opacity hover:opacity-70 md:flex"
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
						class="text-ink-950 text-sm font-semibold transition-opacity hover:opacity-60"
					>
						{link.label}
					</a>
				</li>
			{/each}
			<li>
				<a
					href="/"
					class="bg-ink-950 text-bone-50 hover:bg-ink-800 rounded-full px-5 py-2 text-sm font-bold transition-colors"
				>
					Ver el drop
				</a>
			</li>
		</ul>

		<!-- Mobile toggle: a floating chip, since there's no bar behind it -->
		<button
			onclick={() => (mobileOpen = !mobileOpen)}
			class="text-ink-950 border-ink-950/15 bg-bone-50/85 shadow-ink-950/10 flex h-10 w-10 items-center justify-center rounded-full border shadow-lg backdrop-blur transition-transform active:scale-95 md:hidden"
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

	<!-- Mobile menu: lives inside the fixed nav so it drops from the top edge -->
	{#if mobileOpen}
		<ul
			class="border-ink-950/8 bg-bone-50 flex flex-col border-b md:hidden"
			in:slide={{ duration: 250 }}
			out:slide={{ duration: 250 }}
		>
			{#each links as link (link.href)}
				<li class="border-ink-950/8 border-t">
					<a
						href={link.href}
						class="text-ink-950 hover:bg-bone-100 flex items-center justify-between px-5 py-4 text-base font-semibold"
						onclick={() => (mobileOpen = false)}
					>
						<span>{link.label}</span>
						<span aria-hidden="true" class="text-grey-500">→</span>
					</a>
				</li>
			{/each}
			<li class="border-ink-950/8 border-t p-4">
				<a
					href="/"
					class="bg-ink-950 text-bone-50 flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold"
					onclick={() => (mobileOpen = false)}
				>
					Ver el drop
				</a>
			</li>
		</ul>
	{/if}
</nav>
