async page=>{
 const results=[];
 for(const width of [320,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width:width===320?213:width,height:width===320?600:900},deviceScaleFactor:width===320?1.5:1}),p=await c.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'mist',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   stage='access';await p.locator('#access-lab').click();await p.locator('[data-access="allow"]').click();
   if(!(await p.locator('#access-status').innerText()).includes('両方'))throw Error('missing checks not explained');
   await p.locator('[data-access="identity"]').click();await p.reload();await p.locator('#continue').click();
   if(!(await p.locator('body').innerText()).includes('本人確認：成功'))throw Error('identity check not restored');
   await p.locator('[data-access="rights"]').click();await p.locator('[data-access="allow"]').click();
   for(const answer of ['deny','deny','deny','deny','allow','deny']){await p.locator('[data-access="identity"]').click();await p.locator('[data-access="rights"]').click();await p.locator(`[data-access="${answer}"]`).click();}
   if(!await p.locator('#success-dialog').isVisible())throw Error('access success missing');await p.locator('#access-finish').click();await p.locator('#access-back').click();
   stage='paths';await p.locator('#paths-lab').click();await p.locator('[data-path="test:guest:back"]').click();
   if(!(await p.locator('#paths-status').innerText()).includes('読めました'))throw Error('unguarded path not visible');
   await p.locator('[data-path="guard:back"]').click();await p.locator('[data-path="test:guest:front"]').click();await p.reload();await p.locator('#continue').click();
   if(!(await p.locator('body').innerText()).includes('修理後の確認：1 / 4'))throw Error('path progress not restored');
   for(const action of ['test:guest:back','test:keeper:front','test:keeper:back'])await p.locator(`[data-path="${action}"]`).click();
   if(!await p.locator('#success-dialog').isVisible())throw Error('path success missing');await p.locator('#paths-finish').click();await p.locator('#paths-back').click();
   if(!(await p.locator('#access-lab').innerText()).includes('達成済み')||!(await p.locator('#paths-lab').innerText()).includes('達成済み'))throw Error('completion missing');
   results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
