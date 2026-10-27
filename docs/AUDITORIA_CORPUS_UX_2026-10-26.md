# Auditoría Children on AI — corpus ampliado + UX/UI
Fecha: 2026-10-26 · Versión auditada: draft 0.5 (7 oct 2026) · Alcance: 8 documentos nuevos + sitio estático (index.html, app.js, items.json, 310 ítems, 13 fuentes)

## 1. Diagnóstico del estado actual
- Corpus: 310 ítems verificados con cita/página. Tipología: recomendación 81, hallazgo 80, alerta 49, cifra 39, definición 26, obligación 19, competencia 16.
- Sesgo de fuerza de evidencia: orientación 107 + normativa 97 (66 %) frente a empírica 52 + revisión 39. Opinión 15.
- Sesgo geográfico: S11 (EU Kids Online), S12, S04, S08 (propuesta UE) concentran ~52 %. ALC casi ausente; CR solo aparece como nota "no aplicable".
- Desbalance de público: Dirección 270, Docente 261, **Familia 166**. Edad: 12–14 = 164, 15–18 = 128, **6–11 = 125**. Precisamente los dos segmentos prioritarios del proyecto (familias, 6–11) son los más delgados.
- El producto es un **visor de evidencia**, no todavía un **gestor de tips**: el usuario ve 75 tarjetas para "Familia, 11 años" con citas, estatus legal y caveats, pero no una acción priorizada que pueda guardar, marcar o compartir.

## 2. Aporte de los 8 documentos (matriz de pertinencia)
| Doc | Pertinencia | Qué aporta | Dónde entra | Riesgo |
|---|---|---|---|---|
| Anexo curricular IA y Protección Digital (GCABA, 2026, CC BY-SA) | **Alta** | Progresión espiral basada en el Marco UNESCO: Ciclo Básico = uso mediado/supervisado y validación crítica; Ciclo Orientado = autonomía. Ejes 6.1 Comprensión de la IA, 6.2 Aprender con IA, protección digital; orientaciones de enseñanza y evaluación | Banda 12–18 (dividir 12–14 / 15–18 con este criterio); fila "Argentina·CABA" en la regla de edades; guías docentes | Normativa subnacional; marcar "no aplicable a CR". Licencia compatible con CC BY-SA del sitio |
| Learning in the Age of AI (Imaginable Futures) | Media-alta | Insights por aprendices / sistemas / sociedad (50+ entrevistas, 16 países); agencia, pertenencia, relaciones | Marco de valores para familias; escenarios | Cualitativo, no generalizable; fuerza = "opinión/consulta" |
| AI Toolkit for Educators (Lee, 2023) | Media | Usos docentes, limitaciones (acceso desigual, regulación), alfabetización IA | Guías docentes | Desactualizado (2023), lista de herramientas obsoleta; CC BY-NC-SA incompatible con reutilización de texto bajo CC BY-SA → parafrasear y citar, no copiar |
| Diseño de tutores IA (Gems) | Media (solo 15–18/docentes) | Plantilla Persona-Tarea-Contexto-Formato; reglas de tutor socrático y restricción a material anexado | Tip práctico "configurar un tutor que pregunta en lugar de responder" | Ejemplo dirigido a 18–25 años; Gemini tiene restricciones de edad: no recomendar a 6–11 |
| Data Governance Toolkit | Media | Gobernanza de datos, minimización, ciclo de vida | Dirección: compras de plataformas, privacidad | Pocas menciones a menores (16); extraer solo lo escolar |
| BID – IA para una mejor regulación ALC | Baja-media | Regulación basada en riesgo, sandbox, contexto ALC | "Marco normativo" (ALC) | Habla de regulación con IA, no de niñez (3 menciones) |
| ILIA 2026 | Baja para tips / alta para contexto | Posición de CR (lidera varios subindicadores; incluye "Educación temprana en ciencia en niñas y adolescentes") | Ficha "Costa Rica en contexto" | Indicadores país, no recomendaciones; usar solo cifras con página |
| La era de la IA y nuestro futuro (Kissinger et al.) | Baja | Ensayo: IA como "niñera, tutor, amigo", socialización infantil | Cita de encuadre en introducción | Opinión; no usar como evidencia |

**Recomendación de corpus:** ingresar S14 Anexo GCABA, S15 Imaginable Futures, S16 Toolkit educadores, S17 Tutores IA, S18 Data Governance, con la pipeline V5.2 y `verify_quotes.py`; ILIA, BID y Kissinger como **fuentes de contexto** (sin ítems de recomendación). Objetivo cuantitativo: +40–60 ítems, priorizando Familia y 6–11 hasta ≥30 % de cada celda edad×público.

