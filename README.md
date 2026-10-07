# Children on AI

Sitio web interactivo para familias, docentes y direcciones escolares con **recomendaciones, alertas y diagramas** sobre el uso de IA en niñez y adolescencia, derivados de un corpus cerrado de **13 documentos** (tramos 6–11, 12–14 y 15–18 años). Cada ítem trae su **cita textual y página del PDF**. Formato CIOdD-UCR, citas APA 7.

*Interactive site for families, teachers and school leaders with recommendations, alerts and diagrams on children's and adolescents' use of AI, derived from a closed corpus of 13 documents. Every item carries its verbatim quote and PDF page. Spanish and English UI.*

Estado: **borrador 0.4**. Las paráfrasis, traducciones al inglés, clasificación (tramo, rol, tema) y lectura de figuras **no tienen validación humana**; las 310 citas textuales sí se verifican por script (ver abajo).

## Estructura

```
index.html                 Página única (esqueleto semántico, botones flotantes, diálogo de accesibilidad)
assets/css/styles.css      Temas (claro, oscuro, 3 de alto contraste), ajustes de accesibilidad, diseño
assets/js/i18n.js          Textos de interfaz ES/EN y datos de diagramas/tablas que cambian con el idioma
assets/js/i18n.nav.js      Textos de menú, inicio, tutorial y mapa del sitio (ES/EN)
assets/js/app.js           Lógica (sin dependencias): regla de edades, diagramas, filtros, glosario, idioma, accesibilidad
data/items.json            310 ítems (es/en, cita, página, clasificación)   ← fuente editable
data/catalog.json          Catálogo de las 13 fuentes (es/en, APA 7)        ← fuente editable
data/glossary.json         61 siglas y términos (es/en)                     ← fuente editable
data/data.js               Generado desde los tres JSON (permite abrir index.html con doble clic)
tools/build_data.py        Genera data/data.js
tools/verify_quotes.py     Verifica cada cita contra el pages.jsonl del pipeline
tools/contrast.py          Verifica contraste WCAG de los temas
tools/audit_apa.py         Auditoría APA 7 → docs/AUDITORIA_APA7.md
.github/workflows/pages.yml  Comprobaciones + despliegue en GitHub Pages
docs/ACCESIBILIDAD.md      Qué se implementó y cómo probarlo
```

No hay paso de compilación ni dependencias de ejecución. Los PDF fuente **no** están en el repositorio.

## Navegación (v0.4)

Menú lateral agrupado (Empezar · Explorar · Fuentes y normas · Consulta · Ayuda) con subsecciones; en móvil es un panel deslizable. Se muestra una sección a la vez, con pestañas internas, y cada una tiene enlace propio (`#parati/guias`, `#diagramas/resp`, `#evidencia/explorador`). Incluye **Cómo usar este sitio** (tutorial, etiquetas y colores, teclado, preguntas frecuentes) y **Mapa del sitio** con descargas JSON. Para añadir una sección: `VIEWS`/`GROUPS`/`ICONS` en `app.js`, un `<section class="view" id="v-…">` en `index.html` y las claves `v.`, `d.` en `i18n.nav.js`. Los colores por edad (6–11 verde azulado, 12–14 ámbar, 15–18 violeta) son los tokens `--t1/--t2/--t3`.

## Ejecutar localmente

```bash
python3 -m http.server 8000      # y abrir http://localhost:8000
```

También funciona abriendo `index.html` directamente, porque los datos se cargan desde `data/data.js`. Parámetro opcional: `?lang=en`.

## Editar contenido

1. Edite `data/items.json`, `data/catalog.json` o `data/glossary.json`. Cada ítem: `source`, `page` (índice del PDF), `quote` (textual), `es`, `en`, `kind`, `theme`, `ages`, `audiences`, `strength`, `caveat`/`caveat_en`, `age_note`/`age_note_en`, `figure`/`figure_en`.
2. Regenere los datos: `python3 tools/build_data.py`
3. Verifique las citas (necesita el `pages.jsonl` del pipeline): `python3 -I tools/verify_quotes.py RUTA/pages.jsonl`
4. Haga commit de los JSON **y** de `data/data.js` (el workflow falla si `data.js` está desactualizado).

Los textos de la interfaz están en `assets/js/i18n.js`. **Para añadir un idioma:** copie el bloque `es`, tradúzcalo, añada el código a `LANGS` en `app.js`, agregue un botón en `#langGrp` de `index.html` y los campos `*_<código>` en los JSON (si faltan, se muestra el español).

