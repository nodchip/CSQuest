async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'forge',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const open=async()=>{await p.locator('#forge-open-quests').click();for(let i=0;i<15;i++){const group=p.getByRole('button',{name:/魔石の丸めを調べる/});if(await group.count()){await group.click();return;}const next=p.getByRole('button',{name:'次の種類 →'});if(!await next.count())throw Error('category missing');await next.click();}throw Error('too many pages');};
   const act=async x=>p.locator(`[data-stone-round-action="${x}"]`).click();
   await open();if(await p.getByRole('button',{name:/足す順番を比べる/}).count())throw Error('advanced opened early');
   stage='even';await p.getByRole('button',{name:/一つ目の中間を丸める/}).focus();await p.keyboard.press('Enter');await p.locator('[data-stone-round-action="answer:1.125"]').focus();await p.keyboard.press('Enter');if(!(await p.locator('#stone-round-status').innerText()).includes('確かめ'))throw Error('wrong answer hint missing');await act('answer:1');await p.locator('#stone-round-finish').click();await p.locator('#stone-round-back').click();await open();if(await p.getByRole('button',{name:/足す順番を比べる/}).count())throw Error('advanced opened after one');
   stage='odd';await p.getByRole('button',{name:/二つ目の中間を丸める/}).click();await act('answer:1.25');await p.locator('#stone-round-finish').click();await p.locator('#stone-round-back').click();await open();
   stage='compare';await p.getByRole('button',{name:/足す順番を比べる/}).click();await act('try:left');await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('左から：1'))throw Error('partial state lost');await act('try:right');await act('answer:same');if(!(await p.locator('#stone-round-status').innerText()).includes('確かめ'))throw Error('wrong comparison hint missing');await act('answer:different');if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#stone-round-finish').click();if(!(await p.locator('body').innerText()).includes('小さい方から：0.125 → 1.125'))throw Error('comparison result missing');if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');await p.locator('#stone-round-back').click();await p.reload();await p.locator('#continue').click();await open();if(!(await p.getByRole('button',{name:/足す順番を比べる/}).getAttribute('aria-label'))?.includes('達成済み'))throw Error('completion lost');
   results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