**Brecha que ningún documento cubre:** evidencia empírica para 6–11 y fuentes de Costa Rica (MEP, Ley 8968 de protección de datos, PANI, Código de Niñez). Sin esto, el sitio dice a familias costarricenses qué hace la UE.

## 3. Auditoría UX/UI (pruebas a 1366 px y 390 px)
### Fortalezas
Arquitectura clara por rol y edad; accesibilidad muy por encima de la media (skip link, aria-live, alternativas textuales, panel de accesibilidad, contraste); trazabilidad ejemplar (cita, página, estatus legal).

### Hallazgos (severidad 1–3)
1. **[3] Carga cognitiva en "Para ti":** 75 tarjetas sin jerarquía; la primera tarjeta para "Familia 11 años" es una guía estatutaria de Inglaterra. Falta una capa de *Top 5 tips* en lenguaje llano antes de la evidencia.
2. **[3] El tip no es gestionable:** no hay guardar/favoritos, checklist "ya lo hago", imprimir/PDF de una página, compartir con la escuela, ni plan familiar. El brief pide "visualizar y gestionar".
3. **[3] Registro académico para familias:** "hallazgo", "obligación", "PDF p.", "S08-03", "Legislative proposal, not adopted" aparecen en el primer nivel. Mover la metainformación a un pliegue "¿De dónde sale esto?".
4. **[2] La regla de edades como portada:** es el componente más denso del sitio y en móvil queda recortada (solo 5–7 años visibles; requiere scroll horizontal). Para familias, la portada debería ser "¿Quién eres? + edad" y la regla pasar a Evidencia.
5. **[2] Botones flotantes ES/EN y Accesibilidad tapan contenido** (tarjeta S08 en escritorio, regla en móvil). Integrarlos en la barra superior o colapsarlos en un solo FAB.
6. **[2] Idioma por defecto:** se abre en inglés según el navegador pese a `lang="es"` y público CR. Forzar ES por defecto con memoria de elección.
7. **[2] Menú lateral no es fijo** (termina a 900 px; fondo vacío al hacer scroll). `position: sticky; height: 100vh`.
8. **[2] Bandas de edad incoherentes:** el proyecto define 6–11 y 12–18; los datos usan 6–11/12–14/15–18 y la regla 5–18. Decidir y documentar (propuesta: 6–8, 9–11, 12–14, 15–18, alineado con la progresión espiral UNESCO/GCABA).
9. **[1] Tarjetas de estadísticas** (75/10/10/11/8) no son accionables; convertirlas en filtros.
10. **[1] Sin búsqueda global** ni filtro por tema desde "Para ti" (solo en el Explorador).

## 4. Propuesta de rediseño (priorizada)
**Fase 1 – Capa de tips (2–3 semanas)**
- Nuevo modelo de datos `tips.json`: cada tip = acción en imperativo (≤25 palabras), edad, público, contexto (casa/aula/política), esfuerzo (bajo/medio/alto), urgencia, y `evidence_ids[]` que enlazan a los ítems existentes. Los 310 ítems siguen siendo la base de evidencia; los tips son la capa de producto.
- 8–12 tips por celda edad×público (≈70–100 tips), redactados en lenguaje llano y validados por par docente/familia.
- Tarjeta de tip: acción + "por qué" (1 línea) + nivel de evidencia en semáforo + pliegue con fuentes.

**Fase 2 – Gestión**
- Favoritos y checklist en localStorage ("Mi plan"); exportar plan a PDF de una página e imprimir (CSS print).
- Modo "conversación en familia": tarjetas de preguntas para hablar con el niño/adolescente por edad.
- Kit escolar: plantilla de política institucional + lista de verificación para compras de plataformas (de Data Governance Toolkit + KCSIE).

**Fase 3 – Contexto CR y evaluación**
- Ficha Costa Rica (ILIA, marco legal nacional) y sustitución progresiva de fuentes extranjeras por equivalentes nacionales.
- Prueba de usabilidad con 5 familias, 5 docentes y 3 directores (tareas: encontrar 3 tips para su caso, guardar, imprimir); métricas SUS y tasa de éxito por tarea.

## 5. Decisiones requeridas
1. Bandas de edad definitivas (2 vs 4).
2. ¿El producto prioriza familias (portada simple) o mantiene el enfoque de evidencia para todos?
3. Autoría y validación de los tips en lenguaje llano (equipo, revisión por pares).

