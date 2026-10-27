# Preparación para E5 · Validación con usuarios → v1.0
Estado al 26-10-2026: v0.9 completa (ver `CIERRE_E4_v0.9.md`). Este documento deja listo el arranque de la sesión 8 (E5a).

## 1. Antes de las pruebas (equipo)
- [ ] **Publicar v0.9 en GitHub Pages** (`agmelendez/childrenandai`) o usar una URL de prueba: las personas deben abrir el sitio desde su propio teléfono o computadora. Hasta hoy el trabajo es local.
- [ ] Decidir si las pruebas usan los tips como borrador (recomendado: sí, con el aviso visible) o esperar la validación D5.
- [ ] Reclutar: 5 familias (al menos 2 con hijos de 6–11), 5 docentes (I/II ciclo y III ciclo/Diversificada), 3 personas de dirección; idealmente 1 persona usuaria ciega (E5.2).
- [ ] Consentimiento informado para participantes adultos (Ley 8968): no se registran nombres en los datos de la prueba; solo código P01…P13.
- [ ] Dispositivo y lector de pantalla para E5.2 (VoiceOver en iOS/macOS o NVDA en Windows).

## 2. Tareas propuestas (para convertir en guion en E5a)
| # | Tarea | Público | Éxito | Funciones que prueba |
|---|---|---|---|---|
| T1 | «Encuentre 3 recomendaciones para su caso, guárdelas e imprímalas o guárdelas en PDF.» | Todos | Hoja con 3 tips en ≤ 3 min | E4.1–E4.3 (criterio de aceptación de E4) |
| T2 | «Busque qué hacer si circula una foto falsa de un estudiante.» | Docente, Dirección | Llega a T-DOC-019 o al protocolo de incidentes | E4.4, E4.5 |
| T3 | «Prepare un acuerdo de uso de la IA para su casa.» | Familia | Marca ≥ 3 líneas e imprime | E4.5 Familia |
| T4 | «¿Hay en Costa Rica una edad mínima para usar IA?» | Todos | Responde «no» y cita el sitio | E4.6 / T-TRV-002 |
| T5 | «Compruebe de dónde sale una recomendación.» | Todos | Abre la evidencia y la referencia APA | Procedencia |
| T6 | «Revise una plataforma antes de comprarla.» | Dirección | Usa la lista de compras | E4.5 Dirección |
| T7 | «Cambie el sitio a alto contraste y letra más grande.» | Todos / persona ciega | Ajuste aplicado sin ayuda | Accesibilidad |

## 3. Métricas e instrumentos (a producir en E5a)
- SUS (10 ítems, versión en español validada) → meta ≥ 75.
- Éxito por tarea (sí / con ayuda / no) → meta ≥ 80 %; tiempo por tarea; errores críticos.
- Barreras de accesibilidad por severidad → meta 0 críticas.
- Preguntas abiertas: claridad del lenguaje (Familia), utilidad para el aula, viabilidad de las plantillas institucionales.

## 4. Herramientas listas
- `tools/smoke_e4.js`: prueba de regresión (flujos E4, axe-core, 390 px). Uso: `npm i playwright axe-core` y `node tools/smoke_e4.js` desde la raíz del repositorio.
- Respaldo de v0.8 en `../_respaldo_v0.8_2026-10-26/`.

## 5. Mejoras de contenido recomendadas en paralelo
1. Extraer ítems de Kids Online Costa Rica 2023 (C05/C06) para reemplazar la referencia uruguaya en la ficha CR.
2. Completar URL del ILIA (C01) y las 8 URL APA pendientes.
3. Revisión en inglés de tips y del Kit (equipo).
