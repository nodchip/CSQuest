async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'sky',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const open=async()=>{await p.locator('#sky-open-quests').click();for(let i=0;i<15;i++){const group=p.getByRole('button',{name:/伝令路の混雑を調べる/});if(await group.count()){await group.click();return;}const next=p.getByRole('button',{name:'次の種類 →'});if(!await next.count())throw Error('category missing');await next.click();}throw Error('too many pages');};
   const act=async x=>p.locator(`[data-congestion-action="${x}"]`).click(),sequence=async xs=>{for(const x of xs)await act(x);};
   await open();if(await p.getByRole('button',{name:/混雑の後の送信枠を調べる/}).count())throw Error('advanced opened early');
   stage='grow';await p.getByRole('button',{name:/送る数を少しずつ増やす/}).focus();await p.keyboard.press('Enter');await p.locator('[data-congestion-action="send"]').focus();await p.keyboard.press('Enter');await act('adjust:half');if(!(await p.locator('#congestion-status').innerText()).includes('確かめ'))throw Error('wrong adjustment hint missing');await act('adjust:up');await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('送信枠：2通'))throw Error('partial state lost');await sequence(['send','adjust:up','check']);await p.locator('#congestion-finish').click();await p.locator('#congestion-back').click();await open();if(await p.getByRole('button',{name:/混雑の後の送信枠を調べる/}).count())throw Error('advanced opened after one');
   stage='loss';await p.getByRole('button',{name:/混雑したら数を減らす/}).click();await sequence(['send','adjust:half','check']);await p.locator('#congestion-finish').click();await p.locator('#congestion-back').click();await open();
   stage='recover';await p.getByRole('button',{name:/混雑の後の送信枠を調べる/}).click();await sequence(['send','adjust:up','send','adjust:up','send','adjust:half','send','adjust:up','check']);if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#congestion-finish').click();if(!(await p.locator('body').innerText()).includes('３回目：3通を送り、0通が到着'))throw Error('loss result missing');if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');await p.locator('#congestion-back').click();await p.reload();await p.locator('#continue').click();await open();if(!(await p.getByRole('button',{name:/混雑の後の送信枠を調べる/}).getAttribute('aria-label'))?.includes('達成済み'))throw Error('completion lost');
   results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
