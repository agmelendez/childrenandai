# Registro de decisiones — Children on AI

Origen: `PLAN_MEJORA_2026-10.md`, «Decisiones de partida». Estado: **propuestas pendientes de firma (E0.1)**, salvo indicación. Cambiar el estado a «Aprobada» con fecha y responsable.

| # | Decisión | Propuesta | Estado | Aplicada en | Responsable / fecha |
|---|---|---|---|---|---|
| D1 | Bandas de edad | 4 bandas MEP sin traslape: **6–8** (I ciclo), **9–11** (II ciclo), **12–14** (III ciclo), **15–18** (Diversificada). Los 12 años van con III ciclo | **Aprobada** | v0.7-dev (E2.4, `tools/rebands_d1.py`) | Agustín Gómez Meléndez · 26-10-2026 |
| D2 | Público prioritario de portada | Familias («¿Quién eres? + edad»); docentes y dirección a un clic; la regla de edades pasa a Evidencia | Propuesta | — (E4.1) | |
| D3 | Unidad de producto | **Tip** (acción) sobre la base de **ítems** (evidencia) | **Aprobada** | E3 (tips.json) | Agustín Gómez Meléndez · 26-10-2026 |
| D4 | Idioma por defecto | ES, con EN opcional y memoria de elección | **Aplicada provisionalmente** | v0.6 (E1.1) | Pendiente de firma |
| D5 | Validación de tips | Redacción CIOdD + **validación por personas expertas en educación** + **validación del MEP** + revisión filológica. La validación externa se realiza «en su momento» (antes de publicar tips; los borradores pueden mostrarse marcados como tales) | **Aprobada (modificada)** | E3.4 / E5 · `tips.schema.json` | Agustín Gómez Meléndez · 26-10-2026 |

## Decisiones operativas tomadas en E1 (v0.6)
- **O1 · Regla provisional de aplicabilidad a CR.** «No aplica directamente en CR» = ítem con `legal_status` o con `caveat` que lo declara. Se sustituirá por la matriz de transferibilidad (`data/transfer.json`, E3.1).
- **O2 · Regla de edades en móvil.** ≤ 700 px muestra el resumen por edad; el diagrama completo queda a un botón. Coherente con D2 (la regla migrará a Evidencia en E4).
- **O3 · Orden en «Para ti».** Aplicable CR > tipo (obligación/alerta > recomendación > hallazgo/cifra) > solidez de la evidencia.

- **O4 · Paráfrasis y lectura separadas (26-10-2026).** `es`/`en` reproducen fielmente la fuente; toda inferencia del equipo va en `lectura_cr` y el sitio la muestra rotulada «Lectura CIOdD para Costa Rica (no es texto de la fuente)». Origen: revisión muestral v0.7.
