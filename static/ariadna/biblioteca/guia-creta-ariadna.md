# 🏛️ Ariadna: Guía para Estudiantes de CRETA

> "Salgamos de este laberinto" - Si quieres convertirte en un desarrollador eficiente, Ariadna es tu primer paso.

Bienvenido a **Ariadna**, la configuración oficial de Neovim para estudiantes de Icarus. Si vienes de CRETA, ya sabes que el aprendizaje práctico es lo más importante. Ariadna no es distinto: es una herramienta que aprenderás **haciéndola**, no leyendo manuales largos.

---

## ¿Qué es Ariadna?

Ariadna es **Neovim configurado profesionalmente** para desarrolladores que trabajan con **SvelteKit** y **Tailwind CSS** (exactamente el stack que usa Icarus).

**En otras palabras:** Es un editor de código súper rápido y poderoso que te permite escribir código sin tocar el mouse, con herramientas inteligentes que entienden tu código.

### Por qué Ariadna y no VSCode?

| Aspecto | Ariadna | VSCode |
|---------|---------|--------|
| **Velocidad** | Abre en 50ms | Abre en 5+ segundos |
| **RAM** | ~50MB | 500MB+ |
| **Productividad (experto)** | Extremadamente rápido | Más lento |
| **Curva de aprendizaje** | Pronunciada | Suave |
| **Costo** | Gratis, open source | Gratis pero propietario |

**Realidad:** Los primeros 2 días serán frustrantes. Después de una semana, serás 2x más rápido que en VSCode.

---

## Instalación Rápida (5 minutos)

### Prerequisitos
Verifica que tengas estos instalados (probablemente ya los tienes de CRETA):

```bash
# Verifica que tengas estas herramientas
nvim --version          # Debe ser >= 0.10.0
git --version          # Debe estar instalado
node --version         # Debe ser >= 18.0.0
```

Si no los tienes, instálalos con Homebrew:
```bash
brew install neovim git node
```

### Instalación

```bash
# 1. Respalda tu configuración actual (si existe)
mv ~/.config/nvim ~/.config/nvim.backup.$(date +%Y%m%d)

# 2. Clona Ariadna
git clone https://github.com/icarusmx/ariadna.git ~/.config/nvim

# 3. Abre Neovim (instalará todo automáticamente)
nvim
```

**La primera vez tarda ~3 minutos.** Verás muchos mensajes - eso es normal. Espera a que termine y luego presiona `q`.

---

## Tu Primera Sesión: El Flujo de 3 Minutos

Abre tu proyecto y sigue estos pasos:

```
1. cd tu-proyecto-svelte              # Ve a tu proyecto
2. nvim                               # Abre Neovim
3. Space Space                        # Busca un archivo (Telescope)
4. Escribe: "App.svelte"              # Busca App.svelte
5. Enter                              # Abre el archivo
6. i                                  # Entra a modo Insert (edición)
7. (Edita tu código)                  # Haz cambios
8. Esc                                # Vuelve a modo Normal
9. :w                                 # Guarda
10. Space e                           # Ver archivos del proyecto
11. Space Space                       # Abre otro archivo
12. :q                                # Salir
```

**Eso es.** Todo lo que necesitas para trabajar. El resto son optimizaciones.

---

## Los 5 Comandos Más Importantes

### General
| Teclas | Qué hace |
|--------|----------|
| `Space Space` | 🔍 Buscar archivos rápidamente |
| `Space e` | 📁 Mostrar árbol de archivos |
| `Space fg` | 🔎 Buscar texto en todo el proyecto |
| `:w` | 💾 Guardar |
| `:q` | 🚪 Salir |

### Navegación (sin mouse)
| Teclas | Qué hace |
|--------|----------|
| `h j k l` | ⬅️ ⬇️ ⬆️ ➡️ Moverte |
| `w` | Siguiente palabra |
| `b` | Palabra anterior |
| `gg` | Inicio del archivo |
| `G` | Fin del archivo |

### Edición
| Teclas | Qué hace |
|--------|----------|
| `i` | Entrar a modo Insert (editar) |
| `Esc` | Volver a modo Normal |
| `gcc` | Comentar/descomentar una línea |
| `dd` | Borrar una línea |
| `yy` | Copiar una línea |
| `p` | Pegar |

