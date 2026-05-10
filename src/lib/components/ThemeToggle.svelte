<script>
	let dark = $state(false);
	let mounted = $state(false);

	$effect(() => {
		dark = document.documentElement.classList.contains('dark');
		mounted = true;

		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const onSystemChange = (e) => {
			if (localStorage.getItem('theme')) return;
			dark = e.matches;
			document.documentElement.classList.toggle('dark', e.matches);
		};
		media.addEventListener('change', onSystemChange);
		return () => media.removeEventListener('change', onSystemChange);
	});

	function toggle() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	}
</script>

{#if mounted}
	<button
		onclick={toggle}
		aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
		title={dark ? 'Modo claro' : 'Modo oscuro'}
		class="theme-toggle border-ink-950/15 text-ink-950 shadow-ink-950/10 hover:shadow-ink-950/20 fixed right-5 bottom-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border shadow-lg backdrop-blur transition-transform hover:-translate-y-0.5 md:right-8 md:bottom-8"
	>
		{#if dark}
			<!-- sun -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="4" />
				<path
					d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
				/>
			</svg>
		{:else}
			<!-- moon -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
			</svg>
		{/if}
	</button>
{/if}
