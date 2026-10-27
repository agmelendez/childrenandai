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
sys.exit(1 if bad and "--strict" in sys.argv else 0)
