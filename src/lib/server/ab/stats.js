/*
 * Bayesian engine for the dashboard. Each variant's conversion rate gets a
 * Beta(1 + conversions, 1 + exposures − conversions) posterior (uniform
 * prior), and we Monte-Carlo sample the posteriors to report:
 *
 *   probBeat — P(variant's true rate > control's true rate)
 *   ci       — central 95% credible interval of the rate
 *   lift     — posterior MEDIAN of (variant − control) / control; the mean
 *              is undefined when the control has 0 conversions (E[1/c] = ∞
 *              for Beta(1, b)) and Jensen-inflated otherwise, so we never
 *              report it — and lift is null entirely at 0 control conversions
 *
 * 20k samples keeps the error on probBeat well under one percentage point,
 * and reads honestly at low traffic (wide intervals, probabilities near 50%)
 * where a p-value would over-promise.
 */

const N = 20000;

/* Box–Muller. */
function gaussian() {
	let u = 0;
	while (u === 0) u = Math.random();
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random());
}

/* Marsaglia–Tsang; our shapes are always ≥ 1 but the boost handles < 1 too. */
function sampleGamma(shape) {
	if (shape < 1) return sampleGamma(shape + 1) * Math.pow(1 - Math.random(), 1 / shape);
	const d = shape - 1 / 3;
	const c = 1 / Math.sqrt(9 * d);
	for (;;) {
		let x, v;
		do {
			x = gaussian();
			v = 1 + c * x;
		} while (v <= 0);
		v = v * v * v;
		const u = Math.random();
		if (u < 1 - 0.0331 * x ** 4) return d * v;
		if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
	}
}

function sampleBeta(a, b) {
	const x = sampleGamma(a);
	return x / (x + sampleGamma(b));
}

/*
 * rows: [{ key, is_control, exposed, converted }] →
 * [{ key, rate, ci: [lo, hi], probBeat, lift }] (probBeat/lift null on control).
 */
export function compareVariants(rows) {
	if (!rows.length) return [];
	const control = rows.find((r) => r.is_control) ?? rows[0];

	const samples = new Map();
	for (const r of rows) {
		const a = 1 + r.converted;
		const b = 1 + Math.max(0, r.exposed - r.converted);
		const s = new Float64Array(N);
		for (let i = 0; i < N; i++) s[i] = sampleBeta(a, b);
		samples.set(r.key, s);
	}

	return rows.map((r) => {
		const s = samples.get(r.key);
		const sorted = Float64Array.from(s).sort();
		const ci = [sorted[Math.floor(N * 0.025)], sorted[Math.floor(N * 0.975)]];

		let probBeat = null;
		let lift = null;
		if (r.key !== control.key) {
			const c = samples.get(control.key);
			let wins = 0;
			for (let i = 0; i < N; i++) {
				if (s[i] > c[i]) wins++;
			}
			probBeat = wins / N;
			if (control.converted > 0) {
				const lifts = new Float64Array(N);
				for (let i = 0; i < N; i++) lifts[i] = (s[i] - c[i]) / c[i];
				lifts.sort();
				lift = lifts[N >> 1];
			}
		}

		return {
			key: r.key,
			rate: r.exposed ? r.converted / r.exposed : 0,
			ci,
			probBeat,
			lift
		};
	});
}
