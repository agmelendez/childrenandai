/* Children on AI · lógica del sitio (sin dependencias).
   Requiere: assets/js/i18n.js (window.COA_I18N, window.COA_I18N_DATA) y data/data.js (window.COA_DATA).
   Idiomas: añadir un código en LANGS y un bloque en i18n.js; los campos de contenido usan sufijo _<código> (p. ej. en_en no; ver loc()). */
(function(){
"use strict";
const I=window.COA_I18N, ID=window.COA_I18N_DATA, D=window.COA_DATA;
const LANGS=["es","en"];
const IT=D.items, CAT=D.catalog.fuentes, GLO=D.glossary;
const BYID=Object.fromEntries(IT.map(i=>[i.id,i]));
const SRC=Object.fromEntries(CAT.map(c=>[c.id,c]));
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const em=s=>esc(s).replace(/\*(.+?)\*/g,"<em>$1</em>");
const KINDS=["recomendacion","hallazgo","alerta","cifra","definicion","obligacion","competencia"];
const STRS=["empirica_encuesta","revision_literatura","orientacion","normativa","opinion"];
const AGES=[["6-8","6–8"],["9-11","9–11"],["12-14","12–14"],["15-18","15–18"]]; /* D1: ciclos MEP (I, II, III, Diversificada) */
const ROLES=["Familia","Docente","Dirección"];
const LN={es:{es:"español",en:"inglés"},en:{es:"Spanish",en:"English"}};
const st={view:"inicio",sub:{},lang:"es",age:11,role:"Familia",ex:{q:"",kind:"",theme:"",src:"",age:"",aud:"",str:""},shown:24,lf:"",lshown:6,done:{},dg:"mediacion",al:"fuentes",ser:{0:true,1:true,2:true},glq:"",glc:""};
const THEMES=[...new Set(IT.map(i=>i.theme))];

/* ---------- Preferencias de accesibilidad ---------- */
const DEFP={theme:"auto",size:100,font:false,space:false,links:false,focus:false,motion:false,text:false};
let P=Object.assign({},DEFP);
try{P=Object.assign(P,JSON.parse(localStorage.getItem("coa.a11y")||"{}"))}catch(e){}
const saveP=()=>{try{localStorage.setItem("coa.a11y",JSON.stringify(P))}catch(e){}};
const reduced=()=>P.motion||matchMedia("(prefers-reduced-motion:reduce)").matches;
const smooth=()=>reduced()?"auto":"smooth";

/* ---------- i18n ---------- */
function t(k,v){let s=(I[st.lang]&&I[st.lang][k]);if(s==null)s=I.es[k];if(s==null)return k;return v?s.replace(/\{(\w+)\}/g,(m,x)=>v[x]!=null?v[x]:m):s}
const loc=(o,f)=>(st.lang!=="es"&&o[f+"_"+st.lang]!=null&&o[f+"_"+st.lang]!=="")?o[f+"_"+st.lang]:o[f];
const itx=i=>st.lang==="es"?i.es:(i[st.lang]||i.es);
const th=x=>t("theme."+x);
const roleL=r=>t("role."+r);
const agel=k=>(AGES.find(a=>a[0]===k)||[0,k])[1];
/* No aplicable directamente en CR: ítem con estatus legal extranjero/no adoptado, o advertencia que lo declara. */
const notCR=i=>(i.legal_status?1:0)||(/no (es )?aplica(ble)?( directamente)?/i.test(i.caveat||"")?1:0);
const tramo=a=>a<=8?"6-8":a<=11?"9-11":a<=14?"12-14":"15-18";
const bl=o=>o[st.lang]||o.es;
/* ---------- Procedencia: citas en el texto (APA 7) y notas de fuente ---------- */
const ckey=s=>loc(s,"autor_corto")+", "+s.anio;
function pageTxt(pg){pg=[...new Set(pg)].sort((a,b)=>a-b);const r=[];for(let k=0;k<pg.length;){let j=k;while(j+1<pg.length&&pg[j+1]===pg[j]+1)j++;r.push(j>k?pg[k]+"–"+pg[j]:String(pg[k]));k=j+1}return t(pg.length>1?"prov.pp":"prov.p")+" "+r.join(", ")}
const apaLink=(sid,txt)=>`<a href="#fuentes/refs" class="ref" data-apa="${sid}">${esc(txt)}</a>`;
function inText(ids){
  const by={};ids.forEach(id=>{const i=BYID[id];if(i)(by[i.source]=by[i.source]||[]).push(i.page)});
  const sids=Object.keys(by).sort((a,b)=>ckey(SRC[a]).localeCompare(ckey(SRC[b]),st.lang));
  return sids.length?"("+sids.map(sid=>apaLink(sid,ckey(SRC[sid])+", "+pageTxt(by[sid]))).join("; ")+")":"";
}
function srcNoteInner(k){const ids=(D.figsrc||{})[k]||[];return `<b>${esc(t("prov.nota"))}</b> ${t("prov.from",{c:inText(ids)})} ${esc(t("prov."+k+".x"))} ${esc(t("prov.pdfnote"))}`}
function fillNotes(){$$("[data-note]").forEach(el=>{const k=el.dataset.note;el.innerHTML=k.startsWith("fig:")?srcNoteInner(k.slice(4)):`<b>${esc(t("prov.nota"))}</b> ${t("prov."+k)} ${esc(t("prov.pdfnote"))}`})}
function applyStatic(root){
  (root||document).querySelectorAll("[data-i18n]").forEach(e=>{e.textContent=t(e.dataset.i18n)});
  (root||document).querySelectorAll("[data-i18n-html]").forEach(e=>{e.innerHTML=t(e.dataset.i18nHtml)});
  (root||document).querySelectorAll("[data-i18n-attr]").forEach(e=>e.dataset.i18nAttr.split(";").forEach(p=>{const [a,k]=p.split(":");e.setAttribute(a,t(k))}));
}
const live=$("#live");let liveT=0;
function announce(m){clearTimeout(liveT);live.textContent="";liveT=setTimeout(()=>{live.textContent=m},60)}

/* ---------- Tarjetas ---------- */
function fmtFig(f){
  if(f==null||f==="")return"";
  if(typeof f==="string")return esc(f);
  const v=f.value;let s;
  if(v&&typeof v==="object")s=Object.entries(v).map(([k,x])=>k+": "+(Array.isArray(x)?x.join(" / "):x)).join(" · ");else s=String(v);
  return `<b>${esc(s)}</b> ${esc(f.unit||"")}${f.population?` · ${esc(f.population)}`:""}${f.n_or_base?` · ${esc(t("card.base",{x:f.n_or_base}))}`:""}`;
}
function card(i,opt){
  opt=opt||{};
  const s=SRC[i.source], ages=i.ages||[], ql=s.idioma||"es";
  const agenote=loc(i,"age_note"), cav=loc(i,"caveat")||"", fig=loc(i,"figure"), lvl=loc(i,"levels"), ls=loc(i,"legal_status");
  const ageIdx=a=>AGES.findIndex(x=>x[0]===a)+1;
  const ac=ages.length===AGES.length?`<span class="b">${esc(t("card.allages"))}</span>`:ages.length?ages.map(a=>`<span class="b age${ageIdx(a)}">${agel(a)}</span>`).join(""):`<span class="b" title="${esc(agenote||"")}">${esc(t("card.noage"))}</span>`;
  const lv=lvl&&typeof lvl==="object"?`<details><summary>${esc(t("comp.l1"))} · ${esc(t("comp.l2"))} · ${esc(t("comp.l3"))}</summary><dl class="lv"><dt>${esc(t("comp.l1"))}</dt><dd>${esc(lvl.understand||"")}</dd><dt>${esc(t("comp.l2"))}</dt><dd>${esc(lvl.apply||"")}</dd><dt>${esc(t("comp.l3"))}</dt><dd>${esc(lvl.create||"")}</dd></dl></details>`:"";
  return `<article class="item k-${i.kind} ab-${ages.length===1?ageIdx(ages[0]):0}" id="c-${i.id}" tabindex="-1" aria-label="${esc(t("kind."+i.kind)+" "+i.id)}"><div class="row"><span class="b ${i.kind}">${esc(t("kind."+i.kind))}</span><span class="b">${esc(th(i.theme))}</span>${ac}${notCR(i)?`<span class="b na">${esc(t("card.na"))}</span>`:""}</div>
  <p>${esc(itx(i))}</p>
  ${loc(i,"lectura_cr")?`<p class="lcr"><b>${esc(t("card.lcr"))}</b> ${esc(loc(i,"lectura_cr"))}</p>`:""}
  ${fig?`<div class="fg">${fmtFig(fig)}</div>`:""}
  ${lv}
  <details class="prov"><summary>${esc(t("card.prov"))} <span class="pv-src">${esc(ckey(s))}</span></summary><div class="pvb">
  ${cav?`<div class="cv"><b>${esc(t("card.limits"))}.</b> ${esc(cav)}</div>`:""}
  ${ls?`<span class="cite">${esc(t("fu.state"))}: ${esc(ls)}</span>`:""}
  ${agenote&&!opt.noage?`<span class="cite">${esc(t("card.agenote",{x:agenote}))}</span>`:""}
  <span class="lbl">${esc(t("card.quote"))} · ${esc(t("card.pdf",{p:i.page}))}</span><blockquote lang="${ql}">${esc(i.quote)}</blockquote>${ql!==st.lang?`<span class="cite">${esc(t("card.partial",{l:LN[st.lang][ql]}))}</span>`:""}
  <span class="cite">${apaLink(i.source,"("+ckey(s)+", "+pageTxt([i.page])+")")} · ${esc(t("card.id"))} ${i.id}</span></div></details></article>`;
}
function focusCard(box){const a=box&&box.querySelector("article");if(a){try{a.focus({preventScroll:false})}catch(e){a.focus()}}}

/* ---------- Regla de edades ---------- */
const X0=170,PX=55,AMIN=5,AMAX=19;
const xa=a=>X0+(a-AMIN)*PX;
const LANES=[{id:"leg",h:50},{id:"br",h:34},{id:"eu",h:64},{id:"no",h:34},{id:"ae",h:34},{id:"in",h:34},{id:"us",h:70}];
const USE=[{f:9,t:11,v:45,txt:"45 %*",ref:"S11-02"},{f:15,t:17,v:87,txt:"87 %",ref:"S11-02"}];
const rng=(f,tt)=>f<=5?`≤${tt-1}`:`${f}–${tt-1}`;
const lvTxt=lv=>lv<0?t("level.cur"):t("level."+lv);
const trunc=(s,n)=>esc(s.length>n&&n>8?s.slice(0,n-1)+"…":s);
function buildRuler(){
  let y=26;
  let out=`<svg viewBox="0 0 960 __H__" role="group" aria-label="${esc(t("ruler.aria"))}" focusable="false"><defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" stroke-width="2" opacity=".35"/></pattern></defs>`;
  for(let a=AMIN;a<=AMAX;a++){out+=`<line class="grid" x1="${xa(a)}" y1="14" x2="${xa(a)}" y2="__GY__"/>`;if(a<AMAX)out+=`<text class="tick" aria-hidden="true" x="${xa(a)+PX/2}" y="10" text-anchor="middle">${a}</text>`}
  const pos={};
  LANES.forEach(L=>{pos[L.id]=y;out+=`<text class="lane" aria-hidden="true" x="0" y="${y+L.h/2+3}">${esc(t("lane."+L.id))}</text>`;y+=L.h+8});
  ID.marks.forEach(m=>{const yy=pos.leg,txt=bl({es:m.es,en:m.en}),lg=st.lang==="en"?m.long_en:m.long_es;out+=`<g class="band on mk" tabindex="0" role="button" data-ref="${m.ref}" aria-label="${esc(lg)}"><title>${esc(lg)}</title><rect x="${xa(m.x)-2}" y="${yy}" width="4" height="${LANES[0].h}" fill="var(--a3)"/><rect x="${xa(m.x)+2}" y="${yy+10}" width="84" height="26" rx="4" fill="var(--a0)"/><text x="${xa(m.x)+9}" y="${yy+27}" style="fill:var(--a0i)">${esc(txt)}</text></g>`});
  ID.bands.forEach(b=>{
    const L=LANES.find(z=>z.id===b.l),rh=b.l==="eu"?28:L.h,yy=pos[b.l]+(b.row?32:0),x=xa(b.f),w=(b.t-b.f)*PX-2,txt=bl(b);
    const fillv=b.lv<0?"none":`var(--a${b.lv})`,ink=b.lv<0?"var(--hero-ink)":`var(--a${b.lv}i)`,stroke=b.lv<0?`stroke="var(--hero-muted)" stroke-width="1.5"`:"";
    const lab=`${t("lane."+b.l)}: ${txt}. ${t("tbl.age")} ${rng(b.f,b.t)}. ${lvTxt(b.lv)}${b.prop?". "+t("legend.prop"):""}`;
    out+=`<g class="band" tabindex="0" role="button" data-ref="${b.ref}" data-f="${b.f}" data-t="${b.t}" aria-label="${esc(lab)}" style="fill:${ink}"><title>${esc(lab)}</title><rect x="${x}" y="${yy}" width="${w}" height="${rh}" rx="4" fill="${fillv}" ${stroke}/>${b.prop?`<rect x="${x}" y="${yy}" width="${w}" height="${rh}" rx="4" fill="url(#hatch)" style="color:#fff"/>`:""}<text x="${x+6}" y="${yy+rh/2+4}" ${w<110?'font-size="10"':""}>${trunc(txt,Math.floor(w/5.6))}</text></g>`;
  });
  USE.forEach(u=>{const yy=pos.us,H=LANES[6].h,h=H*u.v/100,x=xa(u.f),w=(u.t-u.f)*PX-2,lab=`${t("lane.us")}: ${u.txt}. ${t("tbl.age")} ${u.f}–${u.t-1}`;out+=`<g class="band on" tabindex="0" role="button" data-ref="${u.ref}" data-f="${u.f}" data-t="${u.t}" aria-label="${esc(lab)}" style="fill:var(--hero-ink)"><title>${esc(lab)}</title><rect x="${x}" y="${yy+H-h}" width="${w}" height="${h}" rx="3" fill="var(--a2)"/><text x="${x+w/2}" y="${yy+H-h-4}" text-anchor="middle">${u.txt}</text></g>`});
  out+=`<text class="tick" aria-hidden="true" x="${xa(11)}" y="${pos.us+LANES[6].h+13}" text-anchor="middle">${esc(t("ruler.useNote"))}</text>`;
  const H=y+22;out+=`<g id="cur" aria-hidden="true"><line x1="0" y1="14" x2="0" y2="${y}" stroke="var(--cur)" stroke-width="2.5"/><rect x="-19" y="-2" width="38" height="18" rx="9" fill="var(--cur)"/><text id="curT" x="0" y="11" text-anchor="middle" style="fill:var(--cur-ink);font-weight:700">11</text></g></svg>`;
  return out.replace("__H__",H).replace(/__GY__/g,y);
}
function rulerAlt(){
  const rows=[];
  ID.marks.forEach(m=>rows.push([t("lane.leg"),`${m.x}`,st.lang==="en"?m.long_en:m.long_es,"",m.ref]));
  ID.bands.forEach(b=>rows.push([t("lane."+b.l),rng(b.f,b.t),bl(b),lvTxt(b.lv)+(b.prop?" · "+t("legend.prop"):""),b.ref]));
  USE.forEach(u=>rows.push([t("lane.us"),`${u.f}–${u.t-1}`,u.txt+" · "+t("ruler.useNote"),"",u.ref]));
  $("#rulerAlt").innerHTML=`<summary>${esc(t("alt.summary"))}</summary><p class="hint">${esc(t("alt.hint"))}</p><div class="tw" tabindex="0" role="region" aria-label="${esc(t("alt.summary"))}"><table><thead><tr><th scope="col">${t("alt.lane")}</th><th scope="col">${t("alt.range")}</th><th scope="col">${t("alt.text")}</th><th scope="col">${t("alt.level")}</th><th scope="col">${t("alt.cite")}</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td><button type="button" class="pill" data-ref="${r[4]}">${r[4]}</button></td></tr>`).join("")}</tbody></table></div>`;
}
let ageT=0;
function setAge(a,quiet){
  st.age=a;$("#age").value=a;$("#ageOut").textContent=a;$("#age").setAttribute("aria-valuetext",t("ruler.ageValue",{n:a}));
  const cur=$("#cur");if(cur){cur.setAttribute("transform",`translate(${xa(a)+PX/2},0)`);$("#curT").textContent=a}
  $$("#ruler .band[data-f]").forEach(g=>{const on=+g.dataset.f<=a&&a<+g.dataset.t;g.classList.toggle("on",on);if(on)g.setAttribute("aria-current","true");else g.removeAttribute("aria-current")});
  const lanes={};let cnt=0;ID.bands.forEach(b=>{if(b.f<=a&&a<b.t){(lanes[b.l]=lanes[b.l]||[]).push(b);cnt++}});
  let h=`<h3>${esc(t("ruler.at",{n:a}))}</h3><div class="row">`;
  ID.marks.forEach(m=>{const lab=st.lang==="en"?m.en:m.es;h+=`<button class="pill" data-ref="${m.ref}" type="button">${esc(t(a>=m.x?"ruler.crossed":"ruler.notyet",{x:lab}))}</button>`});
  Object.keys(lanes).forEach(k=>lanes[k].forEach(b=>h+=`<button class="pill" data-ref="${b.ref}" type="button"><b>${esc(t("lane."+k))}:</b> ${esc(bl(b))}</button>`));
  h+=`</div><span class="cite">${esc(t("ruler.note",{t:agel(tramo(a))}))}</span><div id="rcard"></div>`;
  $("#rdetail").innerHTML=h;
  st.lshown=6;renderLectura();renderGuia();
  if(!quiet){clearTimeout(ageT);ageT=setTimeout(()=>announce(t("ruler.live",{n:a,m:cnt})),500)}
}
function showRef(id,target){const i=BYID[id];if(!i)return;const tg=$(target||"#rcard");tg.innerHTML=card(i);const art=tg.querySelector("article");if(art){art.scrollIntoView({block:"nearest",behavior:smooth()});art.focus({preventScroll:true})}}
function legend(){
  const L=["a0","a1","a2","a3"].map((c,k)=>[`var(--${c})`,t("legend."+k)]);
  $("#legend").innerHTML=L.map(l=>`<span><i class="sw" style="background:${l[0]}"></i>${esc(l[1])}</span>`).join("")+`<span><i class="sw" style="border:2px solid var(--hero-muted);background:none"></i>${esc(t("legend.cur"))}</span><span><i class="sw" style="background:repeating-linear-gradient(45deg,var(--a1),var(--a1) 3px,transparent 3px,transparent 6px)"></i>${esc(t("legend.prop"))}</span>`;
}

/* ---------- Selectores y lectura ---------- */
function picker(){
  const h=`<div><span class="lbl">${esc(t("pick.role"))}</span><div class="seg" role="group" aria-label="${esc(t("pick.group"))}">${ROLES.map(r=>`<button type="button" data-role="${r}" aria-pressed="${r===st.role}">${esc(roleL(r))}</button>`).join("")}</div></div><div><span class="lbl">${esc(t("pick.age"))}</span><div class="row"><b style="font:800 1.4rem var(--f-display);color:var(--navy)">${esc(t("ruler.ageValue",{n:st.age}))}</b><span class="cite">${esc(t("pick.ageNote",{t:agel(tramo(st.age))}))}</span></div></div>`;
  $("#pick").innerHTML=h;
}
const KW={obligacion:3,recomendacion:3,alerta:2};
const strong=i=>(i.strength==="normativa"||i.strength==="empirica_encuesta")?1:0;
const mine=()=>{const tr=tramo(st.age);return IT.filter(i=>(i.ages||[]).includes(tr)&&(i.audiences||[]).includes(st.role))};
function renderLectura(){
  picker();
  const m=mine(),cnt=k=>m.filter(i=>i.kind===k).length,LF=st.lf;
  /* E1.7: obligaciones y alertas aplicables > recomendaciones > hallazgos/cifras; lo no aplicable a CR, al final. */
  const rank=i=>({obligacion:0,alerta:0,recomendacion:1,hallazgo:2,cifra:2})[i.kind]??3;
  const list=(LF?m.filter(i=>i.kind===LF):m.filter(i=>rank(i)<3)).sort((a,b)=>(notCR(a)-notCR(b))||(rank(a)-rank(b))||(strong(b)-strong(a)));
  const fb=(k,n,lab)=>`<button type="button" class="stat" data-lf="${k}" aria-pressed="${LF===k}"><b>${n}</b><span>${esc(lab)}</span></button>`;
  $("#lstats").innerHTML=`<button type="button" class="stat" data-lexp="1" title="${esc(t("stat.allx"))}"><b>${m.length}</b><span>${esc(t("stat.items",{r:roleL(st.role).toLowerCase(),t:agel(tramo(st.age))}))}</span><em>${esc(t("stat.allx"))} →</em></button>`+fb("recomendacion",cnt("recomendacion"),t("stat.recs"))+fb("alerta",cnt("alerta"),t("stat.alerts"))+fb("obligacion",cnt("obligacion"),t("stat.oblig"))+`<div class="stat"><b>${new Set(m.map(i=>i.source)).size}</b><span>${esc(t("stat.sources"))}</span></div>`;
  const nCR=list.filter(i=>!notCR(i)).length;
  $("#lstate").innerHTML=`<span>${esc(LF?t("lectura.filtered",{n:list.length,k:t({recomendacion:"stat.recs",alerta:"stat.alerts",obligacion:"stat.oblig"}[LF])}):t("lectura.order"))} ${esc(t("lectura.cr",{n:nCR,m:list.length}))}</span>${LF?` <button type="button" class="pill" data-lf="">${esc(t("lectura.clear"))}</button>`:""}`;
  $("#lecturaList").innerHTML=list.slice(0,st.lshown).map(i=>card(i)).join("")||`<div class="empty">${esc(t("empty.items"))}</div>`;
  $("#lmore").hidden=list.length<=st.lshown;$("#lmore").textContent=t("lectura.more",{n:list.length-st.lshown});
  renderAlertas();renderTips();
}

/* ---------- Tips (E3.5): acción + por qué + semáforo de confianza + pliegue de evidencia ---------- */
const TIPS=(D.tips&&D.tips.tips)||[];
const tl=(x,f)=>(st.lang!=="es"&&x[f+"_"+st.lang])?x[f+"_"+st.lang]:x[f+"_es"];
const URG={alta:0,media:1,baja:2}, CONF={A:0,B:1,C:2};
function tipCard(x){
  const ev=x.evidence_ids.map(id=>{const i=BYID[id];if(!i)return"";const s=SRC[i.source];return `<li><p>${esc(itx(i))}</p><span class="cite">${apaLink(i.source,"("+ckey(s)+", "+pageTxt([i.page])+")")} · ${esc(t("card.id"))} ${id}</span></li>`}).join("");
  const cr=x.ancla_cr?`<p class="tcr ok"><b>${esc(t("tips.cr"))}</b> ${esc(x.ancla_cr.referencia)}</p>`:"";
  const ad=x.condicion_adaptacion?`<p class="tcr"><b>${esc(t(x.ancla_cr?"tips.cond":"tips.adapt"))}</b> ${esc(x.condicion_adaptacion)}</p>`:"";
  const age=x.advertencia_edad?`<div class="cv">${esc(t("tips.age"))} ${esc(x.advertencia_edad)}</div>`:"";
  const ages=x.edad.length===AGES.length?`<span class="b">${esc(t("card.allages"))}</span>`:x.edad.map(a=>`<span class="b age${AGES.findIndex(z=>z[0]===a)+1}">${agel(a)}</span>`).join("");
  return `<article class="item tip conf-${x.confianza}" id="c-${x.id}" tabindex="-1" aria-label="${esc(t("tips.card")+" "+x.id)}">
  <div class="row"><span class="b sem sem-${x.confianza}"><span class="dot" aria-hidden="true"></span>${esc(t("conf."+x.confianza))}</span><span class="b">${esc(th(x.tema))}</span>${ages}${x.estado!=="publicado"?`<span class="b na">${esc(t("tips.draft"))}</span>`:""}</div>
  <p class="tip-a">${esc(tl(x,"texto"))}</p>
  <p class="tip-w"><b>${esc(t("tips.why"))}</b> ${esc(tl(x,"por_que"))}</p>
  ${cr}${ad}${age}
  <div class="row tip-m"><span class="cite">${esc(t("tips.urg"))}: ${esc(t("lvl."+x.urgencia))}</span><span class="cite">${esc(t("tips.eff"))}: ${esc(t("lvl."+x.esfuerzo))}</span><span class="cite">${x.id}${x.transfer_id?" · "+x.transfer_id:""}</span>${saveBtn(x)}</div>
  <details class="prov"><summary>${esc(t("tips.ev",{n:x.evidence_ids.length}))}</summary><div class="pvb"><ul class="tev">${ev}</ul>${st.lang!=="es"?`<span class="cite">${esc(t("tips.esonly"))}</span>`:""}</div></details></article>`;
}
function renderTips(){
  if(!$("#tipList"))return;
  const tr=tramo(st.age), f=st.tf||"";
  let m=TIPS.filter(x=>x.edad.includes(tr)&&x.publico.includes(st.role)&&tipMatch(x));
  const n=m.length;
  if(f)m=m.filter(x=>x.confianza===f);
  m.sort((a,b)=>(URG[a.urgencia]-URG[b.urgencia])||(CONF[a.confianza]-CONF[b.confianza])||a.id.localeCompare(b.id));
  $("#tipNote").innerHTML=`<b>${esc(t("tips.note.h"))}</b> ${esc(t("tips.note"))}`;
  $("#tipFilt").innerHTML=["","A","B","C"].map(k=>`<button type="button" class="chip" data-tf="${k}" aria-pressed="${f===k}">${esc(k?t("conf."+k):t("tips.all"))} (${k?TIPS.filter(x=>x.edad.includes(tr)&&x.publico.includes(st.role)&&tipMatch(x)&&x.confianza===k).length:n})</button>`).join("");
  $("#tipState").textContent=t("tips.state",{n:m.length,r:roleL(st.role).toLowerCase(),t:agel(tr)});
  $("#tipList").innerHTML=m.map(tipCard).join("")||`<div class="empty">${esc(t("tips.empty"))}</div>`;
  renderProfile();
}

/* ---------- E4.1 Portada por perfiles · E4.2 Mi plan · E4.3 Hoja imprimible (v0.9) ---------- */
/* Solo localStorage de este navegador: IDs de tips, marcas «ya lo hago» y el perfil (rol + banda). Ningún dato personal. */
const TBY=Object.fromEntries(TIPS.map(x=>[x.id,x]));
const BANDAGE={"6-8":7,"9-11":10,"12-14":13,"15-18":16};
const tipSort=(a,b)=>(URG[a.urgencia]-URG[b.urgencia])||(CONF[a.confianza]-CONF[b.confianza])||a.id.localeCompare(b.id);
let PL={v:1,saved:[],done:{},why:true};
try{const p=JSON.parse(localStorage.getItem("coa.plan")||"null");if(p&&Array.isArray(p.saved))PL={v:1,saved:p.saved.filter(id=>TBY[id]),done:p.done||{},why:p.why!==false}}catch(e){}
const savePL=()=>{try{localStorage.setItem("coa.plan",JSON.stringify(PL))}catch(e){}};
try{const pf=JSON.parse(localStorage.getItem("coa.profile")||"null");if(pf&&ROLES.includes(pf.role))st.role=pf.role;if(pf&&BANDAGE[pf.band])st.age=BANDAGE[pf.band]}catch(e){}
const saveProf=()=>{try{localStorage.setItem("coa.profile",JSON.stringify({role:st.role,band:tramo(st.age)}))}catch(e){}};
const inPlan=id=>PL.saved.includes(id);
const saveBtn=x=>`<button type="button" class="pill save" data-save="${x.id}" aria-pressed="${inPlan(x.id)}" aria-label="${esc(t("plan.save")+" · "+x.id)}">${esc(t("plan.save"))}</button>`;
let SHARED=[];
try{const q=new URLSearchParams(location.search).get("plan");if(q)SHARED=[...new Set(q.split(","))].filter(id=>TBY[id]).slice(0,40)}catch(e){}

function renderProfile(){
  if(!$("#top5"))return;
  const tr=tramo(st.age);
  $("#profRole").innerHTML=ROLES.map(r=>`<button type="button" data-prole="${r}" aria-pressed="${r===st.role}">${esc(roleL(r))}</button>`).join("");
  $("#profBand").innerHTML=AGES.map((a,k)=>`<button type="button" class="bd bd${k+1}" data-pband="${a[0]}" aria-pressed="${a[0]===tr}">${esc(t("prof.years",{t:a[1]}))}<small>${esc(t("prof.cyc"+(k+1)))}</small></button>`).join("");
  const all=TIPS.filter(x=>x.edad.includes(tr)&&x.publico.includes(st.role)).sort(tipSort),top=all.slice(0,5);
  $("#profState").textContent=t("prof.top",{n:top.length,r:roleL(st.role).toLowerCase(),t:agel(tr)});
  $("#top5").innerHTML=top.map((x,k)=>`<li class="t5 conf-${x.confianza}"><span class="t5n" aria-hidden="true">${k+1}</span><div class="t5b"><p class="t5a">${esc(tl(x,"texto"))}</p><p class="t5w">${esc(tl(x,"por_que"))}</p><div class="row"><span class="b sem sem-${x.confianza}"><span class="dot" aria-hidden="true"></span>${esc(t("conf."+x.confianza))}</span><span class="b">${esc(th(x.tema))}</span>${saveBtn(x)}<a href="#parati/tips" class="t5go" data-tipgo="${x.id}">${esc(t("prof.ev"))}<span class="sr-only"> · ${x.id}</span></a></div></div></li>`).join("")||`<li class="empty">${esc(t("tips.empty"))}</li>`;
  $("#profAll").textContent=t("prof.all",{n:all.length});
  $("#profPlan").textContent=t("prof.plan",{n:PL.saved.length});
}
function syncSave(id){
  $$(`[data-save="${id}"]`).forEach(b=>b.setAttribute("aria-pressed",inPlan(id)));
  const pp=$("#profPlan");if(pp)pp.textContent=t("prof.plan",{n:PL.saved.length});
  renderSide();
}
function toggleSave(id){
  if(inPlan(id)){PL.saved=PL.saved.filter(x=>x!==id);delete PL.done[id]}else PL.saved.push(id);
  savePL();syncSave(id);
  announce(t(inPlan(id)?"plan.added":"plan.removed",{id:id,n:PL.saved.length}));
}
const planTips=()=>PL.saved.map(id=>TBY[id]).filter(Boolean).sort((a,b)=>(ROLES.indexOf(a.publico[0])-ROLES.indexOf(b.publico[0]))||tipSort(a,b));
const SITE="https://agmelendez.github.io/childrenandai/";
const baseURL=()=>/^https?:/.test(location.protocol)?location.origin+location.pathname:SITE;
const shareURL=()=>baseURL()+"?plan="+PL.saved.join(",")+(st.lang!=="es"?"&lang="+st.lang:"")+"#plan";
const bandsOf=x=>x.edad.length===AGES.length?t("card.allages"):x.edad.map(agel).join(", ");
function renderPlan(){
  if(!$("#planBody"))return;
  /* Enlace compartido: se ofrece, nunca se importa sin acción de la persona usuaria */
  const nw=SHARED.filter(id=>!inPlan(id));
  $("#planShared").innerHTML=SHARED.length?`<div class="note plan-sh" role="region" aria-label="${esc(t("plan.sh.h"))}"><p><b>${esc(t("plan.sh.h"))}</b> ${esc(t("plan.sh.p",{n:SHARED.length,m:nw.length}))}</p><ul>${SHARED.map(id=>`<li>${esc(tl(TBY[id],"texto"))} <span class="cite">${id}</span></li>`).join("")}</ul><div class="row">${nw.length?`<button type="button" class="btn" id="shAdd">${esc(t("plan.sh.add",{n:nw.length}))}</button>`:""}<button type="button" class="btn ghost" id="shDrop">${esc(t("plan.sh.drop"))}</button></div></div>`:"";
  const L=planTips(),n=L.length,d=L.filter(x=>PL.done[x.id]).length,pc=n?Math.round(100*d/n):0;
  if(!n){$("#planBody").innerHTML=`<div class="empty plan-empty"><p><b>${esc(t("plan.empty.h"))}</b></p><p>${esc(t("plan.empty"))}</p><p class="row" style="justify-content:center"><a class="btn" href="#inicio" data-nav="inicio">${esc(t("plan.empty.go"))}</a><a class="btn ghost" href="#parati/tips" data-nav="parati/tips">${esc(t("plan.empty.tips"))}</a></p><p class="cite">${esc(t("plan.privacy"))}</p></div>`;$("#printSheet").innerHTML="";return}
  const prog=`<div class="plan-prog"><div class="row" style="justify-content:space-between"><b id="progL">${esc(t("plan.prog",{d:d,n:n}))}</b><span class="cite">${pc} %</span></div><div class="bar" role="progressbar" aria-labelledby="progL" aria-valuemin="0" aria-valuemax="${n}" aria-valuenow="${d}" aria-valuetext="${esc(t("plan.prog",{d:d,n:n}))}"><i style="width:${pc}%"></i></div></div>`;
  const act=`<div class="row plan-act"><button type="button" class="btn" id="planPrint">${esc(t("plan.print"))}</button><button type="button" class="btn ghost" id="planShare">${esc(t("plan.share"))}</button><label class="chkl"><input type="checkbox" id="planWhy" ${PL.why?"checked":""}> ${esc(t("plan.why"))}</label><button type="button" class="btn ghost danger" id="planClear">${esc(t("plan.clear"))}</button></div><div id="shareBox"></div>${n>(PL.why?8:14)?`<p class="tipnote">${esc(t("plan.long",{n:n}))}</p>`:""}<p class="cite">${esc(t("plan.privacy"))}</p>`;
  const by={};L.forEach(x=>(by[x.publico[0]]=by[x.publico[0]]||[]).push(x));
  const list=Object.keys(by).map(r=>`<h3 class="sh plan-g">${esc(roleL(r))} <span class="cite">(${by[r].length})</span></h3><ul class="plan-l">${by[r].map(x=>`<li class="pi conf-${x.confianza}${PL.done[x.id]?" d":""}"><input type="checkbox" id="dn-${x.id}" data-done="${x.id}" ${PL.done[x.id]?"checked":""}><div class="pib"><label for="dn-${x.id}" class="pia">${esc(tl(x,"texto"))}</label><p class="t5w">${esc(tl(x,"por_que"))}</p><div class="row"><span class="b sem sem-${x.confianza}"><span class="dot" aria-hidden="true"></span>${esc(t("conf."+x.confianza))}</span><span class="b">${esc(bandsOf(x))}</span><span class="b">${esc(th(x.tema))}</span><span class="cite">${esc(t("plan.done"))}${PL.done[x.id]?" ✓":""} · ${x.id}</span><a href="#parati/tips" data-tipgo="${x.id}">${esc(t("prof.ev"))}<span class="sr-only"> · ${x.id}</span></a><button type="button" class="pill" data-save="${x.id}" aria-pressed="true" aria-label="${esc(t("plan.remove")+" · "+x.id)}">${esc(t("plan.remove"))}</button></div></div></li>`).join("")}</ul>`).join("");
  $("#planBody").innerHTML=prog+act+list;
  renderSheet(L);
}
function renderSheet(L){
  const dt=new Date().toLocaleDateString(st.lang==="en"?"en-GB":"es-CR",{year:"numeric",month:"long",day:"numeric"});
  const roles=[...new Set(L.flatMap(x=>x.publico))].map(roleL).join(", ");
  const srcs=[...new Set(L.flatMap(x=>x.evidence_ids.map(id=>BYID[id]&&BYID[id].source)).filter(Boolean))].sort((a,b)=>ckey(SRC[a]).localeCompare(ckey(SRC[b])));
  const cites=x=>[...new Set(x.evidence_ids.map(id=>BYID[id]&&ckey(SRC[BYID[id].source])).filter(Boolean))].join("; ");
  $("#printSheet").innerHTML=`<header class="ps-h"><div><b class="ps-brand">Children on AI</b><span>${esc(t("ps.sub"))}</span></div><div class="ps-meta"><b>${esc(t("ps.title"))}</b><span>${esc(t("ps.for",{r:roles}))} · ${esc(dt)}</span><span>${esc(t("plan.prog",{d:L.filter(x=>PL.done[x.id]).length,n:L.length}))}</span></div></header>
  <table class="ps-t"><thead><tr><th scope="col" class="c0">✓</th><th scope="col">${esc(t("ps.action"))}</th><th scope="col">${esc(t("ps.ages"))}</th><th scope="col">${esc(t("ps.conf"))}</th><th scope="col">${esc(t("ps.src"))}</th></tr></thead><tbody>${L.map(x=>`<tr><td class="c0"><span class="box">${PL.done[x.id]?"✓":""}</span></td><td><b>${esc(tl(x,"texto"))}</b>${PL.why?`<br><span class="w">${esc(tl(x,"por_que"))}</span>`:""}</td><td>${esc(bandsOf(x))}</td><td>${esc(t("ps.c"+x.confianza))}</td><td class="s">${esc(cites(x))}<br>${x.id}</td></tr>`).join("")}</tbody></table>
  <div class="ps-notes"><p><b>${esc(t("ps.notes"))}</b></p><div class="lines"><i></i><i></i><i></i></div></div>
  <footer class="ps-f"><p>${esc(t("ps.draft"))}</p><p>${esc(t("ps.refs"))} ${srcs.map(s=>esc(ckey(SRC[s]))).join("; ")}. ${esc(t("ps.full"))}</p><p>${esc(t("ps.lic"))} · ${esc(baseURL())}</p></footer>`;
}

/* ---------- E4.4 Búsqueda y filtros · E4.5 Módulos por público · E4.6 Costa Rica en contexto (v0.9) ---------- */
const norm=s=>String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
const TEMAS=[...new Set(TIPS.map(x=>x.tema))], CTXS=["casa","aula","politica"], EFFS=["bajo","medio","alto"];
Object.assign(st,{tq:"",tt:"",tc:"",te:""});
function tipControls(){
  const box=$("#tipFilt2");if(!box)return;
  const opt=(v,l,cur)=>`<option value="${esc(v)}" ${v===cur?"selected":""}>${esc(l)}</option>`;
  box.innerHTML=`<div><label class="lbl" for="tq">${esc(t("tf.q"))}</label><input type="search" id="tq" value="${esc(st.tq)}" placeholder="${esc(t("tf.qph"))}"></div>
  <div><label class="lbl" for="tt">${esc(t("tf.tema"))}</label><select id="tt">${opt("",t("tf.all"),st.tt)}${TEMAS.slice().sort((a,b)=>th(a).localeCompare(th(b),st.lang)).map(x=>opt(x,th(x),st.tt)).join("")}</select></div>
  <div><label class="lbl" for="tc">${esc(t("tf.ctx"))}</label><select id="tc">${opt("",t("tf.all"),st.tc)}${CTXS.map(x=>opt(x,t("ctx."+x),st.tc)).join("")}</select></div>
  <div><label class="lbl" for="te">${esc(t("tf.eff"))}</label><select id="te">${opt("",t("tf.all"),st.te)}${EFFS.map(x=>opt(x,t("lvl."+x),st.te)).join("")}</select></div>
  <div class="tfr"><button type="button" class="pill" id="tfReset">${esc(t("tf.reset"))}</button></div>`;
}
const tipMatch=x=>(!st.tt||x.tema===st.tt)&&(!st.tc||x.contexto.includes(st.tc))&&(!st.te||x.esfuerzo===st.te)&&(!st.tq||norm([x.id,x.texto_es,x.texto_en,x.por_que_es,x.por_que_en,x.tema,th(x.tema)].join(" ")).includes(norm(st.tq)));

/* Búsqueda global */
let GQ="";
function renderSearch(){
  const box=$("#gres");if(!box)return;const q=norm(GQ.trim());
  if(q.length<2){box.innerHTML=`<p class="cite">${esc(t("gs.min"))}</p>`;$("#gstate").textContent="";return}
  const has=s=>norm(s).includes(q);
  const tips=TIPS.filter(x=>has([x.id,x.texto_es,x.texto_en,x.por_que_es,x.por_que_en,th(x.tema)].join(" "))).sort(tipSort);
  const secs=[];Object.keys(VIEWS).forEach(v=>{if(has(t("v."+v)+" "+t("d."+v)))secs.push([v,"",t("v."+v),t("d."+v)]);VIEWS[v].forEach(sb=>{const l=subLabel(v,sb);if(has(l))secs.push([v,sb,t("v."+v)+" › "+l,""])})});
  const gl=GLO.filter(g=>has([g.k,g.k_en,g.long,g.long_en,g.def,g.def_en].join(" "))).slice(0,8);
  const its=IT.filter(i=>has([i.id,i.es,i.en,th(i.theme)].join(" ")));
  $("#gstate").textContent=t("gs.state",{a:tips.length,b:secs.length,c:gl.length,d:its.length,q:GQ.trim()});
  const sec=(h,n,body)=>`<section class="gsec" aria-labelledby="gs-${h}"><h3 class="sh" id="gs-${h}">${esc(t("gs."+h))} <span class="cite">(${n})</span></h3>${body}</section>`;
  box.innerHTML=(tips.length?sec("tips",tips.length,`<ul class="gl-l">${tips.slice(0,20).map(x=>`<li><a href="#parati/tips" data-tipgo="${x.id}">${esc(tl(x,"texto"))}</a> <span class="cite">${x.id} · ${esc(x.publico.map(roleL).join(", "))} · ${esc(bandsOf(x))}</span> ${saveBtn(x)}</li>`).join("")}</ul>${tips.length>20?`<p class="cite">${esc(t("gs.more",{n:tips.length-20}))}</p>`:""}`):"")
   +(secs.length?sec("secs",secs.length,`<ul class="gl-l">${secs.map(s=>`<li><a href="#${s[0]}${s[1]?"/"+s[1]:""}" data-nav="${s[0]}${s[1]?"/"+s[1]:""}">${esc(s[2])}</a>${s[3]?` <span class="cite">${esc(s[3])}</span>`:""}</li>`).join("")}</ul>`):"")
   +(gl.length?sec("gl",gl.length,`<dl class="gl">${gl.map(g=>`<dt>${esc(gk(g))}</dt><dd>${esc(loc(g,"long"))}: ${esc(loc(g,"def"))}</dd>`).join("")}</dl>`):"")
   +(its.length?sec("items",its.length,`<div class="grid2">${its.slice(0,6).map(i=>card(i)).join("")}</div><p><button type="button" class="btn ghost" id="gsEx">${esc(t("gs.ex",{n:its.length}))}</button></p>`):"")
   ||`<div class="empty">${esc(t("gs.none"))}</div>`;
}

/* Módulos por público */
const MOD=D.modules||{}, KITS=["familia","docente","direccion"];
let KS={};try{KS=JSON.parse(localStorage.getItem("coa.kit")||"{}")}catch(e){}
const saveKS=()=>{try{localStorage.setItem("coa.kit",JSON.stringify(KS))}catch(e){}};
st.kb=st.kb||{};
const ml=(o,f)=>o[f+"_"+st.lang]||o[f+"_es"];
const bt=b=>b[st.lang]||b.es;
function refs(b){
  const tp=b.tips.map(id=>`<a href="#parati/tips" class="kt" data-tipgo="${id}" title="${esc(TBY[id]?tl(TBY[id],"texto"):"")}">${id}</a>`);
  const it=b.items.map(id=>{const i=BYID[id];return i?`<details class="kref"><summary>${id} · ${esc(ckey(SRC[i.source]))}</summary>${card(i)}</details>`:""});
  return (tp.length||it.length)?`<div class="krefs"><span class="cite">${esc(t("kit.basis"))}</span> ${tp.join(" ")}${it.join("")}</div>`:"";
}
function modBlock(kit,m,k){
  const key=kit+"."+m.id;let body="";
  if(m.tipo==="tarjetas"||m.tipo==="escenarios"){
    const bs=Object.keys(m.bandas),cur=st.kb[key]||(bs.includes(tramo(st.age))?tramo(st.age):bs[0]);
    body=`<div class="seg kbands" role="group" aria-label="${esc(t("prof.band"))}">${bs.map(b=>`<button type="button" data-kband="${key}|${b}" aria-pressed="${b===cur}">${esc(t("prof.years",{t:agel(b)}))}</button>`).join("")}</div><ul class="kcards ${m.tipo}">${m.bandas[cur].map(b=>`<li class="kcard">${m.tipo==="escenarios"?(()=>{const [s,r]=bt(b).split(" → ");return `<p class="ksit"><b>${esc(t("kit.sit"))}</b> ${esc(s)}</p><p><b>${esc(t("kit.resp"))}</b> ${esc(r||"")}</p>`})():`<p class="kq">${esc(bt(b))}</p>`}${refs(b)}</li>`).join("")}</ul>`;
  }else if(m.tipo==="acuerdo"){
    body=m.secciones.map((s,si)=>`<fieldset class="ksec"><legend>${esc(bt(s))}</legend>${s.items.map((b,bi)=>{const id=`k-${key.replace(".","-")}-${si}-${bi}`;return `<div class="kchk"><input type="checkbox" id="${id}" data-kchk="${id}" ${KS[id]?"checked":""}><div><label for="${id}">${esc(bt(b))}</label>${refs(b)}</div></div>`}).join("")}</fieldset>`).join("")
     +`<div class="knotes"><label class="lbl" for="kn-${m.id}">${esc(t("kit.own"))}</label><textarea id="kn-${m.id}" data-knote="${key}" rows="4">${esc(KS["n:"+key]||"")}</textarea><p class="cite">${esc(t("plan.privacy"))}</p></div><div class="ksign"><span>${esc(t("kit.sign"))}</span><span>${esc(t("kit.date"))}</span></div>`;
  }else if(m.tipo==="lista"){
    body=`<ul class="klist">${m.items.map((b,bi)=>{const id=`k-${key.replace(".","-")}-${bi}`;return `<li class="kchk"><input type="checkbox" id="${id}" data-kchk="${id}" ${KS[id]?"checked":""}><div><label for="${id}">${esc(bt(b))}</label>${refs(b)}</div></li>`}).join("")}</ul>`;
  }else if(m.tipo==="prompts"){
    body=`<ul class="kprompts">${m.items.map(b=>`<li><p class="kp">${esc(bt(b))}</p><div class="row"><button type="button" class="pill" data-copy="${esc(bt(b).replace(/^[«“]|[»”].*$/g,""))}">${esc(t("kit.copy"))}</button></div>${refs(b)}</li>`).join("")}</ul>`;
  }else if(m.tipo==="pasos"){
    body=`<ol class="ksteps">${m.items.map(b=>{const [h,...r]=bt(b).split(": ");return `<li><p><b>${esc(h)}:</b> ${esc(r.join(": "))}</p>${refs(b)}</li>`}).join("")}</ol>`;
  }
  return `<article class="kmod" id="km-${m.id}" aria-labelledby="kh-${m.id}"><div class="kmh"><h3 class="sh" id="kh-${m.id}">${esc(ml(m,"titulo"))}</h3><button type="button" class="btn ghost kprint" data-kprint="km-${m.id}">${esc(t("kit.print"))}<span class="sr-only">: ${esc(ml(m,"titulo"))}</span></button></div><p class="lead">${esc(ml(m,"intro"))}</p>${body}<p class="kfoot cite">${esc(t("kit.foot"))}</p></article>`;
}
function renderKit(){
  KITS.forEach(k=>{const el=$("#kit-"+k);if(el)el.innerHTML=`<p class="tipnote">${esc(t("kit.note"))}</p>`+(MOD[k]||[]).map((m,i)=>modBlock(k,m,i)).join("")});
}

/* Costa Rica en contexto */
const CTX=D.ctx||{};let CDIM=0;
function ctxCite(p){const c=((D.ctxsrc||{}).fuentes_contexto||[]).find(x=>x.id==="C01");return `<a href="#contexto" class="ref" data-ctxapa="1">(${esc(t("cx.ilia.c"))}, ${esc(t("prov.p"))} ${esc(p)})</a>`}
function renderCtx(){
  const el=$("#ctxBody");if(!el||!CTX.ilia)return;
  const I=CTX.ilia,dims=st.lang==="en"?I.dims_en:I.dims_es,rows=I.paises.slice().sort((a,b)=>b[CDIM+1]-a[CDIM+1]);
  const W=640,rh=22,top=8,L=150,H=top+rows.length*rh+24,sx=v=>L+(v/100)*(W-L-50);
  const bars=rows.map((r,k)=>{const y=top+k*rh,cr=r[0]==="Costa Rica";return `<g class="cxr${cr?" cr":""}"><text x="${L-8}" y="${y+15}" text-anchor="end">${esc(r[0])}</text><rect x="${L}" y="${y+3}" width="${sx(r[CDIM+1])-L}" height="${rh-7}" rx="3"/><text class="v" x="${sx(r[CDIM+1])+6}" y="${y+15}">${String(r[CDIM+1]).replace(".",st.lang==="es"?",":".")}</text></g>`}).join("");
  const grid=[0,35,60,100].map(v=>`<line x1="${sx(v)}" x2="${sx(v)}" y1="${top}" y2="${H-20}" class="gl${v===35||v===60?" th":""}"/><text x="${sx(v)}" y="${H-6}" text-anchor="middle" class="ax">${v}</text>`).join("");
  const rk=rows.findIndex(r=>r[0]==="Costa Rica")+1;
  el.innerHTML=`<div class="stats cxd">${CTX.datos.map(d=>`<div class="stat"><b>${esc(st.lang==="en"?d.v.replace(",","."):d.v)}</b><span>${esc(bt(d))}</span><em class="cite">${ctxCite(d.p)}</em></div>`).join("")}</div>
  <section class="cxsec" aria-labelledby="cx-h1"><h3 class="sh" id="cx-h1">${esc(t("cx.h1"))}</h3><p class="lead">${esc(t("cx.p1"))}</p>
  <div class="seg" role="group" aria-label="${esc(t("cx.dim"))}">${dims.map((d,k)=>`<button type="button" data-cdim="${k}" aria-pressed="${k===CDIM}">${esc(d)}</button>`).join("")}</div>
  <p class="lstate" aria-live="polite">${esc(t("cx.rank",{d:dims[CDIM],n:rk,m:rows.length}))}</p>
  <div class="scroller gfx"><svg class="cxchart" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="cx-ct"><title id="cx-ct">${esc(t("cx.chart",{d:dims[CDIM],n:rk,m:rows.length}))}</title>${grid}${bars}</svg></div>
  <p class="cite">${esc(t("cx.bands"))}</p>
  ${altTable([t("cx.country"),...dims],I.paises.map(r=>[r[0],...r.slice(1).map(v=>String(v))]),t("cx.h1"))}
  <p class="srcline"><b>${esc(t("prov.nota"))}</b> ${esc(t("cx.src"))} ${ctxCite("22")}. ${esc(bt({es:I.nota_es,en:I.nota_en}))} ${esc(t("cx.disc"))}</p></section>
  <section class="cxsec" aria-labelledby="cx-h2"><h3 class="sh" id="cx-h2">${esc(t("cx.h2"))}</h3><p class="lead">${esc(t("cx.p2"))}</p><div class="grid2">${CTX.ninez_items.map(id=>BYID[id]?card(BYID[id]):"").join("")}</div></section>
  <section class="cxsec" aria-labelledby="cx-h3"><h3 class="sh" id="cx-h3">${esc(t("cx.h3"))}</h3><p class="lead">${esc(t("cx.p3"))}</p><div class="grid2">${CTX.marco_items.map(id=>BYID[id]?card(BYID[id]):"").join("")}</div></section>
  <section class="cxsec" aria-labelledby="cx-h4"><h3 class="sh" id="cx-h4">${esc(t("cx.h4"))}</h3><ul class="klist cxv">${CTX.vacios.map(b=>`<li><p>${esc(bt(b))}</p>${refs(b)}</li>`).join("")}</ul></section>
  <details class="alt" id="ctxApa"><summary>${esc(t("cx.apa"))}</summary><p class="hint">${phm(esc((((D.ctxsrc||{}).fuentes_contexto||[]).find(x=>x.id==="C01")||{}).apa7||"").replace(/\*(.+?)\*/g,"<em>$1</em>"))}</p></details>`;
}

/* ---------- Alertas ---------- */
function renderAlertas(){
  const tr=tramo(st.age),al=IT.filter(i=>i.kind==="alerta"&&(i.ages||[]).includes(tr)&&(i.audiences||[]).includes(st.role));
  const by={};al.forEach(i=>(by[i.theme]=by[i.theme]||[]).push(i));
  const ks=Object.keys(by).sort((a,b)=>th(a).localeCompare(th(b),st.lang));
  $("#alFuentes").innerHTML=`<p class="cite" style="margin-bottom:10px">${esc(t("alertas.count",{n:al.length,r:roleL(st.role).toLowerCase(),t:agel(tr),a:st.age}))}</p>`+(ks.map(k=>`<h4 style="margin:14px 0 8px;font:700 1.05rem var(--f-display);color:var(--navy)">${esc(th(k))}</h4><div class="grid2">${by[k].map(i=>card(i)).join("")}</div>`).join("")||`<div class="empty">${esc(t("alertas.none"))}</div>`);
  $("#alDatos").innerHTML=`<div class="grid2">${ID.datos.map(d=>{const x=bl(d);return `<article class="item" style="border-color:var(--warn)"><h3>${esc(x[0])}</h3><p>${esc(x[1])}</p><div class="row">${d.refs.map(r=>`<button class="pill" data-open="${r}" type="button">${r} · ${esc(t("card.pdf",{p:BYID[r]?BYID[r].page:""}))}</button>`).join("")}</div><p class="srcline"><b>${esc(t("prov.nota"))}</b> ${d.refs.length?t("prov.alert",{c:inText(d.refs)}):t("prov.corpus")} ${esc(t("prov.pdfnote"))}</p></article>`}).join("")}</div><div id="alOpen" class="grid2" style="margin-top:12px"></div>`;
}

/* ---------- Diagramas ---------- */
const DG=["mediacion","tutor","resp","sist","comp"];
function altTable(cols,rows,cap){return `<details class="alt"><summary>${esc(t("alt.summary"))}</summary><p class="hint">${esc(t("alt.hint"))}</p><div class="tw" tabindex="0" role="region" aria-label="${esc(cap)}"><table><caption class="sr-only">${esc(cap)}</caption><thead><tr>${cols.map(c=>`<th scope="col">${esc(c)}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,k)=>k===0?`<th scope="row">${esc(c)}</th>`:`<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></details>`}
function altText(txt){return `<details class="alt"><summary>${esc(t("alt.summary"))}</summary><p class="hint">${esc(txt)}</p></details>`}
function figMediacion(){
  const it=BYID["S11-18"];let f=loc(it,"figure").value;const fes=it.figure.value;
  const names=Object.keys(f),fv=Object.values(fes);if(Object.keys(f).length!==Object.keys(fes).length)f=fes;
  const cols=["var(--a3)","var(--a2)","var(--a1)"],lab=[0,1,2].map(k=>t("med.series"+k));
  const W=720,L=270,S=(W-L-30)/50;let y=40,o=`<svg viewBox="0 0 ${W} 420" role="group" aria-label="${esc(t("med.aria"))}" focusable="false"><text class="mono" aria-hidden="true" x="${L}" y="14">${esc(t("med.axis"))}</text>`;
  [0,10,20,30,40,50].forEach(v=>{o+=`<line x1="${L+v*S}" y1="24" x2="${L+v*S}" y2="400" stroke="var(--line)" opacity=".6"/><text class="mono" aria-hidden="true" x="${L+v*S}" y="414" text-anchor="middle">${v}</text>`});
  names.forEach(n=>{const vals=f[n];o+=`<text x="${L-8}" y="${y+10}" text-anchor="end">${esc(n.length>44?n.slice(0,43)+"…":n)}</text>`;vals.forEach((v,k)=>{if(!st.ser[k])return;o+=`<g class="clk" tabindex="0" role="button" data-open="S11-18" aria-label="${esc(n+", "+lab[k]+": "+v+" %")}"><rect x="${L}" y="${y}" width="${v*S}" height="9" rx="2" fill="${cols[k]}"/></g><text class="mono" aria-hidden="true" x="${L+v*S+4}" y="${y+8}">${v}</text>`;y+=11});y+=14});
  o+=`</svg>`;
  const rows=names.map(n=>[n,...f[n].map(v=>v+" %")]);
  return `<figure class="fig"><div class="row gfx" role="group" aria-label="${esc(t("dg.mediacion"))}">${lab.map((l,k)=>`<button class="chip" type="button" data-ser="${k}" aria-pressed="${st.ser[k]}"><i class="sw" style="background:${cols[k]};margin-right:6px;border-color:var(--ink)"></i>${esc(l)}</button>`).join("")}</div><div class="wide gfx">${o}</div>${altTable([t("med.activity"),...lab],rows,t("med.axis"))}<figcaption>${t("med.cap")}</figcaption></figure>`;
}
function figTutor(){
  return `<figure class="fig"><div class="wide gfx"><svg viewBox="0 0 720 300" role="group" aria-label="${esc(t("tut.aria"))}" focusable="false">
  <line x1="60" y1="40" x2="60" y2="250" stroke="var(--line)"/><line x1="60" y1="250" x2="680" y2="250" stroke="var(--line)"/>
  <text class="mono" x="60" y="26">${esc(t("tut.y"))}</text><text x="205" y="272" text-anchor="middle">${esc(t("tut.x1"))}</text><text x="535" y="272" text-anchor="middle">${esc(t("tut.x2"))}</text><line x1="370" y1="40" x2="370" y2="250" stroke="var(--line)" stroke-dasharray="4 4"/>
  <line x1="60" y1="150" x2="680" y2="150" stroke="var(--muted)" stroke-dasharray="6 5"/><text class="mut" x="684" y="154" style="font-size:11px">${esc(t("tut.base"))}</text>
  <path d="M60 150 L370 78 L680 212" fill="none" stroke="var(--bad)" stroke-width="3.5"/>
  <path d="M60 150 L370 108 L680 158" fill="none" stroke="var(--a3)" stroke-width="3.5"/>
  <g class="clk" tabindex="0" role="button" data-open="S01-01" aria-label="${esc(t("tut.basic1")+": "+t("tut.basic2"))}"><rect x="400" y="198" width="190" height="42" rx="6" fill="var(--bad-bg)"/><text x="410" y="216" style="fill:var(--bad)">${esc(t("tut.basic1"))}</text><text x="410" y="231" style="fill:var(--bad);font-size:10.5px">${esc(t("tut.basic2"))}</text></g>
  <g class="clk" tabindex="0" role="button" data-open="S01-02" aria-label="${esc(t("tut.safe1")+": "+t("tut.safe2"))}"><rect x="430" y="44" width="250" height="42" rx="6" fill="var(--soft)"/><text x="440" y="62">${esc(t("tut.safe1"))}</text><text x="440" y="77" style="font-size:10.5px">${esc(t("tut.safe2"))}</text></g>
  <g class="clk" tabindex="0" role="button" data-open="S01-03" aria-label="${esc(t("tut.short1")+" "+t("tut.short2"))}"><rect x="76" y="176" width="250" height="42" rx="6" fill="var(--soft)"/><text x="86" y="194">${esc(t("tut.short1"))}</text><text x="86" y="209" style="font-size:10.5px">${esc(t("tut.short2"))}</text></g>
  </svg></div>${altText(t("tut.text"))}<figcaption>${t("tut.cap")}</figcaption></figure>`;
}
const RESP=[
 {id:"gob",x:225,y:10,w:250,h:56,refs:["S08-01","S13-30","S04-24","S13-13"]},
 {id:"org",x:225,y:100,w:250,h:56,refs:["S03-03","S03-11","S03-18","S08-11","S08-08"]},
 {id:"esc",x:40,y:200,w:210,h:56,refs:["S13-03","S06-06","S04-20","S06-15","S01-15"]},
 {id:"fam",x:450,y:200,w:210,h:56,refs:["S11-16","S03-06","S06-01","S13-03"]},
 {id:"nin",x:235,y:300,w:240,h:56,refs:["S03-04","S03-06","S03-05","S06-07"]}
];
function figResp(){
  const L=(x1,y1,x2,y2,c,d)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--${c})" stroke-width="2.2" ${d?'stroke-dasharray="5 4"':'marker-end="url(#ar)"'}/>`;
  const x1=t("resp.x1"),x2=t("resp.x2");
  let o=`<svg viewBox="0 0 700 370" role="group" aria-label="${esc(t("resp.aria"))}" focusable="false"><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--blue)"/></marker></defs>`;
  o+=L(350,66,350,98,"blue")+`<text class="mono" x="360" y="86">${esc(t("resp.a1"))}</text>`;
  o+=L(350,156,350,298,"blue")+`<text class="mono" x="340" y="186" text-anchor="end">${esc(t("resp.a2"))}</text>`;
  o+=L(145,256,290,298,"blue")+`<text class="mono" x="40" y="292">${esc(t("resp.a3"))}</text>`;
  o+=L(555,256,420,298,"blue")+`<text class="mono" x="500" y="292">${esc(t("resp.a4"))}</text>`;
  o+=L(478,128,555,198,"bad",1)+L(222,128,145,198,"bad",1);
  o+=`<circle cx="516" cy="163" r="11" fill="var(--bad-bg)" stroke="var(--bad)"/><text x="516" y="167" text-anchor="middle" style="fill:var(--bad);font-weight:700">✕</text><circle cx="184" cy="163" r="11" fill="var(--bad-bg)" stroke="var(--bad)"/><text x="184" y="167" text-anchor="middle" style="fill:var(--bad);font-weight:700">✕</text>`;
  o+=`<text class="mono" x="532" y="152" style="fill:var(--bad)">${esc(x1)}</text><text class="mono" x="532" y="165" style="fill:var(--bad)">${esc(x2)}</text><text class="mono" x="168" y="152" text-anchor="end" style="fill:var(--bad)">${esc(x1)}</text><text class="mono" x="168" y="165" text-anchor="end" style="fill:var(--bad)">${esc(x2)}</text>`;
  RESP.forEach(r=>{o+=`<g class="clk" tabindex="0" role="button" data-resp="${r.id}" aria-label="${esc(t("resp."+r.id)+" · "+t("alt.cite")+": "+r.refs.join(", "))}"><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="8" fill="var(--soft)" stroke="var(--line)"/><text x="${r.x+r.w/2}" y="${r.y+r.h/2+4}" text-anchor="middle" style="font-weight:600">${esc(t("resp."+r.id))}</text></g>`});
  return o+`</svg>`;
}
const SIST=[["r1",24,38,"S04-22"],["r2",21,24,"S04-25"],["r3",22,38,"S04-20"],["r4",7,38,"S04-15"],["r5",15,38,"S04-16"],["r6",25,38,"S04-29"],["r7",28,38,"S04-35"]];
function figSist(){
  let o=`<svg viewBox="0 0 720 ${SIST.length*40+30}" role="group" aria-label="${esc(t("sist.aria"))}" focusable="false">`;
  SIST.forEach((r,k)=>{const y=14+k*40,lab=t("sist."+r[0]);o+=`<g class="clk" tabindex="0" role="button" data-open="${r[3]}" aria-label="${esc(lab+": "+t("sist.of",{a:r[1],b:r[2]}))}"><rect x="0" y="${y-8}" width="720" height="34" rx="6" fill="transparent"/><text x="0" y="${y+4}">${esc(lab)}</text>`;for(let j=0;j<r[2];j++)o+=`<circle cx="${8+j*13.6}" cy="${y+18}" r="4.6" fill="${j<r[1]?"var(--a3)":"var(--line)"}"/>`;o+=`<text x="${8+r[2]*13.6+6}" y="${y+22}" style="font-weight:700">${esc(t("sist.of",{a:r[1],b:r[2]}))}</text></g>`});
  return o+`</svg>`;
}
function figComp(){
  const dims=[["d1","S12-01",["S12-04","S12-05","S12-06"]],["d2","S12-02",["S12-07","S12-08","S12-09"]],["d3","S12-03",["S12-10","S12-11","S12-12"]],["d4","S12-46",["S12-13","S12-14","S12-15"]]];
  const nm=id=>itx(BYID[id]).split(" (")[0];
  let o=`<div class="wide"><div role="group" aria-label="${esc(t("dg.comp"))}" style="display:grid;grid-template-columns:minmax(140px,1fr) repeat(3,minmax(160px,1.3fr));gap:6px;min-width:calc(660px * var(--fs))"><div></div>${["l1","l2","l3"].map(l=>`<div class="lbl" style="margin:0;padding:4px">${esc(t("comp."+l))}</div>`).join("")}`;
  dims.forEach(d=>{o+=`<button type="button" class="pill" style="border-radius:8px;font-weight:600" data-open="${d[1]}">${esc(t("comp."+d[0]))}</button>`;d[2].forEach((id,k)=>{o+=`<button type="button" data-open="${id}" style="border:1px solid var(--line);border-radius:8px;background:var(--a${k+1});color:var(--a${k+1}i);padding:10px;font:500 .88rem var(--f-body);cursor:pointer;text-align:left" aria-label="${esc(t("comp."+d[0])+" · "+t("comp.l"+(k+1))+": "+nm(id))}">${esc(nm(id))}</button>`})});
  return o+`</div></div><figcaption>${t("comp.cap")}</figcaption>`;
}
function renderDg(){
  const b=$("#dgBody");
  if(st.dg==="mediacion")b.innerHTML=figMediacion();
  if(st.dg==="tutor")b.innerHTML=figTutor();
  if(st.dg==="resp")b.innerHTML=`<figure class="fig"><div class="wide gfx">${figResp()}</div>${altText(t("resp.text")+" "+RESP.map(r=>t("resp."+r.id)+": "+r.refs.join(", ")+".").join(" "))}<figcaption>${t("resp.cap")}</figcaption></figure>`;
  if(st.dg==="sist")b.innerHTML=`<figure class="fig"><div class="wide gfx">${figSist()}</div>${altTable([t("sist.col1"),t("sist.col2"),t("sist.col3")],SIST.map(r=>[t("sist."+r[0]),String(r[1]),String(r[2])]),t("dg.sist"))}<div class="stats"><button class="stat" type="button" data-open="S04-17"><b>29 %</b><span>${esc(t("sist.talis1"))}</span></button><button class="stat" type="button" data-open="S04-18"><b>25 %</b><span>${esc(t("sist.talis2"))}</span></button></div><figcaption>${t("sist.cap")}</figcaption></figure>`;
  if(st.dg==="comp")b.innerHTML=`<figure class="fig">${figComp()}</figure>`;
  b.insertAdjacentHTML("beforeend",`<p class="srcline">${srcNoteInner(st.dg)}</p>`);
  $("#dgDetail").innerHTML="";
  b.setAttribute("aria-labelledby","tab-diagramas-"+st.dg);
  syncAlt();
}
function syncAlt(){if(P.text)$$("details.alt").forEach(d=>d.open=true)}

/* ---------- Mapa de evidencia + explorador ---------- */
const THS=()=>THEMES.slice().sort((a,b)=>th(a).localeCompare(th(b),st.lang));
function renderHeat(){
  const cols=[...AGES.map(a=>a[0]),"sin"],labs=[...AGES.map(a=>a[1]),t("ev.noage")];
  let o=`<div class="h">${esc(t("ev.theme"))}</div>${labs.map(l=>`<div class="h">${esc(l)}</div>`).join("")}`;
  const ths=THS();
  const cells=ths.map(x=>cols.map(c=>{const s=IT.filter(i=>i.theme===x&&(c==="sin"?!(i.ages||[]).length:(i.ages||[]).includes(c)));return{n:s.length,s:new Set(s.map(i=>i.source)).size}}));
  const mx=Math.max(...cells.flat().map(c=>c.n));
  ths.forEach((x,r)=>{o+=`<div class="r">${esc(th(x))}</div>`;cols.forEach((c,k)=>{const v=cells[r][k],lv=v.n===0?0:Math.min(3,1+Math.floor(v.n/(mx/3.01)));o+=`<button type="button" data-heat="${esc(x)}|${c}" aria-label="${esc(t("ev.cell",{t:th(x),a:labs[k],n:v.n,s:v.s}))}" style="background:var(--a${lv});color:var(--a${lv}i)">${v.n}<small aria-hidden="true">${v.s}</small></button>`})});
  $("#heat").innerHTML=o;$("#heat").setAttribute("aria-label",t("ev.h2"));
}
function filters(){
  const sel=(id,lab,opts,cur)=>`<div><label class="lbl" for="${id}">${esc(lab)}</label><select id="${id}"><option value="">${esc(t("ex.all"))}</option>${opts.map(o=>`<option value="${esc(o[0])}" ${o[0]===cur?"selected":""}>${esc(o[1])}</option>`).join("")}</select></div>`;
  const e=st.ex;
  $("#filters").innerHTML=`<div><label class="lbl" for="q">${esc(t("ex.q"))}</label><input type="search" id="q" value="${esc(e.q)}" placeholder="${esc(t("ex.qph"))}"></div>`+
   sel("fk",t("ex.kind"),KINDS.map(k=>[k,t("kind."+k)]),e.kind)+sel("ft",t("ex.theme"),THS().map(x=>[x,th(x)]),e.theme)+sel("fs",t("ex.src"),CAT.map(c=>[c.id,c.id+" · "+loc(c,"corto")]),e.src)+sel("fa",t("ex.age"),AGES.map(a=>[a[0],t("ex.agesuf",{a:a[1]})]),e.age)+sel("fu",t("ex.aud"),ROLES.map(r=>[r,roleL(r)]),e.aud)+sel("fr",t("ex.str"),STRS.map(s=>[s,t("str."+s)]),e.str);
  $("#explorador").textContent=t("ex.h2",{n:IT.length});
}
function exFilter(){
  const e=st.ex,q=e.q.toLowerCase();
  return IT.filter(i=>(!e.kind||i.kind===e.kind)&&(!e.theme||i.theme===e.theme)&&(!e.src||i.source===e.src)&&(!e.age||(e.age==="sin"?!(i.ages||[]).length:(i.ages||[]).includes(e.age)))&&(!e.aud||(i.audiences||[]).includes(e.aud))&&(!e.str||i.strength===e.str)&&(!q||(i.es+" "+(i.en||"")+" "+i.quote+" "+th(i.theme)).toLowerCase().includes(q)));
}
function renderEx(announceIt){
  const m=exFilter(),msg=t("ex.count",{n:m.length,m:IT.length});$("#exCount").textContent=msg;
  $("#exList").innerHTML=m.slice(0,st.shown).map(i=>card(i)).join("")||`<div class="empty">${esc(t("ex.none"))}</div>`;
  $("#more").hidden=m.length<=st.shown;
  if(announceIt)announce(msg);
}

/* ---------- Guías, escenarios, marco, fuentes ---------- */
function renderGuia(){
  const tr=tramo(st.age),m=IT.filter(i=>["recomendacion","obligacion"].includes(i.kind)&&(i.ages||[]).includes(tr)&&(i.audiences||[]).includes(st.role));
  const by={};m.forEach(i=>(by[i.theme]=by[i.theme]||[]).push(i));
  const ks=Object.keys(by).sort((a,b)=>th(a).localeCompare(th(b),st.lang));
  $("#guiaBody").innerHTML=`<span class="cite">${esc(t("guia.count",{n:m.length,r:roleL(st.role),t:agel(tr)}))}</span>`+(ks.map((k,n)=>`<details ${n<2?"open":""}><summary style="font:700 1.05rem var(--f-display);color:var(--navy)">${esc(th(k))} (${by[k].length})</summary><div style="display:grid;gap:8px;margin-top:8px">${by[k].map(i=>`<div class="chk ${st.done[i.id]?"d":""}"><input type="checkbox" id="ck-${i.id}" data-chk="${i.id}" ${st.done[i.id]?"checked":""}><label for="ck-${i.id}">${esc(itx(i))}</label><button type="button" class="pill" data-open="${i.id}">${i.source} · ${esc(t("card.pdf",{p:i.page}))}</button></div>`).join("")}</div></details>`).join("")||`<div class="empty">${esc(t("guia.none"))}</div>`);
}
function renderEsc(){
  $("#escList").innerHTML=ID.esc.map(e=>{const x=bl(e),rx=new RegExp(e.rx,"i"),rel=IT.filter(i=>(i.ages||[]).includes(e.a)&&rx.test(i.es+" "+(i.en||""))).slice(0,5);
   return `<article class="item"><span class="b alerta">${esc(t("esc.badge"))}</span><h3>${esc(x.t)}</h3><span class="cite">${esc(t("esc.tramo",{t:agel(e.a)}))}</span><ul style="margin:0;padding-left:18px;font-size:.93rem">${x.q.map(z=>`<li>${esc(z)}</li>`).join("")}</ul><details><summary>${esc(t("esc.related",{n:rel.length}))}</summary><div style="display:grid;gap:8px;margin-top:8px">${rel.map(i=>`<div class="fg">${esc(itx(i))} <button class="pill" type="button" data-open="${i.id}">${i.source} · ${esc(t("card.pdf",{p:i.page}))}</button></div>`).join("")||esc(t("esc.none"))}</div></details></article>`}).join("");
}
function renderNorm(){
  $("#twNorm").setAttribute("aria-label",t("marco.cap"));
  $("#tNorm").innerHTML=`<caption class="sr-only">${esc(t("marco.cap"))}</caption><thead><tr>${[1,2,3,4,5].map(k=>`<th scope="col">${esc(t("marco.c"+k))}</th>`).join("")}</tr></thead><tbody>${ID.norm.map(r=>{const x=bl(r);let ids=[];
   if(r.refs)ids=r.refs;else if(r.pages)ids=r.pages.flatMap(p=>IT.filter(i=>i.source===r.src&&i.page===p).slice(0,1).map(i=>i.id));
   const cls=r.kind==="prop"?"obligacion":r.kind==="draft"?"alerta":"";
   return `<tr><th scope="row" style="background:none"><b>${esc(x[0])}</b></th><td>${esc(x[1])}</td><td><span class="b ${cls}">${esc(x[2])}</span></td><td>${esc(x[3])}</td><td>${ids.filter(z=>BYID[z]).map(z=>`<button class="pill" type="button" data-open="${z}">${z} · ${esc(t("card.pdf",{p:BYID[z].page}))}</button>`).join(" ")}<br><span class="cite">${inText(ids)}</span></td></tr>`}).join("")}</tbody>`;
}
function renderFuentes(){
  const q=$("#q2").value.toLowerCase();
  const m=CAT.filter(s=>!q||(s.titulo+" "+(s.autores||[]).join(" ")+" "+s.organizacion+" "+s.corto+" "+(s.corto_en||"")).toLowerCase().includes(q));
  $("#fuentesList").innerHTML=m.map(s=>{const its=IT.filter(i=>i.source===s.id),ks={};its.forEach(i=>ks[i.kind]=(ks[i.kind]||0)+1);const al=loc(s,"alertas")||[];
   return `<article class="item"><div class="row"><span class="b">${s.id}</span><span class="b">${esc(loc(s,"jurisdiccion"))}</span><span class="b">${esc(t("fu.pp",{n:s.paginas_pdf}))}</span></div><h3>${esc(s.titulo)}</h3><span class="cite">${esc(s.organizacion)} · ${esc(s.anio)}</span><p style="font-size:.92rem">${esc(loc(s,"contenido"))}</p><div class="row"><span class="b">${esc(t("fu.auth"))}: ${esc(loc(s,"autoridad").split(" (")[0])}</span><span class="b">${esc(t("fu.rel"))}: ${esc(loc(s,"relevancia").split(" (")[0])}</span></div><div class="fg"><b>${its.length}</b> ${esc(t("fu.items"))} · ${Object.entries(ks).map(([k,v])=>v+" "+t("kind."+k).toLowerCase()).join(" · ")}</div><span class="cite"><b>${esc(t("fu.state"))}:</b> ${esc(loc(s,"estado_normativo"))}<br><b>${esc(t("fu.tcr"))}:</b> ${esc(loc(s,"transferibilidad_cr"))}</span>${al.length?`<div class="cv">${al.map(esc).join("<br>")}</div>`:""}<button class="pill" type="button" data-src="${s.id}">${esc(t("fu.see"))}</button></article>`}).join("");
  const ph=h=>h.replace(/\[([^\]]*completar[^\]]*|[^\]]*confirmar[^\]]*)\]/gi,(m)=>`<mark class="ph" title="${esc(t("prov.ph"))}">${m}</mark>`);
  $("#refsLead").innerHTML=`${t("prov.refs.lead")} ${esc(t("prov.refs.page"))}`;
  $("#refs").innerHTML=CAT.slice().sort((a,b)=>a.apa7.localeCompare(b.apa7,"en")).map(s=>{const nota=loc(s,"nota_apa");return `<article class="refitem" id="apa-${s.id}" tabindex="-1"><p class="apa">${ph(em(s.apa7))}</p><p class="cite"><b>${s.id}</b> · ${esc(t("prov.lic"))}: ${esc(loc(s,"licencia"))}${nota?` · ${esc(t("prov.refnote"))}: ${esc(nota)}`:""}</p></article>`}).join("")+`<h4 class="sh" style="margin-top:14px">${esc(t("prov.refs.ai"))}</h4><article class="refitem"><p class="apa">${em(t("prov.refs.aiapa"))}</p></article>`;
}
const phm=h=>h.replace(/\[([^\]]*completar[^\]]*|[^\]]*confirmar[^\]]*)\]/gi,m=>`<mark class="ph" title="${esc(t("prov.ph"))}">${m}</mark>`);
const rowsOf=(p,n)=>Array.from({length:n},(_,k)=>t(p+(k+1)).split("|"));
function table(cols,rows,cap){return `<div class="tw" tabindex="0" role="region" aria-label="${esc(cap)}"><table><caption class="sr-only">${esc(cap)}</caption><thead><tr>${cols.map(c=>`<th scope="col">${esc(c)}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,k)=>k===0?`<th scope="row">${c}</th>`:`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`}
const refPend=s=>/completar/i.test(s.apa7), refUrl=s=>/https?:\/\//.test(s.apa7);
function renderMetodo(){
  const pages=CAT.reduce((a,c)=>a+(c.paginas_pdf||0),0);
  $("#mstats").innerHTML=`<div class="stat"><b>${CAT.length}</b><span>${esc(t("me.docs"))}</span></div><div class="stat"><b>${pages}</b><span>${esc(t("me.pages"))}</span></div><div class="stat"><b>${IT.length}</b><span>${esc(t("me.items"))}</span></div><div class="stat"><b>${IT.filter(i=>i.kind==="recomendacion").length}</b><span>${esc(t("me.recs"))}</span></div><div class="stat"><b>${IT.filter(i=>i.kind==="alerta").length}</b><span>${esc(t("me.alerts"))}</span></div>`;
  $("#meCards").innerHTML=[1,2,3,4].map(k=>`<div class="item"><h3>${esc(t("me.c"+k+"t"))}</h3><p>${esc(t("me.c"+k))}</p></div>`).join("")+`<div class="item"><h3>${esc(t("me.c5t"))}</h3><p class="apa">${phm(em(t("me.c5")))}</p></div>`;
  const h3=k=>`<h3 class="sh" style="margin:22px 0 8px">${esc(t(k))}</h3>`;
  $("#iaBody").innerHTML=`<h3 class="sh" style="margin-bottom:8px">${esc(t("ia.h"))}</h3><div class="note">${esc(t("ia.lead"))}</div>${h3("ia.tool.h")}<p>${esc(t("ia.tool"))}</p>${h3("ia.tasks.h")}${table(t("ia.cols").split("|"),rowsOf("ia.t",7).map(r=>r.map(esc)),t("ia.tasks.h"))}${h3("ia.not.h")}<p>${esc(t("ia.not"))}</p>${h3("ia.lim.h")}<p>${esc(t("ia.lim"))}</p>${h3("ia.priv.h")}<p>${esc(t("ia.priv"))}</p>${h3("ia.cite.h")}<p class="apa">${em(t("prov.refs.aiapa"))}</p>${h3("ia.todo.h")}<p>${esc(t("ia.todo"))}</p>`;
  $("#licBody").innerHTML=`<h3 class="sh" style="margin-bottom:8px">${esc(t("lic.h"))}</h3><p class="lead">${esc(t("lic.lead"))}</p>${table(t("lic.cols").split("|"),rowsOf("lic.r",6).map(r=>r.map(esc)),t("lic.h"))}${h3("lic.src.h")}<p class="cite" style="margin-bottom:8px">${esc(t("lic.src.note"))}</p>${table([t("au.cols").split("|")[0],t("prov.lic")],CAT.map(s=>[apaLink(s.id,s.id+" · "+ckey(s)),esc(loc(s,"licencia"))]),t("lic.src.h"))}${h3("lic.attr.h")}<p class="apa">${phm(esc(t("lic.attr")))}</p><div class="note" style="margin-top:14px">${esc(t("lic.flag"))}</div>`;
  const ok=CAT.filter(s=>refUrl(s)&&!refPend(s)).length,nu=CAT.filter(s=>!refUrl(s)).length,np=CAT.filter(refPend).length;
  const uniq=new Set(CAT.map(ckey)).size===CAT.length;
  const stc=lv=>`<span class="stt ${lv}">${esc(t("au."+lv))}</span>`;
  const checks=[1,2,3,4,5,6,7,8,9].map(k=>{const [lv,tx]=t("au.k"+k).split("|");return `<li>${stc(k===3&&!uniq?"warn":lv)} <span>${esc(tx)}</span></li>`}).join("");
  const figs=["ruler","mediacion","tutor","resp","sist","comp"].map(k=>{const ids=D.figsrc[k]||[],ss=[...new Set(ids.map(x=>BYID[x]&&BYID[x].source))].filter(Boolean).sort();return [esc(t("au.fig."+k)),String(ids.length),esc(ss.join(", "))]});
  figs.push([esc(t("au.fig.corpus")),String(IT.length),esc(CAT.map(s=>s.id).join(", "))]);
  $("#audBody").innerHTML=`<h3 class="sh" style="margin-bottom:8px">${esc(t("au.h"))}</h3><p class="lead">${esc(t("au.lead"))}</p><div class="stats"><div class="stat"><b>${ok}/${CAT.length}</b><span>${esc(t("au.complete"))}</span></div><div class="stat"><b>${nu}</b><span>${esc(t("au.no"))} URL/DOI</span></div><div class="stat"><b>${np}</b><span>${esc(t("au.pending"))}</span></div></div><p class="cite" style="margin:10px 0">${esc(t("au.sum",{ok:ok,n:CAT.length,u:nu,p:np}))}</p>${table(t("au.cols").split("|"),CAT.map(s=>[apaLink(s.id,s.id),esc(ckey(s)),esc(refUrl(s)?t("au.yes"):t("au.no")),esc(refPend(s)||!refUrl(s)?t("au.pending"):t("au.complete")),esc(loc(s,"licencia")),esc(loc(s,"nota_apa")||"")]),t("au.h"))}${h3("au.chk.h")}<ul class="checks">${checks}</ul>${h3("au.fig.h")}${table(t("au.fig.cols").split("|"),figs,t("au.fig.h"))}`;
}

