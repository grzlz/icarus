<script>
	/*
	 * Pre-rendered Blender spin of one catalog piece (scripts/render-turntable.mjs →
	 * static/turntables/<slug>[-dark].mp4 + .webp poster). A muted looping video,
	 * no WebGL. The page background is baked in, one encode per theme, so the
	 * garment floats on the page; this follows the html.dark class that
	 * ThemeToggle flips. Fills its parent — give the parent a defined size.
	 *
	 * Reduced motion: the poster frame stays still.
	 */
	import { tick } from 'svelte';

	let { slug, label } = $props();

	// null until mounted: the server can't know the theme, so the video stays
	// hidden rather than flash the light encode on a dark page.
	let dark = $state(null);
	const file = $derived(dark ? `${slug}-dark` : slug);

	function followTheme() {
		const html = document.documentElement;
		const sync = () => (dark = html.classList.contains('dark'));
		sync();
		const observer = new MutationObserver(sync);
		observer.observe(html, { attributes: true, attributeFilter: ['class'] });
		return () => observer.disconnect();
	}

	// Reads `file` so it re-runs on a theme swap: a new src pauses the video, so
	// play once the DOM has it. Autoplay can be refused (data saver); the poster
	// covers that.
	function autoplay(video) {
		if (!file || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		tick().then(() => video.play().catch(() => {}));
	}
</script>

<video
	{@attach followTheme}
	{@attach autoplay}
	src="/turntables/{file}.mp4"
	poster="/turntables/{file}.webp"
	muted
	loop
	playsinline
	preload="auto"
	aria-label={label}
	class="h-full w-full object-cover {dark === null ? 'invisible' : ''}"
></video>

<style>
	/* H.264 can land a level off the page color (near-black especially, and
	   per browser), which reads as a faint square. Feathering the frame edge
	   removes the edge; 2.5% stays inside the ~3% empty margin turntable.py
	   frames around the garment, so the hem and sleeve tips are untouched. */
	video {
		mask-image:
			linear-gradient(to right, transparent, #000 2.5%, #000 97.5%, transparent),
			linear-gradient(to bottom, transparent, #000 2.5%, #000 97.5%, transparent);
		mask-composite: intersect;
	}
</style>
