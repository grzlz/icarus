<script>
	import ShirtMockup from '$lib/components/ShirtMockup.svelte';

	let { config, gallery, loading, error, onGenerate, onDownload } = $props();

	const labelCls = 'text-grey-600 font-mono text-[11px] font-semibold tracking-widest uppercase';
</script>

<div class="space-y-6">
	<div>
		<p class={labelCls}>Referencia (texto exacto)</p>
		<div class="mt-2 aspect-square w-full max-w-sm {loading ? 'animate-pulse' : ''}">
			<ShirtMockup
				phrase={config.phrase || ' '}
				garment={config.garment}
				technique={config.technique}
				size="hero"
			/>
		</div>
	</div>

	<button
		type="button"
		onclick={onGenerate}
		disabled={loading || !config.phrase.trim()}
		class="bg-ink-950 text-bone-50 hover:bg-ink-800 inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
	>
		{loading ? 'Generando…' : 'Generar foto'}
	</button>

	{#if error}
		<p class="text-tomato-600 text-sm font-semibold">{error}</p>
	{/if}

	{#if gallery.length}
		<div>
			<p class={labelCls}>Generadas · {gallery.length}</p>
			<div class="mt-2 grid grid-cols-2 gap-3">
				{#each gallery as item (item.id)}
					<figure class="border-ink-950/10 group relative overflow-hidden rounded-2xl border">
						<img src={item.image} alt={item.phrase} class="aspect-square w-full object-cover" />
						<button
							type="button"
							onclick={() => onDownload(item)}
							class="bg-ink-950/85 text-bone-50 absolute right-2 bottom-2 rounded-full px-3 py-1.5 text-xs font-bold opacity-0 transition-opacity group-hover:opacity-100"
						>
							↓ PNG
						</button>
					</figure>
				{/each}
			</div>
		</div>
	{/if}
</div>
