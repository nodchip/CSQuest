async page=>{
 const results=[];
 for(const width of [320,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width:width===320?213:width,height:width===320?600:900},deviceScaleFactor:width===320?1.5:1}),p=await c.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'sky',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   stage='entry';await p.locator('#name-lab').click();await p.locator('[data-name-action="cache"]').click();if(!(await p.locator('#name-status').innerText()).includes('名前帳'))throw Error('missing cache not explained');
   await p.locator('[data-name-action="lookup"]').click();await p.locator('[data-name-action="address:35"]').click();if(!(await p.locator('#name-status').innerText()).includes('照らし合わせ'))throw Error('wrong address not explained');
   await p.locator('[data-name-action="address:21"]').click();await p.reload();await p.locator('#continue').click();
   if(!(await p.locator('body').innerText()).includes('2つ目：水辺の村の掲示係'))throw Error('progress not restored');
   stage='solve';for(const action of ['lookup','address:35','lookup','missing','cache'])await p.locator(`[data-name-action="${action}"]`).click();
   if(!(await p.locator('body').innerText()).includes('期限切れ'))throw Error('expiry not shown');
   await p.locator('[data-name-action="cache"]').click();if(!(await p.locator('#name-status').innerText()).includes('期限切れ'))throw Error('expired cache accepted');
   await p.locator('[data-name-action="lookup"]').click();await p.locator('[data-name-action="address:48"]').click();
   if(!await p.locator('#success-dialog').isVisible())throw Error('success not shown');await p.locator('#name-finish').click();
   const text=await p.locator('body').innerText();if(!text.includes('3つ目 登録なし')||!text.includes('5つ目 48番'))throw Error('results missing');
   await p.locator('#name-back').click();if(!(await p.locator('#name-lab').innerText()).includes('達成済み'))throw Error('completion missing');results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
