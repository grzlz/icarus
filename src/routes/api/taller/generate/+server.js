import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/*
 * /taller image generation via OpenAI's image-edit API (GPT Image 1.5).
 * Takes the deterministic exact-text reference render from the browser and
 * makes it photoreal while preserving the print verbatim — image editing, not
 * text-to-image. `input_fidelity: high` tells the model to keep the uploaded
 * image's details (the print text) intact and only change fabric/scene.
 *
 * Secrets stay here: OPENAI_API_KEY is read server-side and never sent to the
 * client. TALLER_PASSWORD (optional) gates the endpoint so a guessed /taller
 * URL can't burn API credits.
 */

const MODEL = 'gpt-image-1.5';

// Our two-tier "rápido / calidad" maps to OpenAI's quality knob.
const QUALITY = { rapido: 'low', calidad: 'high' };

const TYPES = {
	playera: 't-shirt',
	sudadera: 'crewneck sweatshirt'
};

const COLORS = {
	black: 'black',
	white: 'natural off-white',
	grey: 'heather grey',
	olive: 'olive green'
};

const SCENES = {
	flatlay: 'laid flat (flat-lay) on a seamless neutral studio background, shot from directly above',
	colgada: 'on a plain wooden hanger against a clean neutral wall',
	model: 'worn by a model, relaxed upper-body crop, natural pose, clean studio lighting'
};

function buildPrompt({ type, garment, technique, scene }) {
	const typeWord = TYPES[type] ?? TYPES.playera;
	const color = COLORS[garment] ?? COLORS.black;
	const sceneText = SCENES[scene] ?? SCENES.flatlay;
	const techniqueText =
		technique === 'bordado'
			? 'The design is a small embroidered chest patch with visible raised thread stitching.'
			: 'The design is screen-printed directly onto the fabric, soft matte ink settled into the cotton weave.';

	return [
		`Turn this flat reference into a photorealistic product photo of a ${color} ${typeWord}, ${sceneText}.`,
		`Keep the print shown in the reference EXACTLY as given: reproduce every character, symbol,`,
		`line break and punctuation mark verbatim — do not correct spelling, translate, rephrase,`,
		`restyle, or add any extra text, numbers or logos.`,
		techniqueText,
		`Heavyweight 220 gsm cotton with natural folds and realistic fabric texture, soft even`,
		`studio lighting, true-to-life colors, sharp focus on the print, square framing.`,
		`No watermark, no mockup template outlines, no hands. The reference's flat colored`,
		`background only indicates the garment color and print placement — it is not part of`,
		`the final photo.`
	].join(' ');
}

export async function POST({ request }) {
	const body = await request.json().catch(() => null);
	if (!body) return json({ error: 'Petición inválida' }, { status: 400 });

	const { referenceImage, garment, technique, type, scene, quality, password } = body;

	if (env.TALLER_PASSWORD && password !== env.TALLER_PASSWORD) {
		return json({ error: 'Acceso denegado' }, { status: 401 });
	}

	if (!env.OPENAI_API_KEY) {
		return json({ error: 'Falta OPENAI_API_KEY en el servidor (.env)' }, { status: 500 });
	}

	const match = /^data:(image\/\w+);base64,(.+)$/s.exec(referenceImage ?? '');
	if (!match) {
		return json({ error: 'Imagen de referencia inválida' }, { status: 400 });
	}
	const [, mimeType, data] = match;
	const prompt = buildPrompt({ type, garment, technique, scene });

	// OpenAI's edits endpoint is multipart/form-data with the reference as a file.
	const form = new FormData();
	form.append('model', MODEL);
	form.append('prompt', prompt);
	form.append('size', '1024x1024');
	form.append('quality', QUALITY[quality] ?? QUALITY.rapido);
	form.append('input_fidelity', 'high'); // preserve the exact print text
	form.append('n', '1');
	form.append(
		'image',
		new Blob([Buffer.from(data, 'base64')], { type: mimeType }),
		'reference.png'
	);

	let res;
	try {
		res = await fetch('https://api.openai.com/v1/images/edits', {
			method: 'POST',
			headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` },
			body: form
		});
	} catch {
		return json({ error: 'No se pudo contactar al servicio de imágenes' }, { status: 502 });
	}

	const payload = await res.json().catch(() => null);

	if (!res.ok) {
		const msg = payload?.error?.message ?? `respondió ${res.status}`;
		console.error('[taller] OpenAI error', res.status, msg);
		return json({ error: `Servicio de imágenes: ${msg}` }, { status: 502 });
	}

	const b64 = payload?.data?.[0]?.b64_json;
	if (!b64) {
		console.error('[taller] no image in response', JSON.stringify(payload)?.slice(0, 500));
		return json({ error: 'El modelo no devolvió una imagen' }, { status: 502 });
	}

	return json({ image: `data:image/png;base64,${b64}` });
}
