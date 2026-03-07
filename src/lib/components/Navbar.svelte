<script>
    import { slide } from 'svelte/transition';

    let mobileOpen = $state(false);

    const links = [
        { label: 'Servicios', href: '/#servicios' },
        { label: 'Proyectos', href: '/proyectos' },
        { label: 'Carreras', href: '/carreras' },
        { label: 'Contacto', href: '/#contacto' }
    ];
</script>

<nav class="sticky top-0 z-50 flex items-center justify-between backdrop-blur-sm bg-primary-950/20 md:px-8 min-h-[60px] px-4 py-2">

    <a href="/" class="text-primary-200 text-lg font-semibold font-primary hidden md:block">ICARUS</a>

    <div class="absolute left-1/2 transform -translate-x-1/2">
        <button onclick={() => mobileOpen = !mobileOpen} class="shrink-0 md:hidden">
            <div class="h-14 w-14">
                <img src="/logo.png" alt="icarus.mx logo" class="h-full w-full object-contain" />
            </div>
        </button>
        <a href="/" class="shrink-0 hidden md:block">
            <div class="h-16 w-16">
                <img src="/logo.png" alt="icarus.mx logo" class="h-full w-full object-contain" />
            </div>
        </a>
    </div>

    <!-- Desktop menu -->
    <ul class="hidden md:flex gap-6 text-primary-200 text-sm font-medium">
        {#each links as link}
            <li>
                <a href={link.href} class="hover:text-red-400 transition-colors duration-200">{link.label}</a>
            </li>
        {/each}
    </ul>
</nav>

<!-- Mobile menu -->
{#if mobileOpen}
<ul class="flex flex-col bg-secondary-900 font-primary text-blue-100 md:hidden p-4 space-y-2" in:slide={{ duration: 400 }} out:slide={{ duration: 400 }}>
    {#each links as link}
        <li class="shadow-lg rounded-b-lg hover:bg-secondary-600 hover:text-blue-50">
            <a href={link.href} class="flex items-center justify-between p-4 gap-3 w-full h-full hover:underline" onclick={() => mobileOpen = false}>
                <span class="text-base font-medium text-primary-100">{link.label}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </a>
        </li>
    {/each}
</ul>
{/if}
