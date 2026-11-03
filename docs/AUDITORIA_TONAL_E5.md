# Auditoría tonal · E5.1–E5.5 · v0.14.0 · 3 nov 2026

**Corpus auditado:** 825 cadenas ES (+ su par EN) introducidas o reescritas en E5: 110 tips (texto, por qué), 440 pasos «Cómo hacerlo», 72 pasos observar–conversar–actuar, 14 de `ayuda.json`, 79 claves de interfaz (`i18n.e5.js`, `i18n.e53.js`).
**Método:** extracción automática + detección de marcadores de registro (usted/ustedes/tú/voseo, excluyendo citas en «»), absolutos, léxico alarmista o punitivo, marcación de género, y lectura dirigida de los casos detectados. No sustituye la validación D5.

## Veredicto
**PASS_WITH_WARNINGS.** El tono de fondo es correcto y coherente con la premisa del proyecto: calmado (0 signos de exclamación), no punitivo de forma sistemática («sin regañar», «sin castigo», «sin acusar»), desescalador («Conocer un riesgo no significa que vaya a pasar») y con la obligatoriedad atada al estatus normativo. Hay **un defecto estructural** (registro de trato partido entre contenido e interfaz) y tres defectos menores.

## Hallazgos

| # | Severidad | Hallazgo | Evidencia | Subetapa |
|---|---|---|---|---|
| H1 | **Alta** | **Registro partido: contenido en *usted*, interfaz en *tú*.** Los 110 tips, 440 pasos, alertas y ayuda tratan de *usted* (con *ustedes* para acciones adulto + menor, uso correcto en CR). La microcopia nueva trata de *tú*. En una misma pantalla conviven «llame al 9-1-1» y «¿Necesitas ayuda ya?»; «Observe · Converse · Actúe» junto a «Empieza por aquí». | 18 claves en tú: `rg.sub`, `acc.inicio`, `acc.parati`, `acc.plan`, `acc.kit`, `acc.alertas`, `acc.marco`, `acc.contexto`, `acc.glosario`, `f3.h`, `f3.sub`, `f3.alldone`, `f3.st.h`, `hg.more`, `nx.help`, `nx.parati_tips`, `nx.plan`, `nx.kit` | E5.2, E5.3, E5.5 |
| H2 | Media | **Masculino genérico dominante pese a portada inclusiva.** `hero.h1` dice «niñas, niños y adolescentes», pero el cuerpo usa «su hijo» 66 veces frente a «su hija» 5; «el estudiante» 13. A la vez, «la maestra» (4) feminiza por defecto a la docencia. | conteos sobre texto sin citas | E5.3, E5.4 |
| H3 | Media | **Voz evaluativa no atribuida en «Esto significa que…».** `mean.resp` («no deben cargar solas con riesgos que las empresas pueden evitar») y `mean.comp` («todo estudiante debe aprender») emiten un *deber* en voz del sitio. Choca con la etiqueta «Recomendación» y con la neutralidad institucional CIOdD. | `mean.resp`, `mean.comp` | E5.2 |
| H4 | Baja | **Asimetría ES/EN del trato.** `esx.recomendacion` ES impersonal («Cada casa o escuela ve cómo usarlo») vs EN «You decide…». | `esx.recomendacion` | E5.1 |
| H5 | Baja | Desliz de persona en texto de *usted*: «Guarda una copia» → «Guarde». | `T-FAM-020.ejemplo` | E5.3 |
| H6 | Baja | Formato del número de emergencia: «9-1-1» (`ay.sub`) vs «911» (`T-FAM-029.senal`). | — | E5.3/E5.5 |
| H7 | Baja | Adjetivos coloquiales vagos en contextos de posible daño: «algo raro o feo», «imagen fea». Infantilizan y no orientan; preferir «algo que le incomodó o le asustó». | `T-FAM-012`, `T-FAM-012.ejemplo` | E5.3 |
| H8 | Observación | Inglés en grafía británica coherente (counsellor 12, neighbourhood, organise, recognise; 0 en-US). Es consistente; solo decidir si se mantiene en-GB o se pasa a en-US (más usual en la región). | campos EN | E5.3–E5.5 |

