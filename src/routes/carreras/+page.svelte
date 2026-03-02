<svelte:head>
	<title>Carreras | icarus.mx</title>
	<meta name="description" content="Únete al equipo de icarus.mx. Buscamos gente que quiera construir cosas que importen." />

	<meta property="og:type" content="website" />
	<meta property="og:title" content="Carreras | icarus.mx" />
	<meta property="og:description" content="Únete al equipo de icarus.mx. Buscamos gente que quiera construir cosas que importen." />
	<meta property="og:image" content="https://icarus.mx/logo_zoomed.png" />
	<meta property="og:url" content="https://icarus.mx/carreras" />
</svelte:head>

<section class="py-24 px-6 min-h-[80vh]">
	<div class="max-w-6xl mx-auto">
		<h1 class="text-4xl md:text-5xl font-black text-primary-100 mb-4 text-center">
			Únete al equipo
		</h1>
		<p class="text-primary-300 text-center text-lg mb-16 max-w-2xl mx-auto">
			Buscamos gente que quiera construir cosas que importen.
		</p>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each [
				{ title: 'Designer', description: 'UI/UX, branding y producto. Que se vea bien y funcione mejor.' },
				{ title: 'Agentic-Assisted Engineer', description: 'Desarrollo asistido por agentes de IA. El futuro del software.' },
				{ title: 'DevOps & Infrastructure Engineer', description: 'CI/CD, cloud, infraestructura. Que nada se caiga.' },
				{ title: 'Frontend Developer', description: 'Interfaces rápidas, accesibles y con buen gusto.' }
			] as role}
				<a
					href="https://wa.me/525548017016?text=Hola%2C%20me%20interesa%20la%20vacante%20de%20{encodeURIComponent(role.title)}"
					target="_blank"
					class="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 group"
				>
					<h3 class="text-xl font-bold text-primary-100 mb-2 group-hover:text-red-400 transition-colors duration-200">
						{role.title}
					</h3>
					<p class="text-primary-200/70 leading-relaxed text-sm">{role.description}</p>
				</a>
			{/each}
		</div>
	</div>
</section>
