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


<section class="bg-secondary-50 text-secondary-900 min-h-[80vh] flex items-center font-primary">
  <div class="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center gap-16 md:gap-20 py-16">
    
    <!-- Text Content -->
    <div class="flex-1 text-left">
      <h1 class=" text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">Entregamos <span class="text-blue-400">software a tiempo</span></h1>
      <p class="mt-6 text-2xl text-gray-700 max-w-xl md:max-w-lg mx-auto md:mx-0">Diseñamos y construimos tecnología para mejorar al mundo.</p>
      <div class="mt-10">
        <a href="/scythe" class="inline-block bg-primary-500 hover:bg-red-600 text-primary-50 font-semibold px-8 py-3 rounded-full shadow-md transition duration-300 ease-in-out">Explora</a>
      </div>
    </div>

    <!-- Image Content -->
    <div class="flex-1 mx-auto">
      <img
        src="/hero.png"
        alt="Hero with man and technology"
        class="w-full max-w-[600px] rounded-2xl transition-transform duration-500 hover:scale-[1.02]"
        width="2432"
        height="1442"
      />
    </div>

  </div>
</section>