**Sin hallazgo (fortalezas verificadas):** absolutos («siempre», «nunca», «está prohibido») solo aparecen ligados a seguridad o a ley CR; ningún paso culpabiliza al menor; las señales de alerta proponen siempre acción + calma; los textos de crisis (911, PANI, OIJ) son directos y sin dramatización; la etiqueta de estatus impide leer un consejo como prohibición.

## Recomendaciones (para aplicar en una E5.6 corta)
1. **H1 · unificar en *usted*** toda la interfaz (es el registro de los 110 tips, de las guías MEP y del trato institucional en CR). Ej.: «Elija la edad, lea los consejos y pruebe uno esta semana»; «¿Necesita ayuda ya?»; «Empiece por aquí»; «Fíjese en la etiqueta…». Re-medir Fernández-Huerta (las formas de *usted* alargan levemente).
2. **H2 ·** primera mención «su hijo o hija» por tip; alternar «su hijo» / «su hija» en los ejemplos (≈ 50/50); «el estudiante» → «el estudiantado» / «cada estudiante»; «la maestra» → «la persona docente» o alternar.
3. **H3 ·** atribuir: «según la fuente, la responsabilidad recae sobre todo en…»; «la UNESCO propone 12 aprendizajes que conviene que todo estudiante logre».
4. **H4–H7 ·** correcciones puntuales de una línea.
5. **H8 ·** decisión de Agustín en su revisión EN (D4).

Costo estimado: 40–60 k tokens (≈ 20 claves de interfaz, ≈ 70 sustituciones de género, 6 puntuales, re-verificación legibilidad + smoke ES/EN).

## Resolución · E5.6 · v0.14.1 · 3 nov 2026
| # | Estado | Cómo |
|---|---|---|
| H1 | Resuelto | Trato de *usted* en **toda** la interfaz (65 claves, no solo las de E5), en capa `assets/js/i18n.e56.js` cargada al final. «Para ti» → **«Para usted»**; «¿Quién eres?» → «¿Cuál es su rol?». Las citas en «» dirigidas a menores conservan el *tú* |
| H2 | Resuelto | `tools/e56_tono.py`: primera mención «su hijo o hija»; ejemplos y señales alternan hijo/hija (66/5 → 32 «su hijo», 25 «su hija», 23 «hijo o hija»); «el estudiante» → «cada estudiante» / «una estudiante» / «quien lo entregó»; «la maestra» → «la maestra o el maestro» / «la persona docente»; «los niños» → «niñas y niños». Mismas sustituciones en `e5_pasos*.py` (regenerar no las revierte; verificado) |
| H3 | Resuelto | `mean.resp` atribuido a las fuentes; `mean.comp` sin «debe» (ES y EN) |
| H4 | Ya resuelto | La capa vigente EN dice «Each family or school decides» |
| H5–H7 | Resueltos | «Guarde una copia»; **9-1-1** en todo el sitio (nombre oficial del sistema); «algo que vio y le incomodó o le asustó» |
| H8 | Resuelto | `tools/e56_en_us.py`: en-US en campos EN (counselor, neighborhood, organize, program, labeling…). Se conservan citas textuales (`quote`) y nombres propios (Open Government/Parliament Licence, Organisation for Economic Co-operation and Development) |

**Verificación:** Fernández-Huerta tips 110/110 ≥ 70 (media 84,2), pasos 110/110 (0 campos < 60), interfaz 46/46 (media 82,6); esquemas OK; APA 0 errores / 7 avisos; contraste OK; smoke E4 (axe 0 violaciones en 8 vistas, 390 px, sin errores JS); barrido renderizado ES: 0 restos de *tú* fuera de citas. Respaldo previo: `_respaldo_v0.14.0_2026-11-03/`.
