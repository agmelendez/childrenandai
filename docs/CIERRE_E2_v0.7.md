# Cierre de la etapa E2 · Release v0.7
Fecha: 26-10-2026 · Repositorio local: `main` = `dev` = etiqueta `v0.7`.

## Criterios de aceptación del plan (E2)
| Criterio | Meta | Resultado | Estado |
|---|---|---|---|
| Citas verificadas | 100 % | **422/422** (V5.2 + pdftotext, `verify_quotes.py`) | Cumple |
| Ancla CR por tema | ≥ 1 por tema | **12/12** temas; **60** ítems con ancla CR (S14, S21–S26) | Cumple |
| Cobertura Familia y 6–11 | ≥ 30 % de ítems por celda edad × público | Familia: 76 / 123 / 148 / 132 ítems en 6–8 / 9–11 / 12–14 / 15–18, equivalentes a 59–68 % de la celda Docente | Cumple con reserva: 6–8 sin evidencia empírica nacional |
| Auditoría APA 7 y licencias | Actualizada | 0 errores · 19 avisos (URL faltantes) | Cumple |
| Accesibilidad no regresiva | WCAG 2.2 AA | Lighthouse 100/100; axe 0 violaciones; contraste OK | Cumple |

## Corpus v0.5 → v0.7
| | v0.5 | v0.7 |
|---|---|---|
| Fuentes con ítems | 13 | **26** |
| Ítems | 310 | **422** |
| Fuentes de Costa Rica | 0 | **7** (guía MEP, Código de la Niñez, Leyes 8968 y 10020, Reglamento 37554-JP, ENIA 2024–2027, Kids Online CR 2023) |
| Fuentes de América Latina | 0 | **2** (GCABA, Kids Online Uruguay) |
| Bandas de edad | 6–11 / 12–14 / 15–18 | **6–8 / 9–11 / 12–14 / 15–18** (D1, ciclos MEP) |
| Fuentes de contexto (sin ítems) | 0 | 6 (ILIA, BID, Kissinger, Kids Online CR 2018 y dos duplicados de 2023) |

## Lotes de ingreso (trazables en `data/ingest/`)
- **e2a**: S14–S19 (55 ítems). **e2b**: S20–S23 (20 ítems). **e2c**: S25 (14 ítems). **e2d**: S26 Código de la Niñez (10), S24 ENIA versión final 2.6 (6, sustituye a los 3 de la versión de consulta) y **E2.5** S04 Eurydice (7: modelos de gobernanza de la IA escolar, contenido de las guías docentes europeas, reorientación analógica sueca).

## Hallazgos que condicionan E3 (tips)
1. Costa Rica regula la IA escolar por **guía orientadora** (S14), no por norma: los tips citan obligaciones solo cuando provienen de ley (8968, 10020, 7739).
2. **Ninguna norma CR fija edades mínimas para IA**; la base legal es el interés superior según edad y madurez (Código, art. 5). Los tips sobre edad deben apoyarse en ese principio y en los términos de uso de cada herramienta.
3. La Ley 8968 **no regula expresamente a menores**: consentimiento escrito de la representación legal.
4. La Ley 10020 (art. 173) ofrece la base para el tip sobre *deepfakes* sexuales; el Código (art. 27) prohíbe difundir datos que identifiquen a víctimas menores de edad.
5. Familia × 6–8 depende de fuentes internacionales: los tips para esa banda serán nivel B/C salvo los anclados en ley.

## Pendientes trasladados
- URL faltantes (19 avisos APA); autoría de S19; año de S20.
- Revisión humana de paráfrasis y clasificación de los 112 ítems nuevos (D5 aplica a tips, pero se recomienda muestreo de ítems).
- `PDFs/` contiene dos copias idénticas de S04 (mismo SHA-256): puede borrarse `Digital_education_at_school_in_Europe_2026_…pdf`.
- Firma de D2–D5.
