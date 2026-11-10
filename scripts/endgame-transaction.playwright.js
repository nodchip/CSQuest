async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'valley',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const act=async a=>{await p.locator(`[data-transaction-action="${a}"]`).click();if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error(`horizontal overflow after ${a}`);},seq=async xs=>{for(const a of xs)await act(a);},finish=async()=>{if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#transaction-finish').click();await p.locator('#transaction-back').click();};
   const commit=['begin','debit','credit','commit','check','begin','debit','credit','commit','check'];
   stage='commit';await p.locator('#transaction-commit').click();await seq(['begin','debit','commit','check']);if(!(await p.locator('#transaction-status').innerText()).includes('片側'))throw Error('partial commit hint missing');await seq(['reset','begin','debit']);await p.reload();await p.locator('#continue').click();const text=await p.locator('body').innerText();if(!text.includes('確定した帳面：村A 5個、村B 2個')||!text.includes('作業中の帳面：村A 3個、村B 2個'))throw Error('draft not restored');await seq(commit.slice(2));await finish();if(await p.locator('#transaction-isolation').count())throw Error('advanced opened after one');
   stage='replay';await p.locator('#transaction-commit').click();await p.locator('#transaction-restart').click();await seq(commit);await finish();if(await p.locator('#transaction-isolation').count())throw Error('replay opened advanced');
   stage='rollback';await p.locator('#transaction-rollback').click();await seq(['begin','debit','rollback','check','begin','debit','rollback','check']);if(!(await p.locator('#transaction-status').innerText()).includes('指定'))throw Error('wrong rollback stage accepted');await seq(['reset','begin','debit','credit','rollback','check']);await finish();if(!await p.locator('#transaction-isolation').isVisible())throw Error('advanced missing');
   stage='isolation';await p.locator('#transaction-isolation').click();await seq(['begin','debit','read','credit','commit','read']);const read=await p.locator('body').innerText();if(!read.includes('確定前に 村A 5個、村B 2個')||!read.includes('作業終了後に 村A 3個、村B 4個'))throw Error('fresh reads incorrect');await seq(['check','begin','debit','read','rollback','read','check']);await finish();await p.reload();await p.locator('#continue').click();if(!(await p.locator('#transaction-isolation').innerText()).includes('達成済み'))throw Error('completion not restored');results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