### Git (Lazygit)
| Teclas | Qué hace |
|--------|----------|
| `Space gg` | Abre Git UI completa (Lazygit) |

**Eso es el 80% de lo que usarás el primer mes.**

---

## Los Tres Modos de Vim (¡esto es importante!)

Vim tiene 3 modos principales. Esto asusta a principiantes pero es lo que lo hace poderoso:

### 1. Normal Mode (Navegación)
- **Cómo entrar:** Presiona `Esc`
- **Qué puedes hacer:** Moverte, borrar líneas, copiar, pegar
- **Cuándo lo usarás:** 70% del tiempo
- **Ejemplo:**
  ```
  j j j          # Bajar 3 líneas
  dd             # Borrar la línea actual
  :w             # Guardar
  ```

### 2. Insert Mode (Edición)
- **Cómo entrar:** Presiona `i`, `a`, u `o`
- **Qué puedes hacer:** Escribir código normalmente
- **Cuándo lo usarás:** 25% del tiempo
- **Regla:** Si escribes algo que no debería estar, presiona `Esc`

### 3. Command Mode (Comandos)
- **Cómo entrar:** Presiona `:` en Normal mode
- **Qué puedes hacer:** Ejecutar comandos como `:w` (guardar), `:q` (salir)
- **Cuándo lo usarás:** 5% del tiempo

**Regla de oro:** Cuando no sepas qué hacer, **presiona `Esc` tres veces**. Siempre te llevará a Normal mode.

---

## Ariadna Para SvelteKit (Tu Stack)

### Autocompletado Inteligente
Mientras escribes un archivo `.svelte`:

```svelte
<script>
  let count = 0;
  // Escribe "cou" y presiona Ctrl+Space
  // Verás sugerencias automáticas
</script>

<button on:click={() => count++}>
  Click me
</button>
```

### Ver el tipo de una variable
Presiona `K` sobre una variable para ver su documentación.

### Ir a la definición
Presiona `gd` sobre un componente para ir a su definición.

---

## Explorar Ariadna: Dónde Vive Todo

```
~/.config/nvim/
├── init.lua                    # Punto de entrada (no toques)
├── lua/
│   ├── config/
│   │   ├── keymaps.lua        # Tus atajos personalizados van aquí
│   │   ├── options.lua        # Configuraciones de Vim
│   │   └── lazy.lua           # Gestor de plugins (no toques)
│   │
│   └── plugins/
│       ├── colorscheme.lua    # Cambiar tema de colores
│       ├── ariadna.lua        # Configuraciones de Ariadna
│       ├── svelte.lua         # Soporte para Svelte
│       ├── tailwind.lua       # Soporte para Tailwind
│       └── personal.lua       # TUS PERSONALIZACIONES AQUÍ ⭐
│
└── docs/                       # Documentación completa
```

**Lo más importante:** `personal.lua` es TU archivo. Git lo ignora. Aquí puedes agregar plugins y cambios sin miedo a conflictos.

---

## Primeros Cambios: Personalizar Ariadna

### Cambiar el tema de colores

Edita `~/.config/nvim/lua/plugins/colorscheme.lua`:

```lua
return {
  {
    "rebelot/kanagawa.nvim",
    opts = {
      theme = "dragon",      -- Cambiar a "dragon" para más oscuro
      transparent = true,    -- false para fondo sólido
    },
  },
}
```

Reinicia Neovim y verás los cambios.

### Agregar tus primeros atajos personalizados

Crea/edita `~/.config/nvim/lua/config/keymaps.lua`:

```lua
local keymap = vim.keymap

-- Ejemplo: Ctrl+s para guardar (en cualquier modo)
keymap.set({ "n", "i", "v" }, "<C-s>", "<cmd>w<cr>", { desc = "Guardar" })

-- Ejemplo: Ctrl+a para seleccionar todo
keymap.set("n", "<C-a>", "gg<S-v>G", { desc = "Seleccionar todo" })

-- Ejemplo: jk para salir de Insert mode
keymap.set("i", "jk", "<Esc>", { desc = "Salir de Insert" })
```

