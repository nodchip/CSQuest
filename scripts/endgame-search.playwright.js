// Exercise search, errors, completion and reload with a progressed save.
async page=>{
 const results=[];
 for(const width of [390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{
    const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');
    return {place:'mid-archive',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};
   });
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   stage='entry';await p.locator('#search-lab').click();
   await p.locator('[data-shelf="1"]').click();if(!(await p.locator('#search-status').innerText()).includes('選び直し'))throw Error('wrong selection not explained');
   await p.locator('[data-shelf="0"]').click();await p.reload();await p.locator('#continue').click();
   if(!(await p.locator('body').innerText()).includes('照合：1回'))throw Error('search progress not restored');
   const actions=[1,2,3,4,5,3,5,0,1,2,3,4,5,6,'missing',3,1,2,'missing',0,3,1,0];
   stage='solve';for(const [index,action] of actions.entries()){
    await p.locator(action==='missing'?'#search-missing':`[data-shelf="${action}"]`).click();
    if(index===5&&!(await p.locator('body').innerText()).includes('小さいので、右側'))throw Error('right-hand explanation missing');
    if(index===15&&!(await p.locator('body').innerText()).includes('大きいので、左側'))throw Error('left-hand explanation missing');
   }
   if(!await p.locator('#success-dialog').isVisible())throw Error('success not shown');
   await p.locator('#search-finish').click();const text=await p.locator('body').innerText();
   if(!text.includes('左から 6回、真ん中から 2回')||!text.includes('左から 1回、真ん中から 3回'))throw Error('comparison missing');
   await p.locator('#search-restart').click();if(await p.evaluate(()=>document.activeElement?.tagName)!=='H3')throw Error('restart focus missing');
   await p.locator('#search-back').click();if(!(await p.locator('#search-lab').innerText()).includes('達成済み'))throw Error('completion missing');
   results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
