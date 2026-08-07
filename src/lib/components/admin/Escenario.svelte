<script>
	/*
	 * What-if calculator for a month of marketing. The four knobs are seeded from
	 * the captured funnel history, so the first render projects your own numbers
	 * rather than invented defaults — the parent keys this component on `rates`
	 * so saving a new month re-seeds instead of stranding you on stale figures.
	 *
	 * `fixedCents` must EXCLUDE ad spend: the budget is a knob, and counting it
	 * on both sides would double it.
	 */
	import { money, pct } from '$lib/admin/format.js';
	import { projectMonth, netOf } from '$lib/finanzas.js';

	let { rates, fixedCents, contributionPct, blendedGross, mixSource } = $props();

	let spend = $state((rates.spend || 200000) / 100);
	let cpc = $state((rates.cpc ?? 250) / 100);
	let conv = $state((rates.convRate ?? 0.005) * 100);
	let ticket = $state((rates.ticket ?? blendedGross) / 100);

	let s = $derived(
		projectMonth({
			spendCents: Math.round(spend * 100),
			cpcCents: Math.round(cpc * 100),
			convRate: conv / 100,
			ticketCents: Math.round(ticket * 100),
			fixedCents,
			contributionPct
		})
	);

	/* Ventas needed to zero out, at this scenario's own ticket and margin. */
	let ordersToBreakEven = $derived.by(() => {
		const perOrder = netOf(ticket * 100) * contributionPct;
		return perOrder > 0 ? Math.ceil((fixedCents + spend * 100) / perOrder) : null;
	});

	let out = $derived([
		{ l: 'Clics', v: s.clicks.toLocaleString('es-MX') },
		{ l: 'Ventas', v: s.orders.toLocaleString('es-MX') },
		{ l: 'Ingreso bruto', v: money(s.grossRevenue) },
		{ l: 'Ingreso neto', v: money(s.netRevenue) },
		{ l: 'Margen de contrib.', v: money(s.contribution) },
		{ l: 'CAC', v: s.cac === null ? '—' : money(s.cac) }
	]);

	const input =
		'border-grey-400 bg-bone-50 text-ink-950 focus:border-tomato-500 focus:ring-tomato-500 mt-1 w-full rounded-lg border px-3 py-2 text-sm tabular-nums';
</script>

<div class="mt-4 grid gap-3 sm:grid-cols-4">
	<label class="text-grey-500 block text-xs font-medium">
		Presupuesto de ads ($/mes)
		<input type="number" min="0" step="100" bind:value={spend} class={input} />
	</label>
	<label class="text-grey-500 block text-xs font-medium">
		Costo por clic ($)
		<input type="number" min="0" step="0.1" bind:value={cpc} class={input} />
	</label>
	<label class="text-grey-500 block text-xs font-medium">
		Conversión clic → venta (%)
		<input type="number" min="0" step="0.05" bind:value={conv} class={input} />
	</label>
	<label class="text-grey-500 block text-xs font-medium">
		Ticket promedio ($)
		<input type="number" min="0" step="10" bind:value={ticket} class={input} />
	</label>
</div>

<div class="border-bone-200 mt-5 grid gap-4 border-t pt-4 sm:grid-cols-3 lg:grid-cols-6">
	{#each out as m (m.l)}
		<div>
			<p class="text-grey-500 text-xs">{m.l}</p>
			<p class="text-ink-950 mt-0.5 text-xl font-semibold tabular-nums">{m.v}</p>
		</div>
	{/each}
</div>

<div
	class="mt-4 rounded-xl px-4 py-3 text-sm
	{s.profit >= 0 ? 'bg-emerald-500/10 text-emerald-700' : 'bg-tomato-500/10 text-tomato-600'}"
>
	<span class="font-semibold">
		{s.profit >= 0 ? 'Utilidad' : 'Pérdida'} de {money(Math.abs(s.profit))}
	</span>
	— margen de {money(s.contribution)} contra {money(s.totalFixed)} de costos fijos + ads.
	{#if ordersToBreakEven}
		Necesitas <span class="font-semibold">{ordersToBreakEven} ventas</span> para quedar en ceros
		{#if s.orders > 0}(el escenario proyecta {s.orders}).{/if}
	{/if}
</div>

{#if contributionPct <= 0}
	<p class="mt-3 text-xs text-amber-700">
		El margen de contribución del catálogo es cero o negativo — captura los costos unitarios en
		<a href="/admin/contabilidad/costos" class="font-medium underline">Estructura de costos</a> o este
		pronóstico no significa nada.
	</p>
{:else if mixSource === 'catalogo'}
	<p class="text-grey-400 mt-3 text-xs">
		Sin ventas aún, el margen ({pct(contributionPct)}) se promedia con pesos iguales sobre todo el
		catálogo. Se recalcula con la mezcla real en cuanto registres ventas.
	</p>
{/if}
