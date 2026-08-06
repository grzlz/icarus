<script>
	import { shortDate } from '$lib/admin/format.js';

	let { data } = $props();

	const kindLabels = { pagina: 'Página', seccion: 'Sección', ajuste: 'Ajustes' };
	const statusStyle = {
		activo: 'bg-emerald-500/10 text-emerald-600',
		pausado: 'bg-amber-500/10 text-amber-600',
		borrador: 'bg-bone-200 text-grey-600',
		terminado: 'bg-ink-950/10 text-grey-600'
	};

	let metricLabel = $derived(Object.fromEntries(data.metrics.map((m) => [m.id, m.label])));
</script>

<svelte:head>
	<title>Experimentos — Icarus Admin</title>
</svelte:head>

<div class="mb-6 flex flex-wrap items-center justify-between gap-3">
	<div>
		<h1 class="text-ink-950 text-2xl font-bold">Experimentos</h1>
		<p class="text-grey-500 mt-1 text-sm">
			A/B testing con asignación fija por visitante y estadística bayesiana.
		</p>
	</div>
	<a
		href="/admin/experimentos/nuevo"
		class="bg-ink-950 text-bone-50 hover:bg-ink-800 rounded-lg px-4 py-2.5 text-sm font-semibold transition"
	>
		+ Nuevo experimento
	</a>
</div>

{#if data.experiments.length === 0}
	<div class="border-bone-200 bg-bone-100 rounded-2xl border p-10 text-center">
		<p class="text-ink-950 font-semibold">Sin experimentos todavía.</p>
		<p class="text-grey-500 mx-auto mt-2 max-w-md text-sm">
			Crea el primero: elige qué probar (una página completa, una sección o solo textos/precios),
			define las variantes y actívalo. Los visitantes se reparten solos y aquí ves quién va ganando.
		</p>
	</div>
{:else}
	<div class="grid gap-4 md:grid-cols-2">
		{#each data.experiments as exp (exp.id)}
			<a
				href="/admin/experimentos/{exp.slug}"
				class="border-bone-200 bg-bone-100 hover:border-grey-400 block rounded-2xl border p-5 transition"
			>
				<div class="flex items-start justify-between gap-3">
					<div class="min-w-0">
						<p class="text-ink-950 truncate font-semibold">{exp.name}</p>
						<p class="text-grey-500 mt-0.5 font-mono text-[11px] tracking-wide">
							{exp.path} · {kindLabels[exp.kind] ?? exp.kind} · {exp.n_variantes} variantes
						</p>
					</div>
					<span
						class="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize {statusStyle[
							exp.status
						] ?? statusStyle.borrador}"
					>
						{exp.status}
					</span>
				</div>
				<div class="text-grey-600 mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-sm">
					<span>
						<span class="text-ink-950 font-semibold tabular-nums">{exp.expuestos}</span> expuestos
					</span>
					<span>meta: {metricLabel[exp.metric] ?? exp.metric}</span>
					{#if exp.winner}
						<span class="font-semibold text-emerald-600">ganó {exp.winner.toUpperCase()}</span>
					{/if}
					<span class="text-grey-500 ml-auto text-xs">
						{exp.started_at
							? `desde ${shortDate(exp.started_at)}`
							: `creado ${shortDate(exp.created_at)}`}
					</span>
				</div>
			</a>
		{/each}
	</div>
{/if}
