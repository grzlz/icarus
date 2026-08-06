/*
 * Single source of truth for the Drop 01 catalog, rendered as the homepage
 * mosaic (`/`). `/tienda` is a permanent redirect to `/` — don't add a
 * second copy of this list anywhere, edit here.
 *
 * Each product:
 * - slug: filename key for the generated mockup in /static/shirts/<slug>.png
 * - phrase: the printed/embroidered text (newlines render as line breaks)
 * - type: 'Playera' | 'Sudadera'
 * - garment: 'black' | 'white' | 'grey' | 'olive' | 'blue' (shirt color)
 * - technique: 'estampado' | 'bordado'
 * - price: display string, IVA incluido (16%). El precio que ve el cliente es
 *   el que se cobra; al netear, lo tuyo es price / 1.16.
 * - tag: optional badge (Hot, Nuevo, etc.)
 * - nerd: 1-5, qué tan deep es el chiste (1 = cualquiera lo pesca, 5 = deep
 *   cut de terminal). Ordena la exploración móvil "más serio / más nerd".
 *
 * Mockups are batch-generated with `node scripts/generate-shirt-images.mjs`
 * (drives the /taller pipeline). If a product has no PNG yet, set
 * `image: null` on it here and the card falls back to the phrase placeholder.
 */

const catalog = [
	{
		slug: 'estampado-gpi-a-un-gpu',
		nerd: 2,
		phrase: 'gpi a un gpu',
		type: 'Playera',
		garment: 'black',
		technique: 'estampado',
		price: '$469',
		tag: 'Hot'
	},
	{
		slug: 'estampado-no-es-bug-es-feature',
		nerd: 1,
		phrase: 'no es bug\nes feature',
		type: 'Playera',
		garment: 'black',
		technique: 'estampado',
		price: '$469',
		tag: 'Hot'
	},
	{
		slug: 'estampado-systemctl-restart-major-tom',
		nerd: 4,
		phrase: 'systemctl restart\nmajor-tom',
		type: 'Sudadera',
		garment: 'grey',
		technique: 'estampado',
		price: '$1,049',
		tag: null
	},
	{
		slug: 'estampado-git-commit-am-some-changes',
		nerd: 3,
		phrase: 'git commit -am\n"some\nchanges"',
		type: 'Playera',
		garment: 'white',
		technique: 'estampado',
		price: '$469',
		tag: null
	},
	{
		slug: 'estampado-git-pull-rebase',
		nerd: 3,
		phrase: 'git pull\n--rebase',
		type: 'Playera',
		garment: 'black',
		technique: 'estampado',
		price: '$469',
		tag: 'Nuevo'
	},
	{
		slug: 'estampado-funciona-en-mi-local',
		nerd: 1,
		phrase: 'funciona en\nmi local',
		type: 'Sudadera',
		garment: 'black',
		technique: 'estampado',
		price: '$1,049',
		tag: null
	},
	// Bordado pieces — embroidered phrases, premium price; placement varies per piece
	{
		slug: 'bordado-qa',
		nerd: 5,
		phrase: ':qa!',
		type: 'Playera',
		garment: 'black',
		technique: 'bordado',
		price: '$570',
		tag: null
	},
	{
		slug: 'bordado-todo',
		nerd: 2,
		phrase: '// TODO',
		type: 'Sudadera',
		garment: 'olive',
		technique: 'bordado',
		price: '$1,150',
		tag: null
	},
	{
		slug: 'bordado-icarus',
		nerd: 1,
		phrase: '</icarus>',
		type: 'Playera',
		garment: 'blue',
		technique: 'bordado',
		price: '$570',
		tag: 'Nuevo'
	},
	{
		slug: 'bordado-caffeinate-dimsu',
		nerd: 5,
		phrase: 'caffeinate\n-dimsu',
		type: 'Playera',
		garment: 'black',
		technique: 'bordado',
		price: '$570',
		tag: 'Nuevo'
	},
	{
		slug: 'estampado-dangerously-skip-permissions',
		nerd: 4,
		phrase: 'dangerously\nskip\npermissions',
		type: 'Sudadera',
		garment: 'black',
		technique: 'estampado',
		price: '$1,049',
		tag: 'Nuevo'
	},
	// Drop 01.5 — new skus, mockups pending (image: null → phrase placeholder)
	{
		slug: 'estampado-deploy-en-viernes',
		nerd: 1,
		phrase: 'deploy en\nviernes',
		type: 'Playera',
		garment: 'white',
		technique: 'estampado',
		price: '$469',
		tag: 'Nuevo',
		image: null
	},
	{
		slug: 'estampado-sudo-frio-deployando',
		nerd: 2,
		phrase: 'sudo frío\ndeployando',
		type: 'Sudadera',
		garment: 'grey',
		technique: 'estampado',
		price: '$1,049',
		tag: null,
		image: null
	},
	{
		slug: 'estampado-vim-nano',
		nerd: 3,
		phrase: 'vim > nano',
		type: 'Playera',
		garment: 'blue',
		technique: 'estampado',
		price: '$469',
		tag: null,
		image: null
	},
	{
		slug: 'bordado-wq',
		nerd: 4,
		phrase: ':wq',
		type: 'Playera',
		garment: 'white',
		technique: 'bordado',
		price: '$570',
		tag: null,
		image: null
	},
	{
		slug: 'estampado-la-vida-es-un-riesgo-kernel',
		nerd: 1,
		phrase: 'la vida es un\nriesgo, kernel',
		type: 'Sudadera',
		garment: 'black',
		technique: 'estampado',
		price: '$1,049',
		tag: 'Nuevo',
		image: null
	}
];

export const products = catalog.map((p) => ({
	...p,
	image: p.image === null ? null : `/shirts/${p.slug}.webp`
}));