Guarda y abre un archivo. ¡Los nuevos atajos funcionarán!

---

## Cuando Algo Falla: Diagnóstico Rápido

### "El autocompletado no funciona"

```vim
:LspInfo
```

Deberías ver un servidor de lenguaje conectado. Si no, ejecuta:

```vim
:Mason
```

Busca `vtsls` (TypeScript) e `svelte-language-server`. Si no están instalados, instálalos (presiona `i`).

### "No veo los iconos correctamente"

Tu terminal necesita una **Nerd Font**. Descárgala de https://www.nerdfonts.com (recomendamos JetBrains Mono).

Después configura tu terminal para usarla:
- **iTerm2:** Preferences → Profiles → Text → Font
- **Alacritty:** `~/.config/alacritty/alacritty.yml`

### "Neovim es lentísimo"

```vim
:Lazy profile
```

Verás qué plugins tardan más en cargar. Desactiva los que no uses en sus archivos `.lua` agregando `enabled = false`.

---

## Tu Progresión de Aprendizaje

### Semana 1: Sobrevivir
- ✅ Aprender Normal, Insert, Command modes
- ✅ Navegar con `h j k l`
- ✅ Guardar `:w` y salir `:q`
- ✅ Buscar archivos `Space Space`
- **Objetivo:** Editar un archivo sin tocar el mouse

### Semana 2: Ser Productivo
- ✅ Movimientos rápidos: `w`, `b`, `gg`, `G`
- ✅ Edición básica: `dd`, `yy`, `p`
- ✅ Buscar en archivo: `/texto`
- ✅ LSP: `gd` (ir a definición), `K` (documentación)
- **Objetivo:** Editar más rápido que en VSCode

### Semana 3 en adelante: Experto
- ✅ Visual mode: `v`, `V`
- ✅ Macros básicas
- ✅ Git con Lazygit
- ✅ Tus propios plugins y configuraciones
- **Objetivo:** Ser una máquina de productividad

---

## Recursos Oficiales de Ariadna

En el directorio de Ariadna encontrarás:

- **[README.es.md](../docs/README.es.md)** - Documentación completa (lee cuando tengas dudas)
- **Tutoriales integrados:**
  ```vim
  :Tutor              # Tutorial oficial de Vim
  :help ariadna       # Ayuda específica de Ariadna
  ```

---

## Cuando Necesites Ayuda

1. **Dentro de Neovim:**
   ```vim
   :help <comando>              # Documentación de cualquier comando
   :Lazy                        # Estado de plugins
   :Mason                       # LSP servers instalados
   :checkhealth                 # Diagnóstico completo
   ```

2. **En la comunidad Icarus:**
   - Slack: canal `#ariadna`
   - Discord de Icarus

3. **Documentación Ariadna completa:**
   - https://github.com/icarusmx/ariadna

---

## Filosofía de Ariadna

Ariadna no es para todos. Es para desarrolladores que:

- ✅ Quieren máxima velocidad y eficiencia
- ✅ Trabajan en servidores remotos vía SSH
- ✅ Están dispuestos a invertir 2 semanas aprendiendo
- ✅ Valoran la personalización total
- ✅ Disfrutan de herramientas minimalistas y poderosas

Si prefieres interfaz gráfica y todo fácil, **VSCode está bien también.** No hay juicio aquí.

Pero si quieres experimentar lo que significa ser un **desarrollador eficiente**, Ariadna es tu puerta.

---

## Tu Próximo Paso

1. **Instala Ariadna** (5 minutos - sigue la sección de instalación arriba)
2. **Abre tu proyecto actual:** `cd tu-proyecto && nvim`
3. **Edita un archivo** siguiendo el flujo de 3 minutos
4. **Practica** los 5 comandos más importantes por 1 semana
5. **Vuelve aquí** cuando tengas dudas

Bienvenido al laberinto. Está bien estar perdido los primeros días. 🏛️

---

**Hecho para estudiantes de CRETA por [icarus.mx](https://icarus.mx)**

Salgamos de este laberinto.
