#!/usr/bin/env python3
"""E4.5 (v0.9) · Módulos por público y E4.6 ficha «Costa Rica en contexto».
Genera data/modules.json y data/context_cr.json. Cada bloque cita tips (que a su vez citan evidencia)
o ítems del corpus; el script falla si un ID no existe. Editar aquí, no los JSON.
Uso: python3 tools/e4_modules.py"""
import json, pathlib
R = pathlib.Path(__file__).resolve().parent.parent / "data"
TIPS = {t["id"]: t for t in json.loads((R / "tips.json").read_text(encoding="utf-8"))["tips"]}
ITEMS = {i["id"]: i for i in json.loads((R / "items.json").read_text(encoding="utf-8"))}

def B(es, en, tips=(), items=()):
    for t in tips: assert t in TIPS, t
    for i in items: assert i in ITEMS, i
    return {"es": es, "en": en, "tips": list(tips), "items": list(items)}

M = {"_nota": "Generado por tools/e4_modules.py. Estado: borrador (D5). Las plantillas son redacción CIOdD a partir de los tips citados; no son normativa.",
"familia": [
 {"id": "conv", "tipo": "tarjetas", "titulo_es": "Tarjetas de conversación por edad", "titulo_en": "Conversation cards by age",
  "intro_es": "Preguntas abiertas para hablar de la IA sin regañar. Use una o dos por semana, en un momento tranquilo.",
  "intro_en": "Open questions to talk about AI without scolding. Use one or two a week, at a calm moment.",
  "bandas": {
   "6-8": [B("¿La IA piensa o siente como tú? ¿Cómo lo sabemos?", "Does AI think or feel like you? How do we know?", ["T-FAM-001"]),
           B("Si la IA te dice algo, ¿cómo podemos comprobar si es verdad?", "If AI tells you something, how can we check if it is true?", ["T-FAM-007"]),
           B("¿Qué cosas nunca le contamos a una máquina? (nombre, escuela, casa, fotos)", "What do we never tell a machine? (name, school, home, photos)", ["T-FAM-005"]),
           B("Si algo en la pantalla te asusta o te pide un secreto, ¿a quién se lo cuentas?", "If something on the screen scares you or asks for a secret, who do you tell?", ["T-FAM-016", "T-FAM-012"])],
   "9-11": [B("¿Para qué te sirvió la IA esta semana? ¿Qué aprendiste tú?", "What did AI help you with this week? What did you learn?", ["T-FAM-008", "T-FAM-009"]),
            B("¿Un chatbot puede ser tu amigo? ¿En qué se diferencia de una persona?", "Can a chatbot be your friend? How is it different from a person?", ["T-FAM-011", "T-FAM-010"]),
            B("Si alguien hiciera una foto falsa de un compañero, ¿qué harías?", "If someone made a fake photo of a classmate, what would you do?", ["T-FAM-014", "T-FAM-015"]),
            B("¿Qué reviso yo de tu uso de la IA, y por qué?", "What do I check about your AI use, and why?", ["T-FAM-022"])],
   "12-14": [B("¿Te ha dado la razón un chatbot en algo en lo que no estabas seguro?", "Has a chatbot agreed with you on something you were unsure about?", ["T-FAM-027"]),
             B("¿Cómo crees que la app decide qué videos mostrarte?", "How do you think the app decides which videos to show you?", ["T-FAM-033"]),
             B("¿Qué pondríamos en nuestro acuerdo de IA de la casa?", "What would we put in our home AI agreement?", ["T-FAM-025"]),
             B("¿Me enseñas una herramienta de IA que uses? Yo te cuento qué me preocupa.", "Will you show me an AI tool you use? I'll tell you what worries me.", ["T-FAM-037"])],
   "15-18": [B("¿Qué usas, para qué, y qué te preocupa de la IA?", "What do you use, what for, and what worries you about AI?", ["T-FAM-026"]),
             B("¿Qué datos tuyos no deberías escribirle a un chatbot?", "Which of your data should you never type into a chatbot?", ["T-FAM-038"]),
             B("Si alguien se hace pasar por ti con voz o fotos falsas, ¿qué pasos darías?", "If someone impersonates you with fake voice or photos, what steps would you take?", ["T-FAM-039", "T-FAM-041"]),
             B("¿La IA te ayuda a aprender o a terminar rápido? ¿Cómo lo notas?", "Does AI help you learn or just finish fast? How can you tell?", ["T-FAM-035", "T-FAM-036"])]}},
 {"id": "acuerdo", "tipo": "acuerdo", "titulo_es": "Acuerdo de uso de la IA en el hogar", "titulo_en": "Home AI use agreement",
  "intro_es": "Plantilla para completar en familia. Marque lo que acuerdan, escriba sus propias reglas y revísenla cada pocos meses.",
  "intro_en": "A template to complete as a family. Tick what you agree on, add your own rules and review it every few months.",
  "secciones": [
   {"es": "Para qué sí usamos la IA", "en": "What we do use AI for", "items": [
     B("Para pedir pistas y explicaciones, no para que haga la tarea.", "To ask for hints and explanations, not to do the homework.", ["T-FAM-009", "T-FAM-035"]),
     B("Para crear juntos (cuentos, ideas) y comentar el resultado.", "To create together (stories, ideas) and discuss the result.", ["T-FAM-023"]),
     B("Con menos de 9 años, solo juntos y con una persona adulta al mando.", "Under 9, only together and with an adult in charge.", ["T-FAM-002"])]},
   {"es": "Lo que no hacemos", "en": "What we don't do", "items": [
     B("No damos nombre completo, escuela, dirección, teléfono ni fotos.", "We don't share full name, school, address, phone or photos.", ["T-FAM-005", "T-FAM-038"]),
     B("No usamos apps de «amigo virtual» ni chats de compañía.", "We don't use 'virtual friend' apps or companion chats.", ["T-FAM-010", "T-TRV-003"]),
     B("No creamos ni reenviamos imágenes falsas de otras personas.", "We don't create or forward fake images of other people.", ["T-FAM-014", "T-FAM-030"]),
     B("No mentimos sobre la edad para abrir una cuenta.", "We don't lie about age to open an account.", ["T-FAM-004"])]},
   {"es": "Dónde y cuándo", "en": "Where and when", "items": [
     B("En un lugar común de la casa (hasta los 11 años).", "In a shared space at home (up to age 11).", ["T-FAM-003"]),
     B("Las apps con IA se apagan a la hora de dormir.", "AI apps are switched off at bedtime.", ["T-FAM-018", "T-FAM-034"]),
     B("Ubicación, micrófono, cámara y memoria del chat apagados si no hacen falta.", "Location, microphone, camera and chat memory off when not needed.", ["T-FAM-006"])]},
   {"es": "Si algo sale mal", "en": "If something goes wrong", "items": [
     B("Lo contamos sin miedo: nadie será castigado por avisar.", "We tell without fear: nobody is punished for telling.", ["T-FAM-012", "T-FAM-041"]),
     B("Si alguien pide fotos, secretos o vernos en persona, paramos y avisamos.", "If someone asks for photos, secrets or to meet, we stop and tell.", ["T-FAM-016", "T-FAM-032"]),
     B("Avisamos a la escuela y, según el caso, al PANI o al OIJ.", "We inform the school and, depending on the case, PANI or OIJ.", ["T-FAM-015", "T-FAM-041"])]}]}],
"docente": [
 {"id": "escenarios", "tipo": "escenarios", "titulo_es": "Escenarios por ciclo del MEP", "titulo_en": "Scenarios by MEP cycle",
  "intro_es": "Situaciones frecuentes y una respuesta basada en los tips. Úselas en reuniones de personal o en su planificación.",
  "intro_en": "Common situations and a response based on the tips. Use them in staff meetings or planning.",
  "bandas": {
   "6-8": [B("Una niña pregunta si puede hablar sola con el chatbot de la tablet. → Use la IA usted, frente al grupo, y diga en voz alta cuándo una respuesta viene de una máquina.", "A girl asks if she can chat alone with the tablet chatbot. → Use AI yourself, in front of the group, and say aloud when an answer comes from a machine.", ["T-DOC-002", "T-DOC-033"])],
   "9-11": [B("El grupo encuentra un dato falso en una respuesta de IA. → Conviértalo en actividad de «cazar errores» y verifiquen en libros o fuentes confiables.", "The group finds a false fact in an AI answer. → Turn it into an 'error hunt' and check against books or reliable sources.", ["T-DOC-013", "T-DOC-003"])],
   "12-14": [B("Un estudiante entrega un texto que parece hecho con IA. → No use detectores como prueba; converse primero y valore su aporte propio.", "A student hands in a text that looks AI-made. → Don't use detectors as proof; talk first and assess their own contribution.", ["T-DOC-008", "T-DOC-009"]),
             B("Circula en el grupo una foto falsa de una compañera. → Proteja a la víctima, comunique a la dirección y denuncie ante el Ministerio Público.", "A fake photo of a classmate circulates. → Protect the victim, inform leadership and report to the Public Prosecutor.", ["T-DOC-019", "T-DOC-020"])],
   "15-18": [B("Quiere usar un tutor con IA en Diversificada. → Que responda con preguntas, use solo el material del curso y nunca dé la respuesta final.", "You want to use an AI tutor in upper secondary. → It should answer with questions, use only course material and never give the final answer.", ["T-TRV-006", "T-DOC-025"]),
             B("Un estudiante usa un chatbot como confidente. → Atienda las señales emocionales y oriente hacia apoyo humano.", "A student uses a chatbot as a confidant. → Attend to emotional signals and guide towards human support.", ["T-DOC-021", "T-DOC-037", "T-DOC-026"])]}},
 {"id": "evaluacion", "tipo": "lista", "titulo_es": "Evaluar cuando hay IA", "titulo_en": "Assessing when AI is involved",
  "intro_es": "Lista de verificación para diseñar tareas y pruebas.", "intro_en": "Checklist to design assignments and tests.",
  "items": [B("La tarea muestra el proceso: borradores, explicación oral o trabajo en clase.", "The task shows the process: drafts, oral explanation or in-class work.", ["T-TRV-005"]),
            B("Se pide declarar el uso de IA y una reflexión personal.", "Students declare AI use and add a personal reflection.", ["T-DOC-006"]),
            B("Hay bitácora: prompt, herramienta, cambios y fuentes verificadas.", "There is a log: prompt, tool, changes and verified sources.", ["T-DOC-007"]),
            B("No se usan detectores de IA como prueba.", "AI detectors are not used as proof.", ["T-DOC-008"]),
            B("La nota y la decisión final las pone una persona; se informa si se usó IA para calificar.", "A person sets the grade and final decision; AI use in grading is disclosed.", ["T-DOC-027"]),
            B("Las herramientas exigidas son gratuitas o institucionales.", "Required tools are free or institutional.", ["T-DOC-023"])]},
 {"id": "prompts", "tipo": "prompts", "titulo_es": "Instrucciones (prompts) seguras", "titulo_en": "Safe prompts",
  "intro_es": "Plantillas para usar con el grupo. Nunca incluya nombres, cédulas, diagnósticos ni trabajos identificables.",
  "intro_en": "Templates to use with the group. Never include names, ID numbers, diagnoses or identifiable work.",
  "items": [B("«Explícame [tema] para estudiantes de [nivel] con un ejemplo de Costa Rica. Al final, dime qué fuentes confiables puedo revisar.»", "“Explain [topic] for [level] students with an example from Costa Rica. At the end, tell me which reliable sources I can check.”", ["T-DOC-012", "T-DOC-029"]),
            B("«Actúa como tutor: no me des la respuesta; hazme una pregunta a la vez para que yo llegue a ella.»", "“Act as a tutor: don't give me the answer; ask me one question at a time so I reach it myself.”", ["T-TRV-006", "T-DOC-025", "T-FAM-036"]),
            B("«Revisa este texto anónimo y señala tres errores de argumento, sin reescribirlo.»", "“Review this anonymous text and point out three argument errors, without rewriting it.”", ["T-DOC-016", "T-DOC-024"]),
            B("«Dame tres respuestas distintas a esta pregunta y explica en qué difieren.» (para comparar con otra IA o con un libro)", "“Give me three different answers to this question and explain how they differ.” (to compare with another AI or a book)", ["T-DOC-029", "T-DOC-010"])]}],
"direccion": [
 {"id": "politica", "tipo": "acuerdo", "titulo_es": "Plantilla de política institucional de IA", "titulo_en": "Institutional AI policy template",
  "intro_es": "Estructura mínima para una política del centro. Complete cada apartado con su comunidad educativa y alinéela con las orientaciones del MEP.",
  "intro_en": "Minimum structure for a school policy. Complete each section with your school community and align it with MEP guidance.",
  "secciones": [
   {"es": "1. Propósito y alcance", "en": "1. Purpose and scope", "items": [
     B("Reglas comunes para todo el personal, compartidas con las familias.", "Common rules for all staff, shared with families.", ["T-DIR-001"]),
     B("Uso guiado, no prohibición total: la escuela enseña el uso responsable.", "Guided use, not a blanket ban: the school teaches responsible use.", ["T-DIR-011", "T-DIR-017"])]},
   {"es": "2. Usos permitidos por ciclo", "en": "2. Permitted uses by cycle", "items": [
     B("Primaria: aprender sobre la IA; secundaria: aprender con la IA.", "Primary: learn about AI; secondary: learn with AI.", ["T-DIR-020", "T-DOC-001"]),
     B("Alfabetización en IA para todo el estudiantado.", "AI literacy for all students.", ["T-DIR-019"])]},
   {"es": "3. Datos y privacidad (Ley 8968)", "en": "3. Data and privacy (Law 8968)", "items": [
     B("Prohibido subir datos identificables de estudiantes a IA pública.", "Uploading identifiable student data to public AI is forbidden.", ["T-DIR-022"], ["S21-05"]),
     B("Consentimiento expreso y por escrito cuando corresponda.", "Express written consent where applicable.", ["T-TRV-001"], ["S21-01", "S22-01"]),
     B("Evaluación anual de impacto en privacidad.", "Annual privacy impact assessment.", ["T-DIR-006"])]},
   {"es": "4. Decisiones automatizadas y transparencia", "en": "4. Automated decisions and transparency", "items": [
     B("Persona responsable de cada sistema que apoye decisiones; se informa a las familias.", "A named person responsible for each decision-support system; families are informed.", ["T-DIR-013", "T-DIR-004"]),
     B("Informe anual de herramientas usadas, fines y resultados.", "Annual report of tools used, purposes and results.", ["T-DIR-018"])]},
   {"es": "5. Equidad, accesibilidad y formación", "en": "5. Equity, accessibility and training", "items": [
     B("Acceso equitativo y herramientas gratuitas, en español y accesibles.", "Equitable access, free tools in Spanish and accessible.", ["T-DIR-010", "T-DIR-021"]),
     B("Formación anual del personal y talleres para familias; tiempo reconocido.", "Annual staff training and family workshops; time recognised.", ["T-DIR-009", "T-DIR-016", "T-DIR-023"])]},
   {"es": "6. Protección e incidentes", "en": "6. Protection and incidents", "items": [
     B("Protocolo de incidentes y canal de reporte confidencial (ver módulo siguiente).", "Incident protocol and confidential reporting channel (see next module).", ["T-DIR-007", "T-DIR-014"])]}]},
 {"id": "compras", "tipo": "lista", "titulo_es": "Lista de verificación para adquirir plataformas con IA", "titulo_en": "Checklist for procuring AI platforms",
  "intro_es": "Úsela antes de firmar o activar una herramienta. Si alguna respuesta es «no», no la adopte todavía.",
  "intro_en": "Use it before signing or activating a tool. If any answer is 'no', don't adopt it yet.",
  "items": [B("¿Hay evidencia independiente de que ayuda a esta edad, y hace falta frente a opciones sin IA?", "Is there independent evidence it helps at this age, and is it needed versus non-AI options?", ["T-DIR-005"]),
            B("¿Minimiza datos, con privacidad desde el diseño, cifrado y almacenamiento seguro?", "Does it minimise data, with privacy by design, encryption and secure storage?", ["T-DIR-002"]),
            B("¿El contrato limita la conservación y garantiza corregir o borrar datos?", "Does the contract limit retention and guarantee correction or deletion?", ["T-DIR-003"], ["S21-04"]),
            B("¿El proveedor explica cómo decide su sistema?", "Can the provider explain how its system decides?", ["T-DIR-004"]),
            B("¿Funciona bien en español y es accesible para estudiantes con discapacidad?", "Does it work well in Spanish and is it accessible for students with disabilities?", ["T-DIR-021", "T-DOC-028"]),
            B("¿Es gratuita o institucional para el estudiantado?", "Is it free or institutional for students?", ["T-DOC-023", "T-DIR-010"]),
            B("¿Se revisaron funciones de IA activadas sin aviso en plataformas que ya usa?", "Were AI features switched on without notice in existing platforms reviewed?", ["T-DIR-024"])]},
 {"id": "incidentes", "tipo": "pasos", "titulo_es": "Protocolo de incidentes con IA", "titulo_en": "AI incident protocol",
  "intro_es": "Para deepfakes, acoso, suplantación o contacto sexual en línea. Adapte nombres y plazos a su centro.",
  "intro_en": "For deepfakes, harassment, impersonation or online sexual contact. Adapt names and deadlines to your school.",
  "items": [B("Recibir: una persona designada recibe el caso por un canal seguro y confidencial, y confirma la recepción.", "Receive: a designated person takes the case through a safe, confidential channel and confirms receipt.", ["T-DIR-014", "T-DIR-007"]),
            B("Proteger: priorizar a la víctima; no culparla; no reenviar ni pedir copias de imágenes sexuales de menores.", "Protect: prioritise the victim; don't blame them; don't forward or request copies of sexual images of minors.", ["T-FAM-041", "T-FAM-015"]),
            B("Resguardar la identidad: no publicar datos que identifiquen a víctima o autor.", "Protect identity: don't publish data identifying victim or perpetrator.", [], ["S26-07"]),
            B("Denunciar: ante sospecha razonable de abuso, al Ministerio Público; según el caso, al PANI o al OIJ.", "Report: on reasonable suspicion of abuse, to the Public Prosecutor; depending on the case, PANI or OIJ.", ["T-DOC-019"], ["S26-08", "S23-04"]),
            B("Comunicar al MEP los casos de maltrato o abuso, también en línea o con IA.", "Notify MEP of abuse cases, including online or AI-generated.", ["T-DIR-008"], ["S26-10"]),
            B("Acompañar y prevenir: apoyo humano, revisión de normas de convivencia y formación.", "Support and prevent: human support, review of conduct rules and training.", ["T-TRV-004", "T-DIR-009", "T-DIR-015"])]}]}

