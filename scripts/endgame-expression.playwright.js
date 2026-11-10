async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'mid-archive',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const act=async a=>{await p.locator(`[data-expression-action="${a}"]`).click();if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error(`horizontal overflow after ${a}`);},seq=async xs=>{for(const a of xs)await act(a);},finish=async()=>{if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#expression-finish').click();await p.locator('#expression-back').click();};
   const priority=['merge:1:*','merge:0:+','check','merge:0:+','merge:0:*','check'];
   stage='precedence';await p.locator('#expression-precedence').click();await seq(['merge:0:+','merge:0:*','check']);if(!(await p.locator('#expression-status').innerText()).includes('優先順位'))throw Error('wrong tree hint missing');await act('reset');await act('merge:1:*');await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('[3 × 4]'))throw Error('tree not restored');await seq(priority.slice(1));await finish();if(await p.locator('#expression-evaluate').count())throw Error('advanced opened after one');
   stage='replay';await p.locator('#expression-precedence').click();await p.locator('#expression-restart').click();await seq(priority);await finish();if(await p.locator('#expression-evaluate').count())throw Error('replay opened advanced');
   stage='association';await p.locator('#expression-association').click();await seq(['merge:0:-','merge:0:-','check','merge:1:-','merge:0:-','check']);await finish();if(!await p.locator('#expression-evaluate').isVisible())throw Error('advanced missing');
   stage='evaluate';await p.locator('#expression-evaluate').click();await seq(['merge:1:*','merge:0:+','check','eval:root']);if(!(await p.locator('#expression-status').innerText()).includes('両側'))throw Error('premature evaluation accepted');await seq(['eval:R','eval:root']);if(!(await p.locator('body').innerText()).includes('1番 14'))throw Error('first result missing');await seq(['check','merge:0:+','merge:0:*','check','eval:L','eval:root']);if(!(await p.locator('body').innerText()).includes('1番 20'))throw Error('second result missing');await act('check');await finish();await p.reload();await p.locator('#continue').click();if(!(await p.locator('#expression-evaluate').innerText()).includes('達成済み'))throw Error('completion not restored');results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
