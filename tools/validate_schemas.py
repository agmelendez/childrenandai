#!/usr/bin/env python3
"""Valida tips.json y transfer.json contra sus esquemas (E0.2–E0.3) y comprueba
integridad referencial: evidence_ids existen en data/items.json y transfer_id existe.
Uso: python3 tools/validate_schemas.py [--ejemplos] [--selftest]
  sin opciones: valida data/tips.json y data/transfer.json si existen.
  --ejemplos:   valida data/ejemplos/*.ejemplo.json.
  --selftest:   comprueba que el esquema RECHAZA casos inválidos conocidos."""
import json, sys, copy, pathlib
from jsonschema import Draft202012Validator, FormatChecker
R = pathlib.Path(__file__).resolve().parent.parent; D = R / "data"
load = lambda p: json.loads(p.read_text(encoding="utf-8"))
V = {k: Draft202012Validator(load(D/"schema"/f"{k}.schema.json"), format_checker=FormatChecker()) for k in ("tips", "transfer")}
ITEMS = {i["id"] for i in load(D/"items.json")}

def check(kind, doc, label):
    errs = [f"{'/'.join(map(str, e.absolute_path)) or '(raíz)'}: {e.message[:160]}" for e in V[kind].iter_errors({k: v for k, v in doc.items() if not k.startswith("_")})]
    rows = doc.get("tips" if kind == "tips" else "practicas", [])
    ids = [r.get("id") for r in rows]
    if len(ids) != len(set(ids)): errs.append("ids duplicados")
    for r in rows:
        miss = [e for e in r.get("evidence_ids", []) if e not in ITEMS]
        if miss: errs.append(f"{r.get('id')}: evidence_ids inexistentes {miss}")
    return errs

def run(pairs):
    bad = 0; tr_ids = set()
    for kind, p in pairs:
        if kind == "transfer" and p.exists(): tr_ids = {x["id"] for x in load(p)["practicas"]}
    for kind, p in pairs:
        if not p.exists(): print(f"—  {p.relative_to(R)}: no existe (se crea en E3)"); continue
        doc = load(p); errs = check(kind, doc, p.name)
        if kind == "tips":
            errs += [f"{t['id']}: transfer_id {t['transfer_id']} no está en la matriz" for t in doc["tips"] if t.get("transfer_id") and t["transfer_id"] not in tr_ids]
        print(("OK " if not errs else "ERR") + f" {p.relative_to(R)}" + "".join("\n     · " + e for e in errs)); bad += bool(errs)
    return bad

def selftest():
    t0 = load(D/"ejemplos/tips.ejemplo.json"); x0 = load(D/"ejemplos/transfer.ejemplo.json")
    def mut(doc, key, f):
        d = copy.deepcopy(doc); f(d[key][0]); return d
    cases = [
        ("tips", mut(t0, "tips", lambda t: t.update(evidence_ids=[])), "tip sin evidencia"),
        ("tips", mut(t0, "tips", lambda t: t.update(evidence_ids=["S99-01"])), "evidence_id inexistente"),
        ("tips", mut(t0, "tips", lambda t: t.update(confianza="A")), "confianza A sin ancla CR"),
        ("tips", mut(t0, "tips", lambda t: t.update(condicion_adaptacion=None)), "sin ancla ni condición de adaptación"),
        ("tips", mut(t0, "tips", lambda t: t.update(edad=["6-11"])), "banda antigua (no D1)"),
        ("tips", mut(t0, "tips", lambda t: t.update(estado="publicado")), "publicado sin validación de expertos, MEP y filología (D5)"),
        ("tips", mut(t0, "tips", lambda t: t.update(estado="publicado", revisado_por=[{"rol":"redaccion_ciodd","fecha":"2026-10-26"},{"rol":"experto_educacion","fecha":"2026-10-26"},{"rol":"filologia","fecha":"2026-10-26"}])), "publicado sin validación del MEP (D5)"),
        ("tips", mut(t0, "tips", lambda t: t.update(fecha="26/10/2026")), "fecha no ISO"),
        ("transfer", mut(x0, "practicas", lambda p: p.update(nivel="A")), "nivel A sin ancla CR"),
        ("transfer", mut(x0, "practicas", lambda p: p.update(condicion_adaptacion=None)), "adaptar sin condición"),
        ("transfer", mut(x0, "practicas", lambda p: p["criterios"].update(legal=0)), "barrera legal con decisión 'adaptar'"),
    ]
    fails = 0
    for kind, doc, name in cases:
        rejected = bool(check(kind, doc, name)); fails += not rejected
        print(("OK  rechaza: " if rejected else "FALLA acepta: ") + name)
    return fails

if __name__ == "__main__":
    a = sys.argv[1:]
    if "--selftest" in a: sys.exit(selftest())
    pairs = [("transfer", D/"ejemplos/transfer.ejemplo.json"), ("tips", D/"ejemplos/tips.ejemplo.json")] if "--ejemplos" in a else [("transfer", D/"transfer.json"), ("tips", D/"tips.json")]
    sys.exit(run(pairs))
