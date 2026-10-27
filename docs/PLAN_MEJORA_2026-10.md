# Plan de mejora incremental — Children on AI
Versión 1.0 · 26-10-2026 · Base: `AUDITORIA_CORPUS_UX_2026-10-26.md` (+ adenda) · Línea base: draft 0.5 (310 ítems, 13 fuentes)

## Principios
1. **Cada etapa entrega un sitio publicable** (release etiquetado en GitHub: v0.6, v0.7…); nada queda a medias en `main`.
2. **Evidencia primero, tip después:** ningún tip sin `evidence_ids[]` verificados (cita + página) y nivel de confianza A/B/C.
3. **Costa Rica como destino:** toda práctica extranjera pasa por la matriz de transferibilidad antes de convertirse en recomendación.
4. **Accesibilidad no regresiva:** cada release conserva WCAG 2.2 AA (contraste, teclado, lector de pantalla) y se prueba con `tools/contrast.py`.
5. **Trazabilidad:** cambios de datos vía scripts en `tools/`, nunca editando `data.js` a mano; CHANGELOG por release.

## Decisiones de partida (propuestas; confirmar o ajustar en E0)
| # | Decisión | Propuesta | Fundamento |
|---|---|---|---|
| D1 | Bandas de edad | 4 bandas alineadas con el MEP: **6–8** (I ciclo), **9–11/12** (II ciclo), **12–15** (III ciclo), **15–18** (Diversificada) | Coherencia local; progresión espiral UNESCO/GCABA; corrige inconsistencia 5–18 / 6–11 / 12–14 / 15–18 |
| D2 | Público prioritario de portada | Familias (entrada simple "¿Quién eres? + edad"); docentes y dirección a un clic; la regla de edades pasa a Evidencia | Familia y 6–11 son los segmentos más débiles y el público más amplio |
| D3 | Unidad de producto | **Tip** (acción) sobre la base de **ítems** (evidencia) | El sitio actual es visor de evidencia, no gestor de tips |
| D4 | Idioma por defecto | ES, con EN opcional y memoria de elección | Público CR |
| D5 | Validación de tips | Redacción CIOdD + revisión por 2 pares (1 docente MEP, 1 familia) + revisión filológica | Lenguaje llano verificable |

---

## E0 · Preparación y gobernanza (semana 1)
**Objetivo:** fijar reglas antes de tocar contenido.
- E0.1 Confirmar D1–D5 y registrar en `docs/DECISIONES.md`.
- E0.2 Definir esquema `tips.json` (id, texto_es/en, por_qué, edad[], público[], contexto casa/aula/política, esfuerzo, urgencia, confianza A/B/C, evidence_ids[], ancla_cr, condición_adaptación, revisado_por, fecha).
- E0.3 Definir esquema de la **matriz de transferibilidad** (`data/transfer.json`).
- E0.4 Crear CHANGELOG y rama `dev`; etiquetar `v0.5` como línea base.
**Criterio de aceptación:** esquemas validados con JSON Schema; decisiones firmadas.

## E1 · Correcciones UX rápidas → release v0.6 (semanas 1–2)
**Objetivo:** quitar fricciones visibles sin cambiar arquitectura.
- E1.1 Idioma por defecto ES (D4).
- E1.2 Menú lateral fijo (`position: sticky; height: 100vh`).
- E1.3 Integrar ES/EN y Accesibilidad en la barra superior (dejar de tapar contenido).
- E1.4 Regla de edades: vista móvil vertical o resumen por edad en lugar de scroll horizontal.
- E1.5 Tarjetas de estadísticas → filtros clicables.
- E1.6 Metainformación (S08-03, "PDF p.", estatus legal) dentro de un pliegue "¿De dónde sale esto?".
- E1.7 Ordenar "Para ti" por relevancia: obligaciones/alertas aplicables → recomendaciones → hallazgos; fuentes no aplicables a CR al final.
**Aceptación:** capturas 1366/390 px sin solapamientos; Lighthouse accesibilidad ≥ 95; prueba de teclado completa.

