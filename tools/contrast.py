#!/usr/bin/env python3
"""Verifica pares de color de los temas de assets/css/styles.css (WCAG 2.2).
Texto normal: AA ≥ 4.5; en temas de alto contraste (hcl, hcd, hcy) se exige AAA ≥ 7. Componentes gráficos: ≥ 3.
Uso: python3 tools/contrast.py"""
import re, pathlib, sys
css = (pathlib.Path(__file__).resolve().parent.parent / "assets/css/styles.css").read_text(encoding="utf-8")
def tokens(sel):
    out = {}
    for m in re.finditer(re.escape(sel) + r"\s*\{([^}]*)\}", css):  # varias reglas por tema: se fusionan en orden
        out.update(dict(re.findall(r"--([\w-]+):\s*(#[0-9A-Fa-f]{6})", m.group(1))))
    return out
base = tokens(":root")
themes = {"light": {}, "dark": tokens(':root[data-theme="dark"]'), "hcl": tokens(':root[data-theme="hcl"]'),
          "hcd": tokens(':root[data-theme="hcd"]'), "hcy": tokens(':root[data-theme="hcy"]')}
def lum(h):
    h = h.lstrip("#"); c = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    c = [x / 12.92 if x <= .03928 else ((x + .055) / 1.055) ** 2.4 for x in c]
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]
def cr(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True); return (la + .05) / (lb + .05)
TEXT = [("ink", "bg"), ("ink", "surface"), ("ink", "soft"), ("muted", "bg"), ("muted", "surface"), ("muted", "soft"),
        ("navy", "surface"), ("navy", "soft"), ("navy", "info-bg"), ("link", "bg"), ("link", "surface"),
        ("on-blue", "blue"), ("surface", "navy"), ("hero-ink", "hero"), ("hero-muted", "hero"),
        ("ok", "ok-bg"), ("warn", "warn-bg"), ("bad", "bad-bg"), ("a0i", "a0"), ("a1i", "a1"), ("a2i", "a2"), ("a3i", "a3"),
        ("cur-ink", "cur"), ("t1", "t1-bg"), ("t2", "t2-bg"), ("t3", "t3-bg"), ("t1", "surface"), ("t2", "surface"), ("t3", "surface"),
        ("side-ink", "side-bg"), ("side-muted", "side-bg"), ("side-act-ink", "side-act-bg"), ("side-ink", "side-hover"), ("side-muted", "side-hover"),
        ("hero-ink", "hero2"), ("hero-muted", "hero2"), ("ok", "surface"), ("warn", "surface"), ("bad", "surface")]
GFX = [("line", "surface"), ("line", "bg"), ("focus", "bg"), ("focus", "surface"), ("hero-line", "hero"), ("a3", "surface"), ("cur", "hero")]  # los bordes de color por edad y separadores del menú son decorativos: la edad también va en texto
fails = 0
for name, over in themes.items():
    t = {**base, **over}; need = 7 if name.startswith("hc") else 4.5
    for a, b in TEXT:
        r = cr(t[a], t[b])
        if r < need: print(f"FALLA {name}: {a} {t[a]} sobre {b} {t[b]} = {r:.2f} (< {need})"); fails += 1
    for a, b in GFX:
        r = cr(t[a], t[b])
        if r < 3: print(f"FALLA {name}: gráfico {a} sobre {b} = {r:.2f} (< 3)"); fails += 1
print("Contraste OK en todos los temas" if not fails else f"{fails} pares por debajo del umbral")
sys.exit(1 if fails else 0)
