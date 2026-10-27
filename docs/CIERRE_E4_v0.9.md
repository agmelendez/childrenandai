# Cierre de la etapa E4 · Release v0.9 (para pruebas con usuarios)
Fecha: 26-10-2026 · Estado del contenido: **borrador** (D5 pendiente: validación por personas expertas en educación, MEP y revisión filológica).

## Entregables
| Subetapa | Qué hay en el sitio | Archivos |
|---|---|---|
| E4.1 Portada por perfiles | Inicio › «¿Quién eres?»: rol × banda MEP → 5 tips prioritarios (urgencia → confianza → ID), con guardar y «Ver evidencia». Perfil recordado en el navegador. | `index.html`, `app.js` (`renderProfile`) |
| E4.2 Mi plan | Vista `#plan`: guardar/quitar, «Ya lo hago», barra de avance, enlace para compartir (`?plan=IDs`, importación solo con acción de la persona), vaciado en dos pasos. Solo `localStorage` (`coa.plan`, `coa.profile`). | `app.js` (`renderPlan`) |
| E4.3 Hoja de una página | Impresión / PDF carta con tabla Acción · Edad · Confianza · Fuentes, casillas, notas familia–escuela, aviso D5, canales escuela → PANI/OIJ, licencia. Capacidad verificada en el peor caso: 8 tips con «por qué», 14 sin él. | `styles.css` (`@media print`) |
| E4.4 Búsqueda y filtros | Vista `#buscar` (botón «Buscar» en la barra): tips, secciones, glosario y evidencia; insensible a tildes. En Tips: palabra clave, tema, contexto (casa/aula/política), esfuerzo y confianza. | `app.js` (`renderSearch`, `tipControls`) |
| E4.5 Kit por público | `#kit/familia`: tarjetas de conversación por banda (16) y acuerdo del hogar (13 líneas + reglas propias + firmas). `#kit/docente`: escenarios por ciclo (6), evaluación con IA (6), prompts seguros (4, con copiar). `#kit/direccion`: plantilla de política (12), compra de plataformas (7), protocolo de incidentes (6 pasos). Cada línea cita sus tips o ítems; cada módulo se imprime por separado. | `data/modules.json` ← `tools/e4_modules.py` |
| E4.6 Costa Rica en contexto | Cifras ILIA 2026 (5.º de 18; 25,1 % de uso de IA generativa; 0,754 % habilidades de IA; 45,0 en I+D+adopción), gráfico interactivo por dimensión con tabla alternativa, marco legal (8 ítems), riesgos en línea (referencia regional) y vacíos regulatorios. | `data/context_cr.json` ← `tools/e4_modules.py` |

## Verificación (Chromium headless, axe-core 4.10, WCAG 2 A/AA)
| Criterio | Resultado |
|---|---|
| Flujo «encontrar 3 tips, guardar, imprimir» | 7 clics desde la portada; < 1 s de interacción automatizada. **La meta ≤ 3 min se mide con personas en E5.** |
| axe-core en inicio, tips, plan, kit (3), contexto, buscar | 0 violaciones |
| 390 px sin scroll horizontal (vistas nuevas, ES/EN) | Cumple |
| Errores JavaScript | 0 |
| Persistencia, enlace compartido, impresión | Cumple (plan 1 página; incidentes 1 página; acuerdo del hogar 2 páginas por las notas y firmas) |
| IDs citados en módulos y ficha | 100 % existen (el generador falla si no) |

## Correcciones hechas durante el cierre
- La sección de riesgos en línea usaba S20 (Dodel et al., 2023), que es **Kids Online Uruguay**: se rotuló como referencia regional. Kids Online Costa Rica (C04–C06) sigue solo como fuente de contexto: **pendiente extraerla como ítems** (recomendado antes de E5b).
- ILIA: el texto (p. 45) da 50,3 en Factores habilitantes y el Gráfico 1 (p. 22) 50,5; se usa el gráfico y se anota.
- Pie y lema actualizados a «borrador 0.9»; el lema en inglés decía 365 ítems (ahora 422).
- Declaración de uso de IA: nueva fila sobre tips, plantillas y ficha CR.

## Pendientes que no bloquean E5
- APA del ILIA (C01): URL por completar.
- Plantillas del Kit: redacción CIOdD; requieren la misma validación D5 que los tips.
- Inglés de tips y módulos: revisión del equipo.
