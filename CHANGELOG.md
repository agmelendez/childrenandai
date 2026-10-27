# CHANGELOG — Children on AI

Formato: [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Versionado por etapa del `docs/PLAN_MEJORA_2026-10.md`.

## [0.10.1] — 2026-10-27 · Portada: guía de uso, regla de edades y mapa del sitio
### Añadido
- «Cómo usar este sitio» en Inicio: 5 pasos (perfil → tips → Mi plan → imprimir/compartir → evidencia), cada uno con enlace; acceso a la guía completa.
- «Mapa del sitio y cómo navegar» en Inicio: diagrama de 4 niveles (Empieza aquí → Profundiza → Fuentes y normas → Consulta y ayuda) con enlaces a las 15 secciones y rutas sugeridas para familia, docente y dirección.
- Textos nuevos ES/EN en `i18n.nav.js` (`hg.*`, `sm.*`, `rg.*`).
### Cambiado
- La regla de edades vuelve a estar visible en Inicio, en su propia sección (ya no plegada).
- Se retira el bloque final «¿Primera vez aquí?» (lo cubre la guía).
### Verificado
- axe-core: 0 violaciones (1366 y 390 px); sin scroll horizontal; 0 errores JS; ES/EN.

## [0.10.0] — 2026-10-27 · Interfaz con identidad visual UCR (solo presentación)
Sin cambios en contenidos, datos ni funciones. Referencia: *Manual de identidad visual UCR* (ODI, 2019), pp. 24–29 y 116–118.
### Cambiado
- Cintillo UCR (azul #005da4, ≥ 56 px, línea gris de 4 px) con el identificador compuesto oficial UCR · CIOdD en reverso (`assets/img/ciodd-ucr-reverso.svg`, optimizado con SVGO), enlazado a ucr.ac.cr. El mismo logo cierra el pie, enlazado al sitio del CIOdD.
- Fondo gris claro #e6e6e6, tarjetas blancas planas (sin gradientes ni sombras); pie gris #323232 con texto blanco.
- Tipografía: Trueno con sustituto Arial (manual, p. 25); se retiran Bricolage Grotesque e Instrument Sans. Atkinson Hyperlegible sigue disponible en Accesibilidad.
- Paleta UCR: azul en títulos, botones y enlaces; bandas MEP con celeste, verde, naranja y azul UCR.
- Menú lateral claro: 4 accesos principales visibles; Explorar, Fuentes, Consulta y Ayuda dentro de «Más recursos y evidencia» (se abre solo si la vista actual está ahí).
- Portada: el perfil «¿Quién eres?» + 5 tips pasa a ser el contenido principal; la regla de edades queda plegada a un clic (D2); se ocultan los accesos por rol duplicados.
- Barra superior blanca; botón de Accesibilidad solo con ícono en escritorio (nombre accesible intacto).
### Verificado
- axe-core 4.10.2: 0 violaciones en Inicio (regla abierta), Para ti, Kit y Evidencia; 390 px sin scroll horizontal; 0 errores JS.

## [0.9.0] — 2026-10-26 · Etapa E4 completa (lista para E5)
### Añadido
- **E4.4** Búsqueda global (`#buscar`, botón en la barra superior; tips, secciones, glosario, evidencia; sin distinguir tildes) y filtros de tips por palabra clave, tema, contexto y esfuerzo.
- **E4.5** Kit por público (`#kit/familia|docente|direccion`): tarjetas de conversación por banda, acuerdo del hogar, escenarios por ciclo MEP, evaluación con IA, prompts seguros, plantilla de política, lista de compras y protocolo de incidentes; cada línea cita tips o ítems; impresión por módulo. Datos: `data/modules.json` (`tools/e4_modules.py`).
- **E4.6** Costa Rica en contexto (`#contexto`): ILIA 2026 con gráfico por dimensión y tabla alternativa, marco legal, riesgos en línea (referencia regional) y vacíos regulatorios. Datos: `data/context_cr.json`.
- `docs/CIERRE_E4_v0.9.md`, `docs/PREPARACION_E5.md`, `tools/smoke_e4.js`.
### Corregido
- S20 es Kids Online **Uruguay**: rotulado como referencia regional (antes se presentaba como Costa Rica en el borrador de la ficha).
- Pie y lema: «borrador 0.9»; lema EN con 422 ítems. Declaración de IA con fila nueva (tips, plantillas, ficha CR).
### Verificado
- axe-core (WCAG 2 A/AA): 0 violaciones en 8 vistas; 390 px sin scroll horizontal; 0 errores JS.

## [0.9.0-e4a] — 2026-10-26 · E4.1–E4.3: portada por perfiles, Mi plan y hoja imprimible
### Añadido
- **E4.1 Portada por perfiles**: bloque «¿Quién eres?» en Inicio (rol × banda MEP) con los 5 tips prioritarios (urgencia → confianza → ID); el perfil se recuerda en este navegador (`coa.profile`).
- **E4.2 Mi plan** (`#plan`, menú Empezar, contador en el menú): botón «Guardar en Mi plan» en cada tip (aria-pressed), lista agrupada por público, casilla «Ya lo hago», barra de avance (`role=progressbar`), vaciado en dos pasos sin diálogos modales. Solo `localStorage` (`coa.plan`: IDs y marcas); ningún dato personal.
- **Compartir**: enlace `?plan=ID,ID#plan` con solo códigos de tips; quien lo abre ve los tips y decide si los agrega (nunca se importan sin su acción).
- **E4.3 Hoja de una página** (CSS print, carta): encabezado CIOdD, tabla Acción / Edad / Confianza / Fuentes (cita corta + ID), casilla de cumplimiento, espacio para acuerdos familia–escuela, aviso de borrador D5, canales escuela → PANI/OIJ, licencia y URL. Opción «Incluir el por qué». Capacidad verificada con el peor caso (tips más largos): 8 con «por qué», 14 sin él; el sitio avisa si se supera.
- `assets/js/i18n.plan.js` (ES/EN).
### Verificado (prueba headless, Chromium)
- Flujo «perfil → guardar 3 tips → Mi plan → marcar → imprimir» en 6 clics; persistencia tras recarga; enlace compartido; «Ver evidencia» abre la tarjeta del tip con la evidencia desplegada; 390 px sin scroll horizontal; ES/EN; sin errores JS.
### Pendiente E4b
- E4.4 búsqueda global y filtros por tema/contexto/esfuerzo; E4.5 módulos por público; E4.6 ficha «Costa Rica en contexto»; prueba cronometrada de aceptación (≤ 3 min) con personas.

## [0.8.0] — 2026-10-26 · Capa de tips (E3), para revisión
### Añadido (lote 3 y sitio)
- 37 tips Docente y 25 Dirección por banda; 20 prácticas nuevas (TR-031…050). Total: 110 tips, 50 prácticas.
- Sitio: pestaña «Para ti › Tips» con tarjeta de tip (E3.5), filtro por confianza, i18n ES/EN; `build_data.py` incluye tips y transfer en `data.js`; inicio por rol abre los tips.
- `docs/CIERRE_E3_v0.8.md`.

### Añadido (lotes 1–2)
### Añadido
- `data/transfer.json` (18 prácticas) y `data/tips.json` (24 tips Familia 6–8/9–11, borrador D5), generados por `tools/e3a_familia.py`.
- `tools/readability.py` (Fernández-Huerta; media 90,8).
- `docs/INFORME_E3A_FAMILIA_6-11.md`.
- Lote 2: 18 tips Familia 12–14/15–18, 6 transversales E3.3 (T-TRV), 12 prácticas (TR-019…030); `docs/INFORME_E3B_FAMILIA_12-18_TRANSVERSALES.md`.
### Cambiado
- Criterios del equipo: sin edad mínima en CR (exposición y riesgo); ejemplos extranjeros no transferibles; compañeros de IA «NO REGULADO»; canal de denuncia escuela → PANI/OIJ.

## [0.7.1] — 2026-10-26 · Revisión muestral, referencias y decisiones D3/D5
### Cambiado
- **D3 aprobada** (el tip es la unidad del producto). **D5 aprobada con cambios**: los tips se validan con personas expertas en educación y con el MEP, además de revisión filológica; `tips.schema.json` exige las tres validaciones para publicar (autotest: 12/12 casos inválidos rechazados).
- **Revisión muestral** de los 112 ítems nuevos (n = 45, estratificada): 0 errores de cifra o cita; 16 % con inferencia sin marcar. La regla se aplicó a todo el universo: 20 ítems corregidos y nuevo campo `lectura_cr`, que el sitio muestra rotulado y separado de la paráfrasis. Ver `docs/REVISION_MUESTRAL_v0.7.md`.
- **Referencias**: 11 URL añadidas (avisos APA de 19 a 9); 8 pendientes con motivo documentado (`tools/update_refs.py`).
### Pendiente
- Autoría de S19 (no localizada públicamente).

## [0.7.0] — 2026-10-26 · Etapa E2 completa (corpus y anclaje Costa Rica)
Resumen: 26 fuentes, 422 ítems, 422/422 citas verificadas, 12/12 temas con ancla CR, bandas D1. Ver `docs/CIERRE_E2_v0.7.md`.

### E2c–E2d y E2.5 (26-10-2026)
- S26 Código de la Niñez y la Adolescencia (10 ítems); S24 sustituida por la ENIA versión final 2.6 con su sección «IA para niñez y adolescencia» (6 ítems); E2.5: 7 ítems nuevos de S04 (Eurydice) sobre gobernanza de la IA escolar y guías docentes.
- `verify_quotes.py` admite varias extracciones por página (V5.2 + pdftotext), necesario para textos a dos columnas.
- Textos del sitio actualizados a «borrador 0.7»; `CITATION.cff` 0.7.0.

### E2a (26-10-2026)
### Añadido
- Seis fuentes nuevas (S14 MEP–ONU–UNESCO–ULACIT, S15 GCABA, S16 Imaginable Futures, S17 Data Governance Toolkit, S18 Lee 2023, S19 Tutores IA) y 55 ítems: 365 ítems, 19 fuentes; 365/365 citas verificadas.
- Primer anclaje en Costa Rica: 19 ítems de S14 (Ley 8968, ENIA 2024–2027, INEC); la obligación Ley 8968 encabeza «Para ti · Familia».
- `tools/extract_pages.py`, `tools/ingest_e2.py`, `data/ingest/`, `data/context_sources.json` (ILIA, BID, Kissinger), `docs/INFORME_E2A.md`.
### E2b · Anclaje Costa Rica (26-10-2026)
- Adenda: S25 Kids Online Costa Rica 2023 (14 ítems). Total: 25 fuentes, 402 ítems, 402/402 citas; 12/12 temas con ancla CR.
- Cinco fuentes y 23 ítems: S20 Kids Online Uruguay 2022, S21 Ley 8968, S22 Reglamento 37554-JP, S23 Ley 10020, S24 ENIA (versión de consulta). Total: 24 fuentes, 388 ítems, 388/388 citas verificadas.
- 33 ítems con ancla CR; 11/12 temas anclados.
- `audit_apa.py`: la legislación no exige cursiva (APA 7 §11). `ingest_e2.py`: aviso si reaparece la banda 6-11.
- Corregido: regresión de bandas en el lote E2a (27 ítems) tras reintegrarlo; ver `docs/INFORME_E2B.md` §4.

### E2.4 · Bandas D1 (26-10-2026)
- D1 aprobada: 6–8 / 9–11 / 12–14 / 15–18 (ciclos MEP, sin traslape; 12 años en III ciclo).
- `tools/rebands_d1.py`: reetiqueta los ítems del tramo 6–11 según la edad declarada por la fuente; 152 ítems cambiados, 2 marcados para revisión; decisión por ítem en `docs/REETIQUETADO_D1.csv`.
- Sitio: 4 bandas en regla, «Para ti», explorador, mapa de evidencia y leyendas; cuarto color de banda (`--t4`) en los 7 temas, contraste verificado.
- Esquema `tips.schema.json`: banda `12-14` (antes `12-15`).

### Cambiado
- Textos del sitio con recuentos (13 → 19 fuentes; 310 → 365 ítems) y límites del corpus.
- `tools/audit_apa.py` acepta «(s. f.)».

## [0.6.0] — 2026-10-26 · Etapa E1 (correcciones UX rápidas)
Sin cambios en el corpus: `data/data.js`, `data/items.json` y `data/catalog.json` quedan intactos (310 ítems, 13 fuentes).

### Cambiado
- **E1.1 Idioma por defecto ES (D4).** Prioridad: `?lang=` > elección guardada (`localStorage coa.lang`) > `es`. Se elimina la detección por `navigator.language`, que mostraba el sitio en inglés en equipos configurados en inglés. (`assets/js/app.js`, arranque)
- **E1.2 Menú lateral fijo.** En ≥ 981 px: `position: sticky; top: 0; align-self: start; height: 100dvh`. `align-self:start` evita que el ítem de la cuadrícula se estire y pierda el anclaje en Safari. (`styles.css`, bloque v0.6)
- **E1.3 ES/EN y Accesibilidad en la barra superior.** Se elimina el contenedor flotante `.fab-wrap`, que tapaba tarjetas (escritorio) y la regla (móvil). Grupo `.tools` con orden de tabulación: Menú → ES → EN → Accesibilidad → Ayuda. En ≤ 1180 px el botón de accesibilidad queda solo con ícono (nombre accesible intacto); en ≤ 640 px se oculta la ruta de navegación y «Cómo usar el sitio» pasa a «?» con etiqueta para lector de pantalla.
- **E1.4 Regla de edades en móvil (≤ 700 px).** Se oculta el SVG con desplazamiento horizontal y su leyenda; se muestra una nota y el resumen vertical por edad (`#rdetail`, una fila por umbral o política). Botón «Ver diagrama completo» (`aria-pressed`) para quien quiera el gráfico; la tabla «Versión en texto» se conserva.
- **E1.5 Tarjetas de estadísticas → filtros.** Recomendaciones, alertas y obligaciones son botones conmutables (`aria-pressed`, ✓ visible, anuncio en región viva). «N ítems» abre el Explorador prefiltrado por rol y tramo. «Fuentes distintas» queda informativa. Se añade «Mostrar más (n restantes)» en pasos de 6.
- **E1.6 Metainformación plegada.** Limitaciones, estatus legal, edad en la fuente, cita textual con «PDF p.», referencia APA e identificador (S08-03…) pasan al pliegue «¿De dónde sale esto?» (con autor-año visible en el resumen). En el primer nivel queda: tipo, tema, edades, texto llano, cifra y, si corresponde, la etiqueta «No aplica directamente en Costa Rica».
- **E1.7 Orden por relevancia en «Para ti».** Clave de orden: (1) aplicable a Costa Rica antes que no aplicable; (2) obligación = alerta > recomendación > hallazgo = cifra; (3) evidencia normativa o de encuesta antes que el resto. Se muestra una línea con el criterio y cuántos ítems aplican sin reservas a CR.
  - *Regla de aplicabilidad (operacional, provisional hasta la matriz de transferibilidad de E3):* un ítem es «no aplicable directamente en CR» si tiene `legal_status` (guía estatutaria de Inglaterra, propuesta UE no adoptada, informe parlamentario del Reino Unido) o si su `caveat` declara «no aplica(ble) directamente…». Resultado: 55 de 310 ítems.

### Corregido
- Los enlaces profundos (`index.html#parati`, `#evidencia/explorador`…) abrían siempre Inicio: el primer render sobrescribía el `hash`. Se conserva el `hash` inicial con `history.replaceState`.
- Contraste del fragmento «on» de la marca (opacidad → `var(--side-muted)`); señalado por axe-core.

### Verificación (Chromium/Playwright, 1366×800 y 390×844)
- Sin solapamientos: no queda ningún elemento `position: fixed` sobre el contenido; `scrollWidth` = ancho de viewport en ambos tamaños (sin desplazamiento horizontal de página).
- Lighthouse 12.2.1 — Accesibilidad: **100** (escritorio) y **100** (móvil) en `#parati`.
- axe-core 4.10.2 (WCAG 2.0/2.1/2.2 A–AA): 0 violaciones en `#inicio` y `#parati`, ambos tamaños.
- `tools/contrast.py`: «Contraste OK en todos los temas».
- Teclado: recorrido completo con Tab; filtros conmutables con Enter/Espacio y foco conservado; persistencia de idioma tras recargar.
- 0 errores de JavaScript en consola.

### Añadido (cierre E0, 26-10-2026)
- `data/schema/tips.schema.json` y `transfer.schema.json` (JSON Schema 2020-12) con reglas: tip sin evidencia o con `evidence_id` inexistente se rechaza; confianza A exige ancla CR; sin ancla exige condición de adaptación; «publicado» exige 3 revisiones (D5); bandas D1.
- `data/ejemplos/` (instancias de ejemplo, no publicables) y `tools/validate_schemas.py` (`--ejemplos`, `--selftest`).
- Repositorio git local: etiquetas `v0.5`, `v0.6`; rama `dev`.
- `docs/REVISION_E0_E1.md`: revisión de cierre.

### Corregido (revisión)
- Eliminados restos de `.fab-wrap` (CSS y exclusión en `markAbbr`).

### Pendiente (fuera de E1)
- E0: firma de D1–D5 (`docs/DECISIONES.md`).
- Las bandas siguen siendo 6–11 / 12–14 / 15–18 hasta E2.4 (D1).

## [0.5.0] — 2026-10-07
Línea base: 310 ítems, 13 fuentes, sitio bilingüe con regla de edades, explorador, diagramas y panel de accesibilidad.
