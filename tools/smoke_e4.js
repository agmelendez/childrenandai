/* Prueba de regresión v0.9 (E4). Requiere: npm i playwright axe-core. Uso: node tools/smoke_e4.js */
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'..'),U='file://'+ROOT+'/index.html',AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));let fail=0;const ok=(c,m)=>{console.log((c?'OK  ':'FALLA ')+m);if(!c)fail++};
await p.goto(U);ok(await p.$$eval('#top5 li',x=>x.length)===5,'portada: 5 tips');
for(const x of (await p.$$('#top5 [data-save]')).slice(0,3))await x.click();
await p.click('#profPlan');ok(await p.$$eval('#planBody .pi',x=>x.length)===3,'Mi plan: 3 tips');
await p.emulateMedia({media:'print'});await p.pdf({path:path.join(require('os').tmpdir(),'coa_plan.pdf'),format:'Letter'});await p.emulateMedia({media:'screen'});
await p.goto(U+'#buscar');await p.fill('#gq','deepfake');await p.waitForTimeout(400);ok(/[1-9]\d* tips/.test(await p.textContent('#gstate')),'búsqueda global');
for(const v of ['inicio','parati/tips','plan','kit/familia','kit/docente','kit/direccion','contexto','buscar']){await p.goto(U+'#'+v);await p.waitForTimeout(300);await p.addScriptTag({content:AXE});const n=await p.evaluate(async()=>(await axe.run(document.querySelector('.view:not([hidden])'),{runOnly:['wcag2a','wcag2aa']})).violations.length);ok(n===0,'axe '+v+' ('+n+')')}
const m=await b.newPage({viewport:{width:390,height:844}});for(const v of ['inicio','kit/familia','contexto','plan']){await m.goto(U+'#'+v);await m.waitForTimeout(300);ok(await m.evaluate(()=>document.documentElement.scrollWidth)<=390,'390 px '+v)}
ok(errs.length===0,'sin errores JS '+errs.join('; '));await b.close();process.exit(fail?1:0)})();
