#!/usr/bin/env python3
"""Genera data/data.js a partir de los JSON canónicos (items, catalog, glossary).
data.js permite abrir index.html con doble clic (file://) sin servidor.
Uso: python3 tools/build_data.py"""
import json, pathlib, sys
root = pathlib.Path(__file__).resolve().parent.parent
d = root / "data"
parts = {}
for k, f in (("items", "items.json"), ("catalog", "catalog.json"), ("glossary", "glossary.json"), ("figsrc", "figure_sources.json")):
    parts[k] = json.loads((d / f).read_text(encoding="utf-8"))
for k, f in (("tips", "tips.json"), ("transfer", "transfer.json"), ("modules", "modules.json"), ("ctx", "context_cr.json"), ("ctxsrc", "context_sources.json")):  # E3 (v0.8), E4 (v0.9)
    if (d / f).exists():
        parts[k] = {x: v for x, v in json.loads((d / f).read_text(encoding="utf-8")).items() if not x.startswith("_")}
# comprobaciones mínimas de integridad
ids = [i["id"] for i in parts["items"]]
assert len(ids) == len(set(ids)), "ids de ítems duplicados"
srcs = {s["id"] for s in parts["catalog"]["fuentes"]}
bad = [i["id"] for i in parts["items"] if i["source"] not in srcs]
assert not bad, f"ítems con fuente desconocida: {bad}"
miss = [i["id"] for i in parts["items"] if not i.get("en")]
if miss:
    print(f"AVISO: {len(miss)} ítems sin traducción al inglés", file=sys.stderr)
js = "/* Archivo generado por tools/build_data.py. No editar a mano: edite data/*.json y vuelva a generar. */\nwindow.COA_DATA=" + json.dumps(parts, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/") + ";\n"
(d / "data.js").write_text(js, encoding="utf-8")
print(f"data/data.js escrito: {len(ids)} ítems, {len(parts.get('tips',{}).get('tips',[]))} tips, {len(srcs)} fuentes, {len(parts['glossary'])} entradas de glosario, {len(js)//1024} KB")
