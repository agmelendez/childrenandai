#!/usr/bin/env python3
"""Aplica las correcciones de la revisión muestral v0.7 (docs/REVISION_MUESTRAL_v0.7.md) a los lotes
de ingreso (data/ingest/*_items.json), para que persistan si se reingresan. Regla: `es`/`en` = paráfrasis
fiel a la cita; la inferencia del equipo pasa a `lectura_cr`/`lectura_cr_en` («Lectura CIOdD para Costa Rica»).
Idempotente. Uso: python3 tools/apply_review_v07.py && python3 tools/ingest_e2.py <lote> ..."""
import json, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
FIX = {
 "S04-42": dict(es="El modelo estonio confía la implementación de la IA a las escuelas, con guías y recursos nacionales en lugar de regulación formal.",
   en="Estonia's model leaves AI implementation to schools, supported by national guidance and resources rather than formal regulation.",
   lectura_cr="Es un esquema comparable al costarricense, que también se apoya en una guía orientadora del MEP y no en regulación.",
   lectura_cr_en="This is comparable to Costa Rica's approach, which also relies on MEP guidance rather than regulation."),
 "S16-05": dict(es="Según una persona líder de una organización juvenil, los jóvenes no hablan con los adultos sobre el impacto de la IA en sus relaciones y pueden percibir juicio y vergüenza de parte de ellos.",
   en="According to a youth organisation leader, young people do not talk to adults about AI's relational impact and may sense adult judgement and shame."),
 "S20-02": dict(theme="Competencias"),
 "S14-01": dict(strength="orientacion", caveat="La guía recuerda una obligación legal vigente (Ley 8968, ver S21); no desarrolla el régimen específico para personas menores de edad.",
   caveat_en="The guide restates a legal obligation in force (Law 8968, see S21); it does not develop the specific regime for minors."),
 "S20-03": dict(es="Los más pequeños mencionan más el apoyo de sus padres y les cuentan más lo que hacen en línea.",
   en="Younger children mention parental support more and tell their parents more about what they do online.",
   lectura_cr="Sugiere que entre los 9 y los 12 años la mediación familiar tiene más llegada (coincide con Kids Online Costa Rica, S25-01).",
   lectura_cr_en="Suggests family mediation reaches children most at ages 9–12 (consistent with Kids Online Costa Rica, S25-01)."),
 "S20-06": dict(es="El maltrato en línea proviene sobre todo de amigos (45 %) y compañeros de clase (29 %), más que de desconocidos o adultos.",
   en="Online mistreatment comes mostly from friends (45%) and classmates (29%) rather than strangers or adults.",
   lectura_cr="La convivencia escolar es parte de la prevención; en Costa Rica, el 71,6 % de las víctimas señala a estudiantes de su propio centro (S25-11).",
   lectura_cr_en="School climate is part of prevention; in Costa Rica, 71.6% of victims point to students at their own school (S25-11)."),
 "S21-01": dict(es="Quien recopile datos personales debe obtener el consentimiento expreso y por escrito de la persona titular o de su representante.",
   en="Anyone collecting personal data must obtain the express written consent of the data subject or their representative.",
   lectura_cr="En estudiantes menores de edad, el consentimiento lo da quien ejerce su representación legal; aplica al registrarlos en plataformas de IA.",
   lectura_cr_en="For minor students, consent is given by whoever holds legal representation; this applies when registering them on AI platforms."),
 "S21-02": dict(es="Antes de pedir datos personales hay que informar de forma expresa, precisa e inequívoca sobre la base de datos, sus fines, sus destinatarios y los derechos de la persona.",
   en="Before requesting personal data, people must be told expressly, precisely and unambiguously about the database, its purposes, its recipients and their rights.",
   lectura_cr="Incluye registrar estudiantes en una plataforma de IA: la escuela debe informar a las familias antes.",
   lectura_cr_en="This includes registering students on an AI platform: the school must inform families beforehand."),
 "S21-04": dict(es="Toda persona tiene derecho a acceder a sus datos, a rectificarlos o suprimirlos y a consentir su cesión; el responsable debe responder gratis en cinco días hábiles.",
   en="Everyone has the right to access, correct or delete their data and to consent to its transfer; the controller must respond free of charge within five working days.",
   lectura_cr="Madres, padres y encargados pueden ejercer estos derechos en representación de sus hijos frente a la escuela o la plataforma.",
   lectura_cr_en="Parents and guardians can exercise these rights on behalf of their children with the school or the platform."),
 "S23-04": dict(es="La definición legal de material pornográfico infantil incluye la imagen o la voz de una persona menor de edad «alteradas o modificadas» en actividades sexuales «reales o simuladas»; producirlo o divulgarlo se castiga con 5 a 9 años de prisión.",
   en="The legal definition of child sexual abuse material includes a minor's image or voice 'altered or modified' in 'real or simulated' sexual activity; producing or disseminating it carries 5–9 years in prison.",
   lectura_cr="Es la base para tratar los deepfakes sexuales de menores como delito; su aplicación a contenido íntegramente sintético carece de jurisprudencia verificada.",
   lectura_cr_en="This is the basis for treating sexual deepfakes of minors as a crime; its application to fully synthetic content lacks verified case law."),
 "S25-02": dict(es="Las personas cuidadoras costarricenses se interesan por la crianza digital, pero muchas no tienen las habilidades o conocimientos para promover usos beneficiosos o prevenir situaciones de violencia y riesgo.",
   en="Costa Rican caregivers are interested in digital parenting, but many lack the skills or knowledge to promote beneficial use or prevent violence and risk.",
   lectura_cr="El mismo informe reporta habilidades digitales similares entre cuidadores y NNA (pp. 24 y 40): la formación de las familias es condición para mediar.",
   lectura_cr_en="The same report finds similar digital skills among caregivers and children (pp. 24 and 40): training families is a precondition for mediation."),
 "S25-04": dict(es="El uso problemático del celular de los adultos se asocia con el de niñas, niños y adolescentes (r = 0,28).",
   en="Adults' problematic phone use is associated with that of children and adolescents (r = 0.28).",
   lectura_cr="El ejemplo de casa cuenta: revisar el propio uso es parte de la mediación.", lectura_cr_en="The example at home matters: reviewing one's own use is part of mediation."),
 "S26-01": dict(es="La ley costarricense considera niña o niño a toda persona hasta los 12 años cumplidos y adolescente a quien tiene más de 12 y menos de 18.",
   en="Costa Rican law considers a child anyone up to age 12 and an adolescent anyone over 12 and under 18.",
   lectura_cr="Las bandas del sitio (D1) agrupan los 12 años con III ciclo por criterio escolar; legalmente siguen siendo niñez hasta cumplirlos.",
   lectura_cr_en="The site's bands (D1) group age 12 with the 3rd cycle on school grounds; legally they remain children until their 12th birthday."),
 "S26-02": dict(es="Toda acción pública o privada que concierna a una persona menor de 18 años debe considerar su interés superior.",
   en="Every public or private action concerning a person under 18 must consider their best interests.",
   lectura_cr="Incluye decidir la adopción de herramientas de IA en la escuela o en casa.", lectura_cr_en="This includes deciding whether to adopt AI tools at school or at home."),
 "S26-03": dict(es="El interés superior se determina considerando, entre otros factores, la edad, el grado de madurez y la capacidad de discernimiento de cada niña, niño o adolescente.",
   en="Best interests are determined by considering, among other factors, each child's age, maturity and discernment.",
   lectura_cr="Base legal para adecuar el uso de IA a la etapa de desarrollo y no solo a la edad cronológica, ya que ninguna norma CR fija edades mínimas para IA.",
   lectura_cr_en="Legal basis for matching AI use to developmental stage, not only chronological age, since no Costa Rican rule sets minimum ages for AI."),
 "S26-05": dict(es="Niñas, niños y adolescentes tienen derecho a obtener información por cualquier fuente y medio, ejercido de forma responsable y con la orientación de padres, representantes o educadores.",
   en="Children and adolescents have the right to obtain information from any source and medium, exercised responsibly and with guidance from parents, representatives or educators.",
   lectura_cr="La ley respalda acompañar el acceso a la información, no solo prohibirlo.", lectura_cr_en="The law supports accompanying access to information, not only prohibiting it."),
 "S26-06": dict(es="Las personas menores de edad tienen derecho a no sufrir injerencias en su vida privada, familia, domicilio y correspondencia, sin perjuicio de los derechos y deberes de la patria potestad.",
   en="Minors have the right not to suffer interference in their private life, family, home and correspondence, without prejudice to parental rights and duties.",
   lectura_cr="En el entorno digital sugiere una supervisión parental de dispositivos proporcional, que respete su privacidad.",
   lectura_cr_en="Online, this suggests proportionate parental supervision of devices that respects their privacy."),
 "S26-07": dict(es="Está prohibido publicar el nombre o cualquier dato personal que identifique a una persona menor de edad autora o víctima de un hecho delictivo, salvo autorización judicial.",
   en="Publishing the name or any personal data identifying a minor who is the perpetrator or victim of a crime is prohibited, save judicial authorisation.",
   lectura_cr="Implica no difundir ni reenviar imágenes, deepfakes o datos de una niña, niño o adolescente que sufre una agresión.",
   lectura_cr_en="This means not sharing or forwarding images, deepfakes or data of a child who suffers an attack."),
 "S26-08": dict(es="Las autoridades y el personal de los centros educativos están obligados a denunciar ante el Ministerio Público cualquier sospecha razonable de maltrato o abuso contra una persona menor de edad.",
   en="School authorities and staff are obliged to report to the Public Prosecutor any reasonable suspicion of mistreatment or abuse of a minor.",
   lectura_cr="Por interpretación, alcanza también la violencia ejercida por medios digitales.", lectura_cr_en="By interpretation, this also covers violence through digital means."),
 "S26-09": dict(es="En el diseño de las políticas educativas, el Estado debe estimular en todos los niveles el desarrollo del pensamiento autónomo, crítico y creativo.",
   en="In designing education policy, the State must foster autonomous, critical and creative thinking at all levels.",
   lectura_cr="Base legal para que la IA en el aula no sustituya el razonamiento del estudiantado.", lectura_cr_en="Legal basis for ensuring classroom AI does not replace students' reasoning."),
}
done = set()
for f in sorted((R/"data/ingest").glob("*_items.json")):
    L = json.loads(f.read_text(encoding="utf-8")); ch = 0
    for x in L:
        if x["id"] in FIX:
            x.update(FIX[x["id"]]); done.add(x["id"]); ch += 1
    if ch: f.write_text(json.dumps(L, ensure_ascii=False, indent=1), encoding="utf-8")
miss = set(FIX) - done
# S04-42 está en el lote e2d; los ítems v0.5 no tienen lote: se corrigen en items.json directamente
items_p = R/"data/items.json"; items = json.loads(items_p.read_text(encoding="utf-8"))
for x in items:
    if x["id"] in miss: x.update(FIX[x["id"]]); done.add(x["id"])
items_p.write_text(json.dumps(items, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"corregidos {len(done)}/{len(FIX)}; sin encontrar: {sorted(set(FIX)-done)}")
