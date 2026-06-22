<script>
	import { garments, techniques, fallbackBg } from '$lib/shirt.js';

	let { config } = $props();

	const types = [
		{ id: 'playera', label: 'Playera' },
		{ id: 'sudadera', label: 'Sudadera' }
	];
	const scenes = [
		{ id: 'flatlay', label: 'Flat-lay' },
		{ id: 'colgada', label: 'Colgada' },
		{ id: 'model', label: 'En modelo' }
	];
	const qualities = [
		{ id: 'rapido', label: 'Rápido', note: 'Nano Banana 2 · ~$0.045' },
		{ id: 'calidad', label: 'Calidad', note: 'Nano Banana Pro · ~$0.134' }
	];

	const chip =
		'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors';
	const on = 'border-ink-950 bg-ink-950 text-bone-50';
	const off = 'border-ink-950/15 bg-bone-50 text-ink-950 hover:bg-bone-100';
	const labelCls = 'text-grey-600 font-mono text-[11px] font-semibold tracking-widest uppercase';
</script>

{#snippet group(title, options, current, select)}
	<div>
		<p class={labelCls}>{title}</p>
		<div class="mt-2 flex flex-wrap gap-2">
			{#each options as opt (opt.id)}
				<button
					type="button"
					onclick={() => select(opt.id)}
					class="{chip} {current === opt.id ? on : off}"
				>
					{opt.label}
				</button>
			{/each}
		</div>
	</div>
{/snippet}

<div class="space-y-6">
	<div>
		<label for="frase" class={labelCls}>Frase</label>
		<textarea
			id="frase"
			bind:value={config.phrase}
			rows="3"
			placeholder="gpi a un gpu"
			class="border-ink-950/15 bg-bone-50 text-ink-950 placeholder:text-grey-400 focus:border-ink-950 mt-2 w-full resize-none rounded-2xl border px-4 py-3 font-mono text-sm focus:outline-none"
		></textarea>
		<p class="text-grey-500 mt-1.5 text-[11px]">Cada salto de línea es un renglón en la prenda.</p>
	</div>

	<div>
		<p class={labelCls}>Color</p>
		<div class="mt-2 flex flex-wrap gap-2">
			{#each garments as g (g.id)}
				<button
					type="button"
					onclick={() => (config.garment = g.id)}
					class="{chip} {config.garment === g.id ? on : off}"
				>
					<span
						class="border-ink-950/20 h-3 w-3 rounded-full border"
						style="background-color: {fallbackBg(g.id)};"
					></span>
					{g.label}
				</button>
			{/each}
		</div>
	</div>

	{@render group('Técnica', techniques, config.technique, (id) => (config.technique = id))}
	{@render group('Prenda', types, config.type, (id) => (config.type = id))}
	{@render group('Escena', scenes, config.scene, (id) => (config.scene = id))}

	<div>
		<p class={labelCls}>Calidad</p>
		<div class="mt-2 grid grid-cols-2 gap-2">
			{#each qualities as q (q.id)}
				<button
					type="button"
					onclick={() => (config.quality = q.id)}
					class="rounded-2xl border p-3 text-left transition-colors {config.quality === q.id
						? 'border-ink-950 bg-ink-950 text-bone-50'
						: 'border-ink-950/15 bg-bone-50 text-ink-950 hover:bg-bone-100'}"
				>
					<span class="block text-sm font-bold">{q.label}</span>
					<span class="mt-0.5 block font-mono text-[10px] opacity-70">{q.note}</span>
				</button>
			{/each}
		</div>
	</div>

	<div>
		<label for="clave" class={labelCls}>Clave de acceso</label>
		<input
			id="clave"
			type="password"
			bind:value={config.password}
			placeholder="opcional"
			class="border-ink-950/15 bg-bone-50 text-ink-950 placeholder:text-grey-400 focus:border-ink-950 mt-2 w-full rounded-2xl border px-4 py-2.5 text-sm focus:outline-none"
		/>
	</div>
</div>
