import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/*
 * /taller image generation. Takes the deterministic exact-text reference render
 * from the browser and asks a Gemini "Nano Banana" model to make it photoreal
 * while preserving the print verbatim (image editing, not text-to-image).
 *
 * Secrets stay here: GEMINI_API_KEY is read server-side and never sent to the
 * client. TALLER_PASSWORD (optional) gates the endpoint so a guessed /taller
 * URL can't burn API credits.
 */

const MODELS = {
	rapido: 'gemini-3.1-flash-image', // Nano Banana 2 — fast, ~$0.045/img
	calidad: 'gemini-3-pro-image' // Nano Banana Pro — best text, ~$0.134/img
};

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
		`Photorealistic product photo of a ${color} ${typeWord}, ${sceneText}.`,
		`Apply the print shown in the attached reference image to the garment EXACTLY as given:`,
		`reproduce every character, symbol, line break and punctuation mark verbatim — do not`,
		`correct spelling, translate, rephrase, restyle, or add any extra text, numbers or logos.`,
		techniqueText,
		`Heavyweight 220 gsm cotton with natural folds and realistic fabric texture, soft even`,
		`studio lighting, true-to-life colors, sharp focus on the print, square 1:1 framing.`,
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

	if (!env.GEMINI_API_KEY) {
		return json({ error: 'Falta GEMINI_API_KEY en el servidor (.env)' }, { status: 500 });
	}

	const match = /^data:(image\/\w+);base64,(.+)$/s.exec(referenceImage ?? '');
	if (!match) {
		return json({ error: 'Imagen de referencia inválida' }, { status: 400 });
	}
	const [, mimeType, data] = match;
	const model = MODELS[quality] ?? MODELS.rapido;
	const prompt = buildPrompt({ type, garment, technique, scene });

	let res;
	try {
		res = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-goog-api-key': env.GEMINI_API_KEY
				},
				body: JSON.stringify({
					contents: [
						{ role: 'user', parts: [{ text: prompt }, { inlineData: { mimeType, data } }] }
					],
					generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
				})
			}
		);
	} catch {
		return json({ error: 'No se pudo contactar al servicio de imágenes' }, { status: 502 });
	}

	if (!res.ok) {
		const detail = await res.text().catch(() => '');
		console.error('[taller] Gemini error', res.status, detail);
		return json({ error: `Servicio de imágenes respondió ${res.status}` }, { status: 502 });
	}

	const payload = await res.json().catch(() => null);
	const parts = payload?.candidates?.[0]?.content?.parts ?? [];
	const imgPart = parts.find((p) => p.inlineData ?? p.inline_data);
	const inline = imgPart?.inlineData ?? imgPart?.inline_data;

	if (!inline?.data) {
		const reason = payload?.candidates?.[0]?.finishReason ?? payload?.promptFeedback?.blockReason;
		console.error('[taller] no image part', reason, JSON.stringify(payload)?.slice(0, 500));
		return json(
			{ error: reason ? `Sin imagen (${reason})` : 'El modelo no devolvió una imagen' },
			{ status: 502 }
		);
	}

	const outMime = inline.mimeType ?? inline.mime_type ?? 'image/png';
	return json({ image: `data:${outMime};base64,${inline.data}` });
}
