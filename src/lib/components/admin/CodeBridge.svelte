<script>
	/*
	 * The bridge from dashboard to code: the exact snippet to paste for this
	 * experiment's configuration — knob() reads for 'ajuste', an <Experiment>
	 * block with one snippet per variant for 'seccion'/'pagina'.
	 */
	import { KNOB_POINTS } from '$lib/ab/knobs.js';

	let { exp, knobKeys = [] } = $props();

	const wired = new Set(KNOB_POINTS.map((p) => p.key));
	let pendingKeys = $derived(knobKeys.filter((k) => !wired.has(k)));
	const ident = (k) => k.replace(/[^a-zA-Z0-9_$]/g, '_');

	let code = $derived(
		exp.kind === 'ajuste'
			? [
					...knobKeys
						.filter((k) => wired.has(k))
						.map((k) => `// '${k}' ya está cableada en el sitio — no requiere código`),
					...(pendingKeys.length
						? [
								`import { page } from '$app/state';`,
								`import { knob } from '$lib/ab/client.js';`,
								'',
								`// en ${exp.path} — el tercer argumento es el valor si no hay experimento`,
								...pendingKeys.map(
									(k) => `const ${ident(k)} = $derived(knob(page.data.ab, '${k}', '…'));`
								)
							]
						: [])
				].join('\n')
			: [
					'<script>',
					`\timport Experiment from '$lib/components/Experiment.svelte';`,
					'</' + 'script>',
					'',
					`<Experiment slug="${exp.slug}">`,
					...exp.variants.map((v) => `\t{#snippet ${v.key}()}<!-- ${v.name} -->{/snippet}`),
					'</Experiment>'
				].join('\n')
	);
</script>

<div
	class="border-bone-200 bg-bone-100 rounded-2xl border p-5 {exp.kind === 'ajuste'
		? ''
		: 'lg:col-span-2'}"
>
	<h2 class="text-ink-950 font-semibold">Integración en el código</h2>
	<p class="text-grey-500 mt-1 text-xs">
		{#if exp.kind === 'ajuste'}
			Las claves cableadas en el sitio funcionan solas; una clave nueva se lee con
			<code class="font-mono">knob()</code> en <code class="font-mono">{exp.path}</code> (una sola vez
			— sirve para todos los experimentos futuros con esa clave).
		{:else}
			Declara un snippet por variante en <code class="font-mono">{exp.path}</code>. Sin asignación
			(experimento pausado o terminado) todos ven <code class="font-mono">a</code>.
		{/if}
	</p>
	<pre
		class="bg-ink-950 text-bone-100 mt-3 overflow-x-auto rounded-xl p-4 font-mono text-xs leading-relaxed">{code}</pre>
</div>
