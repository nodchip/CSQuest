async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'station',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const act=async a=>{await p.locator(`[data-heap-action="${a}"]`).click();if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error(`horizontal overflow after ${a}`);},seq=async xs=>{for(const a of xs)await act(a);},finish=async()=>{if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#heap-finish').click();await p.locator('#heap-back').click();};
   const queue=['take:1','take:3','take:4','check','take:2','take:3','take:5','check'];
   stage='queue';await p.locator('#heap-queue').click();await act('take:4');if(!(await p.locator('#heap-status').innerText()).includes('小さい'))throw Error('wrong priority hint missing');await act('take:1');await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('取り出した順：1'))throw Error('queue not restored');await seq(queue.slice(1));await finish();if(await p.locator('#heap-remove').count())throw Error('advanced opened after one');
   stage='replay';await p.locator('#heap-queue').click();await p.locator('#heap-restart').click();await seq(queue);await finish();if(await p.locator('#heap-remove').count())throw Error('replay opened advanced');
   stage='insert';await p.locator('#heap-insert').click();await seq(['add','swap:0']);if(!(await p.locator('#heap-status').innerText()).includes('親'))throw Error('wrong parent hint missing');await seq(['swap:2','swap:0','check','add','check']);await finish();if(!await p.locator('#heap-remove').isVisible())throw Error('advanced missing');
   stage='remove';await p.locator('#heap-remove').click();await seq(['remove','swap:1']);if(!(await p.locator('#heap-status').innerText()).includes('小さい方'))throw Error('wrong child hint missing');await seq(['swap:2','check','remove','swap:1','swap:3','check']);await finish();await p.reload();await p.locator('#continue').click();if(!(await p.locator('#heap-remove').innerText()).includes('達成済み'))throw Error('completion not restored');results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
