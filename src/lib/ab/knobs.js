/*
 * Puntos de ajuste ya cableados en el sitio. Un experimento tipo 'ajuste'
 * que defina una de estas claves controla ese valor en vivo desde el panel,
 * sin tocar código. Para una clave nueva: léela con knob() donde aplique y
 * regístrala aquí para que el panel la sugiera.
 */
export const KNOB_POINTS = [
	{ key: 'titulo-drop', desc: 'Título del drop en la portada (H1)', fallback: 'Drop 01' },
	{
		key: 'drop02-texto',
		desc: 'Texto del bloque Drop 02 en la franja oscura',
		fallback: 'Ya se está cocinando.'
	}
];
