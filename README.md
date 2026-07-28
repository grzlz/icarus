# icarus.mx

Tienda de **mercancía con humor de dev**: playeras y sudaderas de algodón con
frases estampadas o bordadas, para los que viven en la terminal.

La frase _es_ el producto. Sin colecciones cápsula, sin drama.

---

## Stack

| Pieza         | Qué se usa                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------ |
| Framework     | SvelteKit 2 + Svelte 5 (solo runes: `$state`, `$derived`…)                                       |
| Estilos       | Tailwind CSS v4 — configurado en CSS con `@theme` en `src/app.css` (no hay `tailwind.config.js`) |
| Build         | Vite 6 + `@tailwindcss/vite`                                                                     |
| Adapter       | `adapter-node` → servidor Node en `build/`                                                       |
| 3D            | Threlte 8 + three.js (vista 3D de la prenda en `/tienda`)                                        |
| Base de datos | SQLite vía `better-sqlite3` (`data/icarus.db`)                                                   |
| Lenguaje      | JavaScript plano, ES modules. **Sin TypeScript.**                                                |

---

## Arrancar

```bash
npm install
cp .env.example .env      # llena las llaves si vas a usar /taller
npm run dev -- --port 5188
```

El sitio queda en `http://localhost:5188`. Usamos ese puerto por convención del
proyecto; `npm run dev` a secas también funciona.

### Variables de entorno

`.env` está en `.gitignore`. Copia `.env.example` y llena:

- `OPENAI_API_KEY` — necesaria solo para `/taller` (generación de mockups con
  GPT Image 1.5). Requiere cuenta con saldo.
- `TALLER_PASSWORD` — opcional. Si la pones, `/taller` pide contraseña antes de
  gastar créditos de API. Vacía = sin candado.

---

## Comandos

```bash
npm run dev          # servidor de desarrollo
npm run build        # build de producción → build/
npm run preview      # previsualiza el build
npm run lint         # prettier --check + eslint
npm run format       # prettier --write
npm run screenshot   # captura de pantalla con Playwright (scripts/screenshot.mjs)
```

No corras `npm run check` — este repo es JS plano, no TypeScript.

---

## Estructura

```
src/
  app.css                    tema de Tailwind (@theme) + utilidades .print
  lib/
    products.js              ⭐ catálogo — única fuente de verdad
    shirt.js                 colores de prenda, tinta, hilo y logo
    wing.js                  tinta el logo (el ala) según el color de la prenda
    printDecal.js            dibuja la frase en canvas para el decal 3D
    models3d.js              mapeo tipo de prenda → modelo .glb
    taller/renderReference.js render determinista de texto exacto (base del /taller)
    server/db.js             SQLite: tabla de suscriptores
    actions/reveal.js        acción de Svelte para animar al hacer scroll
    components/              Navbar, Footer, ShirtMockup, vistas 3D, controles del taller
  routes/
    +page.svelte             home: hero + productos destacados
    tienda/+page.svelte      catálogo completo, filtros + visor 3D
    taller/+page.svelte      herramienta interna de mockups
    api/subscribe/           POST correo → SQLite
    api/taller/generate/     POST → OpenAI (la llave nunca sale del servidor)
static/
  shirts/                    mockups .webp generados (uno por slug)
  models/                    shirt.glb, sudadera.glb
  logo.png                   el logo de la marca — no lo quites del Navbar/Footer
scripts/
  generate-shirt-images.mjs  genera los mockups del catálogo en lote
  screenshot.mjs             capturas con Playwright
data/
  icarus.db                  SQLite en vivo — gitignoreado, nunca se commitea
```

### Rutas

| Ruta                   | Qué hace                                                                                                                          |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `/`                    | Hero + rejilla de destacados (`featured` de `products.js`)                                                                        |
| `/tienda`              | Catálogo completo con filtros (Playeras / Sudaderas / Estampado / Bordado) y visor 3D. El filtro va en el hash: `/tienda#bordado` |
| `/taller`              | Herramienta **interna** para generar mockups. No enlazada desde el sitio.                                                         |
| `/api/subscribe`       | `POST { email }` → guarda en SQLite. 409 si ya estaba.                                                                            |
| `/api/taller/generate` | `POST` → OpenAI image edit. Protegida con `TALLER_PASSWORD`.                                                                      |

---

## El catálogo

Todo el catálogo vive en `src/lib/products.js`. Ahí se edita, en ningún otro
lado — la home ya tuvo su propia copia desincronizada una vez y los precios se
fueron por caminos distintos.

