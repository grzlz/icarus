<script>
	import { enhance } from '$app/forms';
	import { KNOB_POINTS } from '$lib/ab/knobs.js';

	let { data, form } = $props();

	const kinds = [
		{
			id: 'ajuste',
			label: 'Ajustes',
			desc: 'Textos, precios o valores, editables en vivo desde el panel. Las claves ya cableadas en el sitio no requieren código; una clave nueva necesita un knob() en la página.'
		},
		{
			id: 'seccion',
			label: 'Sección',
			desc: 'Cambia una sección (hero, franja, CTA). Cada variante es un bloque en el código.'
		},
		{
			id: 'pagina',
			label: 'Página completa',
			desc: 'Layouts alternativos de una ruta entera. Cada variante es un componente en el código.'
		}
	];

	const KEYS = 'abcdefgh';
	let kind = $state('ajuste');
	let variants = $state([
		{ name: 'Control', weight: 50, values: {} },
		{ name: 'Variante B', weight: 50, values: {} }
	]);
	let knobKeys = $state(['titulo']);

	function evenSplit() {
		const n = variants.length;
		const base = Math.floor(100 / n);
		variants.forEach((v, i) => (v.weight = i === 0 ? 100 - base * (n - 1) : base));
	}
	function addVariant() {
		if (variants.length >= KEYS.length) return;
		variants.push({
			name: `Variante ${KEYS[variants.length].toUpperCase()}`,
			weight: 0,
			values: {}
		});
		evenSplit();
	}
	function removeVariant(i) {
		if (variants.length <= 2 || i === 0) return;
		variants.splice(i, 1);
		evenSplit();
	}

	let weightSum = $derived(variants.reduce((s, v) => s + (Number(v.weight) || 0), 0));

	// Dedupe: duplicate strings would crash the keyed {#each} below while typing.
	let cleanKeys = $derived([...new Set(knobKeys.filter(Boolean))]);

	const payloadOf = (v) =>
		kind === 'ajuste'
			? JSON.stringify(Object.fromEntries(cleanKeys.map((k) => [k, v.values[k] ?? ''])))
			: '{}';

	const input =
		'border-grey-400 bg-bone-50 text-ink-950 focus:border-tomato-500 focus:ring-tomato-500 w-full rounded-lg border px-3 py-2 text-sm';
	const label = 'text-grey-600 mb-1 block text-xs font-semibold tracking-wide uppercase';
</script>

<svelte:head>
	<title>Nuevo experimento — Icarus Admin</title>
</svelte:head>

<div class="mb-6">
	<a href="/admin/experimentos" class="text-grey-500 hover:text-ink-950 text-sm">← Experimentos</a>
	<h1 class="text-ink-950 mt-1 text-2xl font-bold">Nuevo experimento</h1>
</div>

