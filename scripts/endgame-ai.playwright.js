async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'observatory',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   stage='forecast';await p.locator('#forecast-lab').click();await p.locator('[data-forecast="sun"]').click();if(!(await p.locator('#forecast-status').innerText()).includes('確かめ'))throw Error('wrong choice not explained');
   await p.locator('[data-forecast="rain"]').click();await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('進み具合：1 / 8'))throw Error('progress not restored');
   for(const choice of ['sun','rain','rain','rain','rain','cloud','uncertain'])await p.locator(`[data-forecast="${choice}"]`).click();if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#forecast-finish').click();if(!(await p.locator('body').innerText()).includes('独立した最終評価'))throw Error('evaluation limit missing');await p.locator('#forecast-back').click();
   stage='errors';await p.locator('#forecast-errors-lab').click();await p.locator('[data-forecast="miss"]').click();if(!(await p.locator('#forecast-status').innerText()).includes('確かめ'))throw Error('wrong classification not explained');for(const choice of ['hit','miss','false-alarm','clear'])await p.locator(`[data-forecast="${choice}"]`).click();
   if(!(await p.locator('body').innerText()).includes('見逃しをゼロ'))throw Error('decision condition missing');await p.locator('[data-forecast="A"]').click();await p.locator('[data-forecast="B"]').click();if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#forecast-finish').click();await p.locator('#forecast-back').click();await p.reload();await p.locator('#continue').click();if(!(await p.locator('#forecast-errors-lab').innerText()).includes('達成済み'))throw Error('completion not restored');
   if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
