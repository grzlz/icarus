<script>
	import { enhance } from '$app/forms';
	import { shortDate, shortDateTime } from '$lib/admin/format.js';
	import VariantResults from '$lib/components/admin/VariantResults.svelte';
	import CodeBridge from '$lib/components/admin/CodeBridge.svelte';

	let { data, form } = $props();
	let exp = $derived(data.exp);

	const kindLabels = { pagina: 'Página completa', seccion: 'Sección', ajuste: 'Ajustes' };
	const statusStyle = {
		activo: 'bg-emerald-500/10 text-emerald-600',
		pausado: 'bg-amber-500/10 text-amber-600',
		borrador: 'bg-bone-200 text-grey-600',
		terminado: 'bg-ink-950/10 text-grey-600'
	};
	let metricLabel = $derived(Object.fromEntries(data.metrics.map((m) => [m.id, m.label])));

	const parse = (json) => {
		try {
			return JSON.parse(json) ?? {};
		} catch {
			return {};
		}
	};
	let knobKeys = $derived([...new Set(exp.variants.flatMap((v) => Object.keys(parse(v.payload))))]);

	let eventNames = $derived([...new Set(exp.breakdown.map((b) => b.name))]);
	let breakdownOf = $derived(
		Object.fromEntries(exp.breakdown.map((b) => [`${b.key}:${b.name}`, b]))
	);
	let maxDaily = $derived(Math.max(...exp.daily.map((d) => d.n), 1));

	const running = $derived(['activo', 'pausado'].includes(exp.status));
	const input =
		'border-grey-400 bg-bone-50 text-ink-950 focus:border-tomato-500 focus:ring-tomato-500 w-full rounded-lg border px-3 py-2 text-sm';
	const btn = 'rounded-lg px-4 py-2 text-sm font-semibold transition';
</script>

<svelte:head>
	<title>{exp.name} — Experimentos</title>
</svelte:head>

