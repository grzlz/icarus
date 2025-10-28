# Glassmorphism en Ariadna: Efectos de Vidrio Líquido

**Técnicas avanzadas de UI para crear interfaces con efecto glassmorphism en SvelteKit + TailwindCSS**

⏱️ Lectura: ~15 minutos | Práctica: 1-2 horas

---

## Tabla de Contenidos

1. [¿Qué es Glassmorphism?](#qué-es-glassmorphism)
2. [Setup en Ariadna](#setup-en-ariadna)
3. [Configuración de Tailwind](#configuración-de-tailwind)
4. [Componentes de Ejemplo](#componentes-de-ejemplo)
5. [Ejercicios Prácticos](#ejercicios-prácticos)

---

<!-- {{{ ¿Qué es Glassmorphism? -->
## ¿Qué es Glassmorphism? (⏱️ 3 min)

Glassmorphism es un estilo de diseño UI que simula vidrio esmerilado o líquido. Se caracteriza por:

- **Transparencia:** Fondos semi-transparentes
- **Blur:** Desenfoque del contenido detrás (backdrop-filter)
- **Bordes sutiles:** Bordes claros, casi invisibles
- **Sombras suaves:** Depth sin ser intrusivo
- **Capas:** Elementos flotantes que muestran lo que hay detrás

**Ejemplos reales:**
- macOS Big Sur+ (menús, notificaciones)
- Windows 11 (taskbar, ventanas)
- iOS 15+ (control center, widgets)

**¿Por qué usarlo?**
- Moderno y elegante
- Crea jerarquía visual sin colores fuertes
- Funciona bien en dark mode
- Diferenciación de marca (Apple, Microsoft lo usan)

**Anti-patrón:** No abuses. Glassmorphism en TODO el sitio es pesado visualmente. Úsalo para elementos destacados: cards, modales, navigation.

**⏱️ Próximo paso (2 min):** Vamos a configurar tu proyecto en Ariadna para trabajar con glassmorphism.
<!-- }}} -->

---

<!-- {{{ Setup en Ariadna -->
## Setup en Ariadna (⏱️ 10 min)

### Crear Proyecto de Práctica (⏱️ 5 min)

```bash
# 1. Crea un nuevo proyecto SvelteKit
npm create svelte@latest glass-practice
# Selecciona: Skeleton project, No TypeScript, No extras

cd glass-practice
npm install

# 2. Instala TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Abre el proyecto en Ariadna
nvim .
```

### Estructura del Proyecto (⏱️ 2 min)

```
glass-practice/
├── src/
│   ├── routes/
│   │   ├── +page.svelte
│   │   └── +layout.svelte
│   ├── lib/
│   │   └── components/
│   │       ├── GlassCard.svelte
│   │       ├── GlassNav.svelte
│   │       └── GlassModal.svelte
│   └── app.css
├── tailwind.config.js
└── package.json
```

### Configurar Tailwind en Ariadna (⏱️ 3 min)

Ahora, desde Ariadna, vamos a configurar los archivos necesarios:

```bash
# Presiona <Space><Space> y escribe "tailwind.config"
# Presiona Enter para abrir el archivo
```

**⏱️ Próximo paso (5 min):** Configurar Tailwind para soportar backdrop-filter y colores personalizados.
<!-- }}} -->

---

<!-- {{{ Configuración de Tailwind -->
## Configuración de Tailwind (⏱️ 15 min)

### Tailwind Config para Glassmorphism (⏱️ 5 min)

Edita `tailwind.config.js` en Ariadna:

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          lighter: 'rgba(255, 255, 255, 0.05)',
          dark: 'rgba(0, 0, 0, 0.1)',
          darker: 'rgba(0, 0, 0, 0.2)',
        }
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
        '5xl': '96px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-inset': 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
}
```

**Comandos de Ariadna útiles aquí:**
```
# Navegar entre llaves/corchetes:
% - salta al cierre de la llave/corchete correspondiente

# Indentar correctamente:
gg=G - reindenta todo el archivo

# Guardar:
<Space>w - guardar archivo
```

### Estilos Globales (⏱️ 5 min)

Edita `src/app.css`:

```bash
# Desde Ariadna:
<Space><Space>
# Escribe: "app.css"
# Enter
```

```css
/* src/app.css */
@import 'tailwindcss';

/* Fondo base para glassmorphism */
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

/* Clases personalizadas de glass */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.glass-hover {
  transition: all 0.3s ease;
}

.glass-hover:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}
```

### Importar Estilos en Layout (⏱️ 3 min)

Edita `src/routes/+layout.svelte`:

```svelte
<script>
  import '../app.css';
</script>

<slot />
```

**Comandos útiles:**
```
# Abrir múltiples archivos relacionados:
<Space>ff - buscar archivos
# Escribe "layout"

# Ver todos los buffers abiertos:
<Space>bb

# Cerrar todos excepto el actual:
:only
```

**⏱️ Próximo paso (30 min):** Crear componentes reales con efecto glass.
<!-- }}} -->

---

<!-- {{{ Componentes de Ejemplo -->
## Componentes de Ejemplo (⏱️ 30 min total)

### 1. Glass Card Básica (⏱️ 10 min)

Crea `src/lib/components/GlassCard.svelte`:

```bash
# En Ariadna:
<Space>e  # Abrir Neo-tree
# Navega a src/lib/components/
# Presiona 'a' para crear archivo nuevo
# Escribe: GlassCard.svelte
```

```svelte
<script>
  let { title, description, children } = $props();
</script>

<div class="glass glass-hover rounded-2xl p-6 max-w-md">
  {#if title}
    <h3 class="text-2xl font-bold text-white mb-2">
      {title}
    </h3>
  {/if}

  {#if description}
    <p class="text-gray-200 mb-4">
      {description}
    </p>
  {/if}

  <div class="text-white">
    {@render children?.()}
  </div>
</div>

<style>
  /* Estilos adicionales específicos del componente */
  div {
    position: relative;
    overflow: hidden;
  }

  div::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
    pointer-events: none;
  }
</style>
```

**⏱️ Práctica (5 min):** Usa la card en `+page.svelte`:

```svelte
<script>
  import GlassCard from '$lib/components/GlassCard.svelte';
</script>

<main class="min-h-screen flex items-center justify-center p-8">
  <GlassCard
    title="Glassmorphism"
    description="Este es un ejemplo de glass card en Ariadna"
  >
    <button class="glass px-4 py-2 rounded-lg text-sm">
      Click me
    </button>
  </GlassCard>
</main>
```

**Comandos de Ariadna útiles aquí:**
```
# Copiar todo el bloque <script>:
va{ - seleccionar todo dentro de llaves
V - modo visual línea
y - copiar (yank)

# Pegar en otro archivo:
p - pegar después del cursor
```

### 2. Glass Navigation (⏱️ 10 min)

Crea `src/lib/components/GlassNav.svelte`:

```svelte
<script>
  let links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' }
  ];

  let mobileMenuOpen = $state(false);
</script>

<nav class="fixed top-0 left-0 right-0 z-50 m-4">
  <div class="glass rounded-full px-6 py-3 mx-auto max-w-4xl">
    <div class="flex items-center justify-between">
      <!-- Logo -->
      <div class="text-white font-bold text-xl">
        Ariadna
      </div>

      <!-- Desktop Links -->
      <div class="hidden md:flex gap-6">
        {#each links as link}
          <a
            href={link.href}
            class="text-white hover:text-gray-200 transition-colors"
          >
            {link.label}
          </a>
        {/each}
      </div>

      <!-- Mobile Menu Button -->
      <button
        class="md:hidden text-white"
        onclick={() => mobileMenuOpen = !mobileMenuOpen}
      >
        Menu
      </button>
    </div>

    <!-- Mobile Menu -->
    {#if mobileMenuOpen}
      <div class="md:hidden mt-4 pt-4 border-t border-white/20">
        {#each links as link}
          <a
            href={link.href}
            class="block py-2 text-white hover:text-gray-200"
          >
            {link.label}
          </a>
        {/each}
      </div>
    {/if}
  </div>
</nav>
```

**⏱️ Práctica (5 min):** Añade el nav a tu layout:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import '../app.css';
  import GlassNav from '$lib/components/GlassNav.svelte';
</script>

<GlassNav />
<slot />
```

### 3. Glass Modal (⏱️ 10 min)

Crea `src/lib/components/GlassModal.svelte`:

```svelte
<script>
  let { open = $bindable(false), title, children } = $props();

  function closeModal() {
    open = false;
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    onclick={handleBackdropClick}
    role="button"
    tabindex="0"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

    <!-- Modal Content -->
    <div class="glass rounded-3xl p-8 max-w-lg w-full relative z-10">
      <div class="flex justify-between items-start mb-6">
        <h2 class="text-3xl font-bold text-white">
          {title}
        </h2>
        <button
          onclick={closeModal}
          class="text-white hover:text-gray-200 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <div class="text-white">
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}
```

**⏱️ Práctica (5 min):** Usa el modal:

```svelte
<!-- src/routes/+page.svelte -->
<script>
  import GlassCard from '$lib/components/GlassCard.svelte';
  import GlassModal from '$lib/components/GlassModal.svelte';

  let modalOpen = $state(false);
</script>

<main class="min-h-screen flex items-center justify-center p-8 pt-24">
  <GlassCard title="Glassmorphism">
    <button
      class="glass px-4 py-2 rounded-lg"
      onclick={() => modalOpen = true}
    >
      Open Modal
    </button>
  </GlassCard>

  <GlassModal bind:open={modalOpen} title="Glass Modal">
    <p>Este es un modal con efecto glassmorphism.</p>
    <p class="mt-4">El fondo se difumina automáticamente.</p>
  </GlassModal>
</main>
```

**Comandos de Ariadna para trabajar con múltiples componentes:**
```
# Ver todos los archivos abiertos:
<Space>bb

# Split vertical para ver dos archivos lado a lado:
:vsplit

# Split horizontal:
:split

# Navegar entre splits:
<Ctrl-w>h - ir a split izquierdo
<Ctrl-w>l - ir a split derecho
<Ctrl-w>j - ir a split inferior
<Ctrl-w>k - ir a split superior

# Cerrar split actual:
:q
```

**⏱️ Próximo paso (1 hora):** Ejercicios prácticos para dominar glassmorphism.
<!-- }}} -->

---

<!-- {{{ Ejercicios Prácticos -->
## Ejercicios Prácticos (⏱️ 1-2 horas)

### Ejercicio 1: Glassmorphic Dashboard (⏱️ 30 min)

**Objetivo:** Crear un dashboard con múltiples glass cards mostrando información.

**Requisitos:**
1. Grid de 3 columnas en desktop, 1 en mobile
2. 6 cards diferentes con iconos y datos
3. Hover effects en cada card
4. Background gradient animado

**Pistas:**
```svelte
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <GlassCard title="Users">
    <div class="text-4xl font-bold">1,234</div>
  </GlassCard>
  <!-- Más cards... -->
</div>
```

**⏱️ Tiempo de práctica:** 30 minutos

---

### Ejercicio 2: Glassmorphic Hero Section (⏱️ 20 min)

**Objetivo:** Crear una hero section con texto sobre glass y CTA buttons.

**Requisitos:**
1. Background con gradiente o imagen
2. Título y descripción sobre glass card
3. Dos botones con efecto glass
4. Animación de entrada (fade in)

**Pistas:**
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**⏱️ Tiempo de práctica:** 20 minutos

---

### Ejercicio 3: Glassmorphic Form (⏱️ 30 min)

**Objetivo:** Crear un formulario de contacto con inputs en glass.

**Requisitos:**
1. Formulario con email, mensaje, submit
2. Inputs con efecto glass
3. Validation states (error/success) también glass
4. Focus states visibles

**Pistas:**
```svelte
<input
  type="email"
  class="glass w-full px-4 py-3 rounded-lg text-white placeholder-gray-300
         focus:outline-none focus:ring-2 focus:ring-white/50"
  placeholder="tu@email.com"
/>
```

**⏱️ Tiempo de práctica:** 30 minutos

---

### Ejercicio 4: Glassmorphic Image Gallery (⏱️ 40 min)

**Objetivo:** Galería de imágenes con overlays en glass al hacer hover.

**Requisitos:**
1. Grid de imágenes (usa placeholders de unsplash.com)
2. Al hacer hover, overlay glass con título y descripción
3. Modal glass al hacer click en imagen
4. Navegación entre imágenes en modal

**Pistas:**
```svelte
<div class="relative group">
  <img src="..." alt="..." class="rounded-lg" />
  <div class="absolute inset-0 glass opacity-0 group-hover:opacity-100
              transition-opacity flex items-center justify-center">
    <h3>Título</h3>
  </div>
</div>
```

**⏱️ Tiempo de práctica:** 40 minutos

---

### Ejercicio Extra: Glassmorphic Landing Page Completa (⏱️ 2 horas)

**Objetivo:** Landing page completa con glassmorphism como tema visual.

**Secciones:**
1. Hero con glass nav
2. Features section (3 cards)
3. Testimonials (glass cards con avatars)
4. Pricing (3 tiers en glass cards)
5. Footer con links en glass

**Requisitos técnicos:**
- Responsive (mobile-first)
- Smooth scroll entre secciones
- Animaciones al scroll
- Dark mode toggle (opcional)

**⏱️ Tiempo de práctica:** 2 horas

---

### Tips para Practicar en Ariadna (⏱️ 5 min)

**Workflow recomendado:**

1. **Split screen para ver código y resultado:**
```bash
# Terminal 1 (Ariadna):
nvim .

# Terminal 2 (Dev server):
npm run dev
```

2. **Live reload automático:**
SvelteKit recarga automáticamente. Guarda con `:w` y mira el navegador.

3. **Iteración rápida:**
```
# En Ariadna:
1. Edita componente
2. <Space>w para guardar
3. Cambia al navegador (Cmd+Tab en macOS)
4. Observa cambios
5. Vuelve a Ariadna (Cmd+Tab)
```

4. **Debugging con Ariadna:**
```
# Si algo se rompe:
<Space>fg - buscar por mensaje de error
:Telescope diagnostics - ver todos los errores LSP
```

5. **Guardar versiones:**
```bash
# Antes de cambios grandes:
git add .
git commit -m "glass card working"

# Desde Ariadna:
<Space>gg - abrir Lazygit
```

**Anti-patrón:** No copies y pegues todo el código. Escribe línea por línea para aprender los atajos de Ariadna y entender qué hace cada parte.
<!-- }}} -->

---

## Recursos Adicionales (⏱️ 2 min)

### Referencias de Glassmorphism:
- [glassmorphism.com](https://glassmorphism.com) - Generador online
- [ui.glass](https://ui.glass) - Más ejemplos
- [cssglassmorphism](https://hype4.academy/tools/glassmorphism-generator) - Otro generador

### Compatibilidad de Navegadores:
```
backdrop-filter:
✅ Chrome 76+
✅ Safari 9+
✅ Firefox 103+
❌ IE 11 (nunca)
```

**Fallback para navegadores sin backdrop-filter:**
```css
.glass {
  background: rgba(255, 255, 255, 0.2); /* Más opaco como fallback */
}

@supports (backdrop-filter: blur(10px)) {
  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
}
```

### Optimización de Performance:
```css
/* backdrop-filter es costoso, úsalo con moderación */

/* ✅ BIEN: Pocos elementos glass */
.modal { backdrop-filter: blur(10px); }

/* ❌ MAL: Todo el sitio con glass */
* { backdrop-filter: blur(10px); } /* NO HAGAS ESTO */

/* ✅ BIEN: Reduce blur en mobile */
@media (max-width: 768px) {
  .glass { backdrop-filter: blur(5px); }
}
```

---

## Conclusión (⏱️ 2 min)

Has completado la guía de glassmorphism en Ariadna. Ahora sabes:
- ✅ Qué es glassmorphism y cuándo usarlo
- ✅ Configurar Tailwind para efectos glass
- ✅ Crear componentes Svelte con efecto glass
- ✅ Trabajar en Ariadna con múltiples archivos
- ✅ Optimizar performance y compatibilidad

**Próximos pasos:**
1. Completa al menos 3 de los ejercicios prácticos
2. Crea tu propia biblioteca de componentes glass
3. Úsalo en un proyecto real de CRETA
4. Experimenta con variaciones (glass oscuro, blur intenso, gradientes)

**Recuerda:** Glassmorphism es una herramienta, no una solución universal. Úsalo donde tenga sentido, no en todo el sitio.

---

*Guía técnica creada para estudiantes de CRETA - Icarus Coding School*
*Última actualización: Octubre 2025*
*Editado completamente en Ariadna*
