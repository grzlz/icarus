<script>
	/*
	 * Stat tile: label · value · optional delta vs prior month · optional
	 * 12-point sparkline (de-emphasis grey, current point in accent).
	 * `goodWhenUp` flips delta color for metrics where up is bad (gastos).
	 */
	let { label, value, note = null, deltaPct = null, trend = null, goodWhenUp = true } = $props();

	const W = 120;
	const H = 36;
	const PAD = 4;

	let points = $derived.by(() => {
		if (!trend || trend.length < 2) return null;
		const max = Math.max(...trend, 1);
		const step = (W - PAD * 2) / (trend.length - 1);
		return trend.map((v, i) => ({
			x: PAD + i * step,
			y: H - PAD - (v / max) * (H - PAD * 2)
		}));
	});
	let path = $derived(
		points ? points.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ') : ''
	);
	let last = $derived(points ? points[points.length - 1] : null);

	let deltaGood = $derived(deltaPct !== null && deltaPct >= 0 === goodWhenUp);
</script>

<div class="border-bone-200 bg-bone-100 rounded-2xl border p-5">
	<p class="text-grey-500 text-sm">{label}</p>
	<div class="mt-1 flex items-end justify-between gap-3">
		<div>
			<p class="text-ink-950 text-3xl font-semibold tracking-tight">{value}</p>
			{#if deltaPct !== null}
				<p
					class="mt-1 text-xs font-medium whitespace-nowrap {deltaGood
						? 'text-emerald-600'
						: 'text-tomato-600'}"
				>
					{deltaPct >= 0 ? '+' : ''}{deltaPct}% vs mes anterior
				</p>
			{/if}
			{#if note}
				<p class="text-grey-500 mt-1 text-xs">{note}</p>
			{/if}
		</div>
		{#if points}
			<svg viewBox="0 0 {W} {H}" class="h-9 w-30 shrink-0" aria-hidden="true">
				<path
					d={path}
					fill="none"
					class="stroke-grey-400"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<circle
					cx={last.x}
					cy={last.y}
					r="4"
					class="fill-tomato-500 stroke-bone-100"
					stroke-width="2"
				/>
			</svg>
		{/if}
	</div>
</div>
