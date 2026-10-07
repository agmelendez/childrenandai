# Accesibilidad (WCAG 2.2 · objetivo AA; texto AAA en temas de alto contraste)

## Implementado
- **Estructura**: enlace «Saltar al contenido», regiones (`header`, `nav`, `main`, `footer`), un solo `h1`, secciones con `aria-labelledby`, `lang` en `<html>` que cambia con el idioma y `lang` por cita (S09 en español, el resto en inglés).
- **Teclado**: todo operable con Tab, Mayús+Tab, Intro, Espacio, flechas (pestañas) y Esc (cierra el diálogo y las definiciones de siglas); el foco vuelve al elemento que abrió el diálogo o la definición.
- **Lectores de pantalla**: región `role="status"` anuncia cambios de edad, idioma, filtros y ajustes; pestañas con patrón ARIA (`tablist`/`tab`/`tabpanel`, `aria-selected`, tabindex itinerante); botones de alternancia con `aria-pressed`; la banda activa de la regla lleva `aria-current`; celdas del mapa de evidencia con etiqueta completa; tablas con `caption`, `th scope`.
- **Diagramas**: cada uno tiene una **versión en texto** (tabla o párrafo) dentro de un `<details>`; los elementos gráficos interactivos son botones con nombre accesible; las marcas y ejes decorativos del SVG están ocultos a la tecnología asistiva (`aria-hidden`).
- **Contraste**: 6 temas; `tools/contrast.py` exige 4,5:1 (7:1 en alto contraste) para texto y 3:1 para componentes. Compatible con `prefers-contrast`, `prefers-color-scheme` y `forced-colors`. La información nunca se transmite solo por color (niveles también en texto/etiquetas; propuestas con trama).
- **Ajustes** (guardados en `localStorage`): tema, tamaño de texto 80–200 %, tipografía Atkinson Hyperlegible, espaciado de línea/letra/palabra, enlaces subrayados, foco reforzado, sin animaciones, modo texto.
- **Objetivos táctiles** ≥ 36–48 px en controles principales; botones flotantes ≥ 44 px.
- **Siglas**: subrayado punteado, activables con teclado, definición en un diálogo con botón de cierre y enlace al glosario.

## Cómo probar
1. Solo teclado: recorrer la página sin ratón; abrir el panel (botón flotante), cambiar tema, cerrar con Esc.
2. Lector de pantalla (NVDA+Firefox/Chrome, JAWS, VoiceOver+Safari, TalkBack): navegar por encabezados (H), regiones (D) y tablas (T); abrir «Versión en texto de este diagrama»; cambiar idioma con ES | EN.
3. Zoom 200 % y 400 % (reflujo, sin desplazamiento horizontal de la página; los diagramas anchos se desplazan en su propio contenedor).
4. Modos de contraste del sistema (Windows contraste alto, macOS «Aumentar contraste»).
5. Automática: axe DevTools o Lighthouse (no sustituye la prueba con personas usuarias).

## Pendiente / límites
- **No se ha probado con personas usuarias de lectores de pantalla.** Registre las barreras como *Issues*.
- Los SVG no escalan su texto con el ajuste de tamaño (se amplía el contenedor y hay versión en texto).
- Las traducciones al inglés y paráfrasis no están validadas por humanos.
