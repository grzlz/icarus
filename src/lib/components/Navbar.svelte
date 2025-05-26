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

<ul
	class="flex flex-col bg-secondary-900 font-primary text-secondary-100 md:hidden p-4 space-y-2 "
	in:slide={{ duration: 400 }}
	out:slide={{ duration: 400 }}
>
		<li class="flex items-center space-x-2 shadow-lg rounded-b-lg p-4 justify-between space-y-3">
		<a href="/scythe" class="hover:underline">Escuela</a>
		<img src="/logo.png" alt="scythe.mx logo" class="w-12 h-12" />
	</li>
	<li class="flex items-center space-x-2 shadow-lg rounded-b-lg p-4 justify-between space-y-3">
		<a href="/scythe" class="hover:underline">Scythe</a>
		<img src="/scythe.png" alt="scythe.mx logo" class="w-12 h-12" />
	</li>
	<li>Portafolio</li>
	<li>Contacto</li>
</ul>

{/if}