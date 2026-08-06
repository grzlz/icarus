import { listExperiments } from '$lib/server/ab/queries.js';
import { METRICS } from '$lib/server/ab/core.js';

export function load() {
	return { experiments: listExperiments(), metrics: METRICS };
}
