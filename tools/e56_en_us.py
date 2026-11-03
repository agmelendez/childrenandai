#!/usr/bin/env python3
"""E5.6 · H8: grafía en-US en los campos EN (no toca 'quote', que es cita textual de la fuente). Idempotente."""
import json, re, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
M = {"counsellor":"counselor","counsellors":"counselors","counselling":"counseling","neighbourhood":"neighborhood","neighbourhoods":"neighborhoods",
"organise":"organize","organises":"organizes","organised":"organized","organising":"organizing","organisation":"organization","organisations":"organizations",
"recognise":"recognize","recognises":"recognizes","recognised":"recognized","colour":"color","colours":"colors","behaviour":"behavior","behaviours":"behaviors",
"programme":"program","programmes":"programs","centre":"center","centres":"centers","favour":"favor","favourite":"favorite","practise":"practice","analyse":"analyze",
"analysed":"analyzed","judgement":"judgment","enrol":"enroll","licence":"license","prioritise":"prioritize","minimise":"minimize","personalised":"personalized",
"summarise":"summarize","apologise":"apologize","emphasise":"emphasize","realise":"realize","harmonised":"harmonized","authorised":"authorized","catalogue":"catalog",
"labelled":"labeled","labelling":"labeling","modelling":"modeling","travelled":"traveled","cancelled":"canceled","defence":"defense","offence":"offense","fulfil":"fulfill",
"specialised":"specialized","optimise":"optimize","utilise":"utilize","categorise":"categorize","standardised":"standardized","customise":"customize","jewellery":"jewelry","centred":"centered","behavioural":"behavioral","organisational":"organizational","offences":"offenses","licences":"licenses"}
rx = re.compile(r"\b(" + "|".join(sorted(M, key=len, reverse=True)) + r")\b", re.I)
KEEP = ["Open Parliament Licence","Open Government Licence","Organisation for Economic Co-operation and Development"]
def fix(s):
    if any(k in s for k in KEEP): return s
    return rx.sub(lambda m: (lambda r: r.capitalize() if m.group(0)[0].isupper() else r)(M[m.group(0).lower()]), s)
n = 0
def walk(o, key=""):
    global n
    if isinstance(o, dict):
        return {k: (fix(v) if isinstance(v, str) and (k == "en" or k.endswith("_en")) else walk(v, k)) for k, v in o.items()}
    if isinstance(o, list): return [walk(v, key) for v in o]
    return o
for f in ["tips","items","glossary","transfer","modules","context_cr","context_sources","alertas_oca","ayuda","catalog","figure_sources"]:
    p = R/f"data/{f}.json"; t = p.read_text(encoding="utf-8"); d = json.loads(t); d2 = walk(d)
    if d2 != d:
        ind = 1 if t.startswith("{\n \"") else (2 if t.startswith("{\n  ") else None)
        p.write_text(json.dumps(d2, ensure_ascii=False, indent=ind) + ("\n" if t.endswith("\n") else ""), encoding="utf-8"); print("json", f)
# JS: solo dentro de los bloques EN
for p in sorted((R/"assets/js").glob("i18n*.js")):
    s = p.read_text(encoding="utf-8")
    parts = re.split(r"(Object\.assign\(window\.COA_I18N\.(?:es|en)[^,]*,)", s)
    out = []; en = False
    for x in parts:
        if x.startswith("Object.assign(window.COA_I18N."): en = ".en" in x[:35]; out.append(x)
        else: out.append(fix(x) if en else x)
    s2 = "".join(out)
    if s2 != s: p.write_text(s2, encoding="utf-8"); print("js", p.name)
# generadores: líneas con "en":
for g in ("e5_pasos.py","e5_pasos_1218.py"):
    p = R/"tools"/g; s = p.read_text(encoding="utf-8"); s2 = fix(s)
    if s2 != s: p.write_text(s2, encoding="utf-8"); print("py", g)
