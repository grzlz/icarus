# Guía Completa de Ariadna: Tu Editor Neovim en CRETA

**Una guía práctica para estudiantes de Icarus que quieren dominar su entorno de desarrollo**

⏱️ Lectura total: ~20 minutos | Práctica recomendada: 2-3 horas

---

## Tabla de Contenidos

1. [¿Qué es Ariadna?](#qué-es-ariadna)
2. [Instalación](#instalación)
3. [Primeros Pasos](#primeros-pasos)
4. [Comandos Esenciales](#comandos-esenciales)
5. [Flujo de Trabajo Real](#flujo-de-trabajo-real)
6. [Exploración y Personalización](#exploración-y-personalización)
7. [Troubleshooting](#troubleshooting)

---

<!-- {{{ ¿Qué es Ariadna? -->
## ¿Qué es Ariadna? (⏱️ 3 min)

Ariadna es la distribución de Neovim personalizada para estudiantes de CRETA en Icarus. Piensa en ella como tu Visual Studio Code, pero:
- Vive completamente en la terminal
- Es más rápida (significativamente)
- Te obliga a usar el teclado (nada de mouse)
- Está configurada específicamente para desarrollo web moderno (SvelteKit, TailwindCSS, JavaScript)

**¿Por qué Ariadna en lugar de LazyVim o AstroNvim?**
Porque está configurada para CRETA. No necesitas pasar días ajustando plugins para Svelte o Tailwind. Todo está listo para trabajar en los proyectos reales que vas a hacer en Icarus.

**La curva de aprendizaje:**
- Semana 1: Te vas a sentir lento (es normal)
- Semana 2-3: Vas a igualar tu velocidad con VS Code
- Semana 4+: Vas a ser más rápido que con cualquier editor gráfico

**Anti-patrón:** No intentes aprender todos los comandos de vim al mismo tiempo. Aprende los esenciales primero, luego expande.
<!-- }}} -->

---

<!-- {{{ Instalación -->
## Instalación (⏱️ 10 min)

### Prerrequisitos

Antes de instalar Ariadna, necesitas:

```bash
# Verifica que tengas Neovim 0.9+
nvim --version

# Si no lo tienes, instala:
# macOS
brew install neovim

# Necesitas Node.js (para LSP servers)
node --version  # Debe ser 18+

# Git (ya deberías tenerlo)
git --version
```

### Instalación de Ariadna

```bash
# 1. Clona el repositorio de Ariadna
git clone https://github.com/icarus-mx/ariadna.git ~/.config/nvim

# 2. Inicia Neovim (primera vez tomará unos minutos instalando plugins)
nvim

# 3. Espera a que termine la instalación (verás mensajes en pantalla)
# Cuando termine, cierra y vuelve a abrir
:q
nvim
```

### Verificación de Instalación (⏱️ 2 min)

```bash
# Abre Neovim
nvim

# Dentro de Neovim, ejecuta:
:checkhealth

# Busca errores en:
# - nvim
# - lazy (plugin manager)
# - mason (LSP installer)
# - telescope (file finder)
```

Si ves errores, anótalos para la sección de troubleshooting.

**Próximo paso:** Ahora que Ariadna está instalada, vamos a aprender a moverte dentro del editor.
<!-- }}} -->

---

<!-- {{{ Primeros Pasos -->
## Primeros Pasos (⏱️ 15 min de lectura + 30 min de práctica)

### Los Modos de Vim

Vim tiene modos. Esto es lo más confuso al principio, pero es lo que lo hace poderoso.

**1. Normal Mode (Modo Normal)** - Tu modo por defecto
- Navegas por el archivo
- Ejecutas comandos
- NO escribes texto
- Identificación: El cursor es un bloque

**2. Insert Mode (Modo Inserción)** - Escribir texto
- Aquí sí escribes como en cualquier editor
- Entras con `i`, `a`, `o`
- Sales con `<Esc>` o `jk`
- Identificación: El cursor es una línea vertical

**3. Visual Mode (Modo Visual)** - Seleccionar texto
- Seleccionas texto para copiar/cortar
- Entras con `v` (caracteres), `V` (líneas), `<Ctrl-v>` (bloque)
- Sales con `<Esc>`

**4. Command Mode (Modo Comando)** - Ejecutar comandos
- Ejecutas comandos especiales
- Entras con `:`
- Ejemplo: `:w` (guardar), `:q` (salir)

### Tu Primera Sesión (⏱️ 10 min práctica)

```bash
# 1. Abre un archivo de prueba
nvim ~/prueba-ariadna.txt

# 2. Estás en Normal Mode (no puedes escribir todavía)

# 3. Presiona 'i' para entrar a Insert Mode
# Verás -- INSERT -- en la parte inferior

# 4. Escribe: "Hola desde Ariadna"

# 5. Presiona <Esc> para volver a Normal Mode

# 6. Escribe: :w (y Enter) para guardar

# 7. Escribe: :q (y Enter) para salir
```

**¡Felicidades!** Acabas de editar tu primer archivo en Ariadna.

### Navegación Básica (⏱️ 15 min práctica)

En Normal Mode:

```
Movimiento básico:
h - izquierda
j - abajo
k - arriba
l - derecha

Movimiento por palabras:
w - siguiente palabra
b - palabra anterior
e - final de palabra

Movimiento en línea:
0 - inicio de línea
$ - final de línea
^ - primer carácter no blanco

Movimiento en archivo:
gg - inicio del archivo
G - final del archivo
5G - ir a línea 5
{number}G - ir a línea {number}
```

**Ejercicio práctico:** Crea un archivo con 20 líneas de texto y practica moverte sin tocar las flechas del teclado.

**Anti-patrón:** No uses las flechas del teclado. Sí, es tentador, pero te va a hacer más lento a largo plazo.

**Próximo paso:** Ahora que sabes moverte, vamos a aprender los comandos esenciales para trabajar de verdad.
<!-- }}} -->

---

<!-- {{{ Comandos Esenciales -->
## Comandos Esenciales (⏱️ 10 min de lectura + 1 hora de práctica)

### Edición de Texto (⏱️ 15 min práctica)

```
Entrar a Insert Mode:
i - insertar antes del cursor
a - insertar después del cursor
I - insertar al inicio de la línea
A - insertar al final de la línea
o - nueva línea abajo
O - nueva línea arriba

Borrar texto (en Normal Mode):
x - borrar carácter bajo el cursor
dw - borrar palabra
dd - borrar línea completa
d$ - borrar hasta el final de la línea
d0 - borrar hasta el inicio de la línea

Deshacer y rehacer:
u - deshacer (undo)
<Ctrl-r> - rehacer (redo)

Copiar y pegar:
yy - copiar línea (yank)
yw - copiar palabra
p - pegar después del cursor
P - pegar antes del cursor

Buscar y reemplazar:
/texto - buscar "texto" hacia adelante
?texto - buscar "texto" hacia atrás
n - siguiente resultado
N - resultado anterior
:%s/viejo/nuevo/g - reemplazar todo
:s/viejo/nuevo/g - reemplazar en línea actual
```

### Comandos de Ariadna Específicos (⏱️ 20 min práctica)

Estos son los comandos que Ariadna añade sobre Neovim base:

```
Explorador de archivos (Neo-tree):
<Space>e - abrir/cerrar explorador de archivos
<Space>E - abrir explorador enfocado

Navegación entre archivos:
<Space><Space> - buscar archivos (Telescope)
<Space>ff - buscar archivos (alternativo)
<Space>fg - buscar en contenido (grep)
<Space>fb - buscar en buffers abiertos
<Space>fr - archivos recientes

Gestión de buffers (archivos abiertos):
<Space>bd - cerrar buffer actual
<Space>bn - siguiente buffer
<Space>bp - buffer anterior

LSP (Language Server - autocompletado inteligente):
gd - ir a definición
gr - ver referencias
K - mostrar documentación
<Space>ca - code actions
<Space>rn - renombrar símbolo

Terminal integrado:
<Space>t - abrir terminal flotante
<Ctrl-\><Ctrl-n> - salir del modo terminal

Git (dentro de Ariadna):
<Space>gg - abrir Lazygit
<Space>gb - git blame de línea actual
<Space>gd - git diff
```

### Plegado de Código (Folding) (⏱️ 10 min práctica)

Ariadna soporta fold markers para organizar archivos grandes:

```
za - toggle fold (abrir/cerrar)
zc - cerrar fold
zo - abrir fold
zM - cerrar todos los folds
zR - abrir todos los folds
```

Cuando veas comentarios con `{{{` y `}}}`, son fold markers. Útil para esta guía y para organizar código.

**Ejercicio práctico:** Abre esta guía en Ariadna y practica plegando/desplegando secciones.

**Próximo paso:** Vamos a ver un flujo de trabajo real editando un proyecto de SvelteKit.
<!-- }}} -->

---

<!-- {{{ Flujo de Trabajo Real -->
## Flujo de Trabajo Real (⏱️ 15 min de lectura + 1 hora de práctica)

### Editando un Proyecto SvelteKit (⏱️ 30 min práctica)

Imagina que estás trabajando en un proyecto de CRETA. Aquí está el flujo completo:

```bash
# 1. Navega a tu proyecto
cd ~/icarus/mi-proyecto-svelte

# 2. Abre el proyecto en Ariadna
nvim .

# Ahora estás en Ariadna con el proyecto cargado
```

**Paso 1: Explorar la estructura del proyecto (⏱️ 5 min)**

```
# Presiona <Space>e para abrir Neo-tree
# Verás tu estructura de archivos a la izquierda

src/
├── routes/
│   ├── +page.svelte
│   └── +layout.svelte
├── lib/
│   └── components/
│       ├── Navbar.svelte
│       └── Footer.svelte
└── app.css

# Navega con j/k
# Presiona <Enter> para abrir un archivo
# Presiona <Space>e de nuevo para cerrar Neo-tree
```

**Paso 2: Buscar archivos rápidamente (⏱️ 5 min)**

```
# Presiona <Space><Space> (dos veces la barra espaciadora)
# Verás un buscador fuzzy (Telescope)

# Empieza a escribir: "navbar"
# Telescope filtrará en tiempo real
# Usa <Ctrl-j> y <Ctrl-k> para navegar
# Presiona <Enter> para abrir el archivo
```

**Paso 3: Editar un componente Svelte (⏱️ 10 min)**

```svelte
<!-- Estás editando src/lib/components/Navbar.svelte -->
<script>
  let mobileMenuOpen = $state(false);

  function toggleMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
</script>

<nav class="bg-primary-900">
  <button onclick={toggleMenu}>
    Menu
  </button>
</nav>
```

**Comandos útiles mientras editas:**

```
# Ir a definición de una función
# Posiciona el cursor sobre "toggleMenu" y presiona gd

# Ver todas las referencias de una variable
# Posiciona el cursor sobre "mobileMenuOpen" y presiona gr

# Renombrar una variable en todo el archivo
# Posiciona el cursor sobre la variable y presiona <Space>rn

# Ver documentación de una función/componente
# Posiciona el cursor sobre ella y presiona K
```

**Paso 4: Trabajar con múltiples archivos (⏱️ 5 min)**

```
# Abre varios archivos con <Space><Space>
# Abre: Navbar.svelte, Footer.svelte, +page.svelte

# Navega entre ellos:
<Space>bb - ver lista de buffers abiertos
<Space>bn - siguiente buffer
<Space>bp - buffer anterior

# Cierra el que no necesitas:
<Space>bd - cerrar buffer actual
```

**Paso 5: Buscar en todo el proyecto (⏱️ 5 min)**

```
# Presiona <Space>fg (find grep)
# Escribe: "mobileMenuOpen"
# Verás todos los archivos donde aparece esa variable

# Navega con <Ctrl-j> y <Ctrl-k>
# Presiona <Enter> para ir a ese archivo
```

### Workflow con Git (⏱️ 15 min práctica)

Ariadna integra Lazygit para manejar Git desde dentro del editor:

```
# Presiona <Space>gg para abrir Lazygit

# En Lazygit:
# - Navega con j/k
# - Presiona <Space> para stage/unstage archivos
# - Presiona 'c' para commit
# - Presiona 'p' para push
# - Presiona 'q' para salir

# Ver git blame de línea actual:
<Space>gb

# Ver git diff:
<Space>gd
```

**Anti-patrón:** No salgas de Ariadna para hacer commits en otra terminal. Usa Lazygit integrado. Es más rápido y mantiene tu contexto.

**Próximo paso:** Ahora vamos a ver cómo personalizar Ariadna para tu flujo de trabajo.
<!-- }}} -->

---

<!-- {{{ Exploración y Personalización -->
## Exploración y Personalización (⏱️ 10 min de lectura + 30 min de exploración)

### Estructura de Configuración de Ariadna (⏱️ 5 min)

```bash
~/.config/nvim/
├── init.lua              # Punto de entrada
├── lua/
│   ├── config/
│   │   ├── options.lua   # Configuración general de Neovim
│   │   ├── keymaps.lua   # Atajos de teclado
│   │   └── lazy.lua      # Gestor de plugins
│   └── plugins/
│       ├── ariadna.lua   # Plugin principal de Ariadna
│       ├── telescope.lua # Buscador de archivos
│       ├── neo-tree.lua  # Explorador de archivos
│       └── ...           # Otros plugins
└── static/
    └── ariadna/
        └── biblioteca/   # Arte ASCII de Ariadna
```

### Personalizaciones Comunes (⏱️ 10 min práctica)

**1. Cambiar atajos de teclado:**

```lua
-- Edita ~/.config/nvim/lua/config/keymaps.lua
-- Ejemplo: cambiar <Space>e por <Space>t para abrir Neo-tree

vim.keymap.set("n", "<leader>t", ":Neotree toggle<CR>", { desc = "Toggle file tree" })
```

**2. Ajustar opciones de editor:**

```lua
-- Edita ~/.config/nvim/lua/config/options.lua
-- Ejemplos comunes:

vim.opt.relativenumber = true  -- Números de línea relativos
vim.opt.tabstop = 2            -- Tamaño de tabulación
vim.opt.shiftwidth = 2         -- Tamaño de indentación
vim.opt.wrap = false           -- No envolver líneas largas
```

**3. Añadir plugins:**

```lua
-- Edita ~/.config/nvim/lua/plugins/tu-plugin.lua
-- Ariadna usa lazy.nvim como gestor de plugins

return {
  "nombre-autor/nombre-plugin",
  config = function()
    -- Configuración del plugin aquí
  end,
}
```

### Explorando Comandos Disponibles (⏱️ 5 min)

```
# Ver todos los comandos de Ariadna:
:Telescope keymaps

# Busca por "space" para ver todos los atajos con <Space>

# Ver ayuda de cualquier comando:
:help {comando}

# Ejemplo:
:help telescope.nvim
```

### Biblioteca de Arte ASCII (⏱️ 5 min exploración)

Ariadna incluye arte ASCII personalizado. Explóralo:

```bash
# Desde Ariadna:
<Space><Space>
# Escribe: "biblioteca"
# Verás archivos .txt con arte ASCII

# Abre ariadna-logo.txt para ver el logo principal
```

**Próximo paso:** Si algo sale mal, aquí está cómo solucionarlo.
<!-- }}} -->

---

<!-- {{{ Troubleshooting -->
## Troubleshooting (⏱️ 10 min)

### Problemas Comunes y Soluciones (⏱️ 2 min por problema)

**1. "No puedo salir de Vim/Ariadna"**

```
# Si estás en Insert Mode:
<Esc>:q<Enter>

# Si hay cambios sin guardar:
:q!<Enter>  # Salir sin guardar
:wq<Enter>  # Guardar y salir

# Atajo rápido:
ZZ  # Guardar y salir (en Normal Mode)
ZQ  # Salir sin guardar (en Normal Mode)
```

**2. "El autocompletado no funciona"**

```
# Verifica que los LSP servers estén instalados:
:Mason

# Busca: svelte, tailwindcss, eslint
# Si no están, presiona 'i' sobre ellos para instalar

# Verifica que el LSP esté activo:
:LspInfo
```

**3. "No encuentro archivos con Telescope"**

```
# Asegúrate de estar en el directorio correcto:
:pwd

# Cambia de directorio si es necesario:
:cd ~/ruta/a/tu/proyecto

# O abre Ariadna desde el directorio correcto:
# En terminal: cd ~/proyecto && nvim .
```

**4. "Las teclas no hacen lo que espero"**

```
# Verifica que estés en Normal Mode:
<Esc><Esc><Esc>  # Presiona varias veces para asegurar

# Verifica tus keymaps:
:Telescope keymaps
```

**5. "Ariadna está lento"**

```
# Revisa qué plugins están cargados:
:Lazy

# Revisa salud del sistema:
:checkhealth

# Busca warnings en rojo y síguelos
```

**6. "No veo el arte ASCII de Ariadna"**

```
# Verifica que los archivos existan:
:e ~/.config/nvim/static/ariadna/biblioteca/ariadna-logo.txt

# Si no existe, clona el repositorio de nuevo:
# cd ~/.config
# rm -rf nvim
# git clone https://github.com/icarus-mx/ariadna.git nvim
```

### Comandos de Diagnóstico (⏱️ 3 min)

```
# Salud general del sistema:
:checkhealth

# Info de LSP activos:
:LspInfo

# Info de Treesitter (syntax highlighting):
:TSInstallInfo

# Plugins instalados:
:Lazy

# Ver logs de Neovim:
:messages
```

### Resetear Ariadna (⏱️ 5 min)

Si todo falla, resetea la configuración:

```bash
# 1. Haz backup de tu configuración actual:
mv ~/.config/nvim ~/.config/nvim.backup
mv ~/.local/share/nvim ~/.local/share/nvim.backup
mv ~/.local/state/nvim ~/.local/state/nvim.backup

# 2. Clona Ariadna de nuevo:
git clone https://github.com/icarus-mx/ariadna.git ~/.config/nvim

# 3. Inicia Neovim:
nvim

# 4. Espera a que instale plugins:
# (puede tomar 2-3 minutos)
```

### Recursos de Ayuda (⏱️ 1 min)

```
# Dentro de Ariadna:
:help ariadna
:help vim-modes
:help key-notation

# Tutoriales interactivos:
:Tutor  # Tutorial básico de Vim

# Comunidad CRETA:
# Pregunta en el canal de Slack de Icarus
# Revisa el repositorio: github.com/icarus-mx/ariadna
```

**Anti-patrón:** No reinicies Ariadna cada vez que algo sale mal. Aprende a diagnosticar y solucionar problemas. Es parte del aprendizaje.
<!-- }}} -->

---

## Conclusión (⏱️ 2 min)

Has completado la guía de Ariadna. Ahora sabes:
- ✅ Qué es Ariadna y por qué usarla
- ✅ Cómo instalarla y verificarla
- ✅ Los modos de Vim y navegación básica
- ✅ Comandos esenciales para editar
- ✅ Flujo de trabajo real con proyectos SvelteKit
- ✅ Cómo personalizar y explorar
- ✅ Troubleshooting cuando algo sale mal

**Próximos pasos:**
1. Practica 15 minutos diarios durante 2 semanas
2. Usa Ariadna para UN proyecto completo (no mezcles con VS Code)
3. Aprende UN comando nuevo por día
4. Lee `GLASSMORPHISM.md` para técnicas avanzadas de UI

**Recuerda:** La curva de aprendizaje es real, pero vale la pena. En un mes vas a ser más rápido que cualquier persona con VS Code.

---

*Guía creada para estudiantes de CRETA - Icarus Coding School*
*Última actualización: Octubre 2025*
