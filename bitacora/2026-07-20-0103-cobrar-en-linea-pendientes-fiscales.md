# Cobrar en línea: pasarela elegida y pendientes fiscales

- fecha: 2026-07-20 01:03
- repo: website (rama main)

## registro original

Investigación de pasarelas de pago para que `/tienda` acepte pedidos de verdad, y qué tanto preocuparse por impuestos al arrancar. Guardado como pendiente para retomar.

## decisión de pasarela

**Stripe Checkout (hosted)** como primera integración.

- 3.6% + $3 MXN por transacción, IVA incluido, sin mensualidad. Misma tarifa para OXXO.
- Mercado Pago sale en ~3.94% efectivo (3.4% + $3 + IVA) pero con mucha más confianza de marca en MX. Candidato a segundo botón cuando haya tracción, no reemplazo.
- Conekta es la más barata (~2.9-3.4%) pero solo gana con volumen alto; DX por debajo.
- Snipcart y compañía descartados: 2% extra encima de la pasarela por un carrito que se escribe en Svelte en un rato.

Flujo: botón en `/tienda` → endpoint SvelteKit crea la Checkout Session (talla/color como metadata) → Stripe hostea el pago → webhook confirma e inserta el pedido en api.icarus.mx. Sin carrito propio al inicio: el catálogo es chico y cada prenda puede ir directo a su sesión.

## pendientes fiscales (lo que hay que resolver antes de cobrar)

Aplican por ser **persona moral**, no persona física. Esto cambió el cálculo a media investigación.

1. **Objeto social y actividad económica.** La empresa venía del lado software; el giro registrado ante el SAT casi seguro no incluye comercio al por menor de ropa. Hay que dar de alta la actividad (trámite en línea, gratis) y confirmar que el acta constitutiva permite el giro. Sin esto, el CFDI no cuadra con la actividad registrada y Stripe puede frenar el underwriting.
2. **ISR es 30%, no 1-2.5%.** Las tasas bajas de RESICO son solo para persona física. RESICO-PM mantiene el 30%; el beneficio es que la base se calcula sobre flujo de efectivo (acumulas cuando cobras, deduces cuando pagas), no sobre lo devengado. Aplica si la empresa factura menos de 35 MDP al año. Confirmar con contador si ya está en RESICO-PM o en régimen general.
3. **IVA 16% sobre ropa, declaración mensual.** Es la trampa real, no el ISR. Los precios deben llevar IVA incluido desde la primera playera — subirlo después se lee como traición al cliente.
4. **Factura global mensual.** CFDI al RFC genérico agrupando las ventas donde nadie pidió factura. Mecánico; Facturama o Alegra lo automatizan por ~$200/mes.
5. **Onboarding de Stripe como persona moral** pide más que RFC + Constancia: acta constitutiva, poder del representante legal, identificación e info de beneficiarios reales.

Margen aproximado por playera de $500: −$69 IVA, −$21 Stripe, y sobre la utilidad cae el 30% de ISR. Quedan ~$410 antes de costo de prenda y antes de ISR.

## estrategias fiscales exploradas

**Vender como persona física en RESICO-PF (1-2.5% ISR): descartada.** La LISR excluye del RESICO-PF a quienes sean socios, accionistas o integrantes de una persona moral, y no solo por operar con ellas — basta con participar en la administración, control o capital. Siendo socio de Icarus, la ruta está cerrada. La reforma 2026 la cerró más: ningún socio puede estar en RESICO si participa en más de una persona moral, con tope de 10% de participación en otras empresas.

**Vender por la persona moral en RESICO-PM: la ruta real.** El 30% asusta menos de lo que suena porque cae sobre utilidad, no sobre ingresos. Prendas, bordado, envíos, comisiones de Stripe y hosting deducen. En una operación de playeras con costo de mercancía real, la utilidad es delgada y el 30% de delgado no duele.

**La jugada que sí conecta con el north star:** RESICO-PM deduce equipo de cómputo y servidores al **50% anual** contra el 30% del régimen general, siempre que el total de inversiones del ejercicio no rebase 3 MDP. O sea: la utilidad de las playeras que se reinvierte en el cluster de GPUs se deduce al doble de velocidad. La meta de financiar el cluster y la estrategia fiscal apuntan al mismo lado — no hay que elegir.

Conclusión: a esta escala no hay estructura exótica que valga la pena. Las dos palancas son elegir bien el régimen (una vez) y deducir todo lo deducible (siempre). Cualquier cosa más sofisticada cuesta más en honorarios de lo que ahorra.

## decisión de precios (2026-07-20)

Precios subidos 16% para trasladar el IVA al cliente, redondeando al patrón de terminación que ya usaba cada familia:

| Antes                     | Ahora  | Neteas |
| ------------------------- | ------ | ------ |
| $399 (playera estampado)  | $469   | $404   |
| $899 (sudadera estampado) | $1,049 | $904   |
| $490 (playera bordado)    | $570   | $491   |
| $990 (sudadera bordado)   | $1,150 | $991   |

Se descartó la idea de sumar $50 fijos: un monto fijo no puede seguir a un impuesto porcentual. En $399 cubría el 78% del IVA, en $990 solo el 46%. Peor aún, el propio $50 causa IVA — sumarlo a $399 dejaba un neto de $387, _por debajo_ del precio original.

El código es lo de menos — un día con pruebas. El camino crítico es el punto 1, porque bloquea tanto la facturación correcta como la activación de Stripe, y es el único que no se puede resolver escribiendo código. Vale arrancar la integración en modo test (no requiere cuenta activada) en paralelo al trámite, así el día que Stripe apruebe solo se cambian las llaves.

Lo que sí conviene decidir ya, aunque el trámite tarde: **precios con IVA adentro**. Es la única de estas decisiones que es cara de revertir.

Esto es el mapa, no el dictamen — el alta inicial con un contador cuesta poco y elegir mal el régimen sí es caro de corregir.
