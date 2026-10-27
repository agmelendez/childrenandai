# Revisión de cierre E0 + E1 — Children on AI v0.6
Fecha: 26-10-2026 · Alcance: etapas E0 (preparación y gobernanza) y E1 (correcciones UX) del `PLAN_MEJORA_2026-10.md` · Repositorio local: `main` = `dev` = etiqueta `v0.6`.

## 1. Criterios de aceptación

| Etapa | Criterio del plan | Resultado | Evidencia |
|---|---|---|---|
| E0 | Esquemas validados con JSON Schema | **Cumple** | `data/schema/tips.schema.json`, `transfer.schema.json` (draft 2020-12); `tools/validate_schemas.py --ejemplos` → OK; `--selftest` rechaza 10/10 casos inválidos |
| E0 | Decisiones firmadas | **No cumple (pendiente humano)** | `docs/DECISIONES.md`: D1–D5 propuestas; D4 aplicada provisionalmente |
| E0.4 | CHANGELOG, rama `dev`, etiqueta `v0.5` | **Cumple** | `git log`: `v0.5` (738a8b4) → `v0.6` (e51c86c); rama `dev` |
| E1 | Capturas 1366/390 px sin solapamientos | **Cumple** | `docs/capturas_v0.6/`; 0 elementos fijos sobre el contenido; `scrollWidth` = ancho de viewport |
| E1 | Lighthouse accesibilidad ≥ 95 | **Cumple (100/100)** | Lighthouse 12.2.1 en `#parati`, escritorio y móvil |
| E1 | Prueba de teclado completa | **Cumple** | Orden de foco: salto → Menú → ES → EN → Accesibilidad → Ayuda → contenido; filtros con Enter/Espacio conservan el foco |

## 2. Controles de integridad (no regresión)

| # | Control | Resultado |
|---|---|---|
| R1 | `data.js` regenerado con `build_data.py` desde los JSON canónicos | Idéntico byte a byte (principio 5: sin ediciones manuales) |
| R2 | Citas verbatim (`verify_quotes.py` contra `Bibliografía/pages.jsonl`) | 310/310 verificadas |
| R3 | Auditoría APA 7 (`audit_apa.py`) | 0 errores · 10 avisos (sin cambios respecto de v0.5) |
| R4 | Claves i18n: paridad ES/EN y claves v0.6 presentes en ambos idiomas | 0 claves huérfanas; 13/13 claves nuevas en ES y EN |
| R5 | axe-core 4.10.2, WCAG 2.2 A–AA, `#inicio` y `#parati`, 1366 y 390 px | 0 violaciones |
| R6 | `tools/contrast.py` (todos los temas) | OK |
| R7 | Errores de JavaScript en consola | 0 |
| R8 | Restos de los botones flotantes (`.fab-wrap`) | Eliminados en esta revisión (regla CSS muerta y exclusión en `markAbbr` → `.tools`) |

## 3. Hallazgos para las etapas siguientes
1. **Para ti · Familia 6–11:** con la regla provisional de aplicabilidad, las 11 obligaciones quedan al final (todas son de Inglaterra o propuestas UE). Confirma la brecha de anclaje CR que debe cerrar E2.3; mientras tanto la vista se encabeza con alertas.
2. **Bandas:** los esquemas nuevos ya exigen las 4 bandas D1 (`6-8`, `9-11`, `12-15`, `15-18`) mientras `items.json` mantiene 6–11/12–14/15–18. El reetiquetado (E2.4) es requisito antes de redactar tips en E3. Nota: D1 deja 12 años en dos bandas («9–11/12» y «12–15»); la firma de D1 debe fijar la regla de corte.
3. **Fuentes de E2a no disponibles en `PDFs/`:** S14 MEP-UNESCO-ULACIT, S15 GCABA, S16 Imaginable Futures, S17 Data Governance Toolkit, S18 AI Toolkit for Educators, S19 Tutores IA. Sin ellas no puede iniciarse la sesión 2.
4. **Safari:** el anclaje del menú (`align-self:start`) se verificó solo en Chromium; probar en Safari/macOS e iOS al abrir el sitio localmente.

## 4. Cómo reproducir localmente
```bash
cd children-on-ai
open index.html                              # el sitio funciona con doble clic (file://)
python3 tools/validate_schemas.py --selftest # esquemas (requiere jsonschema ≥ 4.18)
python3 -I tools/verify_quotes.py ../Bibliografía/pages.jsonl
python3 tools/audit_apa.py && python3 tools/contrast.py
git log --oneline --decorate                 # v0.5 → v0.6
```

## 5. Dictamen
E1 **aprobada**. E0 **aprobada con una condición**: firma de D1–D5 en `docs/DECISIONES.md` (en especial D1 y la regla de corte de 12 años) antes de E2.4.
