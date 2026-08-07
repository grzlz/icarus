<script>
	import { enhance } from '$app/forms';
	import Escenario from '$lib/components/admin/Escenario.svelte';
	import { money, monthName, pct } from '$lib/admin/format.js';

	let { data, form } = $props();

	const chanLabels = {
		meta: 'Meta Ads',
		google: 'Google',
		organico: 'Orgánico',
		instagram: 'Instagram',
		evento: 'Evento',
		otro: 'Otro'
	};

	/* Marketing already counted as a recurring fixed cost is subtracted out —
	 * the scenario's budget knob is the only place ad money is charged. */
	let fixedSinAds = $derived(data.fixedCents - data.marketingFixed);

	const input =
		'border-grey-400 bg-bone-50 text-ink-950 focus:border-tomato-500 focus:ring-tomato-500 w-full rounded-lg border px-3 py-2 text-sm tabular-nums';
	const th = 'pb-2 text-right font-medium';
	const MONTH_PATTERN = '\\d{4}-\\d{2}';
</script>

<svelte:head>
	<title>Embudo y pronóstico — Icarus Admin</title>
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

<!-- 1 · escenario -->
<div class="border-bone-200 bg-bone-100 rounded-2xl border p-5">
	<div class="flex flex-wrap items-baseline justify-between gap-2">
		<h2 class="text-ink-950 font-semibold">Pronóstico de ingresos</h2>
		<p class="text-grey-500 text-xs">
			{data.rates.months === 0
				? 'Sin historial capturado — los valores son supuestos'
				: data.rates.months === 1
					? 'Arrancado con tu único registro capturado'
					: `Arrancado con tus últimos ${data.rates.months} registros`}
		</p>
	</div>
	<p class="text-grey-500 text-sm">
		Mueve los supuestos. El presupuesto de ads se cuenta como costo encima de los fijos, así que la
		utilidad de abajo ya lo trae descontado.
	</p>

	{#key data.rates}
		<Escenario
			rates={data.rates}
			fixedCents={fixedSinAds}
			contributionPct={data.contributionPct}
			blendedGross={data.blendedGross}
			mixSource={data.mixSource}
		/>
	{/key}
</div>

<!-- 2 · promedios históricos -->
{#if data.rates.months > 0}
	<div class="border-bone-200 bg-bone-100 mt-4 rounded-2xl border p-5">
		<h2 class="text-ink-950 font-semibold">Tus promedios (últimos 6 meses)</h2>
		<div class="mt-3 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
			{#each [{ l: 'CPC', v: data.rates.cpc === null ? '—' : money(data.rates.cpc) }, { l: 'Clic → sesión', v: pct(data.rates.sessionRate) }, { l: 'Sesión → checkout', v: pct(data.rates.checkoutRate) }, { l: 'Checkout → venta', v: pct(data.rates.closeRate) }, { l: 'Ticket promedio', v: data.rates.ticket === null ? '—' : money(data.rates.ticket) }, { l: 'ROAS', v: data.rates.roas === null ? '—' : `${data.rates.roas.toFixed(2)}×` }] as m (m.l)}
				<div>
					<p class="text-grey-500 text-xs">{m.l}</p>
					<p class="text-ink-950 mt-0.5 text-xl font-semibold tabular-nums">{m.v}</p>
				</div>
			{/each}
		</div>
	</div>
{/if}

<!-- 3 · captura -->
<div class="border-bone-200 bg-bone-100 mt-4 rounded-2xl border p-5">
	<h2 class="text-ink-950 font-semibold">Captura mensual por canal</h2>
	<p class="text-grey-500 text-sm">
		Cópialo del dashboard de ads una vez al mes. Guardar el mismo mes y canal sobrescribe el
		registro anterior.
	</p>

	<form
		method="POST"
		action="?/save"
		use:enhance
		class="mt-4 grid gap-2 sm:grid-cols-4 lg:grid-cols-8"
	>
		<input
			type="text"
			name="month"
			required
			pattern={MONTH_PATTERN}
			value={data.thisMonth}
			placeholder="AAAA-MM"
			class={input}
		/>
		<select name="channel" required class={input}>
			{#each data.channels as c (c)}
				<option value={c}>{chanLabels[c]}</option>
			{/each}
		</select>
		<input
			type="number"
			name="spend"
			step="0.01"
			min="0"
			value="0"
			placeholder="Gasto $"
			class={input}
		/>
		<input type="number" name="clicks" min="0" value="0" placeholder="Clics" class={input} />
		<input type="number" name="sessions" min="0" value="0" placeholder="Sesiones" class={input} />
		<input type="number" name="checkouts" min="0" value="0" placeholder="Checkouts" class={input} />
		<input type="number" name="orders" min="0" value="0" placeholder="Ventas" class={input} />
		<div class="flex gap-2">
			<input
				type="number"
				name="revenue"
				step="0.01"
				min="0"
				value="0"
				placeholder="Ingreso $"
				class={input}
			/>
			<button
				type="submit"
				class="bg-ink-950 text-bone-50 hover:bg-ink-800 shrink-0 rounded-lg px-3 py-2.5 text-sm font-semibold transition"
				>OK</button
			>
		</div>
	</form>

	{#if data.rows.length === 0}
		<p class="text-grey-500 mt-4 text-sm">
			Sin registros. El sitio todavía no tiene checkout, así que esta captura es la única fuente de
			clics y conversiones.
		</p>
	{:else}
		<div class="mt-4 overflow-x-auto">
			<table class="w-full min-w-160 text-sm">
				<thead class="text-grey-500 text-xs">
					<tr class="border-bone-200 border-b text-left">
						<th class="pb-2 font-medium">Mes</th>
						<th class="pb-2 font-medium">Canal</th>
						<th class={th}>Gasto</th>
						<th class={th}>Clics</th>
						<th class={th}>Sesiones</th>
						<th class={th}>Checkouts</th>
						<th class={th}>Ventas</th>
						<th class={th}>Ingreso</th>
						<th class={th}>CAC</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each data.rows as r (r.id)}
						<tr class="border-bone-200 border-t">
							<td class="text-ink-950 py-2 pr-3 whitespace-nowrap capitalize"
								>{monthName(r.month)}</td
							>
							<td class="text-grey-500 py-2 pr-3 whitespace-nowrap"
								>{chanLabels[r.channel] ?? r.channel}</td
							>
							<td class="text-grey-500 py-2 text-right tabular-nums">{money(r.spend_cents)}</td>
							<td class="text-grey-500 py-2 text-right tabular-nums">{r.clicks}</td>
							<td class="text-grey-500 py-2 text-right tabular-nums">{r.sessions}</td>
							<td class="text-grey-500 py-2 text-right tabular-nums">{r.checkouts}</td>
							<td class="text-ink-950 py-2 text-right font-semibold tabular-nums">{r.orders}</td>
							<td class="text-ink-950 py-2 text-right font-semibold tabular-nums"
								>{money(r.revenue_cents)}</td
							>
							<td class="text-grey-500 py-2 text-right tabular-nums">
								{r.orders > 0 ? money(Math.round(r.spend_cents / r.orders)) : '—'}
							</td>
							<td class="py-2 pl-3 text-right">
								<form
									method="POST"
									action="?/remove"
									use:enhance
									onsubmit={(ev) => {
										if (!confirm('¿Eliminar este registro?')) ev.preventDefault();
									}}
								>
									<input type="hidden" name="row_id" value={r.id} />
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
		</div>
	{/if}
</div>
