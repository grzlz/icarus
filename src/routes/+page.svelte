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


<section class="bg-gradient-to-br from-secondary-600 via-secondary-700 to-secondary-800 text-primary-50 min-h-[90vh] flex items-center justify-center relative overflow-hidden">
  <!-- Background pattern with subtle Scythe logos -->
  <div class="absolute inset-0 opacity-5">
    <img src="/logo_scythe.png" alt="" class="hidden sm:block absolute top-16 left-12 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 opacity-30 rotate-12" />
    <img src="/logo_scythe.png" alt="" class="hidden md:block absolute top-32 right-20 w-12 md:w-16 h-12 md:h-16 opacity-20 -rotate-12" />
    <img src="/logo_scythe.png" alt="" class="hidden sm:block absolute bottom-40 left-24 w-16 sm:w-20 h-16 sm:h-20 opacity-25 rotate-45" />
    <img src="/logo_scythe.png" alt="" class="hidden lg:block absolute bottom-20 right-32 w-24 lg:w-28 h-24 lg:h-28 opacity-15 -rotate-6" />
    <img src="/logo_scythe.png" alt="" class="hidden md:block absolute top-1/2 left-8 w-10 md:w-12 h-10 md:h-12 opacity-35 rotate-90" />
    <img src="/logo_scythe.png" alt="" class="hidden lg:block absolute top-2/3 right-12 w-16 lg:w-18 h-16 lg:h-18 opacity-20 -rotate-45" />
  </div>
  
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
