# Declaración de uso de inteligencia artificial

Versión 0.4 · 7 de octubre de 2026. Es la misma declaración que muestra el sitio en *Método y transparencia → Declaración de uso de IA*.

**Herramienta.** Claude (Anthropic), modelo de lenguaje de gran tamaño, usado mediante Claude Code (agente con acceso a archivos y ejecución de scripts) durante 2026. Modelo configurado en la sesión: `claude-sonnet-5-5`; el modelo que atiende cada turno puede variar, por lo que no se garantiza un único modelo en todo el trabajo. Algunas traducciones se hicieron en paralelo con subagentes del mismo sistema.

Referencia (APA 7): Anthropic. (2026). *Claude* (Sonnet 5.5) [Large language model]. https://claude.ai

## Qué hizo la IA y qué control humano existe

| Tarea | Intervención de la IA | Control y estado |
|---|---|---|
| Catalogación de fuentes | Leyó los 13 PDF y elaboró la ficha de cada uno | Corpus y PDF son del equipo humano. Fichas y referencias pendientes de validación humana |
| Extracción de ítems | Propuso 310 ítems con cita textual y página | Las 310 citas se verifican automáticamente (`tools/verify_quotes.py`). La clasificación NO tiene validación humana aún |
| Paráfrasis y traducción | Parafraseó en español, tradujo al inglés y redactó la interfaz | Pendiente revisión humana de cifras y matices; prevalece la cita original |
| Diagramas | Diseñó los 5 diagramas SVG y sus alternativas textuales | Dos son esquemas conceptuales propios y así se rotulan |
| Programación | Escribió HTML, CSS, JS, scripts de verificación y documentación | Pruebas automáticas y de contraste; faltan pruebas con lectores de pantalla y personas usuarias |
| Referencias y licencias | Redactó referencias APA 7, notas de fuente, auditoría y propuso licencias | Requiere confirmar titularidad, URL/DOI y revisión jurídica |

## Lo que la IA no hizo
No seleccionó el corpus ni tomó decisiones editoriales finales. Las recomendaciones, hallazgos y cifras provienen solo de los 13 PDF; la excepción son las definiciones del glosario marcadas «general» (conocimiento del modelo). La IA no es autora: la responsabilidad editorial es del equipo humano.

## Límites y riesgos
Los modelos de lenguaje pueden errar, omitir matices o atribuir mal una idea; por eso cada ítem lleva su cita textual verificable y el enlace a la página. Las paráfrasis y traducciones pueden perder matices. El sitio no sustituye asesoría jurídica, clínica ni pedagógica.

## Datos y privacidad
Sin datos personales, cookies propias ni analítica (las tipografías se cargan desde Google Fonts). Solo se guardan en el navegador (`localStorage`) el idioma y las preferencias de accesibilidad. El sitio publicado no usa IA en tiempo real. No se procesaron datos de menores.

## Pendiente
Archivar los prompts y el registro de la sesión; validar fichas, clasificación y traducciones con personas expertas; confirmar autoría humana y política institucional sobre IA.

---

# AI-use declaration (English summary)

This site was designed, largely written and programmed with the assistance of Claude (Anthropic) via Claude Code, during 2026 (working version of 7 Oct 2026; configured model `claude-sonnet-5-5`, serving model may vary). The AI catalogued the 13 closed-corpus PDFs, proposed 310 items with verbatim quotes (all machine-verified against the PDFs), paraphrased and translated them, built the diagrams and code, and drafted the references, audit and licence proposal. It did not choose the corpus or take final editorial decisions, and it is not an author. Classification, translations and reference data still need human validation. The published site uses no AI and collects no personal data.
