async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'observatory',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const open=async()=>{await p.locator('#observatory-open-quests').click();for(let i=0;i<25;i++){const group=p.getByRole('button',{name:/守護者の選ぶ道を考える/});if(await group.count()){await group.click();return;}const next=p.getByRole('button',{name:'次の種類 →'});if(!await next.count())throw Error('category missing');await next.click();}throw Error('too many pages');};
   const act=async x=>p.locator(`[data-guardian-action="${x}"]`).click(),seq=async xs=>{for(const x of xs)await act(x);};
   await open();if(await p.getByRole('button',{name:/見積もりと先の結果を比べる/}).count())throw Error('advanced opened early');
   stage='first';await p.getByRole('button',{name:/二つの道を見比べる/}).click();await act('east:8');if(!(await p.locator('#guardian-status').innerText()).includes('小さく'))throw Error('wrong choice hint missing');await p.locator('[data-guardian-action="east:2"]').focus();await p.keyboard.press('Enter');if(!(await p.locator('[data-guardian-action="west:5"]').evaluate(e=>document.activeElement===e)))throw Error('next action focus lost');await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('東で保証される値：2'))throw Error('partial state lost');await seq(['west:4','choose:west']);await p.locator('#guardian-finish').focus();await p.keyboard.press('Enter');if(!(await p.locator('#guardian-status').evaluate(e=>document.activeElement===e)))throw Error('result focus lost');await p.locator('#guardian-back').click();await open();if(await p.getByRole('button',{name:/見積もりと先の結果を比べる/}).count())throw Error('advanced opened after one');
   stage='second';await p.getByRole('button',{name:/別の組合せを調べる/}).click();await seq(['east:3','west:1','choose:east']);await p.locator('#guardian-finish').click();await p.locator('#guardian-back').click();await open();
   stage='horizon';await p.getByRole('button',{name:/見積もりと先の結果を比べる/}).click();await seq(['estimate:east','east:0','west:4','choose:west']);if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#guardian-finish').click();if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');await p.locator('#guardian-back').click();await p.reload();await p.locator('#continue').click();await open();if(!(await p.getByRole('button',{name:/見積もりと先の結果を比べる/}).getAttribute('aria-label'))?.includes('達成済み'))throw Error('completion lost');
   results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
