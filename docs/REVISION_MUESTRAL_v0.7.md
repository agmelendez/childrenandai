# Revisión muestral de los ítems nuevos de v0.7
Fecha: 26-10-2026 · Universo: 112 ítems ingresados en E2 (S14–S26 y S04-41 a S04-47) · Herramienta: `tools/sample_review.py` (semilla 20261026).

## Diseño
- Muestra aleatoria **estratificada por fuente**: el 35 % de cada fuente, redondeado hacia arriba, con mínimo 1. Resultado: **n = 45 (40 % del universo)**. Lista en `docs/muestra_revision_v0.7.json`.
- Para cada ítem se comparó la paráfrasis ES/EN con la cita y unos 700 caracteres de contexto de la página. También se revisaron tipo, tema, bandas, público, solidez y advertencia.
- **Limitación:** la revisión la hizo el mismo sistema que redactó los ítems; no es independiente. D5 (validación por personas expertas en educación y el MEP) cubre los tips, no los ítems. Se recomienda que una persona del equipo revise al menos los 20 ítems corregidos.

## Hallazgos (n = 45)
| Tipo de problema | Casos | % | Ejemplos |
|---|---|---|---|
| Cifra, página o cita incorrecta | 0 | 0 % | — |
| Inferencia del equipo incluida en la paráfrasis sin marcarla | 7 | 16 % | S16-05 (causalidad añadida: «porque perciben juicio»), S26-06 («supervisión proporcional»), S26-05, S26-03, S26-08, S25-02, S04-42 |
| Clasificación | 2 | 4 % | S20-02 (tema «Alfabetización en IA» → «Competencias»: la fuente habla de habilidades digitales, no de IA); S14-01 (solidez «normativa» → «orientación»: la fuente es una guía que recuerda la ley) |
| Sin observaciones | 36 | 80 % | — |

## Corrección aplicada
Como el patrón es sistemático y no aleatorio, la regla se aplicó a **los 112 ítems**, no solo a la muestra. Se detectaron 11 casos más fuera de la muestra con el mismo patrón (S20-03, S20-06, S21-01, S21-02, S21-04, S23-04, S25-04, S26-01, S26-02, S26-07, S26-09).
- **Regla nueva (decisión O4):** `es`/`en` = paráfrasis fiel. La inferencia pasa al campo `lectura_cr`/`lectura_cr_en`, que el sitio muestra rotulado «Lectura CIOdD para Costa Rica (no es texto de la fuente)».
- **20 ítems corregidos** (17 con `lectura_cr`, 1 solo con nueva redacción y 2 de clasificación) mediante `tools/apply_review_v07.py`, que actualiza los lotes `data/ingest/` para que la corrección sobreviva a un reingreso.
- Tras la corrección: 422/422 citas verificadas, APA 0 errores, Lighthouse 100, axe sin violaciones.

## Estimación para el universo
Con 7/45 inferencias sin marcar en la muestra, el intervalo de Wilson al 95 % para la proporción en los 112 ítems es aproximadamente **8 %–29 %**. Se encontraron y corrigieron 18 casos de este tipo (16 %), lo que está dentro del intervalo. Es razonable suponer que queda un número bajo de casos residuales, que deberá detectar la revisión humana.
