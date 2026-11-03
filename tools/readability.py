#!/usr/bin/env python3
"""Legibilidad Fernández-Huerta (L = 206,84 − 0,60·P − 1,02·F; P = sílabas/100 palabras,
F = frases/100 palabras) de texto_es y por_que_es en data/tips.json. Criterio E3: ≥ 70 (Familia).
Silabeo heurístico (núcleos vocálicos con diptongos de vocal débil átona); error típico ±3 puntos."""
import json, re, sys, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
def syl(w):
    w = w.lower(); w = re.sub(r"(?<=[aeiouáéíóú])y$", "i", w); w = re.sub(r"^y(?=[aeiou])", "j", w)
    w = re.sub(r"qu(?=[ei])|gu(?=[ei])", "q", w)
    return max(1, len(re.findall(r"[iuü]?[aeoáéíóú][iuy]?|[iuü][iu]?", w)))
def fh(t):
    words = re.findall(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+", t); n = len(words) or 1
    frases = max(1, len(re.findall(r"[.!?:;]+(\s|$)", t)))
    return 206.84 - 0.60*100*sum(map(syl, words))/n - 1.02*100*frases/n
tips = json.loads((R/"data/tips.json").read_text(encoding="utf-8"))["tips"]
bad = 0
for t in tips:
    a, b = fh(t["texto_es"]), fh(t["por_que_es"]); tot = fh(t["texto_es"]+" "+t["por_que_es"])
    flag = "" if tot >= 70 else "  <-- < 70"; bad += tot < 70
    print(f"{t['id']}  acción {a:5.1f}  por qué {b:5.1f}  conjunto {tot:5.1f}{flag}")
print(f"\nMedia conjunto: {sum(fh(t['texto_es']+' '+t['por_que_es']) for t in tips)/len(tips):.1f} · bajo 70: {bad}/{len(tips)}")

# E5.2: textos de interfaz en lenguaje sencillo (i18n.e5.js, claves hero.*, rg.sub, mean.*, acc.*, esx.*)
if "--ui" in sys.argv:
    import subprocess
    js = "global.window={COA_I18N:{es:{},en:{}}};['i18n','i18n.nav','i18n.plan','i18n.prov','i18n.e5','i18n.e53','i18n.e56'].forEach(f=>eval(require('fs').readFileSync('assets/js/'+f+'.js','utf8')));console.log(JSON.stringify(window.COA_I18N.es))"
    es = json.loads(subprocess.run(["node", "-e", js], cwd=R, capture_output=True, text=True).stdout)
    ks = [k for k in es if k.split(".")[0] in ("hero", "rg", "mean", "acc", "esx", "esl", "hg", "nx", "ay", "oca", "f3", "how") and k != "mean.lbl"]
    # Fernández-Huerta no es interpretable en títulos de < 8 palabras (auditoría E5, 3 nov 2026): se listan aparte
    corto = [k for k in ks if len(re.findall(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+", es[k])) < 8]
    for k in corto: print(f"UI {k:16s}   n/a (título de {len(es[k].split())} palabras; no aplica la fórmula)")
    ks = [k for k in ks if k not in corto]
    low = 0
    for k in ks:
        v = fh(es[k]); low += v < 70; print(f"UI {k:16s} {v:5.1f}" + ("  <-- < 70" if v < 70 else ""))
    print(f"UI media: {sum(fh(es[k]) for k in ks)/len(ks):.1f} · bajo 70: {low}/{len(ks)}")

# E5.3: bloque «Cómo hacerlo» (pasos) · criterio: bloque por tip ≥ 70 y cada campo ≥ 60
if "--pasos" in sys.argv:
    pb = pf = 0; ps = [x for x in tips if x.get("pasos")]
    for x in ps:
        blk = fh(" ".join(v["es"] for v in x["pasos"].values())); pb += blk < 70
        lowf = [k for k, v in x["pasos"].items() if fh(v["es"]) < 60]; pf += len(lowf)
        print(f"PASOS {x['id']}  bloque {blk:5.1f}" + (f"  campos < 60: {lowf}" if lowf else "") + ("  <-- < 70" if blk < 70 else ""))
    print(f"PASOS media: {sum(fh(' '.join(v['es'] for v in x['pasos'].values())) for x in ps)/len(ps):.1f} · bloques < 70: {pb}/{len(ps)} · campos < 60: {pf}")
    bad += pb

sys.exit(1 if bad and "--strict" in sys.argv else 0)
