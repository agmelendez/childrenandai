# Sesión 3 · E2b — Anclaje normativo y empírico de Costa Rica
Fecha: 26-10-2026 · Rama `dev` · Base: `NORMATIVA_CR_E2B.md`, PLAN_MEJORA E2.3–E2.4.

## 1. Resultado
| Indicador | E2a | E2b |
|---|---|---|
| Fuentes / ítems | 19 / 365 | **24 / 388** |
| Citas verificadas | 365/365 | **388/388** |
| APA 7 | 0 errores | **0 errores** (20 avisos: URL faltantes) |
| Ítems con ancla CR (S14, S21–S24) | 19 | **33** |
| Temas con ≥ 1 ancla CR | 10/12 | **11/12** (falta *Edad y adecuación*) |
| Familia × 6–8 / 9–11 | 53* / 91* | **64 / 102** |

\* Valores afectados por la regresión descrita en §4.

## 2. Fuentes ingresadas
| ID | Fuente | Ítems | Aporte |
|---|---|---|---|
| S20 | Kids Online **Uruguay** 2022 (UCU–Agesic–Ceibal–UNICEF–UNESCO; N = 7822, 9–17 años) | 9 | Primer dato empírico latinoamericano para 9–11: menos habilidades de respuesta a riesgos, mayor llegada de la mediación familiar, maltrato en línea entre pares, mensajes sexuales en secundaria. Marcado «no aplicable directamente a CR» |
| S21 | Ley 8968 de protección de datos personales | 5 | Consentimiento expreso y por escrito (titular o representante), deber de informar, datos sensibles, derechos de acceso/rectificación/supresión, seguridad |
| S22 | Reglamento DE 37554-JP | 1 | Definición de consentimiento válido |
| S23 | Ley 10020 (grooming) | 5 | Comisión PANI–MEP–MICITT–OIJ y concientización en centros educativos (ancla de *Responsabilidad compartida*); definición de grooming; delito de seducción por medios electrónicos incluso con identidad falsa; **material pornográfico infantil incluye imagen o voz «alteradas o modificadas» en actividades «reales o simuladas»** (base para tratar los deepfakes sexuales de menores) |
| S24 | Estrategia Nacional de IA 2024–2027 (**versión de consulta**, 21-3-2024) | 3 | Rol del MEP en habilidades de IA en niñez y adolescencia; metas de capacitación |

## 3. Hallazgos para la capa de tips (E3)
- **La Ley 8968 no regula expresamente a personas menores de edad**: el consentimiento lo otorga el titular o su representante. Todo uso de plataformas de IA con datos de estudiantes requiere consentimiento escrito de quien ejerce la representación legal, información previa y medidas de seguridad del centro.
- **Ley 10020, art. 173**: la definición cubre representaciones «alteradas o modificadas» y actos «simulados». Es el ancla CR para el tip transversal sobre deepfakes; su aplicación a contenido íntegramente sintético es una interpretación sin jurisprudencia verificada (consignado en la advertencia del ítem S23-04).
- **Ningún instrumento CR fija edades mínimas para usar IA**; el único umbral en trámite es el proyecto de redes sociales < 14 (contexto, no vigente). *Edad y adecuación* sigue sin ancla nacional.

## 4. Incidencia corregida
Al reintegrar el lote E2a (actualización de la URL de S14), sus 27 ítems volvieron a la banda antigua 6–11 porque el archivo de ingreso no se había actualizado tras E2.4. Corrección: `rebands_d1.py` (27 ítems, lote 2 en `docs/REETIQUETADO_D1_lote2.csv`), bandas D1 copiadas a `data/ingest/*_items.json` y aviso automático en `ingest_e2.py` si reaparece 6–11. El registro original de E2.4 se restauró desde git.

## 5. Pendientes
1. **Kids Online Costa Rica 2023** (Paniamor–IIP-UCR): el PDF descargado es el de Uruguay. Descargar el informe nacional ([enlace](https://paniamor.org/files/project/files/6541_240311informeresultadoskidsonlinecostarica2023marzo2024.pdf)).
2. **Código de la Niñez y la Adolescencia** (Ley 7739): no llegó; es el ancla esperada para *Edad y adecuación* y *Responsabilidad compartida*.
3. **ENIA versión final** (oct. 2024) para sustituir la de consulta.
4. **E2.5** (secciones no extraídas de S04, Eurydice) y release **v0.7**.
5. Revisión humana de paráfrasis y clasificación de los 78 ítems nuevos (E2a + E2b).

## 6. Adenda (26-10-2026, 15:40) · Kids Online Costa Rica
- **S25** Pérez Sánchez (2024), *Informe Segunda encuesta Kids Online. Costa Rica* (Paniamor–IIP-UCR; N = 1200, 9–17 años): **14 ítems**, 402/402 citas verificadas.
- Aportes: mayor mediación en 9–12 que en adolescentes; cuidadores interesados pero con habilidades similares a las de sus hijos (29 % de NNA cree que saben poco o nada); uso problemático del celular de adultos asociado al de NNA (r = 0,28); celular a edades más tempranas; 36 % nunca o casi nunca usa internet en la escuela y la mediación docente no mejoró desde 2018; ciberacoso entre compañeros (71,6 %); 14 % de quienes pidieron ayuda no la recibió; mensajes sexuales 11,9 % (16,2 % en 2018), 38,6 % de adultos.
- **Los 12 temas tienen ahora al menos un ancla CR** (*Edad y adecuación* vía S25-05 y S25-06). Ítems con ancla CR: 47.
- Encuesta 2018, primeros resultados 2023 y resumen 2023 registrados como fuentes de contexto (C04–C06) para no duplicar.
- **Límite persistente:** ninguna fuente CR mide uso de IA en menores, y la muestra empieza a los 9 años, por lo que Familia × 6–8 (64 ítems) sigue sin evidencia nacional.
- Pendientes: Código de la Niñez y la Adolescencia; ENIA versión final; E2.5; release v0.7.
