#!/usr/bin/env python3
"""Completa URL de referencias (APA 7) verificadas por búsqueda el 26-10-2026. Actualiza catalog.json y los
lotes de ingreso que contengan la fuente. Idempotente. Uso: python3 tools/update_refs.py"""
import json, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
U = {  # id: (url, nota opcional)
 "S03": ("https://www.weforum.org/publications/childrens-safety-and-well-being-in-the-age-of-ai-best-practices-and-incentives/", ""),
 "S05": ("https://committees.parliament.uk/work/9220/", "URL de la página de la investigación del comité, donde se publica el informe."),
 "S07": ("https://www.gov.uk/government/publications/keeping-children-safe-in-education--2", "Página oficial de la guía; el corpus usa el borrador informativo publicado antes del 1-9-2026: verificar la versión final."),
 "S11": ("https://researchonline.lse.ac.uk/id/eprint/137132", ""),
 "S12": ("https://unesdoc.unesco.org/ark:/48223/pf0000391105", "Identificador UNESDOC 391105 (versión en inglés)."),
 "S13": ("https://unesdoc.unesco.org/ark:/48223/pf0000399343", "Identificador UNESDOC 399343, tomado del nombre del PDF oficial (399343eng): verificar."),
 "S15": ("https://boletinoficial.buenosaires.gob.ar/normativaba/norma/870606", "Aprobado como Anexo II de la Resolución 1166/MEDGC/26 (BO 11-8-2026), vigente desde el 10-8-2026."),
 "S17": ("https://www.broadbandcommission.org/wp-content/uploads/2025/07/Data-Governance-Toolkit.pdf", ""),
 "S20": ("https://www.unicef.org/uruguay/informes/informe-kids-online-uruguay-2022", "Año de publicación por verificar (datos 2022)."),
 "S21": ("https://www.micitt.go.cr/sites/default/files/marco_juridico_legal/08.%20Ley%20n.%C2%B0%208968%20Ley%20de%20Protecci%C3%B3n%20de%20la%20Persona%20frente%20al%20tratamiento%20de%20sus%20datos%20personales..pdf", "Copia oficial del MICITT (texto del SCIJ consultado el 7-1-2026)."),
 "S22": ("https://www.tse.go.cr/pdf/normativa/reglamentoleyproteccionpersona.pdf", "Copia oficial del TSE; la versión consultada es la impresión del SCIJ (versión 3 de 3)."),
}
PENDIENTES = {"S01": "Sin URL pública localizada (Banco Mundial, serie Digital Innovations in Education, Brief n.º 7).",
 "S08": "Sin URL de EUR-Lex localizada para COM(2026) 681 final; hay copias en registros del Consejo y parlamentos nacionales.",
 "S09": "Sin URL localizada para la reseña.", "S10": "Sin URL localizada en UNESDOC.", "S16": "Sin URL ni fecha localizadas.",
 "S18": "La versión consultada (v2) no tiene URL pública; existe una v3 posterior.", "S19": "Autoría, curso y fecha por confirmar con el autor del proyecto.",
 "S23": "Falta enlace estable al SCIJ."}
def patch(s):
    sid = s["id"]
    if sid in U:
        url, nota = U[sid]; s["url"] = url
        base = s["apa7"].split(" [URL")[0].replace(" [URL/DOI por completar]", "").rstrip()
        if url not in base: base = base.rstrip(".") + ". " + url if not base.endswith(".") else base + " " + url
        s["apa7"] = base
        if nota: s["nota_apa"] = nota
    elif sid in PENDIENTES:
        s["nota_apa"] = PENDIENTES[sid]
    return s
cp = R/"data/catalog.json"; c = json.loads(cp.read_text(encoding="utf-8")); c["fuentes"] = [patch(s) for s in c["fuentes"]]
cp.write_text(json.dumps(c, ensure_ascii=False, indent=1), encoding="utf-8")
for f in (R/"data/ingest").glob("*_catalog.json"):
    L = json.loads(f.read_text(encoding="utf-8")); f.write_text(json.dumps([patch(s) for s in L], ensure_ascii=False, indent=1), encoding="utf-8")
print(f"URL añadidas: {len(U)} · pendientes documentadas: {len(PENDIENTES)}")
