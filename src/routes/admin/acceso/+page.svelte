<script>
	let { form } = $props();
</script>

<svelte:head>
	<title>Acceso — Icarus Admin</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-[70vh] items-center justify-center px-6">
	<form method="POST" class="w-full max-w-sm space-y-4">
		<h1 class="font-mono text-2xl font-bold lowercase">/admin</h1>
		<p class="text-grey-500 text-sm">Sistema de contabilidad e inventario.</p>
		<input
			type="password"
			name="key"
			placeholder="Clave de acceso"
			required
			autocomplete="current-password"
			class="border-grey-400 bg-bone-100 text-ink-950 focus:border-tomato-500 focus:ring-tomato-500 w-full rounded-lg border px-4 py-3"
		/>
		{#if form?.error}
			<p class="text-tomato-600 text-sm font-medium">{form.error}</p>
		{/if}
		<button
			type="submit"
			class="bg-ink-950 text-bone-50 hover:bg-ink-800 w-full rounded-lg px-4 py-3 font-semibold transition"
		>
			Entrar
		</button>
	</form>
</div>