```js
{
  slug: 'estampado-gpi-a-un-gpu',   // llave del mockup en static/shirts/<slug>.webp
  phrase: 'gpi a un gpu',           // la frase impresa (los \n son saltos de línea)
  type: 'Playera',                  // 'Playera' | 'Sudadera'
  garment: 'black',                 // 'black' | 'white' | 'grey' | 'olive'
  technique: 'estampado',           // 'estampado' | 'bordado'
  price: '$399',
  tag: 'Hot',                       // insignia opcional
  featured: true                    // aparece en la home
}
```

Si un producto todavía no tiene mockup, ponle `image: null` y la tarjeta cae al
placeholder que dibuja la frase.

### Técnicas

- **Estampado** — serigrafía, frase grande, presencia clara.
- **Bordado** — la frase en hilo, larga vida, ≈$100 MXN más que su equivalente
  estampado. La colocación varía por pieza.

### Generar mockups

Necesita el servidor de desarrollo corriendo y **gasta créditos de OpenAI**.
Se salta los archivos que ya existen, así que volver a correrlo solo llena
huecos.

```bash
node scripts/generate-shirt-images.mjs
#   BASE_URL=http://localhost:5188    servidor contra el que renderiza
#   QUALITY=rapido|calidad            nivel de calidad (default: rapido)
#   FORCE=1                           regenera aunque ya exista el .webp
#   ONLY=bordado-qa,bordado-todo      solo estos slugs
```

El pipeline es: canvas con texto exacto → API de _edición_ de imagen (no
texto-a-imagen, para que la frase salga literal) → re-encode a WebP.

---

## Base de datos

`data/icarus.db` (SQLite, modo WAL) guarda la lista de correos. La tabla se crea
sola al primer arranque.

**Nunca** commitees la base ni sus archivos `-wal` / `-shm`: `/data` está en
`.gitignore` y ahí se queda. Si vas a correr un script que le escriba, saca
copia antes.

---

## Build de producción

```bash
npm run build     # adapter-node → servidor Node en build/
node build        # lo levanta; PORT y NODE_ENV se pasan por entorno
```

El sitio se aloja en servidor propio. Los detalles de esa máquina no viven en
este repo.

---

## Cómo colaborar

### ¿Traes una frase?

Es la mejor forma de aportar. Abre un **issue** con la etiqueta `frase` y pon:

- la frase tal cual iría impresa (respeta mayúsculas y saltos de línea);
- si la ves de **estampado** o **bordado**, y en qué prenda;
- el chiste, si no es obvio a la primera.

Las frases se aprueban una por una antes de entrar al catálogo, así que un
issue pega más que un PR.

### ¿Traes código?

1. Ábrete rama desde `main`: `fix/algo-descriptivo`, `feat/algo-descriptivo`.
2. Deja pasar el lint: `npm run format && npm run lint`.
3. Commits en formato convencional en español (`feat(tienda): ...`,
   `fix(home): ...`) — mira `git log` para el tono.
4. PR contra `main` explicando **qué** cambia y **por qué**.

Reglas de la casa, para que el PR no rebote:

- **Svelte 5 con runes** (`$state`, `$props`, `$derived`, `$effect`). Nada de
  API vieja: ni `export let`, ni `$:`.
- **JavaScript plano.** Este repo no lleva TypeScript.
- **Tailwind v4 desde `src/app.css`** (`@theme`). No agregues
  `tailwind.config.js`.
- El catálogo se edita **solo** en `src/lib/products.js`.
- Nada de dependencias nuevas sin una razón clara en el PR.
- Si un componente pasa de ~300 líneas, pártelo.
- **Las frases de los productos no se editan sin aprobación una por una.** El
  copy del sitio sí es territorio libre; las frases no.

### Reportar algo roto

Issue con navegador, tamaño de pantalla y captura. Si es una prenda que se ve
mal en el visor 3D, di cuál (el `slug` sirve).

---

## Voz y estilo

Si vas a escribir copy, esto es lo que se respeta:

- Todo en **español mexicano**, casual y con chiste. El spanglish es bienvenido
  cuando el chiste lo pide.
- **Disruptivo, no ofensivo.** El guiño nunca le pega a una persona ni a un rol.
- Fondo hueso claro (`bone-50`/`bone-100`), texto `ink-950`, un solo acento
  juguetón: `tomato-500`. Esquinas redondeadas (`rounded-2xl`, `rounded-full`).
- Inter para el texto; JetBrains Mono (utilidad `.print`) solo para las frases
  impresas y las etiquetas chiquitas en mayúsculas. Nunca mono para el cuerpo.
- Vocabulario llano: playera, sudadera, mercancía, drop, tienda.

Lo que **no** es Icarus: no somos marca outdoor ni folclórica, no somos techwear
oscuro con números de modelo, no somos plantilla de e-commerce. Playeras
sencillas con frases buenas.
