# Auditoría integral E0–E5.4 antes de E5.5 · v0.13.1 · 3 nov 2026

Objetivo: comprobar que todo lo entregado en E0–E4 (plan de mejora) y E5.1–E5.4 (comentarios del 3 nov) cumple sus criterios de aceptación automatizables antes de iniciar E5.5.

## Resultado por etapa
| Etapa | Criterio | Resultado |
|---|---|---|
| E0 | Esquemas JSON validados | `validate_schemas.py`: tips, transfer, ítems y ejemplos OK; selftest 14/14 casos inválidos rechazados (corregido: el ejemplo de tips no tenía `pasos`) |
| E1 | Sin solapamientos 1366/390 px; accesibilidad | 33 vistas × ES/EN × 5 temas a 1366 px y ES/EN a 390 px: 0 violaciones axe WCAG 2 A/AA, 0 desbordes (corregido: Referencias se desbordaba por un DOI largo) |
| E2 | 100 % citas verificadas; APA 7 | `verify_quotes.py`: **422/422**. `audit_apa.py`: 0 errores; avisos 9 → 8 (S11: DOI y editorial verificados en LSE Research Online) |
| E3 | 0 tips sin evidencia; confianza y ancla/condición CR; Fernández-Huerta ≥ 70 | Esquema OK; 110/110 tips ≥ 70 (media 84,1) |
| E4 | Encontrar 3 tips, guardar, imprimir | `smoke_e4.js` OK; hoja imprimible en **1 página** (corregido: salía una 2.ª página en blanco por `min-height:100vh` al imprimir) |
| E5.1 | Estatus en ítems y tips | Validado por esquema; leyenda y filtro sin fallas en el recorrido |
| E5.2 | «Esto significa que…» bajo cada gráfico; lenguaje sencillo | 0 gráficos sin explicación; interfaz 29/29 textos ≥ 70 (los títulos de < 8 palabras se excluyen: la fórmula no es interpretable en textos tan cortos) |
| E5.3–E5.4 | Pasos en todos los tips; Mi plan; alertas O–C–A | 110/110 tips con pasos (bloques ≥ 70, media 87,5); 24/24 bloques de alertas ≥ 70; flujos verificados en E5.3/E5.4 |
| Transversal | Paridad ES/EN | 770/770 claves de interfaz; 0 ítems ni tips sin EN; 0 claves sin traducir en pantalla |
| Transversal | Errores JS · datos | 0 errores JS; `data.js` coincide con los JSON |

## Correcciones hechas en esta auditoría
1. `data/ejemplos/tips.ejemplo.json` con `pasos` (el validador lo rechazaba).
2. Hoja de Mi plan: 1 página en lugar de 2 (CSS de impresión).
3. Referencias: URL y DOI largos ya no ensanchan la página (`overflow-wrap:anywhere`).
4. S11 (EU Kids Online 2026): DOI https://doi.org/10.21953/researchonline.lse.ac.uk.00137132, título completo, editorial y fecha (10-02-2026).
5. Textos visibles «Borrador v0.9» → «v0.13» (hoja imprimible y Kit).
6. Declaración de uso de IA: fila nueva en el sitio (v0.11–v0.13) y sección en `DECLARACION_IA.md`; la referencia APA de la herramienta incluye Opus 5.5.
7. Versiones: `CITATION.cff` 0.13.0 (3 nov 2026); `tips.json` 0.13.0.
8. `README.md` al día (26 fuentes, 422 ítems, 110 tips, estructura y comprobaciones).
9. Restaurado `.github/workflows/pages.yml` (estaba en el zip del repositorio, no en la carpeta local) y ampliado con esquemas, legibilidad y APA.
10. `readability.py --ui` deja fuera los títulos de menos de 8 palabras y los lista aparte.
11. `PLAN_MEJORA_2026-10.md`: E5 «En curso».

## Pendientes que no puede cerrar una auditoría automática (decisión o acción humana)
- **D2 y D4 sin firma** en `DECISIONES.md` (portada por perfiles; español por defecto).
- **D5**: validación de tips y pasos por personas expertas, el MEP y filología.
- **8 referencias APA sin URL/DOI**: S01, S08, S09, S10, S16, S18, S19 (autoría por confirmar) y S23 (enlace SCIJ de la Ley 10020). Las búsquedas de esta sesión no encontraron enlaces estables.
- Revisión de la versión EN (Agustín).
- Teléfonos citados (PANI 1147, OIJ 800-8000-645) por confirmar antes de v1.0.
- Prueba con usuarios y con lector de pantalla (E5 del plan de mejora); Lighthouse y prueba de teclado manual no se automatizaron aquí.
- `LICENSE-CONTENT.md` (CC BY-SA 4.0) sigue como propuesta pendiente de revisión legal.

Respaldo previo a la auditoría: `../_respaldo_v0.12.0_2026-11-03/` (estado E5.3) y el estado E5.4 queda en esta versión.
