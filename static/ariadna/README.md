# 🏛️ Ariadna

**Configuración oficial de Neovim para estudiantes de Icarus**

Ariadna es una distribución de [LazyVim](https://lazyvim.org) optimizada para el stack de Icarus, con tema personalizado, plugins esenciales y documentación en español.

> "Salgamos de este laberinto" 🏛️

---

## ✨ Características

### 🎨 Estética Icarus
- **Tema**: Kanagawa Wave (modo transparente)
- **Welcome screen**: Pantalla de bienvenida personalizada de Ariadna
- **Iconos**: Nerd Fonts con símbolos de Icarus

### 🚀 Optimizado para el Stack de Icarus
- **SvelteKit 5**: Syntax highlighting, LSP, snippets
- **Tailwind CSS 4**: Autocompletado, color preview
- **JavaScript/Node.js**: ESLint, Prettier, debugging

### 📦 Plugins Pre-configurados
- **Telescope**: Búsqueda rápida de archivos (Space+Space)
- **Neotree**: Explorador de archivos (Space+e)
- **Gitsigns**: Indicadores de Git en gutter
- **Markdown**: Renderizado inline + preview con Shift+L
- **LSP**: TypeScript, Svelte, Tailwind, Lua
- **Treesitter**: Syntax highlighting avanzado

### 📚 Documentación en Español
- Cheatsheet de keybindings
- Tutoriales integrados
- Mensajes de ayuda traducidos

---

## 📋 Requisitos

- **Neovim** >= 0.10.0
- **Git** >= 2.19.0
- **Node.js** >= 18.0.0 (para LSP servers)
- **Nerd Font** (recomendado: [JetBrains Mono](https://www.nerdfonts.com/font-downloads))
- **Terminal con true color** (iTerm2, Alacritty, Wezterm)

---

## 🚀 Instalación

### Opción 1: Instalación Limpia (Recomendado para nuevos estudiantes)

```bash
# Respaldar configuración actual (si existe)
mv ~/.config/nvim ~/.config/nvim.backup
mv ~/.local/share/nvim ~/.local/share/nvim.backup

# Clonar Ariadna
git clone https://github.com/icarusmx/ariadna.git ~/.config/nvim

# Abrir Neovim (instalará plugins automáticamente)
nvim
```

**Primera vez:**
- Lazy.nvim instalará todos los plugins (~2 minutos)
- Mason instalará LSP servers automáticamente
- Presiona `q` cuando termine
- Reinicia Nvim: `:q` y vuelve a abrir `nvim`

---

### Opción 2: Probar sin Afectar tu Configuración

```bash
# Clonar en directorio temporal
git clone https://github.com/icarusmx/ariadna.git ~/ariadna-test

# Abrir con configuración aislada
NVIM_APPNAME=ariadna-test nvim
```

Esto no toca tu configuración actual de Nvim.

---

## ⌨️ Keybindings Esenciales

### General
| Keybinding | Acción |
|------------|--------|
| `<leader>` | Space (tecla líder) |
| `<leader><leader>` | Buscar archivos (Telescope) |
| `<leader>e` | Toggle explorador de archivos |
| `<leader>ff` | Buscar archivos por nombre |
| `<leader>fg` | Buscar texto en proyecto (grep) |
| `<leader>fb` | Buscar buffers abiertos |
| `<leader>fh` | Buscar ayuda |

### Navegación
| Keybinding | Acción |
|------------|--------|
| `Ctrl+h/j/k/l` | Navegar entre ventanas |
| `<leader>sv` | Split vertical |
| `<leader>sh` | Split horizontal |
| `gd` | Ir a definición |
| `gr` | Ver referencias |
| `K` | Mostrar documentación (hover) |

### Edición
| Keybinding | Acción |
|------------|--------|
| `gcc` | Comentar/descomentar línea |
| `gc` (visual) | Comentar selección |
| `<leader>ca` | Code actions (refactors) |
| `<leader>rn` | Renombrar símbolo |

### Git
| Keybinding | Acción |
|------------|--------|
| `<leader>gg` | Abrir Lazygit |
| `]h` | Siguiente cambio (hunk) |
| `[h` | Anterior cambio (hunk) |
| `<leader>gp` | Preview cambio |

### Markdown (solo en archivos .md)
| Keybinding | Acción |
|------------|--------|
| `Shift+L` | Preview con Glow |

---

## 🎓 Para Estudiantes de Icarus

### Primer Día con Ariadna

**1. Familiarízate con los modos:**
- `Normal` - Navegación (ESC para volver aquí)
- `Insert` - Edición (i, a, o para entrar)
- `Visual` - Selección (v para entrar)
- `Command` - Comandos (: para entrar)

**2. Practica navegación básica:**
```
h j k l  → ← ↓ ↑
w b      → Siguiente/anterior palabra
gg G     → Inicio/fin de archivo
Ctrl+d/u → Media página abajo/arriba
```

**3. Tu primer flujo de trabajo:**
```
1. nvim                    # Abrir Nvim
2. Space Space             # Buscar archivo
3. Type filename           # Escribir nombre
4. Enter                   # Abrir archivo
5. i                       # Entrar a modo Insert
6. (editar código)
7. Esc                     # Volver a Normal
8. :w                      # Guardar
9. Space e                 # Ver archivos
10. :q                     # Salir
```

### Tutoriales Incluidos

Ariadna incluye tutoriales interactivos:

```vim
:Tutor          " Tutorial oficial de Vim (español)
:AriadnaBasics    " Básicos de Ariadna
:AriadnaGit       " Flujo de Git con Lazygit
:AriadnaSvelte    " Editar SvelteKit como pro
```

---

## 🛠️ Personalización

### Cambiar Tema

Edita `~/.config/nvim/lua/plugins/colorscheme.lua`:

```lua
return {
  {
    "rebelot/kanagawa.nvim",
    opts = {
      theme = "wave",  -- o "dragon" para más oscuro
      transparent = false,  -- Cambia a false para fondo sólido
    },
  },
}
```

Temas alternativos:
- `tokyonight` - Tokyo Night
- `catppuccin` - Catppuccin Mocha
- `rose-pine` - Rosé Pine

### Agregar Plugins

Crea un archivo en `~/.config/nvim/lua/plugins/tu-plugin.lua`:

```lua
return {
  {
    "usuario/nombre-del-plugin",
    opts = {
      -- configuración
    },
  },
}
```

Guarda y ejecuta `:Lazy` para instalar.

---

## 📁 Estructura del Proyecto

```
~/.config/nvim/
├── init.lua                 # Punto de entrada
├── lua/
│   ├── config/
│   │   ├── autocmds.lua    # Auto-comandos
│   │   ├── keymaps.lua     # Keybindings personalizados
│   │   ├── lazy.lua        # Configuración de Lazy.nvim
│   │   └── options.lua     # Opciones de Vim
│   └── plugins/
│       ├── colorscheme.lua # Tema Kanagawa
│       ├── markdown.lua    # Plugins de Markdown
│       ├── svelte.lua      # SvelteKit support
│       ├── tailwind.lua    # Tailwind CSS support
│       └── creta.lua       # Utilidades de Icarus
└── README.md
```

---

## 🆘 Ayuda

### Dentro de Nvim
```vim
:help ariadna              " Ayuda de Ariadna
:Lazy                    " Ver/actualizar plugins
:Mason                   " Ver/instalar LSP servers
:checkhealth             " Diagnosticar problemas
:LspInfo                 " Ver LSP servers activos
```

### Problemas Comunes

**LSP no funciona:**
```vim
:Mason
# Buscar e instalar: vtsls, svelte-language-server, tailwindcss-language-server
```

**Iconos no se ven bien:**
- Instala una Nerd Font: https://www.nerdfonts.com
- Configura tu terminal para usarla

**Plugins no cargan:**
```vim
:Lazy sync    " Sincronizar plugins
:Lazy clean   " Limpiar plugins no usados
```

---

## 🤝 Contribuir

Ariadna es open source y acepta contribuciones de estudiantes de Icarus.

**Cómo contribuir:**
1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/mi-mejora`
3. Commit: `git commit -m "Agrega X funcionalidad"`
4. Push: `git push origin feature/mi-mejora`
5. Abre Pull Request

**Ideas para contribuir:**
- Snippets para SvelteKit/Tailwind
- Temas de colores personalizados
- Tutoriales en español
- Mejoras al README

---

## 📜 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles

---

## 🏛️ Sobre Icarus

Ariadna es parte del ecosistema educativo de [Icarus](https://icarus.mx), una escuela de software que forma desarrolladores mediante proyectos reales.

**Otros proyectos de Icarus:**
- [Creta CLI](https://github.com/icarusmx/creta) - Escuela interactiva de comandos
- [Scythe](https://github.com/icarusmx/scythe) - Sistema de recompensas blockchain
- [Constructores](https://github.com/icarusmx/constructores) - Comunidad de desarrolladores

---

**Hecho con <3 por icarus.mx** - Salgamos de este laberinto