/* ---------- Glosario y siglas ---------- */
const gk=g=>st.lang==="en"?(g.k_en||g.k):g.k;
let ABRX=null,GM={};
function buildAbbr(){
  GM={};const terms=[];
  GLO.filter(g=>g.abbr).forEach(g=>[g.k,g.k_en].filter(Boolean).forEach(x=>{if(!GM[x]){GM[x]=g;terms.push(x)}}));
  terms.sort((a,b)=>b.length-a.length);
  ABRX=new RegExp("(?<![\\wÁÉÍÓÚáéíóúñ-])("+terms.map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")+")(?![\\wÁÉÍÓÚáéíóúñ-])","g");
}
const seen=new WeakMap(),SKIP=["SCRIPT","STYLE","SVG","ABBR","SELECT","OPTION","INPUT","TEXTAREA","TITLE","BLOCKQUOTE","DT","BUTTON","SUMMARY","LABEL","A","CAPTION"];
function markAbbr(root){
  if(!root||root.nodeType!==1||(root.closest&&root.closest("abbr,svg,#gl,#tip,blockquote,button,summary,a,.tools,dialog,.skip")))return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){let p=n.parentNode;while(p&&p!==root.parentNode){if(p.nodeType===1&&SKIP.includes(p.nodeName.toUpperCase()))return NodeFilter.FILTER_REJECT;p=p.parentNode}ABRX.lastIndex=0;const ok=ABRX.test(n.nodeValue);ABRX.lastIndex=0;return ok?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
  const nodes=[];while(w.nextNode())nodes.push(w.currentNode);
  nodes.forEach(n=>{
    const box=n.parentElement.closest(".item,figure,td,.note,.lead,.chk,.fg,.cv,li,p,h2,h3,.stat")||document.body;
    let s=seen.get(box);if(!s){s=new Set();seen.set(box,s)}
    const frag=document.createDocumentFragment();let last=0,txt=n.nodeValue,ch=false,m;ABRX.lastIndex=0;
    while((m=ABRX.exec(txt))){if(s.has(m[1]))continue;s.add(m[1]);ch=true;frag.append(txt.slice(last,m.index));const g=GM[m[1]],a=document.createElement("abbr");a.dataset.k=m[1];a.tabIndex=0;a.setAttribute("role","button");a.setAttribute("aria-haspopup","dialog");a.textContent=m[1];const ex=loc(g,"long");a.title=ex;a.setAttribute("aria-label",m[1]+": "+ex);frag.append(a);last=m.index+m[1].length}
    if(!ch)return;frag.append(txt.slice(last));n.replaceWith(frag);
  });
}
function srcLabel(s){if(s==="g")return t("gl.srcG");const p=(s.split(":")[1]||"");return p?t("gl.srcC",{x:p.replace(/ p\./,", p. ")}):t("gl.srcC0")}
function glCats(){const cs=[...new Set(GLO.map(g=>g.cat))];$("#cg").innerHTML=`<option value="">${esc(t("gl.allcat"))}</option>`+cs.map(c=>`<option value="${esc(c)}" ${c===st.glc?"selected":""}>${esc(loc(GLO.find(g=>g.cat===c),"cat"))}</option>`).join("")}
function renderGl(){
  const q=st.glq.toLowerCase(),c=st.glc;
  const m=GLO.filter(g=>(!c||g.cat===c)&&(!q||(g.k+" "+(g.k_en||"")+" "+g.long+" "+(g.long_en||"")+" "+loc(g,"def")).toLowerCase().includes(q)));
  $("#gl").innerHTML=m.map(g=>`<div class="g" id="g-${GLO.indexOf(g)}"><dt>${esc(gk(g))}</dt><dd><b>${esc(loc(g,"long"))}</b>${loc(g,"def")?`<br>${esc(loc(g,"def"))}`:""}<br><span class="s">${esc(srcLabel(g.src))}</span></dd></div>`).join("")||`<div class="empty">${esc(t("gl.none"))}</div>`;
  $("#glCount").textContent=m.length+" / "+GLO.length;
}
let tipFor=null;
function showTip(a){
  const g=GM[a.dataset.k];let tip=$("#tip");
  if(!tip){tip=document.createElement("div");tip.id="tip";tip.setAttribute("role","dialog");document.body.append(tip)}
  tipFor=a;const df=loc(g,"def")||"";
  tip.setAttribute("aria-label",gk(g));
  tip.innerHTML=`<button type="button" class="pill x" id="tipX" aria-label="${esc(t("tip.close"))}">✕</button><b>${esc(a.dataset.k)}</b>: ${esc(loc(g,"long"))}${df?`<br>${esc(df.length>170?df.slice(0,168)+"…":df)}`:""}<br><a href="#glosario" data-g="${esc(gk(g))}">${esc(t("gl.view"))}</a>`;
  const r=a.getBoundingClientRect();tip.style.left=Math.max(12,Math.min(r.left,innerWidth-Math.min(360,innerWidth-24)-12))+"px";tip.style.top=Math.max(8,Math.min(r.bottom+6,innerHeight-160))+"px";tip.hidden=false;
  $("#tipX").focus();
}
function hideTip(back){const tip=$("#tip");if(tip&&!tip.hidden){tip.hidden=true;if(back&&tipFor)tipFor.focus()}}

