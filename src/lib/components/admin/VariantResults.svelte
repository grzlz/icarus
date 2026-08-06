<script>
	/*
	 * Per-variant results table for an experiment: exposures, conversions,
	 * rate with 95% credible interval (drawn on a shared scale), Bayesian
	 * P(beats control), and time-on-page.
	 */
	let { variants, winner = null } = $props();

	const pct = (x, d = 1) => `${(x * 100).toFixed(d)}%`;

	let maxHi = $derived(Math.max(...variants.map((v) => v.ci?.[1] ?? 0), 0.001));

	const probClass = (p) =>
		p >= 0.95
			? 'text-emerald-600 font-bold'
			: p >= 0.8
				? 'text-ink-950 font-semibold'
				: 'text-grey-500';
</script>

<div class="overflow-x-auto">
	<table class="w-full text-sm">
		<thead>
			<tr class="text-grey-500 text-left text-xs tracking-wide uppercase">
				<th class="py-2 pr-3 font-semibold">Variante</th>
				<th class="py-2 pr-3 text-right font-semibold">Peso</th>
				<th class="py-2 pr-3 text-right font-semibold">Expuestos</th>
				<th class="py-2 pr-3 text-right font-semibold">Conv.</th>
				<th class="py-2 pr-3 text-right font-semibold">Tasa</th>
				<th class="py-2 pr-3 font-semibold">Intervalo 95%</th>
				<th class="py-2 pr-3 text-right font-semibold">P(gana)</th>
				<th class="py-2 text-right font-semibold">Tiempo</th>
			</tr>
		</thead>
		<tbody>
			{#each variants as v (v.key)}
				<tr class="border-bone-200 border-t {winner === v.key ? 'bg-emerald-500/5' : ''}">
					<td class="py-2.5 pr-3">
						<div class="flex items-center gap-2">
							<span
								class="{v.is_control
									? 'bg-bone-200 text-grey-600'
									: 'bg-ink-950 text-bone-50'} rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase"
							>
								{v.key}
							</span>
							<span class="text-ink-950 font-medium">{v.name}</span>
							{#if v.is_control}
								<span class="text-grey-500 text-[10px] uppercase">control</span>
							{/if}
							{#if winner === v.key}
								<span class="text-[10px] font-bold text-emerald-600 uppercase">★ ganadora</span>
							{/if}
						</div>
					</td>
					<td class="text-grey-600 py-2.5 pr-3 text-right tabular-nums">{v.weight}%</td>
					<td class="text-ink-950 py-2.5 pr-3 text-right font-semibold tabular-nums">
						{v.exposed}
					</td>
					<td class="text-ink-950 py-2.5 pr-3 text-right font-semibold tabular-nums">
						{v.converted}
					</td>
					<td class="text-ink-950 py-2.5 pr-3 text-right font-bold tabular-nums">{pct(v.rate)}</td>
					<td class="py-2.5 pr-3">
						<div class="flex items-center gap-2">
							<svg viewBox="0 0 100 12" class="h-3 w-28 shrink-0" aria-hidden="true">
								<line x1="0" y1="6" x2="100" y2="6" class="stroke-bone-200" stroke-width="1" />
								<line
									x1={(v.ci[0] / maxHi) * 100}
									y1="6"
									x2={(v.ci[1] / maxHi) * 100}
									y2="6"
									class={v.is_control ? 'stroke-grey-400' : 'stroke-tomato-500'}
									stroke-width="3"
									stroke-linecap="round"
								/>
								<circle
									cx={(v.rate / maxHi) * 100}
									cy="6"
									r="3"
									class={v.is_control ? 'fill-grey-600' : 'fill-tomato-600'}
								/>
							</svg>
							<span class="text-grey-500 text-xs whitespace-nowrap tabular-nums">
								{pct(v.ci[0])}–{pct(v.ci[1])}
							</span>
						</div>
					</td>
					<td class="py-2.5 pr-3 text-right tabular-nums">
						{#if v.probBeat === null}
							<span class="text-grey-400">—</span>
						{:else}
							<span class={probClass(v.probBeat)}>{Math.round(v.probBeat * 100)}%</span>
						{/if}
					</td>
					<td class="text-grey-600 py-2.5 text-right text-xs whitespace-nowrap tabular-nums">
						{#if v.avgSeconds !== null}
							{Math.round(v.avgSeconds)}s <span class="text-grey-400">(n={v.timeSamples})</span>
						{:else}
							—
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
