<script>
	import { enhance } from '$app/forms';
	import { shortDateTime } from '$lib/admin/format.js';

	let { data, form } = $props();

	// stock matrix: productId → { size → qty }
	let matrix = $derived.by(() => {
		const m = new Map();
		for (const row of data.stock) {
			if (!m.has(row.product_id)) m.set(row.product_id, {});
			m.get(row.product_id)[row.size] = row.stock;
		}
		return m;
	});
	const cellStock = (pid, size) => matrix.get(pid)?.[size] ?? 0;

	const reasonLabels = {
		compra: 'Entrada (compra)',
		ajuste: 'Ajuste (+/-)',
		merma: 'Merma',
		devolucion: 'Devolución'
	};

	const input =
		'border-grey-400 bg-bone-50 text-ink-950 focus:border-tomato-500 focus:ring-tomato-500 w-full rounded-lg border px-3 py-2 text-sm';
</script>

<svelte:head>
	<title>Inventario — Icarus Admin</title>
</svelte:head>

<h1 class="text-ink-950 mb-6 text-2xl font-bold">Inventario</h1>

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
	<div class="border-bone-200 bg-bone-100 overflow-x-auto rounded-2xl border p-5 lg:col-span-2">
		<h2 class="text-ink-950 font-semibold">Existencias por talla</h2>
		<table class="mt-3 w-full min-w-[36rem] text-sm">
			<thead>
				<tr class="text-grey-500 text-left">
					<th class="py-2 pr-3 font-medium">Producto</th>
					{#each data.sizes as size (size)}
						<th class="px-2 py-2 text-center font-medium">{size}</th>
					{/each}
					<th class="py-2 pl-2 text-right font-medium">Costo unit.</th>
				</tr>
			</thead>
			<tbody>
				{#each data.products as p (p.id)}
					<tr class="border-bone-200 border-t">
						<td class="py-2 pr-3">
							<span class="text-ink-950 font-mono lowercase">{p.name}</span>
							<span class="text-grey-400 ml-1 text-xs capitalize">{p.category}</span>
						</td>
						{#each data.sizes as size (size)}
							{@const qty = cellStock(p.id, size)}
							<td
								class="px-2 py-2 text-center tabular-nums {qty === 0
									? 'text-grey-400'
									: qty <= 3
										? 'font-semibold text-amber-600'
										: 'text-ink-950'}"
							>
								{qty}
							</td>
						{/each}
						<td class="py-2 pl-2 text-right">
							<form
								method="POST"
								action="?/setCost"
								use:enhance
								class="inline-flex items-center justify-end gap-1"
							>
								<input type="hidden" name="product_id" value={p.id} />
								<input
									type="number"
									name="cost"
									step="0.01"
									min="0"
									value={(p.cost_cents / 100).toFixed(0)}
									class="{input} w-20 py-1 text-right tabular-nums"
									aria-label="Costo unitario de {p.name}"
								/>
								<button type="submit" class="text-grey-500 hover:text-ink-950 text-xs font-medium"
									>Guardar</button
								>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<p class="text-grey-500 mt-3 text-xs">
			El costo unitario alimenta el valor de inventario del panel. Precios de venta se sincronizan
			del catálogo.
		</p>
	</div>

	<div class="space-y-4">
		<form
			method="POST"
			action="?/move"
			use:enhance
			class="border-bone-200 bg-bone-100 space-y-3 rounded-2xl border p-5"
		>
			<h2 class="text-ink-950 font-semibold">Registrar movimiento</h2>
			<select name="product_id" required class={input}>
				<option value="" disabled selected>Producto…</option>
				{#each data.products as p (p.id)}
					<option value={p.id}>{p.name}</option>
				{/each}
			</select>
			<div class="grid grid-cols-2 gap-3">
				<select name="size" required class={input}>
					{#each data.sizes as size (size)}
						<option value={size}>{size}</option>
					{/each}
				</select>
				<input type="number" name="qty" required placeholder="Cantidad" class={input} />
			</div>
			<select name="reason" required class={input}>
				{#each data.reasons as r (r)}
					<option value={r}>{reasonLabels[r]}</option>
				{/each}
			</select>
			<input type="text" name="note" placeholder="Nota (opcional)" class={input} />
			<button
				type="submit"
				class="bg-ink-950 text-bone-50 hover:bg-ink-800 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition"
			>
				Registrar
			</button>
		</form>

		<form
			method="POST"
			action="?/addProduct"
			use:enhance
			class="border-bone-200 bg-bone-100 space-y-3 rounded-2xl border p-5"
		>
			<h2 class="text-ink-950 font-semibold">Nuevo producto</h2>
			<input type="text" name="name" required placeholder="Nombre / frase" class={input} />
			<div class="grid grid-cols-3 gap-3">
				<select name="category" class="{input} col-span-1">
					<option value="playera">Playera</option>
					<option value="sudadera">Sudadera</option>
					<option value="otro">Otro</option>
				</select>
				<input
					type="number"
					name="price"
					step="0.01"
					min="1"
					required
					placeholder="Precio $"
					class={input}
				/>
				<input type="number" name="cost" step="0.01" min="0" placeholder="Costo $" class={input} />
			</div>
			<button
				type="submit"
				class="border-ink-950 text-ink-950 hover:bg-ink-950 hover:text-bone-50 w-full rounded-lg border px-4 py-2.5 text-sm font-semibold transition"
			>
				Crear
			</button>
		</form>
	</div>
</div>

<div class="border-bone-200 bg-bone-100 mt-4 rounded-2xl border p-5">
	<h2 class="text-ink-950 font-semibold">Últimos movimientos</h2>
	{#if data.movements.length === 0}
		<p class="text-grey-500 mt-3 text-sm">
			Sin movimientos todavía — registra una entrada de compra para iniciar el stock.
		</p>
	{:else}
		<table class="mt-3 w-full text-sm">
			<tbody>
				{#each data.movements as m (m.id)}
					<tr class="border-bone-200 border-t">
						<td class="text-grey-500 py-2 pr-3 whitespace-nowrap">{shortDateTime(m.created_at)}</td>
						<td class="text-ink-950 py-2 pr-3 font-mono lowercase">{m.product_name} · {m.size}</td>
						<td class="py-2 pr-3 capitalize">{m.reason}{m.note ? ` — ${m.note}` : ''}</td>
						<td
							class="py-2 text-right font-semibold tabular-nums {m.qty > 0
								? 'text-emerald-600'
								: 'text-tomato-600'}"
						>
							{m.qty > 0 ? '+' : ''}{m.qty}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
