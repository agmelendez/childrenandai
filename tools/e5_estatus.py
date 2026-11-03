#!/usr/bin/env python3
"""E5.1 · Taxonomía de estatus normativo (comentarios 3 nov 2026: Perfil y Glosario).
Asigna a cada ítem y tip el campo `estatus` y a las normas del glosario `aplica_cr`.
Reglas documentadas en docs/E5.1_ESTATUS.md. Idempotente.
Uso: python3 tools/e5_estatus.py [--report]"""
import json, pathlib, collections, sys
R = pathlib.Path(__file__).resolve().parent.parent; D = R / "data"
load = lambda f: json.loads((D/f).read_text(encoding="utf-8"))
dump = lambda f, o: (D/f).write_text(json.dumps(o, ensure_ascii=False, indent=2 if f == "tips.json" else 1) + "\n", encoding="utf-8")
ESTATUS = ["ley_cr", "directriz_mep", "recomendacion", "ley_extranjera", "propuesta", "dato"]
PRESCR = {"recomendacion", "obligacion", "competencia"}   # tipos de ítem que indican qué hacer
LEY_CR, MEP, EXTR, PROP = {"S21", "S22", "S23", "S26"}, {"S14"}, {"S07", "S15"}, {"S08"}
OVR_ITEMS = {"S14-01": "ley_cr", "S13-26": "ley_extranjera", "S13-27": "ley_extranjera"}
# Auditoría E5.1 (3 nov): hallazgos/definiciones que describen una norma o política concreta de otro país (revisión manual)
for _id in ["S10-05", "S04-24", "S04-28", "S04-31", "S04-33", "S13-13", "S13-14", "S13-18", "S13-19", "S13-20", "S13-21",
            "S13-22", "S13-23", "S13-24", "S13-25", "S13-28", "S13-29", "S13-30",
            "S04-12", "S04-13", "S04-21", "S04-26", "S04-32", "S05-03"]: OVR_ITEMS[_id] = "ley_extranjera"
OVR_ITEMS["S13-15"] = "ley_cr"  # CDN: tratado ratificado por Costa Rica
# Tips que afirman una obligación o un delito previstos en la ley costarricense (revisión manual)
TIP_LEY = {"T-FAM-014", "T-FAM-020", "T-FAM-030", "T-FAM-031", "T-TRV-004", "T-DOC-019", "T-DOC-020", "T-DIR-008"}

def item_status(i):
    if i["id"] in OVR_ITEMS: return OVR_ITEMS[i["id"]]
    s = i["source"]
    # Fuentes normativas: todo su contenido hereda la fuerza de la fuente (auditoría E5.1)
    if s in LEY_CR: return "ley_cr"
    if s in PROP: return "propuesta"
    if s in EXTR: return "ley_extranjera"
    if i["kind"] not in PRESCR: return "dato"
    if s in MEP: return "directriz_mep"
    return "recomendacion"

def tip_status(t):
    a = (t.get("ancla_cr") or {}).get("tipo")
    if t["id"] in TIP_LEY: return "ley_cr"
    if a == "lineamiento_mep" and set(t["publico"]) <= {"Docente", "Dirección"}: return "directriz_mep"
    return "recomendacion"

