async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'forge',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const act=async a=>p.locator(`[data-objects-action="${a}"]`).click(),finish=async()=>{if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#objects-finish').click();await p.locator('#objects-back').click();};
   const identity=async()=>{for(const x of ['act:A:charge','check','act:A:use','check'])await act(x);};
   stage='identity';await p.locator('#objects-identity').click();for(const x of ['act:B:use','act:B:charge','act:A:charge','check'])await act(x);if(!(await p.locator('#objects-status').innerText()).includes('Ｂを動かした'))throw Error('changed other instance not explained');await act('reset');await act('act:A:charge');await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('Ａ 1、Ｂ 2'))throw Error('scene not restored');await act('check');await act('act:A:use');await act('check');await finish();if(await p.locator('#objects-interaction').count())throw Error('advanced opened after one');
   await p.locator('#objects-identity').click();await p.locator('#objects-restart').click();await identity();await finish();if(await p.locator('#objects-interaction').count())throw Error('replay opened advanced');
   stage='encapsulation';await p.locator('#objects-encapsulation').click();for(const x of ['act:A:direct','act:A:use'])await act(x);if(!(await p.locator('#objects-status').innerText()).includes('残量０'))throw Error('empty rejection missing');for(const x of ['check','act:A:direct','act:A:charge'])await act(x);if(!(await p.locator('#objects-status').innerText()).includes('満杯'))throw Error('full rejection missing');await act('check');await finish();if(!await p.locator('#objects-interaction').isVisible())throw Error('advanced missing');
   stage='interaction';await p.locator('#objects-interaction').click();for(const x of ['act:B:use','act:A:use','act:B:charge','check','act:A:use','act:B:charge','check'])await act(x);await finish();await p.reload();await p.locator('#continue').click();if(!(await p.locator('#objects-interaction').innerText()).includes('達成済み'))throw Error('completion not restored');if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