## E2 · Corpus: fuentes nuevas y ancla Costa Rica → v0.7 (semanas 2–4)
**Objetivo:** cerrar brechas de fondo (Familia, 6–11, CR, ALC).
- E2.1 Ingresar con pipeline V5.2 + `verify_quotes.py`: **S14 MEP-UNESCO-ULACIT 2026 (ancla CR)**, S15 Anexo GCABA 2026, S16 Imaginable Futures, S17 Data Governance Toolkit, S18 AI Toolkit for Educators (parafraseo, licencia NC), S19 Diseño de tutores IA.
- E2.2 Fuentes de contexto (sin ítems de recomendación): ILIA 2026, BID regulación, Kissinger et al.
- E2.3 Búsqueda dirigida CR: lineamientos de educación digital del MEP, PRONIE MEP-FOD, PRODHAB, PANI, Estrategia Nacional de IA (MICITT 2024), Código de Niñez y Adolescencia, Ley 8968; datos nacionales de uso en menores.
- E2.4 Reetiquetar los 310 ítems a las 4 bandas (D1) con regla documentada y script.
- E2.5 Recuperar secciones no extraídas de S04 (Eurydice): políticas nacionales de IA escolar, formación docente.
- E2.6 Auditoría APA 7 y licencias actualizada (`tools/audit_apa.py`).
**Aceptación:** ≥ 30 % de ítems por celda edad × público en Familia y 6–11; 100 % de citas verificadas; ≥ 1 ancla CR por tema.

## E3 · Capa de tips y matriz CR → v0.8 (semanas 4–7)
**Objetivo:** convertir evidencia en recomendaciones accionables para CR.
- E3.1 Matriz de transferibilidad para cada práctica candidata (fuente → ancla CR → condición de adaptación → nivel A/B/C).
- E3.2 Redactar 8–12 tips por celda (4 bandas × 3 públicos ≈ 100–140 tips); prioridad: Familia 6–8 y 9–11.
- E3.3 Tips transversales críticos: privacidad y Ley 8968; edad mínima de términos de uso de herramientas (vacío de la guía MEP); chatbots de compañía y dependencia emocional; deepfakes y explotación; evaluación resistente a la IA; tutor socrático (solo 15–18).
- E3.4 Validación por pares (D5) y revisión filológica.
- E3.5 Nueva tarjeta de tip: acción + por qué + semáforo de confianza + pliegue de evidencia.
**Aceptación:** 0 tips sin evidencia; 100 % con nivel de confianza y ancla/condición CR; legibilidad (Fernández-Huerta ≥ 70 para Familia).

## E4 · Nueva arquitectura y gestión → v0.9 (semanas 7–10)
**Objetivo:** que cada público visualice y gestione sus tips.
- E4.1 Portada por perfiles (D2): "¿Quién eres?" + banda → Top 5 tips.
- E4.2 "Mi plan": favoritos, checklist "ya lo hago", progreso (localStorage, sin datos personales).
- E4.3 Exportar plan a PDF de una página / impresión (CSS print), compartible con la escuela.
- E4.4 Búsqueda global y filtros por tema/contexto/esfuerzo.
- E4.5 Módulos por público: **Familia** (tarjetas de conversación por edad, acuerdos de uso en el hogar); **Docente** (escenarios por grado MEP, evaluación, prompts seguros); **Dirección** (plantilla de política institucional, checklist de compra de plataformas, protocolo de incidentes).
- E4.6 Ficha "Costa Rica en contexto" (ILIA + marco legal).
**Aceptación:** flujo "encontrar 3 tips, guardar, imprimir" en ≤ 3 min en pruebas internas.

## E5 · Validación con usuarios y ajuste → v1.0 (semanas 10–12)
- E5.1 Prueba de usabilidad: 5 familias, 5 docentes, 3 directores; métricas SUS, éxito por tarea, tiempo.
- E5.2 Prueba con lector de pantalla (VoiceOver/NVDA) por persona usuaria ciega si es posible.
- E5.3 Ajustes priorizados por severidad; declaración de IA, licencias y CITATION.cff actualizados.
- E5.4 Lanzamiento v1.0 y nota técnica / policy brief CIOdD.
**Aceptación:** SUS ≥ 75; éxito ≥ 80 % por tarea; 0 barreras de accesibilidad críticas.

## E6 · Mantenimiento (continuo)
Revisión trimestral de fuentes y términos de uso de herramientas; registro de fecha de verificación por tip; caducidad automática de tips con > 12 meses sin revisión.

---
## Estimación por tokens y sesiones (sustituye la estimación en semanas)
Supuestos: sesión útil ≈ 200 k tokens de contexto efectivo (por encima, la calidad baja por compactación); 1 palabra ≈ 1,4 tokens en ES; ítem bilingüe con cita y advertencias ≈ 400 tokens; tip bilingüe ≈ 350; captura de pantalla ≈ 1,5 k. Los archivos grandes (`items.json` ≈ 120 k tokens, `data.js` ≈ 130 k) **no se cargan completos**: se procesan con scripts. Margen de error ±30 %.