CR = {"_nota": "E4.6 · Ficha «Costa Rica en contexto». Cifras ILIA tomadas del Gráfico 1 (p. 22 del PDF) y del texto (pp. 21, 24, 45, 103, 115). El texto de la p. 45 da 50,3 en Factores habilitantes y el Gráfico 1 da 50,5: se usa el gráfico y se anota la discrepancia.",
 "ilia": {"fuente": "C01", "pagina": 22, "dims_es": ["ILIA total", "Factores habilitantes", "Investigación, desarrollo y adopción", "Gobernanza"], "dims_en": ["ILIA total", "Enabling factors", "Research, development and adoption", "Governance"],
  "paises": [["Chile",71.4,63.4,73.7,80.8],["Brasil",68.4,59.2,63.9,89.5],["Uruguay",67.0,61.0,65.1,79.4],["Colombia",56.8,46.4,51.6,80.9],["Costa Rica",56.0,50.5,45.0,80.5],["Argentina",55.6,52.7,48.4,70.3],["Perú",52.7,45.5,39.4,83.2],["México",52.0,49.6,45.6,65.0],["Ecuador",51.8,47.0,39.0,77.4],["Rep. Dominicana",45.1,43.3,27.1,73.2],["Panamá",39.3,43.1,31.8,43.3],["El Salvador",37.9,35.1,24.7,61.3],["Trinidad y Tabago",35.5,44.2,31.7,26.9],["Paraguay",32.6,43.5,21.8,30.3],["Jamaica",32.4,40.4,26.9,27.2],["Cuba",30.9,21.4,31.7,45.2],["Guatemala",29.0,40.1,23.4,19.3],["Honduras",26.2,31.7,22.9,21.6]],
  "nota_es": "El Gráfico 1 muestra 18 países; Venezuela y Bolivia no aparecen en la extracción de esa página.", "nota_en": "Chart 1 shows 18 countries; Venezuela and Bolivia do not appear in the extraction of that page."},
 "datos": [
  {"v": "5.º", "es": "lugar regional en el ILIA 2026 (56,0 puntos); grupo «adoptantes», que encabeza junto a Colombia y Argentina.", "en": "regional place in ILIA 2026 (56.0 points); 'adopters' group, which it leads with Colombia and Argentina.", "ref": "C01", "p": "21–22"},
  {"v": "25,1 %", "es": "de la población de 15 a 64 años usa activamente IA generativa: la tasa más alta de la región (promedio 16,1 %).", "en": "of people aged 15–64 actively use generative AI: the highest rate in the region (average 16.1%).", "ref": "C01", "p": "24, 115"},
  {"v": "0,754 %", "es": "concentración de habilidades de ingeniería en IA: más del doble que Chile y Colombia.", "en": "concentration of AI engineering skills: more than double Chile and Colombia.", "ref": "C01", "p": "103"},
  {"v": "45,0", "es": "puntos en Investigación, desarrollo y adopción: la dimensión más débil de Costa Rica.", "en": "points in Research, development and adoption: Costa Rica's weakest dimension.", "ref": "C01", "p": "22"}],
 "ninez_items": ["S20-05", "S20-08", "S20-01", "S20-06", "S20-04"],
 "marco_items": ["S26-01", "S26-02", "S21-01", "S21-04", "S23-04", "S26-08", "S24-01", "S24-03"],
 "vacios": [
  B("No hay edad mínima legal para usar IA: decida según la exposición y el riesgo.", "There is no legal minimum age to use AI: decide by exposure and risk.", ["T-TRV-002"]),
  B("Los chatbots de compañía no están regulados en Costa Rica.", "Companion chatbots are not regulated in Costa Rica.", ["T-TRV-003"]),
  B("La Estrategia Nacional de IA pide al MEP y al PANI protocolos conjuntos, todavía por desarrollar.", "The National AI Strategy asks MEP and PANI for joint protocols, still to be developed.", [], ["S24-03"]),
  B("Las prohibiciones de otros países (p. ej., Noruega) son ejemplos, no normas aplicables.", "Other countries' bans (e.g., Norway) are examples, not applicable rules.", ["T-DIR-017"])]}
for x in CR["ninez_items"] + CR["marco_items"]: assert x in ITEMS, x
(R / "modules.json").write_text(json.dumps(M, ensure_ascii=False, indent=1), encoding="utf-8")
(R / "context_cr.json").write_text(json.dumps(CR, ensure_ascii=False, indent=1), encoding="utf-8")
n = sum(len(b.get("tips", [])) for m in M.values() if isinstance(m, list) for mod in m for b in ([*mod.get("items", [])] + [i for s in mod.get("secciones", []) for i in s["items"]] + [i for v in mod.get("bandas", {}).values() for i in v]))
print("modules.json y context_cr.json OK ·", n, "citas a tips")