/* ---------- Accesibilidad: panel ---------- */
const THEME_OPTS=[["auto","linear-gradient(90deg,#fff 50%,#0E1626 50%)","#1B2230"],["light","#F4F6FA","#1B2230"],["dark","#0E1626","#E9EEF8"],["hcl","#FFFFFF","#000000"],["hcd","#000000","#FFFFFF"],["hcy","#000000","#FFFF00"]];
const TOGGLES=[["font","a11y.font"],["space","a11y.spacing"],["links","a11y.links"],["focus","a11y.focus"],["motion","a11y.motion"],["text","a11y.text"]];
function buildPanel(){
  const lg=$("#fsTheme legend");
  $("#fsTheme").innerHTML="";$("#fsTheme").append(lg);
  THEME_OPTS.forEach(o=>{const d=document.createElement("div");d.className="opt";d.innerHTML=`<input type="radio" name="theme" id="th-${o[0]}" value="${o[0]}" ${P.theme===o[0]?"checked":""}><span class="swatch" aria-hidden="true" style="background:${o[1]};color:${o[2]};text-align:center;font:700 .7rem/16px var(--f-mono)">Aa</span><label for="th-${o[0]}">${esc(t("a11y.c."+o[0]))}</label>`;$("#fsTheme").append(d)});
  const lg2=$("#fsOpts legend");$("#fsOpts").innerHTML="";$("#fsOpts").append(lg2);
  TOGGLES.forEach(o=>{const d=document.createElement("div");d.className="opt";d.innerHTML=`<input type="checkbox" id="op-${o[0]}" data-opt="${o[0]}" ${P[o[0]]?"checked":""}><label for="op-${o[0]}">${esc(t(o[1]))}</label>`;$("#fsOpts").append(d)});
  $("#szDec").textContent="A−";$("#szInc").textContent="A+";$("#szDec").setAttribute("aria-label",t("a11y.size.dec"));$("#szInc").setAttribute("aria-label",t("a11y.size.inc"));
  $("#szOut").textContent=t("a11y.size.value",{n:P.size});
}
function applyP(){
  const r=document.documentElement;
  if(P.theme&&P.theme!=="auto")r.setAttribute("data-theme",P.theme);else r.removeAttribute("data-theme");
  r.style.setProperty("--fs",P.size/100);
  ["font","space","links","focus","motion","text"].forEach(k=>r.classList.toggle("a-"+k,!!P[k]));
  const so=$("#szOut");if(so)so.textContent=t("a11y.size.value",{n:P.size});
  syncAlt();
}

