#!/usr/bin/env python3
"""E5.6 · auditoría tonal (docs/AUDITORIA_TONAL_E5.md): género (H2), persona (H5), 9-1-1 (H6), léxico (H7)
en data/tips.json y data/alertas_oca.json, y las mismas sustituciones en los generadores tools/e5_pasos*.py
para que sigan siendo idempotentes. Uso: python3 tools/e56_tono.py (idempotente)."""
import json, pathlib, sys
R = pathlib.Path(__file__).resolve().parent.parent
# (id, campo) -> [(viejo, nuevo)] ; campo: texto | por_que | hacer | ejemplo | empezar | senal
T = {
("T-FAM-001","por_que"):[("Los niños pequeños","Niñas y niños pequeños")],
("T-FAM-002","texto"):[("Si su hijo tiene","Si su hijo o hija tiene"),("No lo deje conversar solo con un chatbot.","No deje que converse a solas con un chatbot.")],
("T-FAM-002","hacer"):[("Su hijo mira","Su hija mira")],
("T-FAM-004","texto"):[("Si su hijo no la cumple","Si su hijo o hija no la cumple"),("use su propia cuenta y acompáñelo.","use su propia cuenta y úsela a su lado.")],
("T-FAM-004","senal"):[("a nombre de su hijo","a nombre de su hija")],
("T-FAM-005","por_que"):[("datos personales de su hijo.","datos personales de su hijo o hija.")],
("T-FAM-005","ejemplo"):[("y su hijo responde","y su hija responde")],
("T-FAM-007","texto"):[("preguntando a la maestra.","preguntando a la maestra o al maestro.")],
("T-FAM-007","por_que"):[("Los niños que comparan","Niñas y niños que comparan")],
("T-FAM-007","senal"):[("Si su hijo cree todo","Si su hija cree todo"),("hasta que él proponga","hasta que ella proponga")],
("T-FAM-009","texto"):[("que su hijo escriba","que su hijo o hija escriba")],
("T-FAM-009","ejemplo"):[("su hijo pide","su hija pide")],
("T-FAM-010","hacer"):[("tiene su hijo.","tiene su hijo o hija.")],
("T-FAM-010","empezar"):[("del aparato de su hijo, junto con él.","del aparato de su hija, junto con ella.")],
("T-FAM-011","ejemplo"):[("Su hijo le cuenta","Su hija le cuenta")],
("T-FAM-012","texto"):[("Si su hijo le cuenta algo raro o feo que vio","Si su hijo o hija le cuenta algo que vio y le incomodó o le asustó")],
("T-FAM-012","ejemplo"):[("una imagen fea que salió en un juego","una imagen que le incomodó en un juego")],
("T-FAM-013","texto"):[("hable con su hijo.","hable con su hijo o hija.")],
("T-FAM-014","senal"):[("Si su hijo comenta","Si su hija comenta")],
("T-FAM-016","ejemplo"):[("Su hijo responde","Su hija responde")],
("T-FAM-017","texto"):[("conversa con su hijo.","conversa con su hijo o hija.")],
("T-FAM-017","por_que"):[("con el de los niños","con el de niñas y niños")],
("T-FAM-018","senal"):[("Si su hijo se despierta cansado","Si su hija se despierta cansada")],
("T-FAM-019","texto"):[("datos de su hijo,","datos de su hijo o hija,"),("o de la maestra.","o del personal docente.")],
("T-FAM-020","texto"):[("datos de su hijo tiene","datos de su hijo o hija tiene")],
("T-FAM-020","hacer"):[("el de su hijo","el de su hijo o hija")],
("T-FAM-020","ejemplo"):[("Guarda una copia.","Guarde una copia.")],
("T-FAM-022","empezar"):[("cuéntele a su hijo","cuéntele a su hija")],
("T-FAM-023","senal"):[("Si su hijo solo copia","Si su hija solo copia")],
("T-FAM-024","texto"):[("usará su hijo en clase","usará su hijo o hija en clase")],
("T-FAM-024","empezar"):[("a la maestra","a la persona docente")],
("T-FAM-026","texto"):[("a su hijo adolescente","a su hijo o hija adolescente")],
("T-FAM-027","senal"):[("Si su hijo toma","Si su hija toma")],
("T-FAM-028","texto"):[("Esté atento si su hijo pasa","Ponga atención si su hijo o hija pasa"),("Hable con él sin burlas.","Hable del tema sin burlas.")],
("T-FAM-029","ejemplo"):[("Su hijo cuenta","Su hija cuenta")],
("T-FAM-029","senal"):[("llame al 911.","llame al 9-1-1.")],
("T-FAM-032","ejemplo"):[("Su hijo quiere","Su hija quiere")],
("T-FAM-035","ejemplo"):[("su hijo escribe","su hija escribe")],
("T-FAM-040","texto"):[("cuánto se expone su hijo","cuánto se expone su hijo o hija")],
("T-FAM-040","senal"):[("Si su hijo salta","Si su hija salta")],
("T-FAM-041","texto"):[("Si su hijo sufre acoso o una imagen falsa, no lo culpe.","Si su hijo o hija sufre acoso o una imagen falsa, no le eche la culpa.")],
("T-FAM-041","senal"):[("Si su hijo no quiere","Si su hija no quiere")],
("T-FAM-042","ejemplo"):[("Su hijo la revisa","Su hija la revisa")],
("T-TRV-005","ejemplo"):[("el estudiante entrega","cada estudiante entrega")],
("T-TRV-005","senal"):[("converse con el estudiante antes","converse con quien lo entregó antes")],
("T-DOC-002","texto"):[("en manos de los niños.","en manos de niñas y niños.")],
("T-DOC-002","hacer"):[("Los niños no tocan","Niñas y niños no tocan")],
("T-DOC-006","por_que"):[("qué hizo el estudiante","qué hizo cada estudiante")],
("T-DOC-006","hacer"):[("qué aprendió el estudiante","qué aprendió cada estudiante")],
("T-DOC-007","texto"):[("lo que el estudiante cambió","lo que cada estudiante cambió")],
("T-DOC-007","ejemplo"):[("que el estudiante llena","que cada estudiante llena")],
("T-DOC-007","senal"):[("converse con el estudiante sobre","converse con la o el estudiante sobre")],
("T-DOC-008","ejemplo"):[("de un estudiante que habla","de una estudiante que habla")],
("T-DOC-009","texto"):[("primero hable con el estudiante. Vea qué parte hizo él.","primero hable con quien lo entregó. Vea qué parte hizo por su cuenta.")],
("T-DOC-013","por_que"):[("Los niños pequeños","Niñas y niños pequeños")],
("T-DOC-014","senal"):[("Si un estudiante se siente ofendido","Si una estudiante se siente ofendida")],
("T-DOC-019","ejemplo"):[("Un estudiante le muestra","Una estudiante le muestra")],
("T-DOC-019","senal"):[("Si el estudiante está en peligro","Si la o el estudiante está en peligro")],
("T-DOC-021","ejemplo"):[("conversa con el estudiante","conversa con quien la escribió")],
("T-DOC-021","senal"):[("hable con el estudiante","hable con quien lo escribió")],
("T-DOC-025","por_que"):[("después el estudiante aprende","después el estudiantado aprende")],
("T-DOC-026","ejemplo"):[("habla con la maestra,","habla con tu docente,")],
("T-DOC-027","senal"):[("Si un estudiante reclama una nota sugerida por IA, revísela con él personalmente.","Si una estudiante reclama una nota que dio la IA, revísela con ella, cara a cara.")],
("T-DOC-028","ejemplo"):[("para un estudiante con baja visión","para una estudiante con baja visión")],
("T-DOC-032","senal"):[("Si un estudiante cuenta","Si una estudiante cuenta"),("converse con él después","converse con ella después")],
("T-DOC-033","texto"):[("los niños deben saber","niñas y niños deben saber")],
("T-DOC-035","senal"):[("Si un estudiante dice que no puede dejar una app, converse con él","Si una estudiante dice que no puede dejar una app, converse con ella")],
("T-DIR-011","ejemplo"):[("guiadas por el docente","guiadas por la persona docente")],
("T-DIR-020","ejemplo"):[("con el docente.","con la persona docente.")],
}
A = {
("Aprendizaje y docencia","casa","observar"):[("su hijo no sabe","su hijo o hija no sabe")],
("Edad y adecuación","casa","observar"):[("la de su hijo.","la de su hijo o hija.")],
("Uso y prevalencia","casa","observar"):[("Su hijo usa IA","Su hija usa IA")],
("Mediación parental","casa","observar"):[("qué hace su hijo en línea","qué hace su hijo o hija en línea")],
("Mediación parental","casa","conversar"):[("con su hijo.","con su hijo o hija.")],
("Responsabilidad compartida","casa","conversar"):[("con la maestra","con la persona docente")],
}
pend=[]
def ap(s,pairs,tag):
    for a,b in pairs:
        if b in s: continue
        if a not in s: pend.append(tag+' :: '+a); continue
        s=s.replace(a,b,1)
    return s
