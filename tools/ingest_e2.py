#!/usr/bin/env python3
"""Integra lotes de ingreso (data/ingest/<lote>_items.json, <lote>_catalog.json) en los JSON
canónicos de forma idempotente: reemplaza por id si ya existen, añade si no. Luego ejecutar
tools/build_data.py. Uso: python3 tools/ingest_e2.py e2a"""
import json, sys, pathlib
R = pathlib.Path(__file__).resolve().parent.parent; D = R / "data"; lot = sys.argv[1]
items = json.loads((D/"items.json").read_text(encoding="utf-8"))
cat = json.loads((D/"catalog.json").read_text(encoding="utf-8"))
ni = json.loads((D/"ingest"/f"{lot}_items.json").read_text(encoding="utf-8"))
nc = json.loads((D/"ingest"/f"{lot}_catalog.json").read_text(encoding="utf-8"))
def merge(base, new):
    idx = {x["id"]: k for k, x in enumerate(base)}; a = r = 0
    for x in new:
        if x["id"] in idx: base[idx[x["id"]]] = x; r += 1
        else: base.append(x); a += 1
    return a, r
a1, r1 = merge(cat["fuentes"], nc); a2, r2 = merge(items, ni)
srcs = {c["id"] for c in cat["fuentes"]}
assert all(i["source"] in srcs for i in items), "ítem con fuente desconocida"
bad = [i["id"] for i in items if "6-11" in (i.get("ages") or [])]
if bad: print(f"AVISO: {len(bad)} ítems con la banda antigua 6-11; ejecute tools/rebands_d1.py")
(D/"catalog.json").write_text(json.dumps(cat, ensure_ascii=False, indent=1), encoding="utf-8")
(D/"items.json").write_text(json.dumps(items, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"{lot}: fuentes +{a1} ~{r1} (total {len(cat['fuentes'])}); ítems +{a2} ~{r2} (total {len(items)})")
