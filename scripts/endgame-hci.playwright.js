async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'guide',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   stage='accessibility';await p.locator('#accessibility-lab').click();await p.locator('[data-guide-choice="decoration"]').click();await p.locator('#guide-check').click();if(!(await p.locator('#guide-status').innerText()).includes('選び直し'))throw Error('wrong choice not explained');
   await p.locator('[data-guide-choice="button"]').click();await p.locator('#guide-preview').focus();await p.keyboard.press('Enter');if(!(await p.locator('#guide-preview-status').innerText()).includes('使えました'))throw Error('keyboard activation failed');await p.locator('#guide-check').click();await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('2つ目の場面'))throw Error('progress not restored');
   await p.locator('[data-guide-choice="visible"]').click();await p.locator('#guide-check').click();await p.locator('[data-guide-choice="destination"]').click();if(await p.locator('#guide-preview').getAttribute('aria-label')!=='水辺の村へ')throw Error('accessible name incorrect');await p.locator('#guide-check').click();if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#guide-finish').click();await p.locator('#guide-back').click();
   stage='usability';await p.locator('#usability-lab').click();await p.locator('[data-guide-choice="vague"]').click();await p.locator('#guide-check').click();if(!(await p.locator('#guide-status').innerText()).includes('選び直し'))throw Error('wrong choice not explained');
   for(const choice of ['specific','improve','judge']){await p.locator(`[data-guide-choice="${choice}"]`).click();await p.locator('#guide-check').click();}if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#guide-finish').click();if(!(await p.locator('body').innerText()).includes('時期だけでなく目的'))throw Error('purpose distinction missing');await p.locator('#guide-back').click();await p.reload();await p.locator('#continue').click();if(!(await p.locator('#usability-lab').innerText()).includes('達成済み'))throw Error('completion not restored');
   const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);if(overflow)throw Error('horizontal overflow');results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