---
## Adenda (26-10-2026, segunda tanda de documentos)

### Triage
| Documento | Estado | Decisión |
|---|---|---|
| *Digital education at school in Europe 2026* (Eurydice) | **Ya está en el corpus como S04** (40 ítems) | No reingresar; solo recuperar secciones no extraídas (políticas nacionales de IA en escuelas, formación docente) |
| *Learning in the Age of AI* | **Duplicado binario** del archivo de la primera tanda | Ignorar |
| *Evaluación de aprendizajes en tiempos de IA* (diapositivas, 45 pp., ~170 palabras extraíbles, sin autor ni fecha en metadatos) | Fuente gris, mayormente imágenes | No citable como evidencia sin autoría; usar solo como **inspiración** para el tip docente "rediseñar evaluaciones resistentes a la IA" (revisión por pares del protocolo evaluativo → identificar tareas resolubles por IA → rediseño). Pedir autor/fecha o descartar |
| ***Inteligencia Artificial en clase (guía para docente)***, MEP–SNU–UNESCO–ULACIT, 2026, ISBN 978-9977-60-644-6 | **Hallazgo crítico: es fuente oficial costarricense** | Ingresar como **S14, fuente ancla nacional** |

### Implicación: la premisa "no hay información en CR" debe matizarse
Sí existe una guía oficial reciente (MEP, 2026), pero tiene **tres vacíos** que justifican el producto:
1. **Solo docentes.** Familia/padres aparece ~6 veces; no hay orientación para hogares ni para direcciones (política, compras).
2. **Sin criterio de edad.** Recomienda ChatGPT, Copilot, Gemini y DeepSeek "para el aula" sin advertir los límites de edad de sus términos de uso (típicamente 13+ con consentimiento parental, o 18+), ni distinguir primaria de secundaria. Las edades aparecen solo dentro de ejemplos de prompts. DeepSeek se recomienda sin advertencia sobre jurisdicción de datos.
3. **Enfoque de productividad docente** (personalizar, corregir, crear) con ética en el cap. 6; no aborda compañeros/chatbots afectivos, dependencia emocional, explotación o deepfakes, que son el núcleo de S03, S06, S08 y S11.
Aportes aprovechables: anclaje en **Ley 8968** (datos personales), cuentas institucionales @mep.go.cr, "nunca subir datos de estudiantes; usar datos ficticios/anonimizados", IA como punto de partida y no respuesta final, detección de sesgos, verificación comunitaria, autoría y plagio (6.3), regla de 15 minutos diarios para docentes, escenarios por grado (Primaria 4°–6°, Secundaria 7°–11°, Técnica).

### Método propuesto: matriz de transferibilidad (internacional → CR)
Cada tip CR se construye y se documenta así:
`Práctica fuente (país, tipo, fuerza) → ¿existe ancla CR? (MEP 2026, Ley 8968, Código de Niñez y Adolescencia/Ley 7739, PANI) → condición de adaptación (infraestructura, ruralidad, unidocentes, conectividad, edad de términos de uso) → tip CR + nivel de confianza`.
Niveles: **A** = coincide con norma/guía CR; **B** = convergencia de ≥2 fuentes internacionales de distinto continente, sin contradicción CR; **C** = una fuente extranjera o propuesta no adoptada (mostrar como "práctica a considerar").
Ejemplos:
- Privacidad docente → A (MEP 2026 + Ley 8968 + KCSIE S07).
- Chatbots de compañía solo con controles parentales < 13 → C (propuesta UE S08) — reforzar con términos de servicio y S03.
- Progresión mediado → autónomo en secundaria → B (UNESCO S12 + GCABA + Noruega/EAU/India en la regla) y alineable a ciclos MEP (I–II ciclo, III ciclo, Diversificada) — **usar los ciclos del MEP como bandas de edad del sitio** (6–8, 9–11/12, 12–15, 15–18) resuelve también el hallazgo UX n.º 8.
- Evaluación resistente a la IA → B (MEP 6.3 + diapositivas + Toolkit).

### Fuentes CR adicionales que conviene buscar
Política/lineamientos MEP de educación digital vigentes; PRONIE MEP-FOD; resoluciones de la Agencia de Protección de Datos de los Habitantes (PRODHAB); PANI sobre entornos digitales; Estrategia Nacional de IA de Costa Rica (MICITT, 2024); datos de uso en menores (Kids Online/ENAHO-TIC, si existen).
