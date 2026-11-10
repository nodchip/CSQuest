async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'observatory',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const act=async a=>{await p.locator(`[data-local-action="${a}"]`).click();if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error(`horizontal overflow after ${a}`);},seq=async xs=>{for(const a of xs)await act(a);},finish=async()=>{if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#local-finish').click();await p.locator('#local-back').click();};
   const climb=['inspect:A','inspect:B','move:A','inspect:S','check','next','inspect:A','move:A','inspect:S','inspect:G','move:G','check','next'];
   stage='climb';await p.locator('#local-climb').click();await act('inspect:A');await act('move:A');if(!(await p.locator('#local-status').innerText()).includes('すべて'))throw Error('incomplete inspection hint missing');await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('森の道 3'))throw Error('inspection not restored');await seq(['inspect:B','move:B']);if(!(await p.locator('#local-status').innerText()).includes('小さい'))throw Error('nonminimal move accepted');await seq(['move:A','inspect:S','check']);if(!(await p.locator('body').innerText()).includes('灯台 0'))throw Error('full map missing');await seq(climb.slice(5));await finish();if(await p.locator('#local-plateau').count())throw Error('advanced opened after one');
   stage='replay';await p.locator('#local-climb').click();await p.locator('#local-restart').click();await seq(climb);await finish();if(await p.locator('#local-plateau').count())throw Error('replay opened advanced');
   stage='restart';await p.locator('#local-restart').click();await seq(['inspect:A','inspect:B','move:A','inspect:S','check','next','inspect:S','inspect:G','move:G','check','next']);await finish();if(!await p.locator('#local-plateau').isVisible())throw Error('advanced missing');
   stage='plateau';await p.locator('#local-plateau').click();await seq(['inspect:A','check','next','inspect:A','move:A','inspect:S','inspect:G','move:G','check','next']);await finish();await p.reload();await p.locator('#continue').click();if(!(await p.locator('#local-plateau').innerText()).includes('達成済み'))throw Error('completion not restored');results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
