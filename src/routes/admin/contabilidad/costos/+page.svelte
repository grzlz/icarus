<script>
	import { enhance } from '$app/forms';
	import { money, monthName, pct } from '$lib/admin/format.js';

	let { data, form } = $props();

	const catLabels = {
		marketing: 'Marketing',
		plataforma: 'Plataforma',
		almacen: 'Almacén',
		equipo: 'Equipo',
		otro: 'Otro'
	};

	let vigentes = $derived(data.fixed.filter((c) => !c.ends_on));
	let mensual = $derived(vigentes.reduce((s, c) => s + c.amount_cents, 0));

	const input =
		'border-grey-400 bg-bone-50 text-ink-950 focus:border-tomato-500 focus:ring-tomato-500 w-full rounded-lg border px-3 py-2 text-sm';
	const btn =
		'bg-ink-950 text-bone-50 hover:bg-ink-800 rounded-lg px-4 py-2.5 text-sm font-semibold transition';
</script>

<svelte:head>
	<title>Estructura de costos — Icarus Admin</title>
</svelte:head>

{#if form?.error}
	<p class="bg-tomato-500/10 text-tomato-600 mb-4 rounded-lg px-4 py-2 text-sm font-medium">
		{form.error}
	</p>
{:else if form?.ok}
	<p class="mb-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600">
		{form.ok}
	</p>
{/if}

<!-- 1 · costo unitario por producto -->
<div class="border-bone-200 bg-bone-100 rounded-2xl border p-5">
	<h2 class="text-ink-950 font-semibold">Costo unitario por producto</h2>
	<p class="text-grey-500 text-sm">
		Todo lo que pagas por dejar la pieza lista para enviar: blanco, técnica y empaque. La comisión y
		el envío se cobran aparte, abajo.
	</p>
	<table class="mt-4 w-full text-sm">
		<thead class="text-grey-500 text-left text-xs">
			<tr class="border-bone-200 border-b">
				<th class="pb-2 font-medium">Producto</th>
				<th class="pb-2 text-right font-medium">Precio</th>
				<th class="pb-2 text-right font-medium">Neto</th>
				<th class="pb-2 font-medium">Costo unitario</th>
				<th class="pb-2 text-right font-medium">Variable total</th>
				<th class="pb-2 text-right font-medium">Margen</th>
			</tr>
		</thead>
		<tbody>
			{#each data.items as it (it.id)}
				<tr class="border-bone-200 border-t">
					<td class="text-ink-950 max-w-45 truncate py-2 pr-3 font-mono text-xs lowercase">
						{it.name}
						<span class="text-grey-400 ml-1">· {it.category}</span>
					</td>
					<td class="text-grey-500 py-2 text-right tabular-nums">{money(it.gross)}</td>
					<td class="text-grey-500 py-2 text-right tabular-nums">{money(Math.round(it.net))}</td>
					<td class="px-3 py-2">
						<form method="POST" action="?/cost" use:enhance class="flex gap-1.5">
							<input type="hidden" name="product_id" value={it.id} />
							<input
								type="number"
								name="cost"
								step="0.01"
								min="0"
								required
								value={(it.unitCost / 100).toFixed(2)}
								class="{input} w-28 tabular-nums {it.hasCost
									? ''
									: 'border-amber-500 bg-amber-500/5'}"
							/>
							<button type="submit" class="text-grey-400 hover:text-ink-950 text-xs font-medium"
								>Guardar</button
							>
						</form>
					</td>
					<td class="text-grey-500 py-2 text-right tabular-nums">
						{money(it.variable)}
						<span class="text-grey-400 block text-xs">
							+{money(it.commission)} com · +{money(it.shipping)} envío
						</span>
					</td>
					<td
						class="py-2 text-right font-semibold tabular-nums
						{it.contribution > 0 ? 'text-ink-950' : 'text-tomato-600'}"
					>
						{money(Math.round(it.contribution))}
						<span class="text-grey-400 block text-xs font-normal">{pct(it.contributionPct, 0)}</span
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="mt-4 grid gap-4 lg:grid-cols-3">
	<!-- 2 · variables por venta -->
	<form
		method="POST"
		action="?/params"
		use:enhance
		class="border-bone-200 bg-bone-100 h-fit space-y-3 rounded-2xl border p-5"
	>
		<h2 class="text-ink-950 font-semibold">Variables por venta</h2>
		<p class="text-grey-500 text-sm">
			Se restan de cada pieza vendida, sin importar cuál sea. Aplican a todo el catálogo.
		</p>
		<label class="text-grey-500 block text-xs font-medium">
			Comisión de pasarela (% sobre el bruto)
			<input
				type="number"
				name="comision_pct"
				step="0.1"
				min="0"
				max="99"
				required
				value={data.params.comision_pct}
				class="{input} mt-1 tabular-nums"
			/>
		</label>
		<label class="text-grey-500 block text-xs font-medium">
			Envío promedio absorbido por venta ($)
			<input
				type="number"
				name="envio"
				step="0.01"
				min="0"
				required
				value={(data.params.envio_cents / 100).toFixed(2)}
				class="{input} mt-1 tabular-nums"
			/>
		</label>
		<button type="submit" class="{btn} w-full">Guardar</button>
		<p class="text-grey-400 text-xs">
			Deja el envío en 0 si lo cobras completo al cliente. El IVA (16%) se descuenta siempre: los
			ingresos aquí son netos.
		</p>
	</form>

	<!-- 3 · costos fijos recurrentes -->
	<div class="border-bone-200 bg-bone-100 rounded-2xl border p-5 lg:col-span-2">
		<div class="flex flex-wrap items-baseline justify-between gap-2">
			<h2 class="text-ink-950 font-semibold">Costos fijos mensuales</h2>
			<p class="text-grey-500 text-sm">
				Vigente: <span class="text-ink-950 font-semibold tabular-nums">{money(mensual)}</span> /mes
			</p>
		</div>
		<p class="text-grey-500 mt-1 text-sm">
			Se dan de alta una vez y cuentan solos cada mes hasta que los cierres.
		</p>

		<form method="POST" action="?/fixed" use:enhance class="mt-4 grid gap-2 sm:grid-cols-5">
			<input
				type="text"
				name="name"
				required
				placeholder="Concepto"
				class="{input} sm:col-span-2"
			/>
			<select name="category" required class={input}>
				{#each data.categories as c (c)}
					<option value={c}>{catLabels[c]}</option>
				{/each}
			</select>
			<input
				type="number"
				name="amount"
				step="0.01"
				min="0.01"
				required
				placeholder="$ /mes"
				class="{input} tabular-nums"
			/>
			<input type="hidden" name="starts_on" value={data.thisMonth} />
			<button type="submit" class={btn}>Alta</button>
		</form>

		{#if data.fixed.length === 0}
			<p class="text-grey-500 mt-4 text-sm">
				Sin costos fijos. Mientras estén vacíos, el punto de equilibrio sale en cero piezas.
			</p>
		{:else}
			<table class="mt-4 w-full text-sm">
				<tbody>
					{#each data.fixed as c (c.id)}
						<tr class="border-bone-200 border-t {c.ends_on ? 'opacity-50' : ''}">
							<td class="text-ink-950 py-2 pr-3">{c.name}</td>
							<td class="py-2 pr-3">
								<span
									class="bg-bone-200 text-grey-600 rounded-full px-2.5 py-0.5 text-xs font-medium"
								>
									{catLabels[c.category] ?? c.category}
								</span>
							</td>
							<td class="text-grey-500 py-2 pr-3 text-xs whitespace-nowrap capitalize">
								desde {monthName(c.starts_on)}{c.ends_on ? ` · hasta ${monthName(c.ends_on)}` : ''}
							</td>
							<td class="text-ink-950 py-2 pr-3 text-right font-semibold tabular-nums">
								{money(c.amount_cents)}
							</td>
							<td class="py-2 text-right whitespace-nowrap">
								{#if !c.ends_on}
									<form method="POST" action="?/close" use:enhance class="inline">
										<input type="hidden" name="fixed_id" value={c.id} />
										<input type="hidden" name="month" value={data.thisMonth} />
										<button
											type="submit"
											class="text-grey-400 hover:text-ink-950 text-xs font-medium">Cerrar</button
										>
									</form>
								{/if}
								<form
									method="POST"
									action="?/remove"
									use:enhance
									class="ml-2 inline"
									onsubmit={(ev) => {
										if (!confirm('¿Eliminar este costo fijo? Se borra de todos los meses.'))
											ev.preventDefault();
									}}
								>
									<input type="hidden" name="fixed_id" value={c.id} />
									<button
										type="submit"
										class="text-grey-400 hover:text-tomato-600 text-xs font-medium">Eliminar</button
									>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<p class="text-grey-400 mt-3 text-xs">
				<span class="font-medium">Cerrar</span> lo deja contando hasta este mes y lo apaga después —
				el histórico se conserva. <span class="font-medium">Eliminar</span> lo borra de todos los meses.
			</p>
		{/if}
	</div>
</div>
