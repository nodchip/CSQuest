// Run against the local site through Playwright MCP, in isolated contexts.
async page=>{
 const results=[];
 for(const width of [390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const base=await p.evaluate(async()=>{
    const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');
    return {place:'garden',program:['forward','forward'],executed:true,completed:[...new Set(w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)))],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};
   });
   const save=async completed=>{await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),{...base,completed});await p.reload();await p.locator('#continue').click();};
   const shown=async()=>p.locator('[data-four-quest="garden-shelter"]').count();
   stage='four-region gate';await save([...base.completed,'garden-sets','garden-logic']);if(await shown())throw Error('other regions incomplete');
   const other=['observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'];
   stage='garden gate';await save([...base.completed,...other,'garden-sets']);if(await shown())throw Error('one garden basic');
   stage='open';await save([...base.completed,...other,'garden-sets','garden-logic']);if(!(await shown()))throw Error('request not shown');
   for(const [id,answers] of Object.entries({'garden-shelter':[[1,2,3],[2],[1]],'garden-lantern-rule':[[0,2,3],[1],[1,2,3]]})){
    stage=id;await p.locator(`[data-four-quest="${id}"]`).click();
    await p.locator(`[data-four-choice="${answers[0][0]}"]`).click();await p.reload();await p.locator('#continue').click();
    if(await p.locator(`[data-four-choice="${answers[0][0]}"]`).getAttribute('aria-pressed')!=='true')throw Error('partial selection lost');
    for(const n of answers[0].slice(1))await p.locator(`[data-four-choice="${n}"]`).click();await p.locator('#four-check').click();
    for(const answer of answers.slice(1)){for(const n of answer)await p.locator(`[data-four-choice="${n}"]`).click();await p.locator('#four-check').click();}
    if(!await p.locator('#success-dialog').isVisible())throw Error('success dialog missing');
    await p.locator('#finish').click();await p.locator('#four-back').click();
    if(!(await p.locator(`[data-four-quest="${id}"]`).innerText()).includes('達成済み'))throw Error('completion not shown');
   }
   results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