/* ---------- Idioma ---------- */
function setLang(l,quiet){
  if(!LANGS.includes(l))l="es";
  st.lang=l;document.documentElement.lang=l;
  try{localStorage.setItem("coa.lang",l)}catch(e){}
  document.title=t("doc.title");const md=document.querySelector('meta[name="description"]');if(md)md.content=t("doc.desc");
  $$("#langGrp button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.lang===l));
  $("#langGrp").setAttribute("aria-label",t("lang.group")+" / "+(l==="es"?"Language":"Idioma"));
  $("#a11yFl").textContent=t("a11y.fab");$("#a11yBtn").setAttribute("aria-label",t("a11y.fab"));$("#a11yBtn").title=t("a11y.fab");
  $("#a11yClose").setAttribute("aria-label",t("a11y.close"));
  $("#side").setAttribute("aria-label",t("side.label"));$("#sideNav").setAttribute("aria-label",t("side.label"));$("#crumb").setAttribute("aria-label",t("crumb.label"));$("#menuBtn span").textContent=t(document.body.classList.contains("menu-open")?"menu.close":"menu.open");
  $(".skip").textContent=t("skip");
  applyStatic();renderAll();
  if(!quiet)announce(t("lang.changed"));
}
function renderAll(){
  buildAbbr();
  renderHeads();renderSubnavs();renderHome();renderTutorial();renderMap();renderHomeGuide();
  $("#ruler").innerHTML=buildRuler();rulerAlt();legend();
  glCats();$("#qg").value=st.glq;
  filters();renderHeat();renderEx();renderDg();renderEsc();renderNorm();renderFuentes();renderPlan();tipControls();renderKit();renderCtx();renderSearch();$("#gq").value=GQ;renderMetodo();renderGl();fillNotes();
  $("#age").setAttribute("aria-label",t("ruler.control"));
  $("#rulerNote").textContent=t("ruler.mobnote");$("#rulerFull").textContent=t($(".ruler").classList.contains("full")?"ruler.fullOff":"ruler.full");
  $(".tools").setAttribute("aria-label",t("tools.label"));
  buildPanel();
  setAge(st.age,true);
  go(st.view,st.sub[st.view]||"",{quiet:true,tab:true});
  markAbbr(document.body);syncAlt();
}

/* ---------- Eventos ---------- */
function activateTab(group,btn){btn.click();btn.focus()}
document.addEventListener("keydown",e=>{
  const tb=e.target.closest&&e.target.closest("[role=tab]");
  if(tb&&["ArrowLeft","ArrowRight","Home","End"].includes(e.key)){
    const tabs=[...tb.parentElement.querySelectorAll("[role=tab]")],i=tabs.indexOf(tb);let n=e.key==="Home"?0:e.key==="End"?tabs.length-1:(i+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;
    e.preventDefault();activateTab(tb.parentElement,tabs[n]);return;
  }
  if((e.key==="Enter"||e.key===" ")&&e.target.matches&&e.target.matches("#ruler .band,.fig .clk")){e.preventDefault();e.target.dispatchEvent(new MouseEvent("click",{bubbles:true}));return}
  if((e.key==="Enter"||e.key===" ")&&e.target.matches&&e.target.matches("abbr[data-k]")){e.preventDefault();showTip(e.target);return}
  if(e.key==="Escape"){if(document.body.classList.contains("menu-open")){closeMenu(true);return}hideTip(true)}
});
function goExplorer(){go("evidencia","explorador");const h=$("#explorador");if(h){h.focus({preventScroll:true})}}
function scrollToId(id){const n=document.getElementById(id);if(n){n.scrollIntoView({behavior:smooth(),block:"start"});if(!n.hasAttribute("tabindex"))n.setAttribute("tabindex","-1");n.focus({preventScroll:true})}}
document.addEventListener("click",e=>{
  const ab=e.target.closest("abbr[data-k]");
  if(ab){showTip(ab);return}
  const lk=e.target.closest("#tip a[data-g]");
  if(lk){e.preventDefault();hideTip();st.glq=lk.dataset.g;st.glc="";$("#qg").value=st.glq;glCats();renderGl();go("glosario");return}
  if(e.target.closest("#tipX")){hideTip(true);return}
  const tipEl=$("#tip");if(tipEl&&!tipEl.hidden&&!e.target.closest("#tip"))tipEl.hidden=true;
  const sv=e.target.closest("[data-save]");
  if(sv){const id=sv.dataset.save,wasPlan=st.view==="plan";toggleSave(id);if(wasPlan){renderPlan();const f=$("#planBody .pi [data-done]")||$("#planBody a,#planBody button");if(f)f.focus()}return}
  const pr=e.target.closest("[data-prole],[data-pband]");
  if(pr){if(pr.dataset.prole)st.role=pr.dataset.prole;else st.age=BANDAGE[pr.dataset.pband];saveProf();const sel=pr.dataset.prole?`[data-prole="${st.role}"]`:`[data-pband="${tramo(st.age)}"]`;setAge(st.age,true);const b=document.querySelector("#prof "+sel);if(b)b.focus();announce($("#profState").textContent);return}
  const tgo=e.target.closest("[data-tipgo]");
  if(tgo){e.preventDefault();const id=tgo.dataset.tipgo,x=TBY[id];if(x&&!x.publico.includes(st.role))st.role=x.publico[0];if(x&&!x.edad.includes(tramo(st.age)))st.age=BANDAGE[x.edad[0]];st.tf="";setAge(st.age,true);go("parati","tips",{quiet:true});const c=document.getElementById("c-"+id);if(c){c.scrollIntoView({block:"start",behavior:smooth()});c.focus({preventScroll:true});const dd=c.querySelector("details.prov");if(dd)dd.open=true}return}
  const kb=e.target.closest("[data-kband]");
  if(kb){const [k,b]=kb.dataset.kband.split("|");st.kb[k]=b;renderKit();const n=document.querySelector(`[data-kband="${k}|${b}"]`);if(n)n.focus();announce(t("prof.years",{t:agel(b)}));return}
  const kp=e.target.closest("[data-kprint]");
  if(kp){const id=kp.dataset.kprint;document.body.classList.add("pk");const m=document.getElementById(id);if(m)m.classList.add("pon");window.print();return}
  const cp=e.target.closest("[data-copy]");
  if(cp){const v=cp.dataset.copy;try{navigator.clipboard.writeText(v).then(()=>announce(t("kit.copied")),()=>announce(v))}catch(er){announce(v)}return}
  const cd=e.target.closest("[data-cdim]");
  if(cd){CDIM=+cd.dataset.cdim;renderCtx();const n=document.querySelector(`[data-cdim="${CDIM}"]`);if(n)n.focus();announce($("#ctxBody .lstate").textContent);return}
  if(e.target.closest("[data-ctxapa]")){e.preventDefault();const d=$("#ctxApa");if(d){d.open=true;d.scrollIntoView({block:"center",behavior:smooth()});d.querySelector("summary").focus()}return}
  if(e.target.closest("#tfReset")){st.tq=st.tt=st.tc=st.te="";st.tf="";tipControls();renderTips();$("#tq").focus();announce($("#tipState").textContent);return}
  if(e.target.closest("#gsEx")){st.ex={q:GQ,kind:"",theme:"",src:"",age:"",aud:"",str:""};st.shown=24;filters();$("#q")&&($("#q").value=GQ);renderEx(true);goExplorer();return}
  if(e.target.closest("#searchBtn")){go("buscar");setTimeout(()=>{const g=$("#gq");if(g)g.focus()},30);return}
  if(e.target.closest("#planPrint")){renderPlan();window.print();return}
  if(e.target.closest("#planShare")){const u=shareURL();$("#shareBox").innerHTML=`<label class="lbl" for="shareU">${esc(t("plan.share.l"))}</label><input id="shareU" class="shareu" readonly value="${esc(u)}">`;const inp=$("#shareU");inp.focus();inp.select();const ok=()=>announce(t("plan.copied"));try{navigator.clipboard.writeText(u).then(ok,()=>announce(t("plan.copy.manual")))}catch(er){announce(t("plan.copy.manual"))}return}
  const cl=e.target.closest("#planClear");
  if(cl){if(cl.dataset.arm){PL.saved=[];PL.done={};savePL();renderPlan();renderSide();renderProfile();renderTips();announce(t("plan.cleared"));const h=$("#h-plan");if(h)h.focus();return}cl.dataset.arm="1";cl.textContent=t("plan.clear.ok");announce(t("plan.clear.ok"));setTimeout(()=>{if(document.body.contains(cl)){delete cl.dataset.arm;cl.textContent=t("plan.clear")}},5000);return}
  if(e.target.closest("#shAdd")){SHARED.forEach(id=>{if(!inPlan(id))PL.saved.push(id)});savePL();const k=SHARED.length;SHARED=[];history.replaceState(null,"",location.pathname+"#plan");renderPlan();renderSide();renderProfile();renderTips();announce(t("plan.sh.added",{n:k}));const b=$("#planPrint");if(b)b.focus();return}
  if(e.target.closest("#shDrop")){SHARED=[];history.replaceState(null,"",location.pathname+"#plan");renderPlan();const h=$("#h-plan");if(h)h.focus();return}
  const tg=e.target.closest("[data-nav],[data-go],[data-open-a11y],#menuBtn,#scrim,[data-ref],[data-apa],[data-open],[data-role],[data-heat],[data-src],[data-ser],[data-resp],[data-lang],[data-lf],[data-tf],[data-lexp],#lmore,#rulerFull,#more,#exReset,#a11yBtn,#a11yClose,#szDec,#szInc,#szReset,#a11yReset");
  if(!tg)return;
  const d=tg.dataset;
  if(d.nav){e.preventDefault();const [v,sb]=d.nav.split("/");go(v,sb,{tab:tg.getAttribute("role")==="tab"});return}
  if(d.go){const [v,sb]=d.go.split("/");if(d.setrole){st.role=d.setrole;setAge(st.age,true)}go(v,sb);return}
  if(tg.id==="menuBtn"){document.body.classList.contains("menu-open")?closeMenu(true):openMenu();return}
  if(tg.id==="scrim"){closeMenu(true);return}
  if("openA11y" in d){$("#a11yBtn").click();return}
  if(d.lang){if(d.lang!==st.lang)setLang(d.lang);return}
  if(tg.id==="a11yBtn"){const dl=$("#a11yDlg");if(dl.showModal)dl.showModal();else dl.setAttribute("open","");tg.setAttribute("aria-expanded","true");return}
  if(tg.id==="a11yClose"){closeDlg();return}
  if(tg.id==="szDec"||tg.id==="szInc"){P.size=Math.max(80,Math.min(200,P.size+(tg.id==="szInc"?10:-10)));saveP();applyP();announce(t("a11y.size")+": "+t("a11y.size.value",{n:P.size}));return}
  if(tg.id==="szReset"){P.size=100;saveP();applyP();announce(t("a11y.size")+": "+t("a11y.size.value",{n:100}));return}
  if(tg.id==="a11yReset"){P=Object.assign({},DEFP);saveP();applyP();buildPanel();announce(t("a11y.reset"));return}
  if(tg.id==="exReset"){st.ex={q:"",kind:"",theme:"",src:"",age:"",aud:"",str:""};st.shown=24;filters();renderEx(true);markAbbr($("#exList"));return}
  if("tf" in d){st.tf=d.tf;renderTips();markAbbr($("#tipList"));const b=document.querySelector(`#tipFilt [data-tf="${st.tf}"]`);if(b)b.focus();announce($("#tipState").textContent);return}
  if("lf" in d){st.lf=(d.lf&&d.lf!==st.lf)?d.lf:"";st.lshown=6;renderLectura();markAbbr($("#lecturaList"));const b=document.querySelector(`#lstats [data-lf="${st.lf}"]`)||document.querySelector("#lstats [data-lexp]");if(b)b.focus();announce($("#lstate").textContent);return}
  if(d.lexp){st.ex={q:"",kind:"",theme:"",src:"",age:tramo(st.age),aud:st.role,str:""};st.shown=24;filters();renderEx(true);goExplorer();return}
  if(tg.id==="lmore"){const k=st.lshown;st.lshown+=6;renderLectura();markAbbr($("#lecturaList"));const a=$$("#lecturaList article")[k];if(a)a.focus();return}
  if(tg.id==="rulerFull"){const r=$(".ruler"),on=!r.classList.contains("full");r.classList.toggle("full",on);tg.setAttribute("aria-pressed",on);tg.textContent=t(on?"ruler.fullOff":"ruler.full");return}
  if(tg.id==="more"){st.shown+=24;renderEx(true);return}
  if(d.apa){e.preventDefault();go("fuentes","refs",{quiet:true});const el=document.getElementById("apa-"+d.apa);if(el){el.scrollIntoView({block:"center",behavior:smooth()});el.focus({preventScroll:true});el.classList.add("hit");setTimeout(()=>el.classList.remove("hit"),2400);announce(el.textContent.slice(0,160))}return}
  if(d.ref)return void showRef(d.ref);
  if(d.open){
    if(tg.closest("#guiaBody")||tg.closest("#escList")){
      const h=tg.closest(".chk,.fg"),n=h.nextElementSibling;
      if(n&&n.dataset.exp===d.open){n.remove();tg.focus();return}
      h.insertAdjacentHTML("afterend",`<div data-exp="${d.open}">${card(BYID[d.open])}</div>`);focusCard(h.nextElementSibling);return;
    }
    const box=$("#alDatos").hidden?$("#dgDetail"):$("#alOpen");box.innerHTML=card(BYID[d.open]);focusCard(box);return;
  }
  if(d.role){st.role=d.role;setAge(st.age,true);const b=document.querySelector(`#pick [data-role="${d.role}"]`);if(b)b.focus();announce(roleL(d.role));return}
  if(d.ser){st.ser[d.ser]=!st.ser[d.ser];renderDg();const b=document.querySelector(`[data-ser="${d.ser}"]`);if(b)b.focus();return}
  if(d.resp){const r=RESP.find(x=>x.id===d.resp);$("#dgDetail").innerHTML=r.refs.filter(x=>BYID[x]).map(x=>card(BYID[x])).join("");focusCard($("#dgDetail"));return}
  if(d.heat){const [x,c]=d.heat.split("|");st.ex={q:"",kind:"",theme:x,src:"",age:c,aud:"",str:""};st.shown=24;filters();renderEx(true);goExplorer();return}
  if(d.src){st.ex={q:"",kind:"",theme:"",src:d.src,age:"",aud:"",str:""};st.shown=24;filters();renderEx(true);goExplorer();return}
});
document.addEventListener("change",e=>{
  const id=e.target.id,m={fk:"kind",ft:"theme",fs:"src",fa:"age",fu:"aud",fr:"str"};
  if(m[id]){st.ex[m[id]]=e.target.value;st.shown=24;renderEx(true);return}
  if(e.target.dataset.done){const id=e.target.dataset.done;if(e.target.checked)PL.done[id]=true;else delete PL.done[id];savePL();renderPlan();const c=document.getElementById("dn-"+id);if(c)c.focus();announce($("#progL").textContent);return}
  if(["tt","tc","te"].includes(id)){st[id]=e.target.value;renderTips();announce($("#tipState").textContent);return}
  if(e.target.dataset.kchk){const k=e.target.dataset.kchk;if(e.target.checked)KS[k]=1;else delete KS[k];saveKS();return}
  if(id==="planWhy"){PL.why=e.target.checked;savePL();renderPlan();$("#planWhy").focus();return}
  if(e.target.dataset.chk){st.done[e.target.dataset.chk]=e.target.checked;e.target.closest(".chk").classList.toggle("d",e.target.checked);return}
  if(e.target.name==="theme"){P.theme=e.target.value;saveP();applyP();announce(t("a11y.applied",{x:t("a11y.c."+P.theme)}));return}
  if(e.target.dataset.opt){const k=e.target.dataset.opt;P[k]=e.target.checked;saveP();applyP();announce(t("a11y.applied",{x:t(TOGGLES.find(o=>o[0]===k)[1])+": "+(P[k]?"✓":"✗")}));return}
  if(id==="cg"){st.glc=e.target.value;renderGl();markAbbr($("#gl"))}
});
document.addEventListener("input",e=>{
  const id=e.target.id;
  if(id==="q"){st.ex.q=e.target.value;st.shown=24;renderEx()}
  if(id==="q2")renderFuentes();
  if(id==="age")setAge(+e.target.value);
  if(id==="qg"){st.glq=e.target.value;renderGl()}
  if(id==="tq"){st.tq=e.target.value;clearTimeout(tqT);tqT=setTimeout(()=>{renderTips();announce($("#tipState").textContent)},250)}
  if(id==="gq"){GQ=e.target.value;clearTimeout(tqT);tqT=setTimeout(()=>{renderSearch();announce($("#gstate").textContent)},250)}
  if(e.target.dataset.knote){KS["n:"+e.target.dataset.knote]=e.target.value;saveKS()}
});
let tqT=0;
const dlg=$("#a11yDlg");
function closeDlg(){if(dlg.close)dlg.close();else dlg.removeAttribute("open");$("#a11yBtn").setAttribute("aria-expanded","false")}
dlg.addEventListener("click",e=>{if(e.target===dlg)closeDlg()});
dlg.addEventListener("close",()=>{$("#a11yBtn").setAttribute("aria-expanded","false");$("#a11yBtn").focus()});

let mt=0;
new MutationObserver(ms=>{clearTimeout(mt);mt=setTimeout(()=>{ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1&&n.id!=="tip")markAbbr(n)}));syncAlt()},30)}).observe(document.body,{childList:true,subtree:true});


