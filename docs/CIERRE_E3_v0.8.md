# Cierre de la etapa E3 · Release v0.8 (para revisión)
Fecha: 26-10-2026 · Estado de los tips: **borrador** (D5 pendiente: persona experta en educación, MEP y filología).

## Entregables
| Archivo | Contenido |
|---|---|
| `data/tips.json` | **110 tips**: Familia 42 · Docente 37 · Dirección 25 · transversales 6 |
| `data/transfer.json` | **50 prácticas**: 31 adoptar · 16 adaptar · 2 no transferir · 1 investigar |
| `tools/e3a_familia.py` | Generador único (lotes 1–3); editar aquí, no los JSON |
| `tools/readability.py` | Fernández-Huerta |
| Sitio | Nueva pestaña **Para ti › Tips** (E3.5): acción, por qué, semáforo de confianza, base o adaptación a Costa Rica, advertencia de edad, urgencia y esfuerzo, y evidencia desplegable con cita APA. Las tarjetas de inicio por rol abren los tips. |

## Cobertura (tips por celda público × banda; un tip puede cubrir varias)
| | 6–8 | 9–11 | 12–14 | 15–18 |
|---|---|---|---|---|
| Familia | 22 | 27 | 18 | 19 |
| Docente | 15 | 21 | 34 | 33 |
| Dirección | 27 | 28 | 30 | 31 |
Meta del plan: 8–12 por celda → cumplida en las 12 celdas.

## Criterios de aceptación E3
| Criterio | Resultado |
|---|---|
| 0 tips sin evidencia | Cumple: 110/110; todos los IDs existen y coinciden con la banda del tip |
| 100 % con confianza y ancla/condición CR | Cumple: A 64 · B 45 · C 1; 73 con ancla CR; el resto con condición |
| Legibilidad Familia ≥ 70 | Cumple: 0 tips Familia bajo 70 |
| Esquemas | `validate_schemas.py` OK (tips y transfer) |
| Sitio | Prueba headless: escritorio y 390 px sin scroll horizontal, filtros por confianza, sin errores JS |

## Criterios del equipo aplicados en todo E3
Sin edad mínima en Costa Rica (decidir por exposición y riesgo); casos extranjeros solo como ejemplos; compañeros de IA «NO REGULADO» con ejemplos (Character.AI, Replika, personajes infantiles); canal de denuncia: escuela y, según el delito, PANI u OIJ.

## Observaciones para la revisión
- 5 evidencias citadas están etiquetadas en el corpus para otro público (T-FAM-005/S14-04, T-DOC-019/S26-10, T-DOC-023/S16-07, T-DOC-026/S03-18, T-DIR-024/S08-12); el contenido respalda el tip, pero conviene revisarlas.
- T-FAM-029: añadir servicios de apoyo en salud mental de Costa Rica verificados.
- T-TRV-005 y TR-044: normativa MEP de evaluación de los aprendizajes y de celulares en centros (no está en el corpus).
- Character.AI y Replika: ejemplos de mercado no presentes en el corpus (verificar en E6).
- Inglés de los 110 tips: revisión pendiente del equipo. La base y la condición CR solo están en español.
- Accesibilidad: el semáforo usa texto («Confianza alta/media/baja») además del color; falta correr Lighthouse/axe sobre la nueva vista.