GL = {  # aplica_cr: si | no | referencia ; nota en lenguaje sencillo
 "COPPA": ("no", "Ley de Estados Unidos. No aplica en Costa Rica; aquí rige la Ley 8968.", "US law. It does not apply in Costa Rica; Law 8968 applies here."),
 "RGPD": ("no", "Norma de la Unión Europea. No aplica en Costa Rica; aquí rige la Ley 8968.", "European Union rule. It does not apply in Costa Rica; Law 8968 applies here."),
 "GDPR": ("no", "Es el RGPD en inglés. No aplica en Costa Rica.", "Same as RGPD. It does not apply in Costa Rica."),
 "CDN": ("si", "Costa Rica ratificó esta convención; se aplica junto con el Código de la Niñez (Ley 7739).", "Costa Rica ratified this convention; it applies together with the Children's Code (Law 7739)."),
 "DSA": ("no", "Norma de la Unión Europea. No aplica en Costa Rica.", "European Union rule. It does not apply in Costa Rica."),
 "Ley de IA": ("no", "Norma de la Unión Europea. Costa Rica no tiene una ley de IA; tiene una Estrategia Nacional (2024–2027), que no es ley.", "European Union rule. Costa Rica has no AI law; it has a National Strategy (2024–2027), which is not a law."),
 "AADC": ("no", "Código del Reino Unido. No aplica en Costa Rica.", "UK code. It does not apply in Costa Rica."),
 "KCSIE": ("no", "Guía obligatoria solo en Inglaterra. En Costa Rica sirve como ejemplo.", "Mandatory only in England. In Costa Rica it is an example."),
 "DSL": ("no", "Figura de las escuelas inglesas. En Costa Rica no existe con ese nombre.", "A role in English schools. It does not exist under that name in Costa Rica."),
 "RSHE": ("no", "Programa del currículo de Inglaterra. No aplica en Costa Rica.", "Part of England's curriculum. It does not apply in Costa Rica."),
 "KVKK": ("no", "Ley de Türkiye. No aplica en Costa Rica.", "Türkiye's law. It does not apply in Costa Rica."),
 "COM": ("no", "Número de una propuesta europea: todavía no es ley, ni siquiera en Europa.", "Number of a European proposal: it is not yet law, not even in Europe."),
}
NUEVAS = [  # normas e instituciones de Costa Rica que faltaban en el glosario
 {"k":"Ley 8968","k_en":"Law 8968","abbr":False,"cat":"Normas y marcos","cat_en":"Laws and frameworks","long":"Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales (2011)","long_en":"Law on the Protection of Persons regarding the Processing of their Personal Data (2011)","def":"Ley de Costa Rica sobre datos personales. Exige pedir permiso antes de recoger datos y permite pedir que se corrijan o borren.","def_en":"Costa Rican personal data law. It requires consent before collecting data and lets people ask for corrections or deletion.","src":"c:S21","aplica_cr":"si"},
 {"k":"Ley 7739","k_en":"Law 7739","abbr":False,"cat":"Normas y marcos","cat_en":"Laws and frameworks","long":"Código de la Niñez y la Adolescencia (1998)","long_en":"Code on Childhood and Adolescence (1998)","def":"Ley de Costa Rica con los derechos de las personas menores de 18 años, entre ellos el interés superior y la privacidad.","def_en":"Costa Rican law on the rights of people under 18, including their best interests and privacy.","src":"c:S26","aplica_cr":"si"},
 {"k":"Ley 10020","k_en":"Law 10020","abbr":False,"cat":"Normas y marcos","cat_en":"Laws and frameworks","long":"Ley para la Prevención del Acoso a Personas Menores de Edad por Medios Electrónicos o Virtuales (2021)","long_en":"Law on the Prevention of Online Harassment of Minors (2021)","def":"Ley de Costa Rica contra el acoso sexual en línea a menores (grooming). Castiga también imágenes alteradas, como las hechas con IA.","def_en":"Costa Rican law against online sexual grooming of minors. It also covers altered images, such as those made with AI.","src":"c:S23","aplica_cr":"si"},
 {"k":"Guía MEP de IA","k_en":"MEP AI guide","abbr":False,"cat":"Normas y marcos","cat_en":"Laws and frameworks","long":"Inteligencia artificial en clase: guía para docentes (MEP, UNESCO y ULACIT, 2026)","long_en":"Artificial intelligence in class: teacher guide (MEP, UNESCO and ULACIT, 2026)","def":"Lineamiento oficial del Ministerio de Educación Pública para usar la IA en las aulas de Costa Rica.","def_en":"Official guidance from Costa Rica's Ministry of Public Education on using AI in classrooms.","src":"c:S14","aplica_cr":"si","aplica_estatus":"directriz_mep"},
 {"k":"MEP","k_en":"MEP","abbr":True,"cat":"Instituciones y organismos","cat_en":"Institutions and bodies","long":"Ministerio de Educación Pública de Costa Rica","long_en":"Costa Rica's Ministry of Public Education","def":"Dirige la educación pública y define los ciclos escolares que usa este sitio.","def_en":"It runs public education and defines the school cycles this site uses.","src":"g"},
 {"k":"PANI","k_en":"PANI","abbr":True,"cat":"Instituciones y organismos","cat_en":"Institutions and bodies","long":"Patronato Nacional de la Infancia","long_en":"National Child Welfare Agency (Costa Rica)","def":"Institución de Costa Rica que protege a niñas, niños y adolescentes. Recibe denuncias cuando sus derechos están en riesgo.","def_en":"Costa Rican agency that protects children and adolescents. It receives reports when their rights are at risk.","src":"g"},
 {"k":"OIJ","k_en":"OIJ","abbr":True,"cat":"Instituciones y organismos","cat_en":"Institutions and bodies","long":"Organismo de Investigación Judicial","long_en":"Judicial Investigation Agency (Costa Rica)","def":"Policía judicial de Costa Rica. Se acude a él cuando hay un posible delito, como el acoso sexual en línea.","def_en":"Costa Rica's judicial police. Go to it when there may be a crime, such as online sexual harassment.","src":"g"},
 {"k":"PRODHAB","k_en":"PRODHAB","abbr":True,"cat":"Instituciones y organismos","cat_en":"Institutions and bodies","long":"Agencia de Protección de Datos de los Habitantes","long_en":"Data Protection Agency (Costa Rica)","def":"Institución que vigila el cumplimiento de la Ley 8968 sobre datos personales.","def_en":"The agency that oversees compliance with Law 8968 on personal data.","src":"c:S21"},
]

def main():
    it = load("items.json")
    for i in it: i["estatus"] = item_status(i)
    dump("items.json", it)
    tp = load("tips.json")
    for t in tp["tips"]: t["estatus"] = tip_status(t)
    dump("tips.json", tp)
    gl = load("glossary.json"); have = {g["k"] for g in gl}
    for g in gl:
        if g["k"] in GL: g["aplica_cr"], g["nota_cr"], g["nota_cr_en"] = GL[g["k"]]
    for n in NUEVAS:
        if n["k"] not in have: gl.append(n)
    dump("glossary.json", gl)
    if "--report" in sys.argv:
        print("ítems:", collections.Counter(i["estatus"] for i in it))
        print("tips:", collections.Counter(t["estatus"] for t in tp["tips"]))
        print("glosario: aplica_cr", collections.Counter(g.get("aplica_cr") for g in gl if g["cat"]=="Normas y marcos"), "· total", len(gl))
main()
