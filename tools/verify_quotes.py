#!/usr/bin/env python3
"""Comprueba que la cita de cada ítem es subcadena exacta de la página PDF indicada.
Requiere el pages.jsonl del pipeline CIOdD-UCR (una línea JSON por página, con
`clean_text`, `page_number` y el nombre del archivo o `document_id`).
Uso: python3 -I tools/verify_quotes.py RUTA/pages.jsonl [data/items.json]
Los campos del JSONL se detectan automáticamente; ajuste FILE_KEYS si su pipeline usa otros nombres."""
import json, sys, unicodedata, pathlib, re
FILE_KEYS = ("file", "filename", "source_file", "pdf", "path")
def norm(s): return re.sub(r"\s+", " ", unicodedata.normalize("NFC", s)).strip()
if len(sys.argv) < 2: sys.exit(__doc__)
root = pathlib.Path(__file__).resolve().parent.parent
items = json.loads(pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else root / "data/items.json").read_text(encoding="utf-8"))
cat = json.loads((root / "data/catalog.json").read_text(encoding="utf-8"))["fuentes"]
by_file = {norm(c["file"]): c["id"] for c in cat}; by_doc = {c.get("document_id"): c["id"] for c in cat}
pages = {}
for line in open(sys.argv[1], encoding="utf-8"):
    r = json.loads(line)
    sid = by_doc.get(r.get("document_id"))
    if not sid:
        for k in FILE_KEYS:
            if r.get(k): sid = by_file.get(norm(pathlib.Path(r[k]).name)); break
    if sid: pages[(sid, int(r["page_number"]))] = norm(r.get("clean_text", ""))
bad = 0
for i in items:
    t = pages.get((i["source"], i["page"]))
    if t is None: print(f"{i['id']}: página {i['page']} no encontrada en el JSONL"); bad += 1
    elif norm(i["quote"]) not in t: print(f"{i['id']}: la cita NO es subcadena exacta de la página {i['page']}"); bad += 1
print(f"{len(items)-bad}/{len(items)} citas verificadas" + ("" if not bad else f"; {bad} con problemas"))
sys.exit(1 if bad else 0)
