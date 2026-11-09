async page=>{
 const results=[];
 for(const first of ['garden','harbor']){
  const c=await page.context().browser().newContext({viewport:{width:390,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);const fixture=await p.evaluate(async first=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:first,program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs','garden-image-fit','garden-image-pixels'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};},first);
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const press=async seq=>{for(const x of seq)await p.locator(`[data-coop="${x}"]`).click();};
   const garden=async()=>{await p.locator('#image-resample').click();for(let n=0;n<3;n++){for(const i of [0,2,8,10])await p.locator(`[data-resample="cell:${i}"]`).click();for(const action of ['reduce','expand','next'])await p.locator(`[data-resample="${action}"]`).click();}await p.locator('[data-resample="ambiguous"]').click();await p.locator('#resample-finish').click();await p.locator('#resample-back').click();};
   const harbor=async()=>{await p.locator('#count-lab').click();await press(['A','B','A','B','A','B','check','A','A','A','B','B','B','check','A','A','A','B','B','B','check']);await p.locator('#coop-finish').click();await p.locator('#coop-back').click();await p.locator('#join-lab').click();await press(['B','A','send','A','send']);await p.locator('#coop-finish').click();await p.locator('#coop-back').click();await p.locator('#lock-lab').click();await press(['A','A','A','A','A','B','B','B','B','B','check','B','B','B','B','B','A','A','A','A','A','check']);await p.locator('#coop-finish').click();await p.locator('#coop-back').click();};
   stage=first;if(first==='garden')await garden();else await harbor();await p.reload();await p.locator('#continue').click();
   const afterFirst=await p.evaluate(()=>JSON.parse(localStorage.getItem('csquest-workshop-journey-v1')).completed);if(new Set(afterFirst).size!==afterFirst.length||afterFirst.includes('garden-image-resample')!==(first==='garden')||afterFirst.includes('harbor-lock')!==(first==='harbor'))throw Error('first completion contaminated other quest');
   stage='travel';await p.locator(first==='garden'?'#travel':'#back').click();await p.locator(`[data-travel-place="${first==='garden'?'harbor':'garden'}"]`).click();await p.locator('#travel-depart').click();stage='second';if(first==='garden')await harbor();else await garden();await p.reload();await p.locator('#continue').click();
   const complete=await p.evaluate(()=>JSON.parse(localStorage.getItem('csquest-workshop-journey-v1')).completed);if(new Set(complete).size!==complete.length||!['garden-image-resample','harbor-count','harbor-join','harbor-lock'].every(id=>complete.includes(id)))throw Error('cross-journey completion invalid');results.push({first,ok:errors.length===0,errors});
  }catch(e){results.push({first,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
