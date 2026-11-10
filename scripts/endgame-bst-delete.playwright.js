async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'mid-archive',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const open=async()=>{await p.locator('#archive-open-quests').click();for(let i=0;i<15;i++){const group=p.getByRole('button',{name:/枝の札を取り除く/});if(await group.count()){await group.click();return;}const next=p.getByRole('button',{name:'次の種類 →'});if(!await next.count())throw Error('category missing');await next.click();}throw Error('too many pages');};
   const act=async x=>p.locator(`[data-bstd-action="${x}"]`).click();
   await open();if(await p.getByRole('button',{name:/二つの枝を持つ札を取り除く/}).count())throw Error('advanced opened early');
   stage='leaf';await p.getByRole('button',{name:/枝のない札を取り除く/}).focus();await p.keyboard.press('Enter');await p.locator('[data-bstd-action="node:4"]').focus();await p.keyboard.press('Enter');if(!(await p.locator('#bstd-status').innerText()).includes('確認'))throw Error('wrong choice hint missing');await act('node:2');await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('取り除く札：2'))throw Error('partial state lost');await act('retain:none');await p.locator('#bstd-finish').click();await p.locator('#bstd-back').click();await open();if(await p.getByRole('button',{name:/二つの枝を持つ札を取り除く/}).count())throw Error('advanced opened after one');
   stage='single';await p.getByRole('button',{name:/一つの枝を持つ札を取り除く/}).click();await act('node:9');await act('retain:none');if(!(await p.locator('#bstd-status').innerText()).includes('確認'))throw Error('lost child hint missing');await act('retain:9.5');await p.locator('#bstd-finish').click();await p.locator('#bstd-back').click();await open();
   stage='two';await p.getByRole('button',{name:/二つの枝を持つ札を取り除く/}).click();await act('node:8');await act('node:9');await act('copy');await act('retain:9.5');if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#bstd-finish').click();if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');await p.locator('#bstd-back').click();await p.reload();await p.locator('#continue').click();await open();if(!(await p.getByRole('button',{name:/二つの枝を持つ札を取り除く/}).getAttribute('aria-label'))?.includes('達成済み'))throw Error('completion lost');
   results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
