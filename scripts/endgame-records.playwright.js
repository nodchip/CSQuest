// Isolated progressed save: exercise correct and incorrect record operations.
async page=>{
 const results=[];
 for(const width of [320,390,1200]){
  // A 320px window at 150% zoom exposes about 213 CSS pixels.
  const c=await page.context().browser().newContext({viewport:{width:width===320?213:width,height:width===320?600:900},deviceScaleFactor:width===320?1.5:1}),p=await c.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{
    const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');
    return {place:'valley',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};
   });
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   stage='entry';await p.locator('#record-lab').click();
   await p.locator('[data-record="check"]').click();if(!(await p.locator('#record-status').innerText()).includes('準備済み'))throw Error('wrong filter not explained');
   await p.locator('[data-record="select:A"]').click();await p.reload();await p.locator('#continue').click();
   if(await p.locator('[data-record="select:A"]').getAttribute('aria-pressed')!=='true')throw Error('selection not restored');
   await p.locator('[data-record="select:B"]').click();await p.locator('[data-record="check"]').click();
   if(await p.evaluate(()=>document.activeElement?.dataset.record)!=='join:A:10')throw Error('stage focus skipped choices');
   if(!await p.evaluate(()=>{const r=document.activeElement.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;}))throw Error('focused choice is off-screen');
   await p.locator('[data-record="join:A:20"]').click();if(!(await p.locator('#record-status').innerText()).includes('番号が同じ'))throw Error('wrong join not explained');
   await p.keyboard.press('Tab');if(await p.evaluate(()=>document.activeElement?.dataset.record)!=='join:A:10')throw Error('cannot return from error to choices');
   await p.locator('[data-record="join:A:10"]').click();await p.reload();await p.locator('#continue').click();
   if(!await p.locator('[data-record="join:A:10"]').isDisabled())throw Error('joined pair not restored');
   const actions=['join:B:20','check','choose:A','check','column:id','select:D','select:E','check','join:D:30','join:E:40','check','choose:E','check','column:id','select:G','select:I','check','join:G:50','join:I:60','check','check','column:id'];
   stage='solve';for(const action of actions)await p.locator(`[data-record="${action}"]`).click();
   if(!await p.locator('#success-dialog').isVisible())throw Error('success not shown');
   await p.locator('#record-finish').click();const text=await p.locator('body').innerText();
   if(!text.includes('1つ目 A')||!text.includes('2つ目 E')||!text.includes('3つ目 該当なし'))throw Error('results missing');
   await p.locator('#record-back').click();if(!(await p.locator('#record-lab').innerText()).includes('達成済み'))throw Error('completion missing');
   results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
