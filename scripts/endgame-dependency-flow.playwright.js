async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'city',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const open=async()=>{await p.locator('#city-open-quests').click();for(let i=0;i<15;i++){const group=p.getByRole('button',{name:/祭りの準備の順番を考える/});if(await group.count()){await group.click();return;}const next=p.getByRole('button',{name:'次の種類 →'});if(!await next.count())throw Error('category missing');await next.click();}throw Error('too many pages');};
   const act=async x=>p.locator(`[data-depflow-action="${x}"]`).click(),sequence=async xs=>{for(const x of xs)await act(x);};
   await open();if(await p.getByRole('button',{name:/進まない約束を調べる/}).count())throw Error('advanced opened early');
   stage='line';await p.getByRole('button',{name:/先に必要な準備を進める/}).focus();await p.keyboard.press('Enter');await p.locator('[data-depflow-action="task:B"]').focus();await p.keyboard.press('Enter');if(!(await p.locator('#depflow-status').innerText()).includes('先'))throw Error('wrong order hint missing');await act('task:A');await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('A を完了'))throw Error('partial state lost');await sequence(['task:B','task:C','check']);await p.locator('#depflow-finish').click();await p.locator('#depflow-back').click();await open();if(await p.getByRole('button',{name:/進まない約束を調べる/}).count())throw Error('advanced opened after one');
   stage='branch';await p.getByRole('button',{name:/二つの準備をつなぐ/}).click();await sequence(['task:B','task:A','task:C','task:D','check']);await p.locator('#depflow-finish').click();await p.locator('#depflow-back').click();await open();
   stage='cycle';await p.getByRole('button',{name:/進まない約束を調べる/}).click();await act('stop');if(!(await p.locator('#depflow-status').innerText()).includes('先'))throw Error('premature stop hint missing');await sequence(['task:A','stop']);await act('cycle:B,C,D');if(!(await p.locator('#depflow-status').innerText()).includes('確かめ'))throw Error('downstream hint missing');await act('cycle:B,C');if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#depflow-finish').click();if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');await p.locator('#depflow-back').click();await p.reload();await p.locator('#continue').click();await open();if(!(await p.getByRole('button',{name:/進まない約束を調べる/}).getAttribute('aria-label'))?.includes('達成済み'))throw Error('completion lost');
   results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
