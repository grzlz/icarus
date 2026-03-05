<script>
	import { fly } from 'svelte/transition';

	const roles = [
		{
			title: 'Designer',
			summary: 'UI/UX, branding y producto. Que se vea bien y funcione mejor.',
			description: 'Diseñas interfaces, sistemas de diseño y experiencias de usuario para productos digitales. Trabajas de la mano con desarrollo para que cada pixel tenga sentido y cada flujo sea intuitivo.'
		},
		{
			title: 'Agentic-Assisted Engineer',
			summary: 'Desarrollo asistido por agentes de IA. El futuro del software.',
			description: 'Construyes software junto con agentes de IA. Defines prompts, flujos de trabajo y arquitecturas que combinan código tradicional con modelos de lenguaje para resolver problemas reales.'
		},
		{
			title: 'DevOps & Infrastructure Engineer',
			summary: 'CI/CD, cloud, infraestructura. Que nada se caiga.',
			description: 'Diseñas y mantienes la infraestructura que sostiene nuestros productos. CI/CD, monitoreo, cloud, automatización. Tu trabajo hace que todo lo demás funcione.'
		},
		{
			title: 'Frontend Developer',
			summary: 'Interfaces rápidas, accesibles y con buen gusto.',
			description: 'Construyes interfaces web con tecnologías modernas. Te importa el rendimiento, la accesibilidad y los detalles. Trabajas con Svelte, React o lo que el proyecto necesite.'
		}
	];

	let selected = $state(null);
	let appEmail = $state('');
	let cvFile = $state(null);
	let formStatus = $state('idle');
	let dragOver = $state(false);

	function selectRole(index) {
		selected = index;
		formStatus = 'idle';
		appEmail = '';
		cvFile = null;
	}

	function goBack() {
		selected = null;
	}

	function handleFileChange(e) {
		const file = e.target.files[0];
		if (file) cvFile = file;
	}

	function handleDrop(e) {
		e.preventDefault();
		dragOver = false;
		const file = e.dataTransfer.files[0];
		if (file) cvFile = file;
	}

	function handleDragOver(e) {
		e.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	async function handleApply(e) {
		e.preventDefault();
		formStatus = 'sending';

		const data = new FormData();
		data.append('email', appEmail);
		data.append('position', roles[selected].title);
		if (cvFile) data.append('cv', cvFile);

		try {
			const res = await fetch('https://formspree.io/f/xpwzgkvl', {
				method: 'POST',
				body: data
			});
			if (res.ok) {
				formStatus = 'sent';
				appEmail = '';
				cvFile = null;
			} else {
				formStatus = 'error';
			}
		} catch {
			formStatus = 'error';
		}
	}
</script>

<svelte:head>
	<title>Carreras | icarus.mx</title>
	<meta name="description" content="Únete al equipo de icarus.mx. Buscamos gente que quiera construir cosas que importen." />

	<meta property="og:type" content="website" />
	<meta property="og:title" content="Carreras | icarus.mx" />
	<meta property="og:description" content="Únete al equipo de icarus.mx. Buscamos gente que quiera construir cosas que importen." />
	<meta property="og:image" content="https://icarus.mx/logo_zoomed.png" />
	<meta property="og:url" content="https://icarus.mx/carreras" />
</svelte:head>

<section class="py-24 px-6 min-h-[80vh] bg-primary-900/60">
	<div class="max-w-4xl mx-auto">

		{#if selected === null}
			<div in:fly={{ y: -20, duration: 300 }}>
				<h1 class="text-4xl md:text-5xl font-black text-primary-100 mb-4 text-center">
					Únete al equipo
				</h1>
				<p class="text-primary-300 text-center text-lg mb-16 max-w-2xl mx-auto">
					Buscamos gente que quiera construir cosas que importen.
				</p>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					{#each roles as role, i}
						<button
							onclick={() => selectRole(i)}
							class="text-left bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 group cursor-pointer"
						>
							<h3 class="text-xl font-bold text-primary-100 mb-2 group-hover:text-red-400 transition-colors duration-200">
								{role.title}
							</h3>
							<p class="text-primary-200/70 leading-relaxed text-sm">{role.summary}</p>
						</button>
					{/each}
				</div>
			</div>
		{:else}
			<div in:fly={{ y: 20, duration: 300 }}>
				<button
					onclick={goBack}
					class="flex items-center gap-2 text-primary-300 hover:text-red-400 transition-colors mb-10 cursor-pointer"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg>
					Todas las vacantes
				</button>

				<h1 class="text-3xl md:text-4xl font-black text-primary-100 mb-12">
					{roles[selected].title}
				</h1>

				<!-- Descripción -->
				<div class="mb-12">
					<h2 class="text-lg font-bold text-primary-200 mb-3">Descripción</h2>
					<p class="text-primary-300 leading-relaxed">{roles[selected].description}</p>
				</div>

				<!-- Cultura -->
				<div class="mb-12 bg-white/5 border border-white/10 rounded-2xl p-8">
					<h2 class="text-lg font-bold text-primary-200 mb-3">¿Cómo es trabajar en icarus?</h2>
					<p class="text-primary-300 leading-relaxed mb-4">
						Somos un equipo donde el trabajo se mide por resultados, no por horas frente a la pantalla. Respetamos tu tiempo y creemos que la mejor versión de ti aparece cuando tienes espacio para vivir fuera del código.
					</p>
					<p class="text-primary-300 leading-relaxed">
						Trabajamos en remoto, con horarios flexibles y una cultura de comunicación directa. Nos importa que crezcas profesionalmente y que disfrutes lo que haces.
					</p>
				</div>

				<!-- Aplicación -->
				<div>
					<h2 class="text-lg font-bold text-primary-200 mb-6">Iniciar aplicación</h2>
					<form onsubmit={handleApply} class="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5">
						<div>
							<label for="app-email" class="block text-sm font-medium text-primary-200 mb-2">Correo</label>
							<input
								id="app-email"
								type="email"
								bind:value={appEmail}
								required
								class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-primary-100 placeholder-primary-400/50 focus:outline-none focus:border-red-400/50 transition-colors"
								placeholder="tu@correo.com"
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-primary-200 mb-2">CV</label>
							<label
								for="cv-upload"
								role="button"
								ondrop={handleDrop}
								ondragover={handleDragOver}
								ondragleave={handleDragLeave}
								class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors {dragOver ? 'border-red-400 bg-red-400/5' : 'border-white/10 hover:border-white/20 bg-white/5'}"
							>
								{#if cvFile}
									<p class="text-primary-200 text-sm">{cvFile.name}</p>
									<p class="text-primary-400/50 text-xs mt-1">Click o arrastra para cambiar</p>
								{:else}
									<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-primary-400/50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
									</svg>
									<p class="text-primary-400/50 text-sm">Arrastra tu archivo o haz click para seleccionar</p>
								{/if}
								<input
									id="cv-upload"
									type="file"
									accept=".pdf,.doc,.docx"
									onchange={handleFileChange}
									class="hidden"
								/>
							</label>
						</div>

						<button
							type="submit"
							disabled={formStatus === 'sending'}
							class="w-full bg-red-400 hover:bg-red-500 disabled:opacity-50 text-primary-950 font-bold py-3 rounded-lg transition-all duration-300 cursor-pointer"
						>
							{#if formStatus === 'sending'}
								Enviando...
							{:else if formStatus === 'sent'}
								Aplicación enviada
							{:else if formStatus === 'error'}
								Error, intenta de nuevo
							{:else}
								Enviar aplicación
							{/if}
						</button>
					</form>
				</div>
			</div>
		{/if}

	</div>
</section>
