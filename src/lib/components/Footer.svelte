<script>
	let email = $state('');
	let status = $state('idle');
	let message = $state('');

	const year = new Date().getFullYear();

	async function subscribe(e) {
		e.preventDefault();
		if (!email) return;

		status = 'loading';
		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});
			const data = await res.json();

			if (res.ok) {
				status = 'success';
				message = '✓ Te avisamos.';
				email = '';
			} else {
				status = 'error';
				message = data.error || 'Error en el envío.';
			}
		} catch {
			status = 'error';
			message = 'Error de conexión.';
		}
	}
</script>

<footer class="mt-24 border-t border-ink-950/8 bg-bone-100 text-ink-950 font-primary">
	<div class="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-14 md:grid-cols-4 md:px-10">
		<!-- Brand -->
		<div class="md:col-span-2">
			<div class="flex items-center gap-2.5">
				<img src="/logo.png" alt="" class="h-7 w-auto" />
				<p class="text-lg font-extrabold tracking-tight">Icarus</p>
			</div>
			<p class="mt-4 max-w-sm text-sm text-grey-600">
				Playeras y sudaderas con frases para los que viven en la terminal. Hecho en México, en
				lotes chicos.
			</p>

			<form onsubmit={subscribe} class="mt-6 flex max-w-sm flex-col gap-2 sm:flex-row">
				<input
					type="email"
					bind:value={email}
					placeholder="tucorreo@dominio.mx"
					disabled={status === 'loading'}
					class="flex-1 rounded-full border border-ink-950/15 bg-bone-50 px-4 py-2.5 text-sm text-ink-950 placeholder-grey-500 focus:border-ink-950 focus:outline-none"
				/>
				<button
					type="submit"
					disabled={status === 'loading'}
					class="rounded-full bg-ink-950 px-5 py-2.5 text-sm font-bold text-bone-50 transition-colors hover:bg-ink-800 disabled:opacity-50"
				>
					{status === 'loading' ? '...' : 'Avísame'}
				</button>
			</form>
			{#if message}
				<p class="mt-2 text-xs {status === 'success' ? 'text-ink-950' : 'text-tomato-600'}">
					{message}
				</p>
			{/if}
		</div>

		<div>
			<h3 class="mb-4 font-mono text-[10px] font-bold tracking-widest text-grey-600 uppercase">
				Tienda
			</h3>
			<ul class="space-y-2 text-sm">
				<li>
					<a href="/tienda" class="text-ink-950 hover:opacity-60">Toda la mercancía</a>
				</li>
				<li>
					<a href="/tienda#playeras" class="text-ink-950 hover:opacity-60">Playeras</a>
				</li>
				<li>
					<a href="/tienda#sudaderas" class="text-ink-950 hover:opacity-60">Sudaderas</a>
				</li>
			</ul>
		</div>

		<div>
			<h3 class="mb-4 font-mono text-[10px] font-bold tracking-widest text-grey-600 uppercase">
				Info
			</h3>
			<ul class="space-y-2 text-sm">
				<li>
					<a href="/#sobre" class="text-ink-950 hover:opacity-60">Sobre Icarus</a>
				</li>
				<li>
					<a href="/#contacto" class="text-ink-950 hover:opacity-60">Contacto</a>
				</li>
				<li>
					<a href="/#contacto" class="text-ink-950 hover:opacity-60">Envíos y cambios</a>
				</li>
			</ul>
		</div>
	</div>

	<div class="border-t border-ink-950/8">
		<div
			class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-xs md:flex-row md:px-10"
		>
			<p class="text-grey-600">&copy; {year} Icarus · Hecho en México con cariño y café</p>
			<div class="flex gap-5">
				<a
					href="https://www.instagram.com/icarus.mx"
					aria-label="Instagram"
					class="text-grey-600 transition-colors hover:text-ink-950"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							d="M7.75 2C5.12665 2 3 4.12665 3 6.75V17.25C3 19.8734 5.12665 22 7.75 22H16.25C18.8734 22 21 19.8734 21 17.25V6.75C21 4.12665 18.8734 2 16.25 2H7.75ZM7.75 4H16.25C17.4926 4 18.5 5.00736 18.5 6.25V17.75C18.5 18.9926 17.4926 20 16.25 20H7.75C6.50736 20 5.5 18.9926 5.5 17.75V6.25C5.5 5.00736 6.50736 4 7.75 4ZM12 7C9.51472 7 7.5 9.01472 7.5 11.5C7.5 13.9853 9.51472 16 12 16C14.4853 16 16.5 13.9853 16.5 11.5C16.5 9.01472 14.4853 7 12 7ZM12 9C13.3807 9 14.5 10.1193 14.5 11.5C14.5 12.8807 13.3807 14 12 14C10.6193 14 9.5 12.8807 9.5 11.5C9.5 10.1193 10.6193 9 12 9ZM17.5 6.25C17.5 6.66421 17.1642 7 16.75 7C16.3358 7 16 6.66421 16 6.25C16 5.83579 16.3358 5.5 16.75 5.5C17.1642 5.5 17.5 5.83579 17.5 6.25Z"
						/>
					</svg>
				</a>
				<a
					href="https://wa.me/525548017016"
					aria-label="WhatsApp"
					class="text-grey-600 transition-colors hover:text-ink-950"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="h-5 w-5 fill-current">
						<path
							d="M16 .396c-8.837 0-16 7.163-16 16 0 2.82.735 5.59 2.13 8.031L0 32l7.745-2.021c2.355 1.29 5.028 1.97 7.794 1.97 8.837 0 16-7.163 16-16S24.837.396 16 .396zm0 29.202c-2.475 0-4.9-.661-7.03-1.916l-.506-.295-4.6 1.201 1.226-4.48-.313-.515a13.393 13.393 0 01-2.08-7.094c0-7.433 6.048-13.481 13.481-13.481S29.481 7.963 29.481 15.396 23.433 29.598 16 29.598z"
						/>
					</svg>
				</a>
			</div>
		</div>
	</div>
</footer>
