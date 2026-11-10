async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'choices',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const open=async()=>{await p.locator('#workshop-open-quests').click();for(let i=0;i<15;i++){const group=p.getByRole('button',{name:/指示書の名前と説明を整える/});if(await group.count()){await group.click();return;}const next=p.getByRole('button',{name:'次の種類 →'});if(!await next.count())throw Error('category missing');await next.click();}throw Error('too many category pages');};
   const act=async x=>p.locator(`[data-instructions-action="${x}"]`).click();
   await open();if(await p.getByRole('button',{name:/変わった手順と説明をそろえる/}).count())throw Error('advanced opened early');
   stage='name';await p.getByRole('button',{name:/意味が伝わる名前を選ぶ/}).focus();await p.keyboard.press('Enter');await p.locator('[data-instructions-action="answer:seconds"]').focus();await p.keyboard.press('Enter');if(!(await p.locator('#instructions-status').innerText()).includes('確かめ'))throw Error('wrong answer hint missing');await act('answer:minutes');await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('扉の状態'))throw Error('partial state lost');await act('answer:open');await p.locator('#instructions-finish').click();await p.locator('#instructions-back').click();await open();if(await p.getByRole('button',{name:/変わった手順と説明をそろえる/}).count())throw Error('advanced opened after one');
   stage='comment';await p.getByRole('button',{name:/手順の理由を伝える/}).click();await act('answer:reason');await act('answer:why');await p.locator('#instructions-finish').click();await p.locator('#instructions-back').click();await open();
   stage='revise';await p.getByRole('button',{name:/変わった手順と説明をそろえる/}).click();await act('answer:new');await act('answer:comment');if(!(await p.locator('#instructions-status').innerText()).includes('確かめ'))throw Error('wrong answer hint missing');await act('answer:both');if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#instructions-finish').click();if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');await p.locator('#instructions-back').click();await p.reload();await p.locator('#continue').click();await open();if(!(await p.getByRole('button',{name:/変わった手順と説明をそろえる/}).getAttribute('aria-label'))?.includes('達成済み'))throw Error('completion lost');
   results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
