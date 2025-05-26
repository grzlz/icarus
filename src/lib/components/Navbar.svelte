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
        <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 fill-yellow-100 text-secondary-100" viewBox="0 0 24 24">
            <path d="M10 4H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" />
        </svg>
    </li>

    <li class="shadow-lg rounded-b-lg hover:bg-secondary-600 hover:text-blue-50">
        <a href="https://wa.me/525548017016?text=Hola%2C%20quiero%20más%20información%20sobre%20icarus.mx" target="_blank" class="flex items-center justify-between p-4 gap-3 w-full h-full hover:underline">
            <span>Contacto</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-9 h-9 text-green-500 fill-current" aria-label="WhatsApp logo">
                <path d="M16 .396c-8.837 0-16 7.163-16 16 0 2.82.735 5.59 2.13 8.031L0 32l7.745-2.021c2.355 1.29 5.028 1.97 7.794 1.97 8.837 0 16-7.163 16-16S24.837.396 16 .396zm0 29.202c-2.475 0-4.9-.661-7.03-1.916l-.506-.295-4.6 1.201 1.226-4.48-.313-.515a13.393 13.393 0 01-2.08-7.094c0-7.433 6.048-13.481 13.481-13.481S29.481 7.963 29.481 15.396 23.433 29.598 16 29.598zm7.458-10.553c-.408-.204-2.408-1.188-2.782-1.325-.375-.14-.65-.204-.926.204-.277.409-1.063 1.325-1.304 1.6-.24.277-.48.307-.888.102-.408-.204-1.719-.633-3.275-2.02-1.21-1.079-2.021-2.408-2.261-2.816-.24-.408-.026-.63.18-.834.184-.183.409-.48.612-.72.204-.24.271-.408.409-.68.136-.272.068-.51-.034-.714-.102-.204-.926-2.24-1.27-3.067-.334-.804-.676-.696-.926-.71l-.79-.014c-.272 0-.71.102-1.082.51-.372.408-1.418 1.385-1.418 3.38 0 1.995 1.454 3.923 1.656 4.196.204.273 2.86 4.375 6.93 6.133.968.417 1.723.666 2.311.853.971.308 1.855.264 2.556.161.78-.117 2.408-.984 2.748-1.933.34-.95.34-1.766.238-1.933-.102-.17-.373-.272-.78-.477z"/>
            </svg>
        </a>
    </li>
</ul>

{/if}