<script>
	import StatTile from '$lib/components/admin/StatTile.svelte';
	import WeeklyBars from '$lib/components/admin/WeeklyBars.svelte';
	import { money, delta, monthName, shortDateTime } from '$lib/admin/format.js';

	let { data } = $props();
	let s = $derived(data.stats);
</script>

<svelte:head>
	<title>Panel — Icarus Admin</title>
</svelte:head>

<div class="mb-6 flex items-baseline justify-between">
	<h1 class="text-ink-950 text-2xl font-bold">Panel</h1>
	<p class="text-grey-500 text-sm capitalize">{monthName(s.month)}</p>
</div>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
	<StatTile
		label="Ingresos del mes"
		value={money(s.income)}
		deltaPct={delta(s.income, s.incomePrev)}
		note="IVA incluido: {money(s.ivaInIncome)}"
		trend={s.weekly.map((w) => w.total)}
	/>
	<StatTile
		label="Gastos del mes"
		value={money(s.expenses)}
		deltaPct={delta(s.expenses, s.expensesPrev)}
		goodWhenUp={false}
	/>
	<StatTile
		label="Utilidad del mes"
		value={money(s.profit)}
		deltaPct={delta(s.profit, s.profitPrev)}
		note="{s.unitsSold} piezas vendidas"
	/>
	<StatTile label="Fondo GPU" value={money(s.gpuFund)} note="utilidad acumulada histórica" />
</div>

<div class="mt-4 grid gap-4 lg:grid-cols-3">
	<div class="lg:col-span-2">
		<WeeklyBars weekly={s.weekly} />
	</div>

	<div class="border-bone-200 bg-bone-100 rounded-2xl border p-5">
		<h2 class="text-ink-950 font-semibold">Stock bajo</h2>
		<p class="text-grey-500 text-sm">3 piezas o menos</p>
		{#if s.lowStock.length === 0}
			<p class="text-grey-500 mt-6 text-sm">Sin alertas — todo el catálogo tiene stock. ✓</p>
		{:else}
			<ul class="mt-4 space-y-2">
				{#each s.lowStock as item (item.id + item.size)}
					<li class="flex items-center justify-between gap-2 text-sm">
						<span class="text-ink-950 truncate font-mono lowercase">{item.name}</span>
						<span
							class="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold
							{item.stock <= 0 ? 'bg-tomato-500/15 text-tomato-600' : 'bg-amber-500/15 text-amber-600'}"
						>
							{item.stock <= 0 ? '⛔ agotado' : `⚠ ${item.stock} · ${item.size}`}
						</span>
					</li>
				{/each}
			</ul>
			<a
				href="/admin/inventario"
				class="text-tomato-600 mt-4 inline-block text-sm font-medium hover:underline"
			>
				Reabastecer →
			</a>
		{/if}
	</div>
</div>

<div class="border-bone-200 bg-bone-100 mt-4 rounded-2xl border p-5">
	<div class="flex items-baseline justify-between">
		<h2 class="text-ink-950 font-semibold">Ventas recientes</h2>
		<a href="/admin/ventas" class="text-tomato-600 text-sm font-medium hover:underline"
			>Ver todas →</a
		>
	</div>
	{#if data.sales.length === 0}
		<p class="text-grey-500 mt-4 text-sm">
			Aún no hay ventas registradas. Registra la primera en
			<a href="/admin/ventas" class="text-tomato-600 hover:underline">Ventas</a>.
		</p>
	{:else}
		<table class="mt-3 w-full text-sm">
			<tbody>
				{#each data.sales as sale (sale.id)}
					<tr class="border-bone-200 border-t">
						<td class="text-grey-500 py-2 pr-3 whitespace-nowrap"
							>{shortDateTime(sale.created_at)}</td
						>
						<td class="text-ink-950 py-2 pr-3">{sale.summary}</td>
						<td class="text-grey-500 py-2 pr-3 capitalize">{sale.channel}</td>
						<td
							class="py-2 text-right font-semibold tabular-nums
							{sale.status === 'cancelada' ? 'text-grey-400 line-through' : 'text-ink-950'}"
						>
							{money(sale.total_cents)}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
