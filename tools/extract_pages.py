#!/usr/bin/env python3
"""Extracción ligera por página, compatible con el pages.jsonl del pipeline V5.2
(campos document_id, filename, page_number, clean_text). Usa pdftotext (poppler).
Uso: python3 -I tools/extract_pages.py SALIDA.jsonl PDF [PDF...]"""
import sys, json, hashlib, subprocess, pathlib, unicodedata
out = open(sys.argv[1], "w", encoding="utf-8")
for p in map(pathlib.Path, sys.argv[2:]):
    sha = hashlib.sha256(p.read_bytes()).hexdigest()
    n = int([l for l in subprocess.run(["pdfinfo", str(p)], capture_output=True, text=True).stdout.splitlines() if l.startswith("Pages:")][0].split()[1])
    empty = 0
    for k in range(1, n + 1):
        t = subprocess.run(["pdftotext", "-f", str(k), "-l", str(k), "-enc", "UTF-8", str(p), "-"], capture_output=True, text=True).stdout
        t = unicodedata.normalize("NFC", t).replace("\f", "").strip()
        empty += len(t) < 40
        out.write(json.dumps({"document_id": "doc_" + sha[:16], "filename": p.name, "sha256": sha, "page_number": k, "clean_text": t, "extractor": "pdftotext"}, ensure_ascii=False) + "\n")
    print(f"{p.name}: {n} pp., {empty} pp. casi vacías, sha256 {sha[:12]}")