/* ---------- Navegación: vistas, subsecciones, menú lateral ---------- */
const VIEWS={inicio:[],plan:[],kit:["familia","docente","direccion"],contexto:[],buscar:[],parati:["tips","lectura","guias","escenarios"],alertas:["fuentes","datos"],diagramas:DG,evidencia:["mapa","explorador"],marco:[],fuentes:["lista","refs"],glosario:[],metodo:["metodologia","ia","licencias","auditoria"],tutorial:["pasos","etiquetas","acc","faq"],sitio:[]};
const GROUPS=[["start",["inicio","parati","kit","plan"]],["explore",["alertas","diagramas","evidencia"]],["sources",["contexto","marco","fuentes"]],["ref",["buscar","glosario","metodo"]],["help",["tutorial","sitio"]]];
const ALIAS={tips:["parati","tips"],lectura:["parati","lectura"],guias:["parati","guias"],escenarios:["parati","escenarios"],explorador:["evidencia","explorador"],mapa:["sitio",""]};
const ICONS={kit:'<path d="M4 7h16v13H4zM9 7V4h6v3M4 12h16"/>',contexto:'<path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',buscar:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',plan:'<path d="M6 3h12v18l-6-4-6 4z"/><path d="M9 9l2 2 4-4"/>',inicio:'<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',parati:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',alertas:'<path d="M12 3l10 18H2L12 3zM12 10v5M12 18v.5"/>',diagramas:'<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8 7l3 9M16 7l-3 9M8.5 6h7"/>',evidencia:'<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',marco:'<path d="M3 21h18M5 21V9M19 21V9M9 21V9M15 21V9M2 9l10-6 10 6"/>',fuentes:'<path d="M4 4h9a4 4 0 014 4v13a3 3 0 00-3-3H4zM4 4v14"/>',glosario:'<path d="M5 19l5-14 5 14M7 14h6M18 8v11M21 12h-6"/>',metodo:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/>',tutorial:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 115 0c0 1.7-2.5 2-2.5 4M12 17v.5"/>',sitio:'<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/>'};
function subLabel(v,sb){if(v==="alertas")return t(sb==="fuentes"?"alertas.t1":"alertas.t2");if(v==="diagramas")return t("dg."+sb);return t("s."+sb)}
const panelId=(v,sb)=>v==="diagramas"?"dgBody":`sp-${v}-${sb}`;
function renderSide(){
  const _cur=st.view,_mi=(g)=>g[1].includes(_cur);
  $("#sideNav").innerHTML="<ul>"+GROUPS.map((g,gi)=>`${gi===1?`<li class="more-w"><details class="more" ${GROUPS.slice(1).some(_mi)?"open":""}><summary>${esc(t("nav.more"))}</summary><ul>`:""}<li><p class="sg-t">${esc(t("grp."+g[0]))}</p><ul>${g[1].map(v=>{const cur=v===st.view,subs=VIEWS[v];return `<li><a class="nv" href="#${v}" data-nav="${v}" ${cur?'aria-current="page"':""}><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[v]}</svg><span>${esc(t("v."+v))}</span>${v==="plan"&&PL.saved.length?`<em class="cnt">${PL.saved.length}<span class="sr-only"> ${esc(t("plan.cnt"))}</span></em>`:""}</a>${cur&&subs.length?`<ul class="sub">${subs.map(sb=>`<li><a href="#${v}/${sb}" data-nav="${v}/${sb}" ${sb===st.sub[v]?'aria-current="true"':""}>${esc(subLabel(v,sb))}</a></li>`).join("")}</ul>`:""}</li>`}).join("")}</ul></li>${gi===GROUPS.length-1?"</ul></details></li>":""}`).join("")+"</ul>";
}
function renderCrumb(){
  const g=GROUPS.find(x=>x[1].includes(st.view)),sb=st.sub[st.view],items=[t("grp."+g[0]),t("v."+st.view)];if(sb&&VIEWS[st.view].length>1)items.push(subLabel(st.view,sb));
  $("#crumb").innerHTML="<ol>"+items.map((x,k)=>`<li${k===items.length-1?' aria-current="page"':""}>${esc(x)}</li>`).join("")+"</ol>";
}
function renderHeads(){
  $$(".vh").forEach(h=>{const v=h.id.slice(3);h.innerHTML=`<div class="ageline" aria-hidden="true"><i></i><i></i><i></i></div><h2 id="h-${v}" tabindex="-1">${esc(t("v."+v))}</h2><p>${esc(t("d."+v))}</p>`});
}
function renderSubnavs(){
  $$(".subnav").forEach(n=>{const v=n.dataset.for;n.setAttribute("aria-label",t("v."+v));n.innerHTML=VIEWS[v].map(sb=>`<button type="button" role="tab" id="tab-${v}-${sb}" data-nav="${v}/${sb}" aria-selected="false" tabindex="-1" aria-controls="${panelId(v,sb)}">${esc(subLabel(v,sb))}</button>`).join("")});
}
function renderHome(){
  const ic={Familia:ICONS.parati,Docente:ICONS.fuentes,"Dirección":ICONS.marco};
  $("#homeTiles").innerHTML=ROLES.map(r=>`<button type="button" class="tile" data-go="parati/tips" data-setrole="${r}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ic[r]}</svg><b>${esc(t("home."+r))}</b><span>${esc(t("home."+r+".d"))}</span></button>`).join("")+`<a class="tile alt" href="#tutorial" data-nav="tutorial" style="text-decoration:none"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS.tutorial}</svg><b>${esc(t("home.tut"))}</b><span>${esc(t("home.tut.d"))}</span></a>`;
}
function renderHomeGuide(){
  const steps=[["s1","inicio"],["s2","parati/tips"],["s3","plan"],["s4","plan"],["s5","evidencia/explorador"]];
  $("#homeGuide").innerHTML=`<h2 class="hs-h" id="hgH">${esc(t("hg.h"))}</h2><p class="hs-sub">${esc(t("hg.sub"))}</p>
  <ol class="hg-steps">${steps.map((s,i)=>`<li><span class="hg-n" aria-hidden="true">${i+1}</span><h3>${esc(t("hg."+s[0]+".t"))}</h3><p>${esc(t("hg."+s[0]))}</p>${s[1]==="inicio"?`<a href="#prof" class="hg-go">${esc(t("hg.go"))} <span aria-hidden="true">→</span><span class="sr-only">: ${esc(t("hg."+s[0]+".t"))}</span></a>`:`<a href="#${s[1]}" data-nav="${s[1]}" class="hg-go">${esc(t("hg.go"))} <span aria-hidden="true">→</span><span class="sr-only">: ${esc(t("hg."+s[0]+".t"))}</span></a>`}</li>`).join("")}</ol>
  <p class="hg-full"><a href="#tutorial" data-nav="tutorial">${esc(t("hg.full"))}</a></p>`;
  const lv=[["l1",["inicio","parati","kit","plan"]],["l2",["alertas","diagramas","evidencia"]],["l3",["contexto","marco","fuentes"]],["l4",["buscar","glosario","metodo","tutorial","sitio"]]];
  const lk=(h,lab)=>`<a href="#${h}" data-nav="${h}">${esc(lab)}</a>`;
  const routes={familia:[["inicio",t("v.inicio")],["parati/tips",t("v.parati")+" › Tips"],["plan",t("v.plan")],["plan",t("sm.print")]],
    docente:[["inicio",t("v.inicio")],["parati/escenarios",t("v.parati")+" › "+subLabel("parati","escenarios")],["kit/docente",t("v.kit")],["plan",t("v.plan")]],
    direccion:[["inicio",t("v.inicio")],["kit/direccion",t("v.kit")],["contexto",t("v.contexto")],["marco",t("v.marco")]]};
  $("#homeMap").innerHTML=`<h2 class="hs-h" id="smH">${esc(t("sm.h"))}</h2><p class="hs-sub">${esc(t("sm.sub"))}</p>
  <ol class="sm-flow">${lv.map(l=>`<li class="sm-col sm-${l[0]}"><h3>${esc(t("sm."+l[0]))}</h3><p>${esc(t("sm."+l[0]+"d"))}</p><ul>${l[1].map(v=>`<li>${lk(v,t("v."+v))}</li>`).join("")}</ul></li>`).join("")}</ol>
  <h3 class="sm-rt-h">${esc(t("sm.routes"))}</h3>
  <div class="sm-routes">${Object.keys(routes).map(r=>`<div class="sm-route"><b>${esc(t("sm.r."+r))}</b><ol>${routes[r].map(x=>`<li>${lk(x[0],x[1])}</li>`).join("")}</ol></div>`).join("")}</div>`;
}
function renderTutorial(){
  const lnk=(h,lab)=>`<a href="#${h}" data-nav="${h}">${esc(lab)}</a>`;
  $("#tuPasos").innerHTML=`<h3 class="sh" style="margin-bottom:12px">${esc(t("tu.steps.h"))}</h3><ol class="steps">${[1,2,3,4,5].map(k=>`<li><h4>${esc(t("tu.s"+k+".t"))}</h4><p>${esc(t("tu.s"+k))}</p></li>`).join("")}</ol>
  <h3 class="sh" style="margin:26px 0 4px">${esc(t("tu.tools.h"))}</h3><p class="lead" style="margin-bottom:12px">${esc(t("tu.tools.sub"))}</p><div class="legend-grid">${[["r1","inicio"],["r2","diagramas"],["r3","evidencia/explorador"],["r4","glosario"],["r5","parati/escenarios"],["r6","sitio"]].map(r=>`<div><div><b>${esc(t("tu."+r[0]+".t"))}</b><p>${esc(t("tu."+r[0]))}</p>${lnk(r[1],t("v."+r[1].split("/")[0]))}</div></div>`).join("")}</div>`;
  $("#tuEtq").innerHTML=`<h3 class="sh" style="margin-bottom:10px">${esc(t("tg.kinds"))}</h3><div class="legend-grid">${KINDS.map(k=>`<div><span class="b ${k}">${esc(t("kind."+k))}</span><p>${esc(t("tg.kind."+k))}</p></div>`).join("")}</div>
  <h3 class="sh" style="margin:26px 0 4px">${esc(t("tg.ages"))}</h3><p class="lead" style="margin-bottom:10px">${esc(t("tg.ages.d"))}</p><div class="row">${[1,2,3,4].map(k=>`<span class="b age${k}">${esc(t("tg.age"+k))}</span>`).join("")}</div>
  <h3 class="sh" style="margin:26px 0 10px">${esc(t("tg.ev"))}</h3><div class="legend-grid">${STRS.map(k=>`<div><span class="b">${esc(t("str."+k))}</span><p>${esc(t("tg.ev."+k))}</p></div>`).join("")}</div>`;
  $("#tuAcc").innerHTML=`<h3 class="sh" style="margin-bottom:8px">${esc(t("ac.h"))}</h3><p class="lead">${esc(t("ac.1"))}</p><p class="lead" style="margin-top:8px">${esc(t("ac.2"))}</p><p style="margin-top:12px"><button type="button" class="btn" data-open-a11y>${esc(t("a11y.title"))}</button></p>
  <h3 class="sh" style="margin:26px 0 10px">${esc(t("ac.kbd"))}</h3><dl class="kbd">${[1,2,3,4].map(k=>`<dt>${esc(t("ac.k"+k))}</dt><dd>${esc(t("ac.a"+k))}</dd>`).join("")}</dl>`;
  $("#tuFaq").innerHTML=[1,2,3,4,5].map(k=>`<details><summary>${esc(t("faq.q"+k))}</summary><p>${esc(t("faq.a"+k))}</p></details>`).join("");
}
function renderMap(){
  const tree=GROUPS.map(g=>`<li><h3>${esc(t("grp."+g[0]))}</h3><ul>${g[1].map(v=>`<li><a class="v" href="#${v}" data-nav="${v}">${esc(t("v."+v))}</a><p>${esc(t("d."+v))}</p>${VIEWS[v].length>1?`<ul>${VIEWS[v].map(sb=>`<li><a href="#${v}/${sb}" data-nav="${v}/${sb}">${esc(subLabel(v,sb))}</a></li>`).join("")}</ul>`:""}</li>`).join("")}</ul></li>`).join("");
  const dl=`<li><h3>${esc(t("map.data"))}</h3><p>${esc(t("map.data.d"))}</p><ul><li><a href="data/items.json" download>${esc(t("map.items"))}</a></li><li><a href="data/catalog.json" download>${esc(t("map.catalog"))}</a></li><li><a href="data/glossary.json" download>${esc(t("map.glossary"))}</a></li></ul></li>`;
  $("#siteMap").innerHTML=tree+dl;
}
function openMenu(){document.body.classList.add("menu-open");$("#menuBtn").setAttribute("aria-expanded","true");$("#menuBtn span").textContent=t("menu.close");setTimeout(()=>{const f=$("#sideNav a[aria-current=page]")||$("#sideNav a");if(f)f.focus()},60)}
function closeMenu(back){if(!document.body.classList.contains("menu-open"))return;document.body.classList.remove("menu-open");$("#menuBtn").setAttribute("aria-expanded","false");$("#menuBtn span").textContent=t("menu.open");if(back)$("#menuBtn").focus()}
let suppress=0;
function go(view,sub,o){
  o=o||{};
  if(ALIAS[view]){const a=ALIAS[view];view=a[0];sub=a[1]}
  if(!VIEWS[view])view="inicio";
  const subs=VIEWS[view];if(!subs.includes(sub))sub=st.sub[view]||subs[0]||"";
  const prev=st.view;st.view=view;st.sub[view]=sub;
  if(view==="alertas")st.al=sub;
  if(view==="diagramas"&&st.dg!==sub){st.dg=sub}
  $$(".view").forEach(v=>{v.hidden=v.dataset.view!==view});
  $$(`#v-${view} .subpanel`).forEach(p=>{if(p.dataset.sub==="*")return;const on=p.dataset.sub===sub;p.hidden=!on;if(on)p.setAttribute("aria-labelledby",`tab-${view}-${sub}`)});
  if(view==="diagramas")renderDg();
  if(view==="plan")renderPlan();
  $$(`#v-${view} .subnav [role=tab]`).forEach(b=>{const on=b.dataset.nav===view+"/"+sub;b.setAttribute("aria-selected",on);b.tabIndex=on?0:-1});
  renderSide();renderCrumb();
  const nm=t("v."+view)+(subs.length>1?" · "+subLabel(view,sub):"");
  document.title=nm+" · Children on AI";
  const h=view+(subs.length>1?"/"+sub:"");
  if(!o.noHash&&location.hash!=="#"+h&&!(view==="inicio"&&!location.hash)){suppress=1;location.hash=h;setTimeout(()=>{suppress=0},80)}
  if(!o.tab)closeMenu();
  if(!o.quiet&&!o.tab){window.scrollTo({top:0,behavior:"auto"});const hd=document.getElementById(view==="inicio"?"h1":"h-"+view);if(hd){hd.setAttribute("tabindex","-1");hd.focus({preventScroll:true})}announce(nm)}
  else if(o.tab&&!o.quiet)announce(nm);
}
function routeFromHash(quiet){
  const h=decodeURIComponent(location.hash.slice(1));
  if(!h){go("inicio","",{quiet:quiet,noHash:true});return}
  const [v,sb]=h.split("/");
  if(VIEWS[v]||ALIAS[v])go(v,sb,{quiet:quiet,noHash:true});
}
window.addEventListener("hashchange",()=>{if(suppress){suppress=0;return}routeFromHash(false)});

/* ---------- Arranque ---------- */
let l0="es";
/* D4 (v0.6): español por defecto. Prioridad: ?lang= > elección guardada en este navegador > "es". */
try{const q=new URLSearchParams(location.search).get("lang"),sv=localStorage.getItem("coa.lang");l0=LANGS.includes(q)?q:(LANGS.includes(sv)?sv:"es")}catch(e){l0="es"}
applyP();
const h0=location.hash; /* v0.6: conserva el enlace profundo (#vista/sub) que el primer render sobrescribía */
setLang(l0,true);
if(h0&&location.hash!==h0)history.replaceState(null,"",h0);
if(SHARED.length&&!location.hash)history.replaceState(null,"",location.pathname+location.search+"#plan");
routeFromHash(true);
window.addEventListener("beforeprint",()=>{if(st.view==="plan")renderPlan()});
window.addEventListener("afterprint",()=>{document.body.classList.remove("pk");$$(".kmod.pon").forEach(m=>m.classList.remove("pon"))});
window.COA={st,setLang,t};
})();
