# Sesión 2 · E2a — Ingreso de fuentes S14–S19
Fecha: 26-10-2026 · Rama `dev` (no publicada en `main`; v0.7 se etiqueta al cerrar E2b) · Base: `PLAN_MEJORA_2026-10.md`, E2.1–E2.2.

## 1. Resultado
| Indicador | v0.6 | E2a | Cambio |
|---|---|---|---|
| Fuentes con ítems | 13 | **19** | +6 |
| Ítems | 310 | **365** | +55 |
| Citas verificadas (subcadena exacta de la página) | 310/310 | **365/365** | — |
| Auditoría APA 7 | 0 errores | **0 errores** · 16 avisos | URL faltantes |
| Ítems con ancla en Costa Rica | 0 | **19** (S14) | Ley 8968, ENIA 2024–2027, INEC |
| Temas con ≥ 1 ancla CR | 0/12 | **10/12** | faltan *Edad y adecuación* y *Responsabilidad compartida* |
| Celda Familia × 6–11 | 75 | **86** | +15 % |

Ítems nuevos por fuente: S14 = 19 · S15 = 14 · S16 = 8 · S17 = 5 · S18 = 5 · S19 = 4. Por tipo: 33 recomendaciones, 9 hallazgos, 7 alertas, 3 competencias, 2 obligaciones y 1 cifra (ver `data/ingest/e2a_items.json`).

## 2. Fuentes ingresadas
| ID | Fuente | Rol en el sitio | Advertencias principales |
|---|---|---|---|
| S14 | MEP–ONU–UNESCO–ULACIT (2026), *Inteligencia artificial en clase* | **Ancla CR**: privacidad (Ley 8968), declaración de uso, normas de aula, mediación familiar | Cifras secundarias sin fuente primaria verificable (30 %, 40 %, 67 %, 78 %, 85 %) **excluidas** del corpus; no menciona edades mínimas de los términos de uso; propone subir ensayos a ChatGPT (p. 37) contra su propia regla de privacidad (registrado como alerta S14-07) |
| S15 | GCABA (2026), Anexo curricular IA y Protección Digital | Modelo de progresión por ciclos (mediado → autónomo); dependencia emocional; evaluación humana | Norma de otra jurisdicción (`legal_status` → «No aplica directamente en CR»); edades inferidas |
| S16 | Imaginable Futures (s. f.), *Learning in the Age of AI* | Familia: barreras internas, «código de silencio», umbral práctico → emocional | Cualitativo, sin fecha; testimonios |
| S17 | Comisión de Banda Ancha (2025), *Data Governance Toolkit* | Dirección: minimización, retención, compras, EIPD | No específico de niñez; extrapolación declarada |
| S18 | Lee (2023), *AI Toolkit for Educators* | Docente 15–18: verificación, sesgo de detectores | Universitario y desactualizado; CC BY-NC-SA → solo cita breve |
| S19 | *Diseño de tutores IA para los cursos* (s. f.) | Tip de tutor socrático (15–18) | **Sin autoría ni fecha**: confirmar procedencia |

Fuentes de contexto sin ítems (E2.2): ILIA 2026 (CEPAL–CENIA), BID (2026) y Kissinger et al., registradas en `data/context_sources.json`.

## 3. Método y trazabilidad
1. Extracción por página con `tools/extract_pages.py` (pdftotext) → `Bibliografía/e2/pages_e2.jsonl` (campos compatibles con V5.2; SHA-256 por archivo). **Limitación:** no se ejecutó el cuaderno completo V5.2 (OCR, chunks, embeddings); la verificación de citas usa el mismo criterio que v0.5.
2. Lectura completa de S14, S15, S16, S18 y S19; lectura filtrada de S17 (91 pp.; solo pasajes de niñez, educación, consentimiento, retención y compras).
3. Redacción de ítems (paráfrasis ES/EN, tipo, tema, edades, público, solidez, advertencias) en `data/ingest/e2a_items.json`; fichas en `e2a_catalog.json`.
4. Integración idempotente con `tools/ingest_e2.py e2a` → `tools/build_data.py`; verificación `verify_quotes.py` (365/365) y `audit_apa.py` (acepta «(s. f.)», APA 7 §9.17).
5. Bandas: los ítems nuevos usan aún 6–11 / 12–14 / 15–18; el reetiquetado a las 4 bandas D1 es E2.4.

## 4. Pendientes y decisiones para el autor
- **S19:** indicar autoría, curso y fecha (o retirarla si no puede atribuirse).
- **S14:** confirmar año de la referencia (créditos © 2025; ficha 1.ª ed. 2026) y URL oficial.
- URL faltantes en las 6 fichas nuevas.
- `PDFs/Digital_education_at_school_in_Europe_2026…pdf` es un duplicado de S04 (mismo tamaño): usar para E2.5.
- Validación humana de paráfrasis y clasificación (ítems generados con asistencia de IA).

## 5. Siguiente: E2b (sesión 3)
Búsqueda dirigida CR (lineamientos MEP, PRONIE MEP-FOD, PRODHAB, PANI, ENIA, Código de Niñez y Adolescencia, Ley 8968, datos nacionales) para cubrir los 2 temas sin ancla y la celda Familia 6–11; reetiquetado a bandas D1 (requiere firma de D1); E2.5 (S04); release v0.7.