## Publicar en GitHub Pages

1. Cree el repositorio y suba todo: `git init && git add . && git commit -m "Children on AI 0.3" && git branch -M main && git remote add origin <URL> && git push -u origin main`
2. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada `push` a `main` ejecuta las comprobaciones y publica en `https://<usuario>.github.io/<repositorio>/`.

Si prefiere sin Actions: Source = *Deploy from a branch*, rama `main`, carpeta `/ (root)`; el archivo `.nojekyll` ya está incluido.

## Accesibilidad

Botón flotante **Accesibilidad** (abajo a la derecha) y botón flotante **ES | EN**. Incluye: 6 temas de contraste (automático, claro, oscuro, alto contraste claro, alto contraste oscuro, amarillo sobre negro), tamaño de texto 80–200 %, tipografía legible, mayor espaciado, enlaces siempre subrayados, foco reforzado, reducir animaciones y **modo texto** (oculta gráficos y abre sus versiones en texto). Cada diagrama tiene una versión en texto (tabla o lista). Se respetan `prefers-color-scheme`, `prefers-contrast`, `prefers-reduced-motion` y `forced-colors`. Detalles y guía de pruebas en [`docs/ACCESIBILIDAD.md`](docs/ACCESIBILIDAD.md).

## Pendientes y límites conocidos

- Prueba con usuarios de lector de pantalla (NVDA, JAWS, VoiceOver, TalkBack): **pendiente**.
- Validación humana de paráfrasis, traducciones, clasificación y figuras: **pendiente**.
- Sin fuentes de Costa Rica; todo marco normativo citado corresponde a otras jurisdicciones.
- Cifras que difieren entre fuentes (p. ej. 72 % de 9–17 años según UNESCO frente a 9–16 años en la encuesta original) están señaladas en *Alertas sobre la evidencia*.
- KCSIE 2026 (S07) es un borrador informativo; el EU KIDS Act (S08) es una propuesta, no ley.
- Autoría, año y URL de «Cómo citar este sitio»: por completar al publicar.
- Las fuentes tipográficas se cargan desde Google Fonts; para evitar esa solicitud externa, descargue las fuentes a `assets/fonts/` y cambie el `<link>` de `index.html`.
- **Licencias (propuesta, sin revisión jurídica):** código MIT (`LICENSE`); contenido original CC BY-SA 4.0 (`LICENSE-CONTENT.md`, falta pegar el texto legal oficial); citas con la licencia de cada fuente (`NOTICE.md`). Confirmar titular y compatibilidad CC BY-SA 4.0 / 3.0 IGO.
- **Declaración de uso de IA:** [`docs/DECLARACION_IA.md`](docs/DECLARACION_IA.md) (también en el sitio, *Método y transparencia*). Claude (Anthropic) apoyó catalogación, extracción, traducción, diagramas, código y referencias; la responsabilidad editorial es del equipo humano.
- **Auditoría APA 7:** [`docs/AUDITORIA_APA7.md`](docs/AUDITORIA_APA7.md), generada con `python3 -I tools/audit_apa.py`; URL/DOI/meses/páginas pendientes listados ahí.
- **Procedencia de datos:** cada gráfico, tabla y tarjeta lleva «Nota. Elaboración propia con datos de (autoría, año, PDF p. n)»; los ítems de cada gráfico están en `data/figure_sources.json`.

---

## English summary

Static site, no build step. Open `index.html` or run `python3 -m http.server`. Edit `data/*.json`, run `python3 tools/build_data.py`, commit, push to `main`; enable **Settings → Pages → Source: GitHub Actions**. Floating **ES | EN** and **Accessibility** buttons (contrast themes, text size, screen-reader-oriented text versions of all diagrams, text mode). Quotes verified with `tools/verify_quotes.py` (310/310 against the pipeline's `pages.jsonl`). Every graphic carries an APA 7 source note; see `docs/AUDITORIA_APA7.md`, `docs/DECLARACION_IA.md` (AI-use declaration), `LICENSE` (MIT code), `LICENSE-CONTENT.md` (CC BY-SA 4.0 content, proposal pending legal review). Pending: screen-reader user testing, human validation of paraphrases and translations, pending URLs/DOIs, citation text.
