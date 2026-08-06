<script>
	/*
	 * Ingresos por semana — single-series column chart (no legend needed).
	 * Columns: ≤24px wide, 4px rounded cap, square baseline, hover tooltip.
	 */
	import { money, shortDate } from '$lib/admin/format.js';

	let { weekly } = $props();

	let hovered = $state(null);

	let max = $derived(Math.max(...weekly.map((w) => w.total), 1));
	// Clean axis ceiling: round max up to 1 significant step.
	let ceil = $derived.by(() => {
		const pow = 10 ** Math.floor(Math.log10(max));
		return Math.ceil(max / pow) * pow;
	});
	let gridlines = [0.25, 0.5, 0.75, 1];
</script>

<div class="border-bone-200 bg-bone-100 rounded-2xl border p-5">
	<div class="flex items-baseline justify-between">
		<h2 class="text-ink-950 font-semibold">Ingresos por semana</h2>
		<p class="text-grey-500 text-sm">últimas 12 semanas</p>
	</div>

	<div class="relative mt-4 h-40">
		{#each gridlines as g (g)}
			<div
				class="border-bone-200 absolute right-0 left-0 border-t"
				style="bottom: {g * 100}%"
			></div>
			<span
				class="text-grey-400 absolute right-0 translate-y-full pt-0.5 text-[10px]"
				style="bottom: {g * 100}%"
			>
				{money(ceil * g)}
			</span>
		{/each}

		<div class="absolute inset-0 flex items-end gap-[2px]">
			{#each weekly as w, i (w.week_start)}
				<div
					class="group relative flex h-full flex-1 items-end justify-center"
					onmouseenter={() => (hovered = i)}
					onmouseleave={() => (hovered = null)}
					role="presentation"
				>
					<div
						class="w-full max-w-6 rounded-t transition-colors
						{hovered === i ? 'bg-tomato-600' : 'bg-tomato-500'}"
						style="height: {w.total === 0 ? '2px' : `${(w.total / ceil) * 100}%`};
						{w.total === 0 ? 'opacity: 0.25;' : ''}"
					></div>
					{#if hovered === i}
						<div
							class="bg-ink-950 text-bone-50 pointer-events-none absolute bottom-full z-10 mb-2 rounded-lg px-3 py-1.5 text-xs whitespace-nowrap shadow-lg"
						>
							<span class="font-semibold">{money(w.total)}</span>
							<span class="opacity-70"> · sem. {shortDate(w.week_start + ' 00:00:00')}</span>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<div class="text-grey-400 mt-2 flex justify-between text-[10px]">
		<span>{shortDate(weekly[0].week_start + ' 00:00:00')}</span>
		<span>esta semana</span>
	</div>
</div>
