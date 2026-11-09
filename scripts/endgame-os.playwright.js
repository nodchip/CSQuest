async page=>{
 const results=[];
 for(const width of [320,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width:width===320?213:width,height:width===320?600:900},deviceScaleFactor:width===320?1.5:1}),p=await c.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'station',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   stage='schedule';await p.locator('#scheduling-lab').click();await p.locator('[data-scheduling="run:B"]').click();if(!(await p.locator('#scheduling-status').innerText()).includes('到着順'))throw Error('wrong choice not explained');
   await p.locator('[data-scheduling="run:A"]').click();await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('今は 1 刻'))throw Error('schedule not restored');
   const actions='AABABAAABBBABBBAABABA';for(const id of actions)await p.locator(`[data-scheduling="run:${id}"]`).click();
   if(!await p.locator('#success-dialog').isVisible())throw Error('schedule success missing');await p.locator('#scheduling-finish').click();
   const text=await p.locator('body').innerText();if(!text.includes('Bは2刻、Aは4刻'))throw Error('completion times missing');await p.locator('#scheduling-back').click();
   stage='pages';await p.locator('#travel').click();await p.locator('[data-travel-place="forge"]').click();await p.locator('#travel-depart').click();await p.locator('#pages-lab').click();
   await p.locator('[data-page="frame:0"]').click();if(!(await p.locator('#pages-status').innerText()).includes('道具ごとの表'))throw Error('wrong page not explained');
   await p.locator('[data-page="frame:2"]').click();await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('道具 B のページ 0'))throw Error('pages not restored');
   for(const action of ['frame:0','frame:1','unmapped'])await p.locator(`[data-page="${action}"]`).click();
   if(!await p.locator('#success-dialog').isVisible())throw Error('pages success missing');await p.locator('#pages-finish').click();await p.locator('#pages-back').click();if(!(await p.locator('#pages-lab').innerText()).includes('達成済み'))throw Error('completion missing');
   results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
