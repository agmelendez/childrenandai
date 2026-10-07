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
const AGES=[["6-11","6–11"],["12-14","12–14"],["15-18","15–18"]];
const ROLES=["Familia","Docente","Dirección"];
const LN={es:{es:"español",en:"inglés"},en:{es:"Spanish",en:"English"}};
const st={view:"inicio",sub:{},lang:"es",age:11,role:"Familia",ex:{q:"",kind:"",theme:"",src:"",age:"",aud:"",str:""},shown:24,done:{},dg:"mediacion",al:"fuentes",ser:{0:true,1:true,2:true},glq:"",glc:""};
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
const tramo=a=>a<=11?"6-11":a<=14?"12-14":"15-18";
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
  const ac=ages.length===3?`<span class="b">${esc(t("card.allages"))}</span>`:ages.length?ages.map(a=>`<span class="b age${ageIdx(a)}">${agel(a)}</span>`).join(""):`<span class="b" title="${esc(agenote||"")}">${esc(t("card.noage"))}</span>`;
  const lv=lvl&&typeof lvl==="object"?`<details><summary>${esc(t("comp.l1"))} · ${esc(t("comp.l2"))} · ${esc(t("comp.l3"))}</summary><dl class="lv"><dt>${esc(t("comp.l1"))}</dt><dd>${esc(lvl.understand||"")}</dd><dt>${esc(t("comp.l2"))}</dt><dd>${esc(lvl.apply||"")}</dd><dt>${esc(t("comp.l3"))}</dt><dd>${esc(lvl.create||"")}</dd></dl></details>`:"";
  return `<article class="item k-${i.kind} ab-${ages.length===1?ageIdx(ages[0]):0}" id="c-${i.id}" tabindex="-1" aria-label="${esc(t("kind."+i.kind)+" "+i.id)}"><div class="row"><span class="b ${i.kind}">${esc(t("kind."+i.kind))}</span><span class="b">${esc(th(i.theme))}</span>${ac}</div>
  <p>${esc(itx(i))}</p>
  ${fig?`<div class="fg">${fmtFig(fig)}</div>`:""}
  ${lv}
  ${cav?(cav.length<=80?`<div class="cv">${esc(cav)}</div>`:`<details><summary>${esc(t("card.limits"))}</summary><div class="cv" style="margin-top:6px">${esc(cav)}</div></details>`):""}
  ${agenote&&!opt.noage?`<span class="cite">${esc(t("card.agenote",{x:agenote}))}</span>`:""}
  ${ls?`<span class="cite">${esc(t("fu.state"))}: ${esc(ls)}</span>`:""}
  <details><summary>${esc(t("card.quote"))} · ${i.source} · ${esc(t("card.pdf",{p:i.page}))}</summary><blockquote lang="${ql}">${esc(i.quote)}</blockquote>${ql!==st.lang?`<span class="cite">${esc(t("card.partial",{l:LN[st.lang][ql]}))}</span>`:""}</details>
  <span class="cite">${apaLink(i.source,"("+ckey(s)+", "+pageTxt([i.page])+")")} · ${i.id}</span></article>`;
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
  renderLectura();renderGuia();
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
  const m=mine(),top=m.filter(i=>KW[i.kind]).sort((a,b)=>(KW[b.kind]-KW[a.kind])||(strong(b)-strong(a))).slice(0,6);
  const cnt=k=>m.filter(i=>i.kind===k).length;
  $("#lstats").innerHTML=`<div class="stat"><b>${m.length}</b><span>${esc(t("stat.items",{r:roleL(st.role).toLowerCase(),t:agel(tramo(st.age))}))}</span></div><div class="stat"><b>${cnt("recomendacion")}</b><span>${esc(t("stat.recs"))}</span></div><div class="stat"><b>${cnt("alerta")}</b><span>${esc(t("stat.alerts"))}</span></div><div class="stat"><b>${cnt("obligacion")}</b><span>${esc(t("stat.oblig"))}</span></div><div class="stat"><b>${new Set(m.map(i=>i.source)).size}</b><span>${esc(t("stat.sources"))}</span></div>`;
  $("#lecturaList").innerHTML=top.map(i=>card(i)).join("")||`<div class="empty">${esc(t("empty.items"))}</div>`;
  renderAlertas();
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
  $("#iaBody").innerHTML=`<h3 class="sh" style="margin-bottom:8px">${esc(t("ia.h"))}</h3><div class="note">${esc(t("ia.lead"))}</div>${h3("ia.tool.h")}<p>${esc(t("ia.tool"))}</p>${h3("ia.tasks.h")}${table(t("ia.cols").split("|"),rowsOf("ia.t",6).map(r=>r.map(esc)),t("ia.tasks.h"))}${h3("ia.not.h")}<p>${esc(t("ia.not"))}</p>${h3("ia.lim.h")}<p>${esc(t("ia.lim"))}</p>${h3("ia.priv.h")}<p>${esc(t("ia.priv"))}</p>${h3("ia.cite.h")}<p class="apa">${em(t("prov.refs.aiapa"))}</p>${h3("ia.todo.h")}<p>${esc(t("ia.todo"))}</p>`;
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
  if(!root||root.nodeType!==1||(root.closest&&root.closest("abbr,svg,#gl,#tip,blockquote,button,summary,a,.fab-wrap,dialog,.skip")))return;
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
  renderHeads();renderSubnavs();renderHome();renderTutorial();renderMap();
  $("#ruler").innerHTML=buildRuler();rulerAlt();legend();
  glCats();$("#qg").value=st.glq;
  filters();renderHeat();renderEx();renderDg();renderEsc();renderNorm();renderFuentes();renderMetodo();renderGl();fillNotes();
  $("#age").setAttribute("aria-label",t("ruler.control"));
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
  const tg=e.target.closest("[data-nav],[data-go],[data-open-a11y],#menuBtn,#scrim,[data-ref],[data-apa],[data-open],[data-role],[data-heat],[data-src],[data-ser],[data-resp],[data-lang],#more,#exReset,#a11yBtn,#a11yClose,#szDec,#szInc,#szReset,#a11yReset");
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
});
const dlg=$("#a11yDlg");
function closeDlg(){if(dlg.close)dlg.close();else dlg.removeAttribute("open");$("#a11yBtn").setAttribute("aria-expanded","false")}
dlg.addEventListener("click",e=>{if(e.target===dlg)closeDlg()});
dlg.addEventListener("close",()=>{$("#a11yBtn").setAttribute("aria-expanded","false");$("#a11yBtn").focus()});

