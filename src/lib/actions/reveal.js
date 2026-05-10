/**
 * Svelte action for scroll-triggered reveal animations.
 * Elements below the viewport fade up when scrolled into view.
 * Elements already visible on mount are left untouched.
 *
 * Usage: <div use:reveal> or <div use:reveal={{ delay: 200 }}>
 */
export function reveal(node, options = {}) {
	const { threshold = 0.15, delay = 0 } = options;

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (prefersReducedMotion) return {};

	const rect = node.getBoundingClientRect();
	const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

	if (isInViewport) return {};

	const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
	node.style.opacity = '0';
	node.style.transform = 'translateY(24px)';
	node.style.transition = `opacity 0.6s ${ease} ${delay}ms, transform 0.6s ${ease} ${delay}ms`;

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.style.opacity = '1';
					node.style.transform = 'translateY(0)';
					observer.unobserve(node);
				}
			}
		},
		{ threshold }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
