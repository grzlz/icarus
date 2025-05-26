<script>
    import { slide } from 'svelte/transition';

    let logoClick = $state(false)
</script>

<nav class="flex justify-around bg-secondary-800 items-center">
    <h1 class="hidden md:flex text-primary-200">ICARUS</h1>

    <button onclick={() => logoClick = !logoClick}>
        <div class="h-16 w-16 md:h-14 md:w-14 shrink-0">
            <img src="/logo.png" alt="icarus.mx logo">
        </div>
    </button>
    

    <ul class="hidden md:flex gap-4 text-primary-200 mr-0" >
        <li>Escuela</li>
        <li>Scythe</li>
        <li>Portafolio</li>
        <li>Contacto</li>
    </ul>

</nav>

{#if logoClick}

<ul class="flex flex-col bg-secondary-900 font-primary text-blue-100 md:hidden p-4 space-y-2" in:slide={{ duration: 400 }} out:slide={{ duration: 400 }}>
    <li class="flex items-center space-x-2 shadow-lg rounded-b-lg p-4 justify-between space-y-3 hover:bg-secondary-600 hover:text-blue-50">
        <a href="/scythe" class="hover:underline">Escuela</a>
        <img src="/logo.png" alt="scythe.mx logo" class="w-12 h-12" />
	</li>
	
    <li class="flex items-center space-x-2 shadow-lg rounded-b-lg p-4 justify-between space-y-3 hover:bg-secondary-600 hover:text-blue-50">
		<a href="/scythe" class="hover:underline">Scythe</a>
		<img src="/scythe.png" alt="scythe.mx logo" class="w-12 h-12" />
	</li>
	
    <li class="flex items-center justify-between shadow-lg rounded-b-lg p-4 hover:bg-secondary-600 hover:text-blue-50">
        <a href="/portafolio" class="flex items-center gap-3 hover:underline">Portafolio</a>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 fill-yellow-100 text-secondary-100" viewBox="0 0 24 24">
            <path d="M10 4H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" />
        </svg>
    </li>
    
    <li class="flex items-center justify-between shadow-lg rounded-b-lg p-4 hover:bg-secondary-600 hover:text-blue-50">
        <a href="https://wa.me/5215512345678?text=Hola%2C%20quiero%20más%20información%20sobre%20Scythe" target="_blank" class="flex items-center gap-3 hover:underline">
            Contacto
        </a>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-400" viewBox="0 0 448 512" fill="currentColor">
          <path d="M380.9 97.1C339 55.2 283.3 32 224.5 32 123.8 32 40 115.8 40 216.5c0 38 10 75 29.2 107.6L32 480l158.7-41.7c30.5 8.4 62.3 12.7 94.1 12.7h.1c100.7 0 184.5-83.8 184.5-184.5 0-58.8-23.2-114.5-65.1-156.4zM224.5 426c-27.5 0-54.7-4.4-80.3-13.1l-5.7-1.9-94.4 24.8 25.2-92-3.6-5.9c-18.6-30.3-28.4-65.3-28.4-101.4C37.3 132.4 122.4 47.3 224.5 47.3c50.5 0 97.9 19.7 133.6 55.4s55.4 83.1 55.4 133.6c0 102.1-85.1 187.2-188 187.2zm101.6-138.9c-5.6-2.8-33.1-16.3-38.3-18.1s-8.9-2.8-12.7 2.8-14.6 18.1-17.9 21.8-6.6 4.2-12.2 1.4-23.7-8.7-45.2-27.9c-16.7-14.9-27.9-33.3-31.1-38.9s-.3-8.7 2.5-11.5c2.6-2.6 5.6-6.6 8.4-9.9 2.8-3.3 3.7-5.6 5.6-9.3s.9-7-0.5-9.8-12.7-30.5-17.4-41.8c-4.6-11.1-9.3-9.6-12.7-9.8s-7 0-10.7 0c-3.7 0-9.8 1.4-15 7s-19.7 19.2-19.7 46.9 20.2 54.3 23 58c2.8 3.7 39.7 60.6 96.2 85.1 13.4 5.8 23.8 9.3 31.9 11.9 13.4 4.3 25.6 3.7 35.2 2.3 10.7-1.6 33.1-13.5 37.8-26.5 4.7-13 4.7-24.1 3.3-26.5-1.3-2.4-5.1-3.9-10.7-6.6z"/>
        </svg>

	</li>
</ul>

{/if}