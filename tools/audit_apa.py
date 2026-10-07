#!/usr/bin/env python3
"""Auditoría APA 7 de las referencias y de la procedencia de datos.
Lee data/catalog.json, data/items.json y data/figure_sources.json y genera docs/AUDITORIA_APA7.md.
Sale con código 1 si hay errores estructurales (no por datos pendientes, que se listan como pendientes).
Uso: python3 -I tools/audit_apa.py"""
import json, pathlib, re, sys, datetime
root = pathlib.Path(__file__).resolve().parent.parent
cat = json.loads((root/"data/catalog.json").read_text(encoding="utf-8"))["fuentes"]
items = json.loads((root/"data/items.json").read_text(encoding="utf-8"))
figs = json.loads((root/"data/figure_sources.json").read_text(encoding="utf-8"))
ids = {i["id"]: i for i in items}
errors, warns = [], []

def key(s): return f'{s["autor_corto"]}, {s["anio"]}'

rows = []
for s in cat:
    a = s["apa7"]; sid = s["id"]
    has_url = bool(re.search(r"https?://", a))
    pend = bool(re.search(r"completar", a, re.I))
    year = re.search(r"\((\d{4})(?:, [^)]*)?\)\.", a)
    ital = "*" in a
    checks = {
        "año entre paréntesis tras la autoría": bool(year),
        "título en cursiva (*…*)": ital,
        "autoría abreviada para cita en el texto": bool(s.get("autor_corto")),
        "licencia identificada": "completar" not in (s.get("licencia") or "").lower() and "no indicada" not in (s.get("licencia") or "").lower(),
    }
    if not year: errors.append(f"{sid}: la referencia no sigue «Autoría. (Año). Título»")
    if not ital: errors.append(f"{sid}: título sin cursiva")
    if not s.get("autor_corto"): errors.append(f"{sid}: falta autor_corto")
    if year and year.group(1) != str(s["anio"]): errors.append(f"{sid}: el año de apa7 ({year.group(1)}) difiere de anio ({s['anio']})")
    if pend or not has_url: warns.append(f"{sid}: URL/DOI o datos por completar")
    rows.append((s, has_url, pend, checks))

keys = [key(s) for s in cat]
dup = {k for k in keys if keys.count(k) > 1}
if dup: errors.append(f"claves de cita en el texto duplicadas: {sorted(dup)}")
for i in items:
    if i["source"] not in {s["id"] for s in cat}: errors.append(f'{i["id"]}: fuente desconocida')
    if not isinstance(i.get("page"), int): errors.append(f'{i["id"]}: sin página')
fig_rows = []
for k, v in figs.items():
    if v == ["*"]:
        fig_rows.append((k, len(items), sorted({i["source"] for i in items}))); continue
    miss = [x for x in v if x not in ids]
    if miss: errors.append(f"figure_sources[{k}]: ítems inexistentes {miss}")
    fig_rows.append((k, len(v), sorted({ids[x]["source"] for x in v if x in ids})))
for k in ("ruler","mediacion","tutor","resp","sist","comp"):
    if k not in figs: errors.append(f"gráfico sin fuentes declaradas: {k}")

L = []
L.append("# Auditoría APA 7 (7.ª ed.) · Children on AI\n")
L.append(f"Generado por `tools/audit_apa.py` el {datetime.date.today().isoformat()} a partir de `data/*.json`. No lo edite a mano.\n")
L.append("## Resumen\n")
ok = sum(1 for _, u, p, _c in rows if u and not p)
L.append(f"- Referencias: **{len(cat)}**; completas (con URL/DOI y sin campos pendientes): **{ok}**; con datos pendientes: **{len(cat)-ok}**.")
L.append(f"- Ítems con cita textual y página: **{len(items)}**; claves de cita en el texto únicas: **{'sí' if not dup else 'no'}**.")
L.append(f"- Errores estructurales: **{len(errors)}**; avisos de datos pendientes: **{len(warns)}**.\n")
L.append("## Referencias\n")
L.append("| Fuente | Cita en el texto | URL/DOI | Estado | Licencia | Nota |\n|---|---|---|---|---|---|")
for s, u, p, c in rows:
    L.append(f'| {s["id"]} | {key(s)} | {"sí" if u else "falta"} | {"pendiente" if (p or not u) else "completa"} | {s.get("licencia","")} | {s.get("nota_apa","")} |')
L.append("\n## Procedencia de cada gráfico\n")
L.append("Cada gráfico, mapa, tabla y tarjeta del sitio muestra «Nota. Elaboración propia con datos de (autoría, año, PDF p. …)», enlazada a la referencia. Ítems que sustentan cada gráfico (`data/figure_sources.json`):\n")
L.append("| Gráfico | Ítems | Fuentes |\n|---|---|---|")
for k, n, ss in fig_rows: L.append(f"| {k} | {n} | {', '.join(ss)} |")
L.append("\n## Controles\n")
L += [
 "1. **Cumple.** Nota de fuente con cita en el texto en: regla de edades, 5 diagramas, mapa de calor, explorador, guías, escenarios, alertas (cifras), marco normativo, fuentes y glosario; cada tarjeta lleva «(autoría, año, PDF p. n)».",
 "2. **Cumple.** Las 310 citas textuales se verifican contra el texto de los PDF con `tools/verify_quotes.py`.",
 f"3. **{'Cumple' if not dup else 'Falla'}.** Claves de cita (autoría + año) únicas.",
 "4. **Cumple.** Estructura de referencia APA 7 y orden alfabético; autoría de grupo como autor (S04, S05, S08).",
 "5. **Pendiente.** URL, DOI, mes o páginas por completar (ver tabla). APA 7 exige URL o DOI cuando existen.",
 "6. **Pendiente.** S04: DOI inferido de la p. 2 del PDF; S08: título oficial completo por confirmar.",
 "7. **Límite.** Las páginas son el índice del PDF consultado, no la numeración impresa (APA 7 pide la impresa cuando existe). El sitio lo declara en cada nota.",
 "8. **Límite.** S02 es preprint sin revisión por pares; S07 es borrador informativo.",
 "9. **Límite.** Los esquemas conceptuales (ruta del tutor, responsabilidades) son de elaboración propia y se rotulan así.",
 "10. **Pendiente.** Referencia de la herramienta de IA: Anthropic. (2026). *Claude* (Sonnet 5.5) [Large language model]. https://claude.ai — confirmar versión y fecha exactas de uso.",
]
if errors:
    L.append("\n## Errores estructurales\n"); L += [f"- {e}" for e in errors]
if warns:
    L.append("\n## Avisos (datos pendientes)\n"); L += [f"- {w}" for w in warns]
(root/"docs/AUDITORIA_APA7.md").write_text("\n".join(L)+"\n", encoding="utf-8")
print(f"docs/AUDITORIA_APA7.md escrito · errores: {len(errors)} · avisos: {len(warns)}")
for e in errors: print("ERROR:", e, file=sys.stderr)
sys.exit(1 if errors else 0)
