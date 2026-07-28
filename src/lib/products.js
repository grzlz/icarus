/*
 * Single source of truth for the Drop 01 catalog. `/tienda` renders the full
 * list; `/` renders the `featured` subset. The homepage used to carry its own
 * drifted copy of this list — don't do that again, edit here.
 *
 * Each product:
 * - slug: filename key for the generated mockup in /static/shirts/<slug>.png
 * - phrase: the printed/embroidered text (newlines render as line breaks)
 * - type: 'Playera' | 'Sudadera'
 * - garment: 'black' | 'white' | 'grey' | 'olive' (shirt color)
 * - technique: 'estampado' | 'bordado'
 * - price: display string, IVA incluido (16%). El precio que ve el cliente es
 *   el que se cobra; al netear, lo tuyo es price / 1.16.
 * - tag: optional badge (Hot, Nuevo, etc.)
 * - featured: shown on the homepage grid
 *
 * Mockups are batch-generated with `node scripts/generate-shirt-images.mjs`
 * (drives the /taller pipeline). If a product has no PNG yet, set
 * `image: null` on it here and the card falls back to the phrase placeholder.
 */

const catalog = [
	{
		slug: 'estampado-gpi-a-un-gpu',
		phrase: 'gpi a un gpu',
		type: 'Playera',
		garment: 'black',
		technique: 'estampado',
		price: '$469',
		tag: 'Hot',
		featured: true
	},
	{
		slug: 'estampado-no-es-bug-es-feature',
		phrase: 'no es bug\nes feature',
		type: 'Playera',
		garment: 'black',
		technique: 'estampado',
		price: '$469',
		tag: 'Hot',
		featured: true
	},
	{
		slug: 'estampado-systemctl-restart-major-tom',
		phrase: 'systemctl restart\nmajor-tom',
		type: 'Sudadera',
		garment: 'grey',
		technique: 'estampado',
		price: '$1,049',
		tag: null,
		featured: true
	},
	{
		slug: 'estampado-git-commit-am-some-changes',
		phrase: 'git commit -am\n"some\nchanges"',
		type: 'Playera',
		garment: 'white',
		technique: 'estampado',
		price: '$469',
		tag: null,
		featured: true
	},
	{
		slug: 'estampado-git-pull-rebase',
		phrase: 'git pull\n--rebase',
		type: 'Playera',
		garment: 'black',
		technique: 'estampado',
		price: '$469',
		tag: 'Nuevo',
		featured: true
	},
	{
		slug: 'estampado-funciona-en-mi-local',
		phrase: 'funciona en\nmi local',
		type: 'Sudadera',
		garment: 'black',
		technique: 'estampado',
		price: '$1,049',
		tag: null,
		featured: true
	},
	// Bordado pieces — embroidered phrases, premium price; placement varies per piece
	{
		slug: 'bordado-qa',
		phrase: ':qa!',
		type: 'Playera',
		garment: 'black',
		technique: 'bordado',
		price: '$570',
		tag: null,
		featured: false
	},
	{
		slug: 'bordado-todo',
		phrase: '// TODO',
		type: 'Sudadera',
		garment: 'olive',
		technique: 'bordado',
		price: '$1,150',
		tag: null,
		featured: false
	},
	{
		slug: 'bordado-icarus',
		phrase: '</icarus>',
		type: 'Playera',
		garment: 'blue',
		technique: 'bordado',
		price: '$570',
		tag: 'Nuevo',
		featured: false
	},
	{
		slug: 'bordado-caffeinate-dimsu',
		phrase: 'caffeinate\n-dimsu',
		type: 'Playera',
		garment: 'black',
		technique: 'bordado',
		price: '$570',
		tag: 'Nuevo',
		featured: false
	},
	{
		slug: 'estampado-dangerously-skip-permissions',
		phrase: 'dangerously\nskip\npermissions',
		type: 'Sudadera',
		garment: 'black',
		technique: 'estampado',
		price: '$1,049',
		tag: 'Nuevo',
		featured: false
	}
];

export const products = catalog.map((p) => ({
	...p,
	image: p.image === null ? null : `/shirts/${p.slug}.webp`
}));

export const featured = products.filter((p) => p.featured);
