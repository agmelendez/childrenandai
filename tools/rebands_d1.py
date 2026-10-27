#!/usr/bin/env python3
"""E2.4 · Reetiquetado a las bandas D1 (6-8 / 9-11 / 12-14 / 15-18), idempotente.
Regla: 12-14 y 15-18 se conservan. El tramo antiguo 6-11 se divide según la edad que declara
la fuente (campo age_note, en español):
  1. Se ignoran rangos de grados escolares («grados 9–12»).
  2. Se leen rangos de edad «a–b», edades sueltas «N años» y umbrales «menores de N» (→ 6..N-1).
  3. Se toma el intervalo [mín, máx] y se asignan las bandas 6-8 y/o 9-11 que lo intersecan.
  4. Sin edades numéricas → ambas bandas (la fuente se refiere a la niñez en general).
  5. Si el intervalo no toca 6-11 (p. ej., «13–17»), se asigna 9-11 y se marca para revisión.
Salida: data/items.json actualizado y docs/REETIQUETADO_D1.csv con la decisión por ítem (no sobrescribir: renombrar antes de una nueva corrida).
Uso: python3 tools/rebands_d1.py"""
import json, re, csv, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
P = R / "data/items.json"; items = json.loads(P.read_text(encoding="utf-8"))
ORDER = ["6-8", "9-11", "12-14", "15-18"]
def span(note):
    s = re.sub(r"grados?\s+\d{1,2}\s*[–-]\s*\d{1,2}", " ", note or "", flags=re.I)
    pts = []
    for a, b in re.findall(r"(?<!\d)(\d{1,2})\s*[–-]\s*(\d{1,2})(?!\d)", s): pts += [int(a), int(b)]
    for n in re.findall(r"(?:menores de|under|<)\s*(?:\d{1,2}\s*[–-]\s*)?(\d{1,2})", s, flags=re.I): pts += [6, int(n) - 1]
    for n in re.findall(r"(?<![\d–-])(\d{1,2}) años", s): pts.append(int(n))
    pts = [p for p in pts if 3 <= p <= 25]
    return (min(pts), max(pts)) if pts else None
rows = []; changed = 0
for i in items:
    old = list(i.get("ages") or [])
    if "6-11" not in old:
        new = [a for a in ORDER if a in old]; rule = "sin cambio" if new == old else "orden"
    else:
        sp = span(i.get("age_note", "")); rest = [a for a in old if a != "6-11"]
        if sp is None: low = ["6-8", "9-11"]; rule = "sin edad numérica → 6-8 y 9-11"
        else:
            lo, hi = sp; low = [b for b, (x, y) in (("6-8", (6, 8)), ("9-11", (9, 11))) if lo <= y and hi >= x]
            rule = f"intervalo {lo}–{hi} → {', '.join(low) or '—'}"
            if not low: low = ["9-11"]; rule += " · REVISAR: fuera de 6–11, se asigna 9-11"
        new = [a for a in ORDER if a in low + rest]
    if new != old: changed += 1
    i["ages"] = new
    rows.append([i["id"], "|".join(old), "|".join(new), rule, i.get("age_note", "")])
P.write_text(json.dumps(items, ensure_ascii=False, indent=1), encoding="utf-8")
with open(R / "docs/REETIQUETADO_D1.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(["id", "bandas_antes", "bandas_D1", "regla", "age_note"]); w.writerows(rows)
from collections import Counter
print(f"{len(items)} ítems · {changed} reetiquetados · revisar: {sum('REVISAR' in r[3] for r in rows)}")
print(Counter(a for i in items for a in i["ages"]))
print(Counter(r[3].split(' →')[0] if r[3].startswith('intervalo') else r[3] for r in rows if '6-11' in r[1]).most_common(12))
