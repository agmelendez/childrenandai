# Auditoría de cierre E5.1 y E5.2 (3 nov 2026)

Objetivo: confirmar que E5.1 (estatus normativo) y E5.2 (lenguaje sencillo) están completas antes de iniciar E5.3.

## Hallazgos y correcciones
| # | Hallazgo | Corrección |
|---|---|---|
| 1 | 29 de 110 tips (todos de Docente y Dirección) bajo Fernández-Huerta 70 | Reescritos en lenguaje sencillo, sin cambiar acción, evidencia ni cifras. 110/110 ≥ 70; media 79,1 → 84,1. Antes/después: `E5.2_REESCRITURA_TIPS.csv` |
| 2 | 43 ítems de fuentes normativas no prescriptivos (hallazgos, cifras) quedaban como `dato`, sin etiqueta (p. ej., «La propuesta prohíbe…» sin la insignia de Propuesta) | Regla nueva: todo el contenido de una fuente normativa hereda su fuerza (S21–S23, S26 → Ley CR; S07, S15 → Norma de otro país; S08 → Propuesta) |
| 3 | 24 ítems de fuentes no normativas describen una norma o política concreta de otro país (RGPD, COPPA, Ley de IA de la UE, Noruega, China, India, EAU, Luxemburgo…) sin etiqueta | Marcados `ley_extranjera` (lista revisada a mano en `tools/e5_estatus.py`) |
| 4 | S13-15 (CDN, 18 años) sin etiqueta, aunque la CDN rige en Costa Rica | `ley_cr` |
| 5 | La hoja imprimible de Mi plan no mostraba el estatus del tip | Se añade la etiqueta (ícono + texto) en la columna Acción |

Distribución final de ítems: dato 191 · recomendación 106 · norma de otro país 70 · ley CR 23 · propuesta 20 · directriz MEP 12. Tips: recomendación 83 · directriz MEP 19 · ley CR 8 (revisados contra los textos con «delito», «ilegal», «exige», «derecho», «denuncie»: sin cambios).

## Verificación final
- `validate_schemas.py`: OK (tips, transfer, estatus de ítems); selftest rechaza tip sin estatus o con `propuesta`.
- `readability.py`: tips 110/110 ≥ 70; interfaz 29/30 ≥ 70 (excepción: título de 4 palabras).
- Paridad de textos ES/EN en `i18n.e5.js`: completa.
- Recorrido automático: 24 vistas y subvistas × ES/EN × 4 temas (claro, oscuro, alto contraste oscuro y amarillo) × 1366 px, y claro a 390 px. Resultado: 0 violaciones axe-core WCAG 2 A/AA; 0 gráficos sin «Esto significa que…»; 0 claves sin traducir; 0 desbordes horizontales; 0 errores JS.
- Funcional: filtro «Tipo de norma» devuelve exactamente los conteos esperados; la búsqueda encuentra las entradas nuevas del glosario; la hoja imprimible muestra el estatus.

## Pendientes (fuera de E5.1–E5.2)
- Las versiones EN de los 29 tips reescritos no cambiaron: el sentido se conservó, pero conviene que revises si quieres simplificarlas también.
- La búsqueda compara subcadenas sin tildes («PANI» también encuentra «compañía»); es comportamiento de E4.4, se puede afinar en E5.5.
- La clasificación de tips sigue sujeta a la validación experta y del MEP (D5).
