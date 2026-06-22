<script>
	import { onMount } from 'svelte';
	import { renderReference } from '$lib/taller/renderReference.js';
	import TallerControls from '$lib/components/TallerControls.svelte';
	import TallerResult from '$lib/components/TallerResult.svelte';

	// Internal mockup tool. Not linked from the navbar; noindex below.
	const config = $state({
		phrase: 'gpi a un\ngpu',
		garment: 'black',
		technique: 'estampado',
		type: 'playera',
		scene: 'flatlay',
		quality: 'rapido',
		password: ''
	});

	let loading = $state(false);
	let error = $state('');
	let gallery = $state([]);

	onMount(() => {
		config.password = localStorage.getItem('taller_pw') ?? '';
	});

	// Persist only the access key, so María doesn't retype it each visit.
	$effect(() => {
		localStorage.setItem('taller_pw', config.password ?? '');
	});

	function slugify(s) {
		return (
			(s || 'icarus')
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-+|-+$/g, '')
				.slice(0, 40) || 'icarus'
		);
	}

	async function generate() {
		if (loading || !config.phrase.trim()) return;
		loading = true;
		error = '';
		try {
			const referenceImage = await renderReference({
				phrase: config.phrase,
				garment: config.garment,
				technique: config.technique
			});

			const res = await fetch('/api/taller/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					referenceImage,
					garment: config.garment,
					technique: config.technique,
					type: config.type,
					scene: config.scene,
					quality: config.quality,
					password: config.password
				})
			});

			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				error = data.error ?? 'Error al generar la imagen';
				return;
			}

			gallery = [
				{ id: crypto.randomUUID(), image: data.image, phrase: config.phrase },
				...gallery
			].slice(0, 12);
		} catch {
			error = 'No se pudo conectar con el servidor';
		} finally {
			loading = false;
		}
	}

	function download(item) {
		const a = document.createElement('a');
		a.href = item.image;
		a.download = `icarus-${slugify(item.phrase)}.png`;
		document.body.appendChild(a);
		a.click();
		a.remove();
	}
</script>

<svelte:head>
	<title>Taller · Icarus</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="bg-bone-50 min-h-screen">
	<div class="mx-auto max-w-6xl px-5 py-12 md:px-10 md:py-16">
		<header class="mb-10 max-w-2xl">
			<p class="text-grey-600 font-mono text-[11px] font-semibold tracking-widest uppercase">
				Taller · interno
			</p>
			<h1 class="text-ink-950 mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
				De la frase a la <span class="text-tomato-500">foto</span>.
			</h1>
			<p class="text-grey-600 mt-3 text-sm leading-relaxed">
				Escribe la frase, elige prenda y técnica, y genera un mockup fotorrealista. La vista previa
				es la referencia exacta que se manda al modelo — el texto se respeta tal cual.
			</p>
		</header>

		<div class="grid grid-cols-1 gap-10 lg:grid-cols-2">
			<TallerControls {config} />
			<TallerResult
				{config}
				{gallery}
				{loading}
				{error}
				onGenerate={generate}
				onDownload={download}
			/>
		</div>
	</div>
</section>