| Sesión | Etapa | Entrada (lectura) | Salida (escritura) | Total aprox. | Entregable al cierre |
|---|---|---|---|---|---|
| 1 | E0 + E1 | Código del sitio 55 k + capturas 20 k + iteraciones 40 k | Ediciones 25 k + decisiones/esquemas 10 k | **≈ 150 k** | v0.6 publicable |
| 2 | E2a | 6 fuentes nuevas ≈ 100 k | ~60 ítems ≈ 25 k + verificación 10 k | **≈ 160 k** | S14–S19 en el corpus |
| 3 | E2b | Búsqueda CR (10–15 búsquedas/lecturas) ≈ 70 k + reglas de reetiquetado 20 k | Ítems CR ≈ 15 k + script bandas 10 k + auditoría APA 10 k | **≈ 140 k** | v0.7 |
| 4 | E3a | Evidencia Familia filtrada ≈ 70 k | Matriz transferibilidad ≈ 20 k + 50 tips Familia ≈ 18 k | **≈ 130 k** | Tips Familia (4 bandas) |
| 5 | E3b | Evidencia Docente/Dirección ≈ 80 k | 70 tips ≈ 25 k + revisión ≈ 15 k | **≈ 140 k** | v0.8 (tips completos) |
| 6 | E4a | Código ≈ 60 k + esquemas | Portada por perfiles, tarjeta de tip, búsqueda ≈ 40 k + pruebas 25 k | **≈ 150 k** | Nueva arquitectura |
| 7 | E4b | Código ≈ 50 k | Mi plan, PDF/impresión, módulos por público ≈ 45 k + pruebas 30 k | **≈ 150 k** | v0.9 |
| 8 | E5a | Plan y sitio ≈ 40 k | Protocolo de usabilidad, guiones, instrumento SUS ≈ 25 k | **≈ 70 k** | Kit de pruebas (las pruebas las hace el equipo) |
| 9 | E5b | Resultados ≈ 40 k + código ≈ 50 k | Análisis + ajustes ≈ 40 k + declaraciones/licencias 10 k | **≈ 150 k** | v1.0 |
| — | E6 | — | — | ≈ 50–80 k por revisión trimestral | Actualización |

**Total: ≈ 1,2–1,3 M tokens en 9 sesiones** (rango realista 8–12). Para ahorrar: una sesión por etapa con el estado en `docs/` (este plan + CHANGELOG) para no releer el historial; abrir cada sesión indicando "Sesión N del PLAN_MEJORA". Las sesiones 2–3 y 6–7 son las de mayor riesgo de exceder presupuesto; si se acercan al límite se cierran en un subentregable.

## Matriz de seguimiento
| Etapa | Sesiones | Release | Depende de | Entregable verificable | Estado |
|---|---|---|---|---|---|
| E0 | 1 | — | — | DECISIONES.md, esquemas | **Completada 26-10-2026** (D1 firmada; faltan D2–D5) (ver REVISION_E0_E1.md) |
| E1 | 1 | v0.6 | E0.1 | Sitio con UX corregida | **Completada 26-10-2026 · v0.6** |
| E2 | 2–3 | v0.7 | E0 | Corpus S14–S19 + ítems reetiquetados | **Completada 26-10-2026 · v0.7** (26 fuentes, 422 ítems, 12/12 temas con ancla CR; ver CIERRE_E2_v0.7.md) |
| E3 | 4–5 | v0.8 | E2 | tips.json + transfer.json | **Completada 26-10-2026 · v0.8 (para revisión)**: 110 tips, 50 prácticas; ver CIERRE_E3_v0.8.md |
| E4 | 6–7 | v0.9 | E3 | Portada por perfiles, Mi plan, PDF | **Completada 26-10-2026 · v0.9** (E4.1–E4.6; ver CIERRE_E4_v0.9.md y PREPARACION_E5.md) |
| E5 | 8–9 | v1.0 | E4 | Informe de usabilidad, lanzamiento | Pendiente |

 Riesgos principales: escasez de evidencia empírica CR para 6–11 (mitigación: nivel C explícito + agenda de investigación); cambios en términos de uso de herramientas (E6); disponibilidad de pares validadores (E5).