tf=R/"data/tips.json"; d=json.loads(tf.read_text(encoding="utf-8")); ix={t["id"]:t for t in d["tips"]}
for (i,c),p in T.items():
    t=ix[i]
    if c in("texto","por_que"): t[c+"_es"]=ap(t[c+"_es"],p,f"{i}.{c}")
    else: t["pasos"][c]["es"]=ap(t["pasos"][c]["es"],p,f"{i}.{c}")
tf.write_text(json.dumps(d,ensure_ascii=False,indent=1)+"\n",encoding="utf-8")
af=R/"data/alertas_oca.json"; a=json.loads(af.read_text(encoding="utf-8"))
for (tm,c,k),p in A.items(): a["temas"][tm][c][k]["es"]=ap(a["temas"][tm][c][k]["es"],p,f"{tm}.{c}.{k}")
af.write_text(json.dumps(a,ensure_ascii=False,indent=1)+"\n",encoding="utf-8")
# generadores
pairs=[x for v in list(T.values())+list(A.values()) for x in v]
for g in ("e5_pasos.py","e5_pasos_1218.py"):
    f=R/"tools"/g; s=f.read_text(encoding="utf-8"); n=0
    for x,y in pairs:
        if x in s and y not in s: s=s.replace(x,y); n+=1
    f.write_text(s,encoding="utf-8"); print(g,"sustituciones",n)
print("pendientes:",pend or "ninguna")
