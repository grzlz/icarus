<script>
	import { track } from '@vercel/analytics/sveltekit';

	let start = $state(Date.now());

  function handleClick() {
      track('Signup');
    }


	function handleVisibilityChange() {
		if (document.visibilityState === 'hidden') {
			const seconds = Math.round((Date.now() - start) / 1000);
			track('time-spent-home', { seconds });
		}
	}

	$effect(() => {
		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
	});
</script>

<svelte:head>
	<!-- General Metadata -->
	<title>icarus.mx</title>
	<meta name="description" content="Icarus es mitad escuela mitad fábrica socialista de software." />

	<!-- Open Graph Metadata -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content="icarus.mx | ¿Ok pero qué es Scythe?" />
	<meta property="og:description" content="Scythe es un nuevo sistema de producción y gobierno. Está en construcción. Da click si quieres saber más." />
	<meta property="og:image" content="https://icarus.mx/logo_zoomed.png" />
	<meta property="og:url" content="https://icarus.mx" />
	<meta property="og:site_name" content="icarus.mx" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://icarus.mx" />
	<meta property="twitter:title" content="icarus.mx | ¿Ok pero qué es Scythe?" />
	<meta property="twitter:description" content="Scythe es un nuevo sistema de producción y gobierno. Está en construcción. Da click si quieres saber más." />
	<meta property="twitter:image" content="https://icarus.mx/logo_zoomed.png" />
</svelte:head>

<section class="bg-gradient-to-b from-primary-950 via-primary-900 to-primary-700 text-primary-50 min-h-[90vh] flex items-center justify-center relative overflow-hidden">

  
  <div class="max-w-4xl mx-auto px-6 md:px-10 text-center relative z-10">
    <!-- Main heading -->
    <div class="space-y-2">
      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight">
        Entregamos <span class="text-red-400 relative inline-block">
          software
          <div class="absolute -bottom-1 md:-bottom-2 left-0 w-full h-0.5 md:h-1 bg-red-400 rounded"></div>
        </span>
      </h1>
      <h2 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight text-primary-400">
        a tiempo
      </h2>
    </div>
    
    <!-- Subtitle -->
    <div class="mt-12 space-y-6">
      <p class="text-lg sm:text-xl md:text-2xl lg:text-3xl text-primary-200 max-w-3xl mx-auto leading-relaxed">
        Estamos construyendo <span class="font-bold text-red-400">Scythe</span>
      </p>
      
      <!-- Call to action -->
      <div class="mt-16 flex justify-center">
        <a href="https://blog.scythe.mx" class="inline-block bg-red-500 hover:bg-red-400 text-white font-bold text-lg px-12 py-4 rounded-full shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-red-500/25">
          Entrar
        </a>
      </div>
    </div>
  </div>
</section>
