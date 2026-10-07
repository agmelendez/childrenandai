# Auditoría APA 7 (7.ª ed.) · Children on AI

Generado por `tools/audit_apa.py` el 2026-10-07 a partir de `data/*.json`. No lo edite a mano.

## Resumen

- Referencias: **13**; completas (con URL/DOI y sin campos pendientes): **3**; con datos pendientes: **10**.
- Ítems con cita textual y página: **310**; claves de cita en el texto únicas: **sí**.
- Errores estructurales: **0**; avisos de datos pendientes: **10**.

## Referencias

| Fuente | Cita en el texto | URL/DOI | Estado | Licencia | Nota |
|---|---|---|---|---|---|
| S01 | Munoz-Najar et al., 2026 | falta | pendiente | © 2026 IBRD/World Bank; reutilización no comercial con atribución (p. 2) | Falta URL de publicación y mes exacto. |
| S02 | Pham et al., 2026 | sí | completa | No indicada en el PDF consultado; verificar con la publicación original | Iniciales de autoría completadas desde la p. 1 del PDF. Es un preprint sin revisión por pares. |
| S03 | AlQahtani et al., 2026 | falta | pendiente | © 2026 World Economic Forum | Falta URL. |
| S04 | EACEA/Eurydice, 2026 | sí | completa | CC BY 4.0 | DOI del PDF inferido por la alineación de la p. 2; confirmar. Autoría de grupo: EACEA/Eurydice. |
| S05 | JCHR, 2026 | falta | pendiente | Open Parliament Licence | Editorial normalizada a «UK Parliament». Falta URL. |
| S06 | Tilbury, 2026 | sí | completa | No indicada en el PDF consultado; verificar con la publicación original | Falta mes de publicación (el DOI está completo). |
| S07 | DfE, 2026 | falta | pendiente | Open Government Licence v3.0; Crown copyright 2026 (p. 196) | Versión del corpus es borrador informativo; confirmar versión final. Falta URL. |
| S08 | European Commission, 2026 | falta | pendiente | No indicada en el PDF consultado; verificar con la publicación original | Título oficial completo por confirmar (el corchete «EU KIDS Act» es una descripción, no parte del título). Falta URL. |
| S09 | de Miguel, 2026 | falta | pendiente | No indicada en el PDF consultado; verificar con la publicación original | Faltan páginas y URL. Reseña de libro: formato APA con descripción entre corchetes. |
| S10 | Kralj, 2026 | falta | pendiente | © UNESCO 2026; CC BY-SA 3.0 IGO | Falta URL. |
| S11 | Staksrud et al., 2026 | falta | pendiente | No indicada en el PDF consultado; verificar con la publicación original | Editorial normalizada a «EU Kids Online». Falta DOI/URL. |
| S12 | Miao y Shiohira, 2024 | falta | pendiente | CC BY-SA 3.0 IGO | Falta URL/DOI (el PDF consultado solo trae ISBN). |
| S13 | Livingstone et al., 2026 | falta | pendiente | © UNESCO 2026; CC BY-SA 3.0 IGO | Falta URL. |

## Procedencia de cada gráfico

Cada gráfico, mapa, tabla y tarjeta del sitio muestra «Nota. Elaboración propia con datos de (autoría, año, PDF p. …)», enlazada a la referencia. Ítems que sustentan cada gráfico (`data/figure_sources.json`):

| Gráfico | Ítems | Fuentes |
|---|---|---|
| ruler | 14 | S08, S11, S13 |
| mediacion | 3 | S11 |
| tutor | 3 | S01 |
| resp | 20 | S01, S03, S04, S06, S08, S11, S13 |
| sist | 9 | S04 |
| comp | 16 | S12 |
| corpus | 310 | S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12, S13 |

## Controles

1. **Cumple.** Nota de fuente con cita en el texto en: regla de edades, 5 diagramas, mapa de calor, explorador, guías, escenarios, alertas (cifras), marco normativo, fuentes y glosario; cada tarjeta lleva «(autoría, año, PDF p. n)».
2. **Cumple.** Las 310 citas textuales se verifican contra el texto de los PDF con `tools/verify_quotes.py`.
3. **Cumple.** Claves de cita (autoría + año) únicas.
4. **Cumple.** Estructura de referencia APA 7 y orden alfabético; autoría de grupo como autor (S04, S05, S08).
5. **Pendiente.** URL, DOI, mes o páginas por completar (ver tabla). APA 7 exige URL o DOI cuando existen.
6. **Pendiente.** S04: DOI inferido de la p. 2 del PDF; S08: título oficial completo por confirmar.
7. **Límite.** Las páginas son el índice del PDF consultado, no la numeración impresa (APA 7 pide la impresa cuando existe). El sitio lo declara en cada nota.
8. **Límite.** S02 es preprint sin revisión por pares; S07 es borrador informativo.
9. **Límite.** Los esquemas conceptuales (ruta del tutor, responsabilidades) son de elaboración propia y se rotulan así.
10. **Pendiente.** Referencia de la herramienta de IA: Anthropic. (2026). *Claude* (Sonnet 5.5) [Large language model]. https://claude.ai — confirmar versión y fecha exactas de uso.

## Avisos (datos pendientes)

- S01: URL/DOI o datos por completar
- S03: URL/DOI o datos por completar
- S05: URL/DOI o datos por completar
- S07: URL/DOI o datos por completar
- S08: URL/DOI o datos por completar
- S09: URL/DOI o datos por completar
- S10: URL/DOI o datos por completar
- S11: URL/DOI o datos por completar
- S12: URL/DOI o datos por completar
- S13: URL/DOI o datos por completar
