async page=>{
 const results=[];
 for(const width of [320,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width:width===320?213:width,height:width===320?600:900},deviceScaleFactor:width===320?1.5:1}),p=await c.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'forge',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   stage='wrong attempt';await p.locator('#swap-lab').click();for(let i=0;i<5;i++)await p.locator('[data-swap-add="A:B"]').click();
   if(await p.evaluate(()=>document.activeElement?.id)!=='swap-undo')throw Error('focus lost at card limit');
   for(let i=0;i<5;i++)await p.locator('#swap-undo').click();
   for(const id of ['A:B','B:A'])await p.locator(`[data-swap-add="${id}"]`).click();await p.locator('#swap-start').click();await p.locator('#swap-step').click();
   if(!(await p.locator('#swap-step').getAttribute('aria-label')).includes('Aが青、Bが青、Cが空'))throw Error('updated boxes not announced');
   while(await p.locator('#swap-step').count())await p.locator('#swap-step').click();
   if(!await p.locator('#swap-retry').count())throw Error('wrong program not rejected');await p.locator('#swap-undo').click();await p.locator('#swap-undo').click();
   for(const id of ['C:A','A:B','B:C'])await p.locator(`[data-swap-add="${id}"]`).click();await p.locator('#swap-start').click();await p.locator('#swap-step').click();await p.reload();await p.locator('#continue').click();
   if(!(await p.locator('body').innerText()).includes('A＝赤、B＝青、C＝赤'))throw Error('intermediate state not restored');
   stage='solve';for(let i=0;i<3;i++){
    if(i)await p.locator('#swap-start').click();while(await p.locator('#swap-step').count())await p.locator('#swap-step').click();
    if(!(await p.locator('body').innerText()).includes('入れ替えられました'))throw Error('trial not accepted '+i);await p.locator('#swap-next').click();
   }
   if(!await p.locator('#success-dialog').isVisible())throw Error('success not shown');await p.locator('#swap-finish').click();await p.locator('#swap-back').click();
   if(!(await p.locator('#swap-lab').innerText()).includes('達成済み'))throw Error('completion missing');results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