<div class="mb-6">
	<a href="/admin/experimentos" class="text-grey-500 hover:text-ink-950 text-sm">← Experimentos</a>
	<div class="mt-1 flex flex-wrap items-center gap-3">
		<h1 class="text-ink-950 text-2xl font-bold">{exp.name}</h1>
		<span
			class="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize {statusStyle[exp.status]}"
		>
			{exp.status}
		</span>
	</div>
	<p class="text-grey-500 mt-1 font-mono text-xs tracking-wide">
		{exp.path} · {kindLabels[exp.kind]}{exp.target ? ` · ${exp.target}` : ''} · meta: {metricLabel[
			exp.metric
		] ?? exp.metric}
		{#if exp.started_at}· activo desde {shortDate(exp.started_at)}{/if}
		{#if exp.ended_at}· terminó {shortDate(exp.ended_at)}{/if}
	</p>
	{#if exp.hypothesis}
		<p class="text-grey-600 mt-2 max-w-2xl text-sm italic">"{exp.hypothesis}"</p>
	{/if}
</div>

{#if form?.error}
	<p class="bg-tomato-500/10 text-tomato-600 mb-4 rounded-lg px-4 py-2 text-sm font-medium">
		{form.error}
	</p>
{:else if form?.ok}
	<p class="mb-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600">
		{form.ok}
	</p>
{/if}

<!-- Acciones -->
<div class="mb-4 flex flex-wrap items-center gap-2">
	{#if exp.status === 'borrador'}
		<form method="POST" action="?/estado" use:enhance>
			<input type="hidden" name="next" value="activo" />
			<button class="{btn} text-bone-50 bg-emerald-600 hover:bg-emerald-700">▶ Activar</button>
		</form>
		<form
			method="POST"
			action="?/eliminar"
			use:enhance
			onsubmit={(e) => !confirm('¿Eliminar este borrador?') && e.preventDefault()}
		>
			<button class="{btn} text-tomato-600 hover:bg-tomato-500/10">Eliminar</button>
		</form>
	{:else if exp.status === 'activo'}
		<form method="POST" action="?/estado" use:enhance>
			<input type="hidden" name="next" value="pausado" />
			<button class="{btn} bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">⏸ Pausar</button>
		</form>
	{:else if exp.status === 'pausado'}
		<form method="POST" action="?/estado" use:enhance>
			<input type="hidden" name="next" value="activo" />
			<button class="{btn} text-bone-50 bg-emerald-600 hover:bg-emerald-700">▶ Reanudar</button>
		</form>
	{/if}
	{#if running}
		<form
			method="POST"
			action="?/estado"
			use:enhance
			onsubmit={(e) => !confirm('¿Terminar sin ganadora?') && e.preventDefault()}
		>
			<input type="hidden" name="next" value="terminado" />
			<button class="{btn} bg-bone-200 text-grey-600 hover:text-ink-950">■ Terminar</button>
		</form>
		<span class="text-grey-500 ml-2 text-xs">Declarar ganadora:</span>
		{#each exp.variants as v (v.key)}
			<form
				method="POST"
				action="?/ganador"
				use:enhance
				onsubmit={(e) =>
					!confirm(`¿Declarar ganadora la variante ${v.key.toUpperCase()} y terminar?`) &&
					e.preventDefault()}
			>
				<input type="hidden" name="key" value={v.key} />
				<button class="{btn} border-bone-200 border px-3 py-1.5 hover:border-emerald-600">
					★ {v.key.toUpperCase()}
				</button>
			</form>
		{/each}
	{/if}
</div>

<!-- Resultados -->
<div class="border-bone-200 bg-bone-100 mb-4 rounded-2xl border p-5">
	<div class="flex flex-wrap items-baseline justify-between gap-2">
		<h2 class="text-ink-950 font-semibold">Resultados</h2>
		<p class="text-grey-500 text-xs">
			P(gana) = probabilidad bayesiana de superar al control en «{metricLabel[exp.metric] ??
				exp.metric}»
		</p>
	</div>
	{#if exp.status === 'borrador'}
		<p class="text-grey-500 mt-3 text-sm">Sin datos: el experimento aún no se activa.</p>
	{:else}
		{#if exp.weights_changed_at}
			<p class="mt-2 rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-600">
				Los pesos cambiaron el {shortDateTime(exp.weights_changed_at)} — para no mezclar épocas, solo
				se cuentan visitantes asignados desde entonces.
			</p>
		{/if}
		<div class="mt-3">
			<VariantResults variants={exp.variants} winner={exp.winner} />
		</div>

		{#if exp.daily.length}
			<div class="mt-5">
				<p class="text-grey-500 mb-2 text-xs font-semibold tracking-wide uppercase">
					Expuestos por día
				</p>
				<div class="flex h-12 items-end gap-1">
					{#each exp.daily as d (d.day)}
						<div
							class="bg-grey-400/60 w-6 rounded-t"
							style="height: {Math.max((d.n / maxDaily) * 100, 6)}%"
							title="{d.day}: {d.n}"
						></div>
					{/each}
				</div>
			</div>
		{/if}

		{#if eventNames.length}
			<div class="mt-5 overflow-x-auto">
				<p class="text-grey-500 mb-2 text-xs font-semibold tracking-wide uppercase">
					Todos los eventos (visitantes · total)
				</p>
				<table class="w-full max-w-md text-sm">
					<thead>
						<tr class="text-grey-500 text-left text-xs">
							<th class="py-1 pr-3 font-semibold">Evento</th>
							{#each exp.variants as v (v.key)}
								<th class="py-1 pr-3 text-right font-mono font-semibold uppercase">{v.key}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each eventNames as name (name)}
							<tr class="border-bone-200 border-t">
								<td class="text-ink-950 py-1.5 pr-3 font-mono text-xs">{name}</td>
								{#each exp.variants as v (v.key)}
									{@const b = breakdownOf[`${v.key}:${name}`]}
									<td class="text-grey-600 py-1.5 pr-3 text-right tabular-nums">
										{b ? `${b.visitors} · ${b.total}` : '—'}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	{/if}
</div>

<div class="grid gap-4 lg:grid-cols-2">
	<!-- Ajustes en vivo -->
	{#if exp.kind === 'ajuste' && exp.status !== 'terminado' && knobKeys.length}
		<form
			method="POST"
			action="?/ajustes"
			use:enhance
			class="border-bone-200 bg-bone-100 space-y-3 rounded-2xl border p-5"
		>
			<h2 class="text-ink-950 font-semibold">Ajustes por variante</h2>
			<p class="text-grey-500 -mt-2 text-xs">
				Se aplican al guardar, sin deploy. La asignación de visitantes no cambia.
			</p>
			{#each exp.variants as v (v.key)}
				{@const values = parse(v.payload)}
				<div class="border-bone-200 rounded-xl border p-3">
					<p class="text-ink-950 mb-2 text-xs font-bold uppercase">
						{v.key} · {v.name}
					</p>
					<div class="grid gap-2 sm:grid-cols-2">
						{#each knobKeys as k (k)}
							<div>
								<label class="text-grey-500 mb-0.5 block font-mono text-[10px]" for="{v.key}-{k}">
									{k}
								</label>
								<input
									id="{v.key}-{k}"
									type="text"
									name="knob:{v.key}:{k}"
									value={values[k] ?? ''}
									class={input}
								/>
							</div>
						{/each}
					</div>
				</div>
			{/each}
			<button class="{btn} bg-ink-950 text-bone-50 hover:bg-ink-800">Guardar ajustes</button>
		</form>
	{/if}

	<!-- Pesos -->
	{#if exp.status !== 'terminado'}
		<form
			method="POST"
			action="?/pesos"
			use:enhance
			class="border-bone-200 bg-bone-100 h-fit space-y-3 rounded-2xl border p-5"
		>
			<h2 class="text-ink-950 font-semibold">Reparto de tráfico</h2>
			<p class="text-grey-500 -mt-2 text-xs">
				Deben sumar 100%. Solo afecta a visitantes nuevos — y en un experimento en marcha el conteo
				de estadísticas se reinicia (mezclar épocas de reparto sesga la comparación).
			</p>
			{#each exp.variants as v (v.key)}
				<div class="flex items-center gap-3">
					<span class="text-ink-950 w-40 truncate text-sm font-medium">
						<span class="font-mono text-xs font-bold uppercase">{v.key}</span> · {v.name}
					</span>
					<input type="hidden" name="v_key" value={v.key} />
					<input
						type="number"
						name="v_weight"
						value={v.weight}
						min="0"
						max="100"
						class="{input} w-20! text-right tabular-nums"
					/>
					<span class="text-grey-500 text-xs">%</span>
				</div>
			{/each}
			<button class="{btn} bg-ink-950 text-bone-50 hover:bg-ink-800">Guardar pesos</button>
		</form>
	{/if}

	<CodeBridge {exp} {knobKeys} />
</div>
