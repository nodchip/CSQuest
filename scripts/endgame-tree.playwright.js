async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'mid-archive',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const act=async a=>p.locator(`[data-tree-action="${a}"]`).click(),finish=async()=>{if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#tree-finish').click();await p.locator('#tree-back').click();};
   const search=async()=>{for(const x of ['visit:4','visit:2','visit:3','next','visit:4','visit:6','visit:7','empty','next'])await act(x);};
   stage='search';await p.locator('#tree-search').click();await act('visit:6');if(!(await p.locator('#tree-status').innerText()).includes('根から'))throw Error('wrong node feedback missing');await act('visit:4');await act('visit:2');await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('4 → 2'))throw Error('partial path not restored');for(const x of ['visit:3','next','visit:4','visit:6','visit:7','empty','next'])await act(x);await finish();if(await p.locator('#tree-compare').count())throw Error('advanced opened after one');
   await p.locator('#tree-search').click();await p.locator('#tree-restart').click();await search();await finish();if(await p.locator('#tree-compare').count())throw Error('replay opened advanced');
   stage='insert';await p.locator('#tree-insert').click();for(const x of ['insert','next','visit:4','insert','next','visit:4','insert','next','visit:4','visit:2','insert'])await act(x);if(!(await p.locator('body').innerText()).includes('番号2：左 空、右 3'))throw Error('inserted tree missing');await act('next');await finish();if(!await p.locator('#tree-compare').isVisible())throw Error('advanced missing');
   stage='compare';await p.locator('#tree-compare').click();for(const x of ['visit:4','visit:6','visit:7','next',...Array.from({length:7},(_,i)=>`visit:${i+1}`),'next','visit:4','visit:6','visit:7','empty','next',...Array.from({length:7},(_,i)=>`visit:${i+1}`),'empty','next'])await act(x);const text=await p.locator('#success-dialog').innerText();if(!text.includes('3回')||!text.includes('7回')||!text.includes('不在'))throw Error('comparison results missing');await finish();await p.reload();await p.locator('#continue').click();if(!(await p.locator('#tree-compare').innerText()).includes('達成済み'))throw Error('completion not restored');if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
