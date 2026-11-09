async page=>{
 const results=[];
 for(const width of [320,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width:width===320?213:width,height:width===320?600:900},deviceScaleFactor:width===320?1.5:1}),p=await c.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'valley',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs','valley-query-lab'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   if(await p.locator('#integrity-lab').count())throw Error('next stage opened with one quest');
   stage='tables';await p.locator('#tables-lab').click();await p.locator('[data-table="check"]').click();if(!(await p.locator('#tables-status').innerText()).includes('見比べ'))throw Error('wrong set not explained');
   await p.locator('[data-table="choose:10"]').click();await p.reload();await p.locator('#continue').click();if(await p.locator('[data-table="choose:10"]').getAttribute('aria-pressed')!=='true')throw Error('selection not restored');
   for(const action of ['choose:20','choose:30','choose:40','check','choose:20','check','choose:10','choose:30','check','check','choose:30','check','check'])await p.locator(`[data-table="${action}"]`).click();
   if(!await p.locator('#success-dialog').isVisible())throw Error('tables success missing');await p.locator('#tables-finish').click();await p.locator('#tables-back').click();
   if(!await p.locator('#integrity-lab').count())throw Error('two distinct quests did not unlock next stage');
   stage='integrity';await p.locator('#integrity-lab').click();await p.locator('[data-integrity="parcel:C:30"]').click();if(!(await p.locator('#integrity-status').innerText()).includes('登録されていません'))throw Error('missing destination not explained');
   await p.locator('[data-integrity="parcel:B:20"]').click();await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('2つ目：'))throw Error('integrity progress not restored');
   await p.locator('[data-integrity="destination:40"]').click();if(!(await p.locator('#integrity-status').innerText()).includes('目的とは異なります'))throw Error('valid unrelated change misclassified');
   await p.locator('[data-integrity="destination:10"]').click();if(!(await p.locator('#integrity-status').innerText()).includes('すでにあります'))throw Error('duplicate not explained');
   await p.locator('[data-integrity="destination:30"]').click();await p.locator('[data-integrity="delete:10"]').click();if(!(await p.locator('#integrity-status').innerText()).includes('参照する荷物'))throw Error('referenced deletion not explained');
   await p.locator('[data-integrity="delete:20"]').click();if(!await p.locator('#success-dialog').isVisible())throw Error('integrity success missing');await p.locator('#integrity-finish').click();await p.locator('#integrity-back').click();
   if(!(await p.locator('#integrity-lab').innerText()).includes('達成済み'))throw Error('completion missing');results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