{#if form?.error}
	<p class="bg-tomato-500/10 text-tomato-600 mb-4 rounded-lg px-4 py-2 text-sm font-medium">
		{form.error}
	</p>
{/if}

<form method="POST" action="?/create" use:enhance class="max-w-3xl space-y-4">
	<!-- Tipo -->
	<div class="grid gap-3 sm:grid-cols-3">
		{#each kinds as k (k.id)}
			<label
				class="cursor-pointer rounded-2xl border p-4 transition {kind === k.id
					? 'border-ink-950 bg-bone-100'
					: 'border-bone-200 bg-bone-100/50 hover:border-grey-400'}"
			>
				<input type="radio" name="kind" value={k.id} bind:group={kind} class="sr-only" />
				<p class="text-ink-950 font-semibold">{k.label}</p>
				<p class="text-grey-500 mt-1 text-xs leading-relaxed">{k.desc}</p>
			</label>
		{/each}
	</div>

	<!-- Qué y dónde -->
	<div class="border-bone-200 bg-bone-100 space-y-3 rounded-2xl border p-5">
		<div>
			<label class={label} for="exp-name">Nombre</label>
			<input
				id="exp-name"
				type="text"
				name="name"
				required
				placeholder="Ej. Frase del hero, agosto"
				class={input}
			/>
		</div>
		<div>
			<label class={label} for="exp-hyp">Hipótesis (opcional)</label>
			<textarea
				id="exp-hyp"
				name="hypothesis"
				rows="2"
				placeholder="Qué esperas que pase y por qué"
				class={input}
			></textarea>
		</div>
		<div class="grid gap-3 sm:grid-cols-3">
			<div>
				<label class={label} for="exp-path">Ruta</label>
				<input
					id="exp-path"
					type="text"
					name="path"
					list="exp-routes"
					value="/"
					required
					class="{input} font-mono"
				/>
				<datalist id="exp-routes">
					{#each data.routes as r (r)}<option value={r}></option>{/each}
				</datalist>
			</div>
			{#if kind === 'seccion'}
				<div>
					<label class={label} for="exp-target">Sección</label>
					<input
						id="exp-target"
						type="text"
						name="target"
						placeholder="hero / franja / footer"
						class={input}
					/>
				</div>
			{/if}
			<div>
				<label class={label} for="exp-metric">Métrica principal</label>
				<select id="exp-metric" name="metric" required class={input}>
					{#each data.metrics as m (m.id)}
						<option value={m.id}>{m.label}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Variantes -->
	<div class="border-bone-200 bg-bone-100 space-y-3 rounded-2xl border p-5">
		<div class="flex items-baseline justify-between">
			<h2 class="text-ink-950 font-semibold">Variantes</h2>
			<p class="text-xs {weightSum === 100 ? 'text-grey-500' : 'text-tomato-600 font-semibold'}">
				pesos: {weightSum}%{weightSum === 100 ? '' : ' (deben sumar 100)'}
			</p>
		</div>

		{#if kind === 'ajuste'}
			<div>
				<span class={label}>Valores a probar</span>
				<div class="flex flex-wrap items-center gap-2">
					{#each knobKeys, ki (ki)}
						<input
							type="text"
							bind:value={knobKeys[ki]}
							placeholder="clave"
							list="knob-points"
							class="{input} w-40! font-mono text-xs"
						/>
					{/each}
					<button
						type="button"
						onclick={() => knobKeys.push('')}
						class="text-grey-500 hover:text-ink-950 text-xs font-semibold"
					>
						+ otra clave
					</button>
				</div>
				<datalist id="knob-points">
					{#each KNOB_POINTS as p (p.key)}<option value={p.key}>{p.desc}</option>{/each}
				</datalist>
				<p class="text-grey-500 mt-1.5 text-xs">
					Cableadas en el sitio (funcionan sin tocar código):
					{#each KNOB_POINTS as p, i (p.key)}
						<code class="font-mono">{p.key}</code>{i < KNOB_POINTS.length - 1 ? ', ' : ''}
					{/each}
				</p>
			</div>
		{/if}

		{#each variants as v, i (i)}
			<div class="border-bone-200 rounded-xl border p-3">
				<div class="flex items-center gap-2">
					<span
						class="bg-ink-950 text-bone-50 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase"
					>
						{KEYS[i]}{i === 0 ? ' · control' : ''}
					</span>
					<input type="text" name="v_name" bind:value={v.name} required class="{input} flex-1" />
					<div class="flex items-center gap-1">
						<input
							type="number"
							name="v_weight"
							bind:value={v.weight}
							min="0"
							max="100"
							required
							class="{input} w-16! text-right tabular-nums"
						/>
						<span class="text-grey-500 text-xs">%</span>
					</div>
					{#if i > 0 && variants.length > 2}
						<button
							type="button"
							onclick={() => removeVariant(i)}
							class="text-grey-400 hover:text-tomato-600 text-xs"
							aria-label="Quitar variante"
						>
							✕
						</button>
					{/if}
				</div>
				{#if kind === 'ajuste'}
					<div class="mt-2 grid gap-2 sm:grid-cols-2">
						{#each cleanKeys as k (k)}
							<div>
								<label class="text-grey-500 mb-0.5 block font-mono text-[10px]" for="v{i}-{k}"
									>{k}</label
								>
								<input id="v{i}-{k}" type="text" bind:value={v.values[k]} class={input} />
							</div>
						{/each}
					</div>
				{/if}
				<input type="hidden" name="v_payload" value={payloadOf(v)} />
			</div>
		{/each}

		<button
			type="button"
			onclick={addVariant}
			class="text-grey-500 hover:text-ink-950 text-sm font-semibold"
		>
			+ Agregar variante
		</button>
	</div>

	<div class="flex items-center gap-3">
		<button
			type="submit"
			class="bg-ink-950 text-bone-50 hover:bg-ink-800 rounded-lg px-5 py-2.5 text-sm font-semibold transition"
		>
			Crear en borrador
		</button>
		<p class="text-grey-500 text-xs">
			Nada corre todavía: lo activas desde su página cuando esté listo.
		</p>
	</div>
</form>
