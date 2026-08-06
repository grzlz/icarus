<script>
	import { enhance } from '$app/forms';
	import { money, shortDateTime } from '$lib/admin/format.js';

	let { data, form } = $props();

	let selectedId = $state('');
	// El precio se precarga del catálogo pero es editable (descuentos, promos).
	let price = $state('');
	let selected = $derived(data.products.find((p) => p.id === Number(selectedId)));
	$effect(() => {
		if (selected) price = (selected.price_cents / 100).toFixed(0);
	});

	const input =
		'border-grey-400 bg-bone-50 text-ink-950 focus:border-tomato-500 focus:ring-tomato-500 w-full rounded-lg border px-3 py-2 text-sm';
</script>

<svelte:head>
	<title>Ventas — Icarus Admin</title>
</svelte:head>

<h1 class="text-ink-950 mb-6 text-2xl font-bold">Ventas</h1>

{#if form?.error}
	<p class="bg-tomato-500/10 text-tomato-600 mb-4 rounded-lg px-4 py-2 text-sm font-medium">
		{form.error}
	</p>
{:else if form?.ok}
	<p class="mb-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600">
		{form.ok}
	</p>
{/if}

<div class="grid gap-4 lg:grid-cols-3">
	<form
		method="POST"
		action="?/create"
		use:enhance
		class="border-bone-200 bg-bone-100 h-fit space-y-3 rounded-2xl border p-5"
	>
		<h2 class="text-ink-950 font-semibold">Registrar venta</h2>
		<select name="product_id" bind:value={selectedId} required class={input}>
			<option value="" disabled>Producto…</option>
			{#each data.products as p (p.id)}
				<option value={p.id}>{p.name} — {money(p.price_cents)}</option>
			{/each}
		</select>
		<div class="grid grid-cols-3 gap-3">
			<select name="size" required class={input}>
				{#each data.sizes as size (size)}
					<option value={size}>{size}</option>
				{/each}
			</select>
			<input
				type="number"
				name="qty"
				min="1"
				value="1"
				required
				class={input}
				aria-label="Cantidad"
			/>
			<input
				type="number"
				name="price"
				step="0.01"
				min="1"
				bind:value={price}
				required
				class="{input} tabular-nums"
				aria-label="Precio unitario"
				placeholder="Precio $"
			/>
		</div>
		<select name="channel" required class={input}>
			{#each data.channels as c (c)}
				<option value={c}
					>{c === 'directa' ? 'Venta directa' : c === 'web' ? 'Web' : 'Evento'}</option
				>
			{/each}
		</select>
		<input type="text" name="customer" placeholder="Cliente (opcional)" class={input} />
		<input type="text" name="note" placeholder="Nota (opcional)" class={input} />
		<button
			type="submit"
			class="bg-tomato-500 hover:bg-tomato-600 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition"
		>
			Cobrar
		</button>
		<p class="text-grey-500 text-xs">
			El precio incluye IVA (16%). La venta descuenta stock automáticamente.
		</p>
	</form>

	<div class="border-bone-200 bg-bone-100 overflow-x-auto rounded-2xl border p-5 lg:col-span-2">
		<h2 class="text-ink-950 font-semibold">Historial</h2>
		{#if data.sales.length === 0}
			<p class="text-grey-500 mt-3 text-sm">Todavía no hay ventas. La primera aparecerá aquí.</p>
		{:else}
			<table class="mt-3 w-full min-w-[32rem] text-sm">
				<thead>
					<tr class="text-grey-500 text-left">
						<th class="py-2 pr-3 font-medium">Fecha</th>
						<th class="py-2 pr-3 font-medium">Artículos</th>
						<th class="py-2 pr-3 font-medium">Canal</th>
						<th class="py-2 pr-3 text-right font-medium">Total</th>
						<th class="py-2"></th>
					</tr>
				</thead>
				<tbody>
					{#each data.sales as sale (sale.id)}
						<tr class="border-bone-200 border-t {sale.status === 'cancelada' ? 'opacity-50' : ''}">
							<td class="text-grey-500 py-2 pr-3 whitespace-nowrap"
								>{shortDateTime(sale.created_at)}</td
							>
							<td class="text-ink-950 py-2 pr-3">
								{sale.summary}
								{#if sale.customer}<span class="text-grey-400"> — {sale.customer}</span>{/if}
							</td>
							<td class="text-grey-500 py-2 pr-3 capitalize">{sale.channel}</td>
							<td
								class="py-2 pr-3 text-right font-semibold tabular-nums {sale.status === 'cancelada'
									? 'line-through'
									: ''}"
							>
								{money(sale.total_cents)}
							</td>
							<td class="py-2 text-right">
								{#if sale.status === 'completada'}
									<form
										method="POST"
										action="?/cancel"
										use:enhance
										onsubmit={(e) => {
											if (!confirm('¿Cancelar esta venta? El stock se devuelve.'))
												e.preventDefault();
										}}
									>
										<input type="hidden" name="sale_id" value={sale.id} />
										<button
											type="submit"
											class="text-grey-400 hover:text-tomato-600 text-xs font-medium"
										>
											Cancelar
										</button>
									</form>
								{:else}
									<span class="text-grey-400 text-xs">cancelada</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>
