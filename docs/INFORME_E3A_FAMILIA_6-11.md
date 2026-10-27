# E3a · Lote 1 de tips: Familia 6–8 y 9–11
Fecha: 26-10-2026 · Estado: **borrador** (D5: pendiente experto en educación, MEP y filología) · Generador: `tools/e3a_familia.py`

## Entregables
- `data/transfer.json` — matriz de transferibilidad (E3.1): **18 prácticas** · 13 adoptar · 4 adaptar · 1 no transferir · niveles A 13 / B 4 / C 1.
- `data/tips.json` — **24 tips Familia** (E3.2): 19 aplican a 6–8 y 23 a 9–11; confianza **A 16 / B 8 / C 0**; 20 con ancla CR (Ley 8968, Ley 10020, Código 7739, guía MEP, Kids Online CR 2023, ENIA); 4 sin ancla con condición de adaptación explícita.
- `tools/readability.py` — Fernández-Huerta: **media 90,8; 0/24 bajo 70**.

## Criterios de aceptación (E3)
| Criterio | Resultado |
|---|---|
| 0 tips sin evidencia | Cumple (todos los `evidence_ids` existen; 0 con banda incongruente) |
| 100 % con confianza y ancla/condición CR | Cumple (validado por esquema) |
| Legibilidad Familia ≥ 70 | Cumple (90,8) |

## Criterios fijados por el equipo (26-10-2026)
- **Sin edad mínima en CR.** Ninguna norma costarricense fija edad mínima ni regula el uso de IA por menores; las recomendaciones se deciden **en función de la exposición y los riesgos** (interés superior, edad y madurez). La edad de 13 años de los términos de uso se menciona solo como dato del proveedor.
- **Casos extranjeros como ejemplos.** Noruega (sin IA generativa en grados 1–7), China u otros se citan como ejemplos, no como modelos aplicables a CR (TR-018: no transferir).
- **Compañeros de IA: NO REGULADO.** Ni los compañeros de IA ni la edad están regulados en CR, y los tips lo dicen expresamente. Ejemplos citados: apps de compañía (Character.AI, Replika), chatbots con personajes infantiles (S13-11) y chatbots integrados en juegos y redes (S08-12). Character.AI y Replika son ejemplos de mercado que no están en el corpus: verificarlos en E6.
- **Canales de denuncia:** la escuela es el canal oficial; después, el PANI o el OIJ según el tipo de delito (T-FAM-015).
- **Privacidad (Código 7739):** se cita el derecho sin número de artículo, porque no se tiene la fuente del artículo.
- **Inglés:** la revisión queda para el cierre de E3.

## Pendientes antes de publicar
1. Revisión del inglés al cierre de E3; T-FAM-023 se valida con docentes de I y II ciclo.
2. Validación D5 (persona experta en educación, MEP, filología).
3. Lotes siguientes: Familia 12–14 y 15–18 y transversales E3.3.