let mt=0;
new MutationObserver(ms=>{clearTimeout(mt);mt=setTimeout(()=>{ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1&&n.id!=="tip")markAbbr(n)}));syncAlt()},30)}).observe(document.body,{childList:true,subtree:true});


/* ---------- Navegación: vistas, subsecciones, menú lateral ---------- */
const VIEWS={inicio:[],parati:["lectura","guias","escenarios"],alertas:["fuentes","datos"],diagramas:DG,evidencia:["mapa","explorador"],marco:[],fuentes:["lista","refs"],glosario:[],metodo:["metodologia","ia","licencias","auditoria"],tutorial:["pasos","etiquetas","acc","faq"],sitio:[]};
const GROUPS=[["start",["inicio","parati"]],["explore",["alertas","diagramas","evidencia"]],["sources",["marco","fuentes"]],["ref",["glosario","metodo"]],["help",["tutorial","sitio"]]];
const ALIAS={lectura:["parati","lectura"],guias:["parati","guias"],escenarios:["parati","escenarios"],explorador:["evidencia","explorador"],mapa:["sitio",""]};
const ICONS={inicio:'<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',parati:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',alertas:'<path d="M12 3l10 18H2L12 3zM12 10v5M12 18v.5"/>',diagramas:'<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8 7l3 9M16 7l-3 9M8.5 6h7"/>',evidencia:'<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',marco:'<path d="M3 21h18M5 21V9M19 21V9M9 21V9M15 21V9M2 9l10-6 10 6"/>',fuentes:'<path d="M4 4h9a4 4 0 014 4v13a3 3 0 00-3-3H4zM4 4v14"/>',glosario:'<path d="M5 19l5-14 5 14M7 14h6M18 8v11M21 12h-6"/>',metodo:'<path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/>',tutorial:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 115 0c0 1.7-2.5 2-2.5 4M12 17v.5"/>',sitio:'<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/>'};
function subLabel(v,sb){if(v==="alertas")return t(sb==="fuentes"?"alertas.t1":"alertas.t2");if(v==="diagramas")return t("dg."+sb);return t("s."+sb)}
const panelId=(v,sb)=>v==="diagramas"?"dgBody":`sp-${v}-${sb}`;
function renderSide(){
  $("#sideNav").innerHTML="<ul>"+GROUPS.map(g=>`<li><p class="sg-t">${esc(t("grp."+g[0]))}</p><ul>${g[1].map(v=>{const cur=v===st.view,subs=VIEWS[v];return `<li><a class="nv" href="#${v}" data-nav="${v}" ${cur?'aria-current="page"':""}><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[v]}</svg><span>${esc(t("v."+v))}</span></a>${cur&&subs.length?`<ul class="sub">${subs.map(sb=>`<li><a href="#${v}/${sb}" data-nav="${v}/${sb}" ${sb===st.sub[v]?'aria-current="true"':""}>${esc(subLabel(v,sb))}</a></li>`).join("")}</ul>`:""}</li>`}).join("")}</ul></li>`).join("")+"</ul>";
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
  $("#homeTiles").innerHTML=ROLES.map(r=>`<button type="button" class="tile" data-go="parati/lectura" data-setrole="${r}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ic[r]}</svg><b>${esc(t("home."+r))}</b><span>${esc(t("home."+r+".d"))}</span></button>`).join("")+`<a class="tile alt" href="#tutorial" data-nav="tutorial" style="text-decoration:none"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS.tutorial}</svg><b>${esc(t("home.tut"))}</b><span>${esc(t("home.tut.d"))}</span></a>`;
}
function renderTutorial(){
  const lnk=(h,lab)=>`<a href="#${h}" data-nav="${h}">${esc(lab)}</a>`;
  $("#tuPasos").innerHTML=`<h3 class="sh" style="margin-bottom:12px">${esc(t("tu.steps.h"))}</h3><ol class="steps">${[1,2,3,4,5].map(k=>`<li><h4>${esc(t("tu.s"+k+".t"))}</h4><p>${esc(t("tu.s"+k))}</p></li>`).join("")}</ol>
  <h3 class="sh" style="margin:26px 0 4px">${esc(t("tu.tools.h"))}</h3><p class="lead" style="margin-bottom:12px">${esc(t("tu.tools.sub"))}</p><div class="legend-grid">${[["r1","inicio"],["r2","diagramas"],["r3","evidencia/explorador"],["r4","glosario"],["r5","parati/escenarios"],["r6","sitio"]].map(r=>`<div><div><b>${esc(t("tu."+r[0]+".t"))}</b><p>${esc(t("tu."+r[0]))}</p>${lnk(r[1],t("v."+r[1].split("/")[0]))}</div></div>`).join("")}</div>`;
  $("#tuEtq").innerHTML=`<h3 class="sh" style="margin-bottom:10px">${esc(t("tg.kinds"))}</h3><div class="legend-grid">${KINDS.map(k=>`<div><span class="b ${k}">${esc(t("kind."+k))}</span><p>${esc(t("tg.kind."+k))}</p></div>`).join("")}</div>
  <h3 class="sh" style="margin:26px 0 4px">${esc(t("tg.ages"))}</h3><p class="lead" style="margin-bottom:10px">${esc(t("tg.ages.d"))}</p><div class="row">${[1,2,3].map(k=>`<span class="b age${k}">${esc(t("tg.age"+k))}</span>`).join("")}</div>
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
try{const q=new URLSearchParams(location.search).get("lang");l0=LANGS.includes(q)?q:(localStorage.getItem("coa.lang")||((navigator.language||"es").toLowerCase().startsWith("en")?"en":"es"))}catch(e){l0=(navigator.language||"es").toLowerCase().startsWith("en")?"en":"es"}
applyP();
setLang(l0,true);
routeFromHash(true);
window.COA={st,setLang,t};
})();
