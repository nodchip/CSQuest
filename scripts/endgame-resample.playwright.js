async page=>{
 const results=[];
 for(const width of [213,390,1200])for(const harborFirst of [false,true]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'garden',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs','garden-image-fit'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   if(harborFirst)fixture.completed.push('harbor-count','harbor-join','harbor-lock');await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();if(await p.locator('#image-resample').count())throw Error('advanced quest unlocked after only one');
   fixture.completed.push('garden-image-pixels');await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();if(!await p.locator('#image-resample').count())throw Error('advanced quest not unlocked');
   stage='sample';await p.locator('#image-resample').click();await p.locator('[data-resample="cell:1"]').click();await p.locator('[data-resample="reduce"]').click();if(!(await p.locator('#resample-status').innerText()).includes('左上'))throw Error('wrong sampling not explained');await p.locator('[data-resample="cell:1"]').click();await p.locator('summary').filter({hasText:'大きな操作'}).click();await p.locator('#resample-mark').click();if(!(await p.locator('#resample-status').innerText()).includes('1行、左から1列を選びました'))throw Error('large control status missing');
   await p.reload();await p.locator('#continue').click();if(await p.locator('[data-resample="cell:0"]').getAttribute('aria-pressed')!=='true')throw Error('selection not restored');
   for(let scene=0;scene<3;scene++){
    for(const i of scene===0?[2,8,10]:[0,2,8,10])await p.locator(`[data-resample="cell:${i}"]`).click();
    await p.locator('[data-resample="reduce"]').click();
    if(!(await p.locator('[aria-label^="残した２×２の絵"]').getAttribute('aria-label')).includes(scene===2?'すべて紫':'すべて白'))throw Error('wrong reduced image');await p.locator('[data-resample="expand"]').click();
    if(!(await p.locator('body').innerText()).includes(scene===2?'元どおり':'残らず'))throw Error('comparison missing');await p.locator('[data-resample="next"]').click();
   }
   stage='comparison';await p.locator('[data-resample="certain"]').click();if(!(await p.locator('#resample-status').innerText()).includes('比べ'))throw Error('wrong conclusion not explained');await p.locator('[data-resample="ambiguous"]').click();if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');const completed=await p.evaluate(()=>JSON.parse(localStorage.getItem('csquest-workshop-journey-v1')).completed);if(new Set(completed).size!==completed.length||['harbor-count','harbor-join','harbor-lock'].some(id=>completed.includes(id)!==harborFirst))throw Error('other quests changed or duplicated');await p.locator('#resample-finish').click();await p.locator('#resample-back').click();await p.reload();await p.locator('#continue').click();if(!(await p.locator('#image-resample').innerText()).includes('達成済み'))throw Error('completion not restored');if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');results.push({width,harborFirst,ok:errors.length===0,errors});
  }catch(e){results.push({width,harborFirst,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
