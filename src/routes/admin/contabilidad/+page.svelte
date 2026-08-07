<script>
	import StatTile from '$lib/components/admin/StatTile.svelte';
	import { money, moneyExact, monthName, pct } from '$lib/admin/format.js';
	import { unitsToCover } from '$lib/finanzas.js';

	let { data } = $props();
	let eq = $derived(data.eq);
	let be = $derived(eq.breakEven);
	let w = $derived(eq.warnings);

	const catLabels = {
		marketing: 'Marketing',
		plataforma: 'Plataforma',
		almacen: 'Almacén',
		equipo: 'Equipo',
		produccion: 'Producción',
		envio: 'Envíos',
		otro: 'Otro'
	};
</script>

<svelte:head>
	<title>Punto de equilibrio — Icarus Admin</title>
</svelte:head>

<div class="mb-4 flex flex-wrap items-center gap-2">
	{#each data.months as m (m)}
		<a
			href="?mes={m}"
			class="rounded-full px-3 py-1 text-xs font-medium capitalize transition
			{m === eq.month ? 'bg-ink-950 text-bone-50' : 'bg-bone-100 text-grey-500 hover:text-ink-950'}"
		>
			{monthName(m)}
		</a>
	{/each}
</div>

{#if w.noProducts}
	<p class="bg-tomato-500/10 text-tomato-600 mb-4 rounded-lg px-4 py-3 text-sm font-medium">
		No hay productos activos en el catálogo.
	</p>
{:else if w.missingCost.length > 0}
	<p class="mb-4 rounded-lg bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
		<span class="font-semibold">Faltan costos unitarios.</span>
		{w.missingCost.length}
		{w.missingCost.length === 1 ? 'producto no tiene' : 'productos no tienen'} costo capturado, así que
		el margen de abajo está inflado.
		<a href="/admin/contabilidad/costos" class="font-medium underline">Capturarlos →</a>
	</p>
{/if}

{#if w.negativeMargin && !w.noProducts}
	<p class="bg-tomato-500/10 text-tomato-600 mb-4 rounded-lg px-4 py-3 text-sm">
		<span class="font-semibold">Margen de contribución negativo.</span>
		Cada pieza pierde dinero, así que no hay volumen que alcance el equilibrio. Sube el precio o baja
		el costo antes de invertir en marketing.
	</p>
{/if}

{#if w.doubleCountedAds}
	<p class="mb-4 rounded-lg bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
		<span class="font-semibold">Posible doble conteo.</span>
		Tienes {money(w.doubleCountedAds.marketingFixed)} como costo fijo de marketing y
		{money(w.doubleCountedAds.adSpendCaptured)} de gasto capturado en el embudo este mes. Si es el mismo
		dinero, quítalo de un lado.
	</p>
{/if}

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
	<StatTile
		label="Punto de equilibrio"
		value={be.units === null ? '—' : `${be.units} pzas`}
		note={be.units === null ? 'sin margen positivo' : `${money(be.netRevenue)} de ingreso neto`}
	/>
	<StatTile
		label="Costos fijos del mes"
		value={money(eq.fixed.total)}
		note="{eq.fixed.recurring.length} recurrentes + gastos sueltos"
		goodWhenUp={false}
	/>
	<StatTile
		label="Margen de contribución"
		value={money(Math.round(eq.blended.contribution))}
		note="{pct(eq.blended.contributionPct)} · mezcla por {eq.blended.source === 'ventas'
			? 'ventas reales'
			: 'catálogo (sin historial)'}"
	/>
	<StatTile
		label="Avance del mes"
		value="{eq.progress.units} pzas"
		note={eq.progress.remaining === null
			? 'sin meta calculable'
			: eq.progress.remaining === 0
				? '✓ equilibrio alcanzado'
				: `faltan ${eq.progress.remaining} pzas`}
	/>
</div>

{#if be.viable}
	<div class="border-bone-200 bg-bone-100 mt-4 rounded-2xl border p-5">
		<div class="flex flex-wrap items-baseline justify-between gap-2">
			<h2 class="text-ink-950 font-semibold">Camino al equilibrio</h2>
			<p class="text-grey-500 text-sm tabular-nums">
				{money(eq.progress.contribution)} de {money(eq.fixed.total)} cubiertos
			</p>
		</div>
		<div class="bg-bone-200 mt-3 h-3 w-full overflow-hidden rounded-full">
			<div
				class="bg-tomato-500 h-full rounded-full transition-all"
				style="width: {Math.round((eq.progress.pct ?? 0) * 100)}%"
			></div>
		</div>
		<p class="text-grey-500 mt-2 text-xs">
			{eq.progress.units} de {be.units} piezas · cada pieza aporta ~{money(
				Math.round(eq.blended.contribution)
			)} a los costos fijos
		</p>
	</div>
{/if}

<div class="mt-4 grid gap-4 lg:grid-cols-5">
	<div class="border-bone-200 bg-bone-100 rounded-2xl border p-5 lg:col-span-3">
		<h2 class="text-ink-950 font-semibold">Cuántas piezas por producto</h2>
		<p class="text-grey-500 text-sm">Si ese producto cargara el mes solo.</p>
		{#if eq.items.length === 0}
			<p class="text-grey-500 mt-4 text-sm">Sin productos activos.</p>
		{:else}
			<table class="mt-3 w-full text-sm">
				<thead class="text-grey-500 text-left text-xs">
					<tr class="border-bone-200 border-b">
						<th class="pb-2 font-medium">Producto</th>
						<th class="pb-2 text-right font-medium">Neto</th>
						<th class="pb-2 text-right font-medium">Variable</th>
						<th class="pb-2 text-right font-medium">Margen</th>
						<th class="pb-2 text-right font-medium">Pzas</th>
					</tr>
				</thead>
				<tbody>
					{#each eq.items as it (it.id)}
						{@const need = unitsToCover(eq.fixed.total, it)}
						<tr class="border-bone-200 border-t">
							<td class="text-ink-950 max-w-45 truncate py-2 pr-3 font-mono text-xs lowercase">
								{it.name}
								{#if !it.hasCost}
									<span class="ml-1 text-amber-600" title="sin costo capturado">⚠</span>
								{/if}
							</td>
							<td class="text-grey-500 py-2 text-right tabular-nums">{money(Math.round(it.net))}</td
							>
							<td class="text-grey-500 py-2 text-right tabular-nums">{money(it.variable)}</td>
							<td
								class="py-2 text-right font-semibold tabular-nums
								{it.contribution > 0 ? 'text-ink-950' : 'text-tomato-600'}"
							>
								{money(Math.round(it.contribution))}
								<span class="text-grey-400 ml-1 text-xs font-normal"
									>{pct(it.contributionPct, 0)}</span
								>
							</td>
							<td class="text-ink-950 py-2 text-right font-semibold tabular-nums">{need ?? '—'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	<div class="border-bone-200 bg-bone-100 rounded-2xl border p-5 lg:col-span-2">
		<div class="flex items-baseline justify-between">
			<h2 class="text-ink-950 font-semibold">Costos fijos</h2>
			<a
				href="/admin/contabilidad/costos"
				class="text-tomato-600 text-sm font-medium hover:underline">Editar →</a
			>
		</div>
		{#if eq.fixed.recurring.length === 0 && eq.fixed.other.length === 0}
			<p class="text-grey-500 mt-4 text-sm">
				Sin costos fijos capturados — el equilibrio sale en cero. Da de alta los recurrentes en
				<a href="/admin/contabilidad/costos" class="text-tomato-600 hover:underline"
					>Estructura de costos</a
				>.
			</p>
		{:else}
			<ul class="mt-3 space-y-1.5 text-sm">
				{#each eq.fixed.recurring as c (c.id)}
					<li class="flex items-baseline justify-between gap-2">
						<span class="text-ink-950 truncate">{c.name}</span>
						<span class="text-grey-500 shrink-0 tabular-nums">{money(c.amount_cents)}</span>
					</li>
				{/each}
				{#each eq.fixed.other as r (r.category)}
					<li class="flex items-baseline justify-between gap-2">
						<span class="text-grey-500 truncate italic">
							{catLabels[r.category] ?? r.category} (gastos sueltos)
						</span>
						<span class="text-grey-500 shrink-0 tabular-nums">{money(r.total)}</span>
					</li>
				{/each}
			</ul>
			<div
				class="border-bone-200 text-ink-950 mt-3 flex items-baseline justify-between border-t pt-3 font-semibold"
			>
				<span>Total</span>
				<span class="tabular-nums">{moneyExact(eq.fixed.total)}</span>
			</div>
		{/if}
		<p class="text-grey-400 mt-4 text-xs">
			Producción y envíos no se cuentan aquí — ya viven en el costo variable por pieza.
		</p>
	</div>
</div>
