<script>
	/*
	 * Pre-rendered Blender spin of one catalog piece (scripts/render-turntable.mjs →
	 * static/turntables/<slug>.mp4 + .webp poster). A muted looping video, no
	 * WebGL. Like the mockup photos, the bone studio background is baked in.
	 * Fills its parent — give the parent a defined size (e.g. `aspect-square`).
	 *
	 * Reduced motion: the poster frame stays still.
	 */
	let { slug, label } = $props();

	function autoplay(video) {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		// Autoplay can be refused (e.g. data saver); the poster covers it.
		video.play().catch(() => {});
	}
</script>

<video
	{@attach autoplay}
	src="/turntables/{slug}.mp4"
	poster="/turntables/{slug}.webp"
	muted
	loop
	playsinline
	preload="auto"
	aria-label={label}
	class="h-full w-full object-cover"
></video>
