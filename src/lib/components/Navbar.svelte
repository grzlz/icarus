<script>
	import { track } from '$lib/ab/client.js';

	let { count = 0 } = $props();

	let scrolled = $state(false);
</script>

<svelte:window onscroll={() => (scrolled = window.scrollY > 24)} />

<!-- One thin masthead bar. Logo and name left; the only two things a shopper
     needs on the right: how big the drop is, and how to order. -->
<nav
	class="bg-bone-50/90 sticky top-0 z-50 border-b backdrop-blur-md transition-colors {scrolled
		? 'rule'
		: 'border-transparent'}"
>
	<div class="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3.5 md:px-10">
		<a
			href="/"
			class="text-ink-950 flex items-center gap-2.5 transition-opacity hover:opacity-70"
			aria-label="Icarus, inicio"
		>
			<img src="/logo.png" alt="" class="h-6 w-auto" />
			<span class="wordmark text-xl">Icarus</span>
		</a>

		<div class="flex items-center gap-5 md:gap-8">
			{#if count}
				<a href="/#catalogo" class="label text-grey-600 hover:text-ink-950 hidden sm:inline">
					{count} piezas
				</a>
			{/if}
			<a
				href="https://wa.me/525548017016"
				target="_blank"
				rel="noopener"
				onclick={() => track('whatsapp', { meta: 'navbar' })}
				class="text-ink-950 text-sm font-semibold transition-opacity hover:opacity-60"
			>
				Pedidos <span aria-hidden="true">↗</span>
			</a>
		</div>
	</div>
</nav>
