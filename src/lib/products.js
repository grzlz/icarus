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
 * - price: display string
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
		price: '$299',
		tag: 'Hot',
		featured: true
	},
	{
		slug: 'estampado-no-es-bug-es-feature',
		phrase: 'no es bug\nes feature',
		type: 'Playera',
		garment: 'black',
		technique: 'estampado',
		price: '$299',
		tag: 'Hot',
		featured: true
	},
	{
		slug: 'estampado-deploys-los-viernes',
		phrase: 'deploys\nlos\nviernes',
		type: 'Playera',
		garment: 'white',
		technique: 'estampado',
		price: '$299',
		tag: 'Nuevo',
		featured: true
	},
	{
		slug: 'estampado-rm-rf-lunes',
		phrase: 'rm -rf\n/lunes',
		type: 'Playera',
		garment: 'black',
		technique: 'estampado',
		price: '$299',
		tag: null,
		featured: true
	},
	{
		slug: 'estampado-systemctl-restart-major-tom',
		phrase: 'systemctl restart\nmajor-tom',
		type: 'Sudadera',
		garment: 'grey',
		technique: 'estampado',
		price: '$899',
		tag: null,
		featured: true
	},
	{
		slug: 'estampado-git-commit-ya-quedo',
		phrase: 'git commit -m\n"ya quedó"',
		type: 'Playera',
		garment: 'white',
		technique: 'estampado',
		price: '$299',
		tag: null,
		featured: true
	},
	{
		slug: 'estampado-git-push-force',
		phrase: 'git push\n--force\nthe situation',
		type: 'Playera',
		garment: 'black',
		technique: 'estampado',
		price: '$299',
		tag: 'Nuevo',
		featured: true
	},
	{
		slug: 'estampado-works-on-mi-maquina',
		phrase: 'works on\nmi máquina',
		type: 'Sudadera',
		garment: 'black',
		technique: 'estampado',
		price: '$899',
		tag: null,
		featured: true
	},
	// Bordado pieces — discreet patches, premium price, more "uniform" feel
	{
		slug: 'bordado-wq',
		phrase: ':wq',
		type: 'Playera',
		garment: 'black',
		technique: 'bordado',
		price: '$490',
		tag: null,
		featured: false
	},
	{
		slug: 'bordado-todo',
		phrase: '// TODO',
		type: 'Sudadera',
		garment: 'olive',
		technique: 'bordado',
		price: '$990',
		tag: null,
		featured: false
	},
	{
		slug: 'bordado-console-log',
		phrase: 'console\n.log(ñ)',
		type: 'Playera',
		garment: 'black',
		technique: 'bordado',
		price: '$490',
		tag: null,
		featured: false
	},
	{
		slug: 'bordado-icarus',
		phrase: '</icarus>',
		type: 'Playera',
		garment: 'olive',
		technique: 'bordado',
		price: '$490',
		tag: 'Nuevo',
		featured: false
	},
	{
		slug: 'bordado-git-blame-yo',
		phrase: 'git blame: yo',
		type: 'Playera',
		garment: 'black',
		technique: 'bordado',
		price: '$590',
		tag: 'Nuevo',
		featured: false
	}
];

export const products = catalog.map((p) => ({
	...p,
	image: p.image === null ? null : `/shirts/${p.slug}.webp`
}));

export const featured = products.filter((p) => p.featured);
