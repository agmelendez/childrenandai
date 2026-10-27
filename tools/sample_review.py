#!/usr/bin/env python3
"""Muestra aleatoria estratificada por fuente de los ítems ingresados en v0.7 para revisión humana/IA.
Tamaño por fuente: ceil(35 % de sus ítems), mínimo 1. Semilla fija para reproducibilidad.
Uso: python3 tools/sample_review.py > docs/muestra_revision_v0.7.json"""
import json, math, random, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
items = json.loads((R/"data/items.json").read_text(encoding="utf-8"))
new = [i for i in items if i["source"] >= "S14" or (i["source"] == "S04" and int(i["id"].split("-")[1]) >= 41)]
rng = random.Random(20261026); out = []
for s in sorted({i["source"] for i in new}):
    pool = sorted([i for i in new if i["source"] == s], key=lambda x: x["id"])
    out += rng.sample(pool, max(1, math.ceil(len(pool) * 0.35)))
print(json.dumps([{k: i[k] for k in ("id", "source", "page", "quote", "es", "en", "kind", "ages", "audiences", "theme", "strength", "caveat")} for i in out], ensure_ascii=False, indent=1))
