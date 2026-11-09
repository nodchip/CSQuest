async page=>{
 const results=[];
 for(const width of [320,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width:width===320?213:width,height:width===320?600:900},deviceScaleFactor:width===320?1.5:1}),p=await c.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'sky',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   stage='entry';await p.locator('#queue-lab').click();await p.locator('[data-queue-action="send:B"]').click();
   if(!(await p.locator('#queue-status').innerText()).includes('先頭'))throw Error('wrong order not explained');
   await p.locator('[data-queue-action="send:A"]').click();
   if(await p.evaluate(()=>document.activeElement?.id)!=='queue-status')throw Error('next correct action was preselected');
   if(!await p.evaluate(()=>{const r=document.activeElement.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;}))throw Error('queue status is off-screen');
   await p.reload();await p.locator('#continue').click();
   if(!(await p.locator('body').innerText()).includes('待ち列：B'))throw Error('queue state not restored');
   stage='solve';for(const action of ['send:B','send:A','send:B','send:A','send:B','send:C','send:A','wait','wait','send:B'])await p.locator(`[data-queue-action="${action}"]`).click();
   if(!await p.locator('#success-dialog').isVisible())throw Error('success not shown');await p.locator('#queue-finish').click();
   const text=await p.locator('body').innerText();if(!text.includes('Cは2分待ち')||!text.includes('4つ目：Aは0分待ち、Bは0分待ち'))throw Error('wait results missing');
   await p.locator('#queue-back').click();if(!(await p.locator('#queue-lab').innerText()).includes('達成済み'))throw Error('completion missing');results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
