async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'sky',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const open=async()=>{await p.locator('#sky-open-quests').click();for(let i=0;i<20;i++){const group=p.getByRole('button',{name:/住所の控えの期限を調べる/});if(await group.count()){await group.click();return;}const next=p.getByRole('button',{name:'次の種類 →'});if(!await next.count())throw Error('category missing');await next.click();}throw Error('too many pages');};
   const act=async x=>p.locator(`[data-dnsexpiry-action="${x}"]`).click(),sequence=async xs=>{for(const x of xs)await act(x);};
   await open();if(await p.getByRole('button',{name:/期限の違いを比べる/}).count())throw Error('advanced opened early');
   stage='short';await p.getByRole('button',{name:/二刻の控えを調べる/}).focus();await p.keyboard.press('Enter');await p.locator('[data-dnsexpiry-action="answer:new"]').focus();await p.keyboard.press('Enter');if(!(await p.locator('#dnsexpiry-status').innerText()).includes('期限'))throw Error('wrong answer hint missing');await act('answer:old');await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('時刻 1：192.0.2.42'))throw Error('partial state lost');await act('answer:new');await p.locator('#dnsexpiry-finish').click();await p.locator('#dnsexpiry-back').click();await open();if(await p.getByRole('button',{name:/期限の違いを比べる/}).count())throw Error('advanced opened after one');
   stage='long';await p.getByRole('button',{name:/四刻の控えを調べる/}).click();await sequence(['answer:old','answer:old','answer:new']);await p.locator('#dnsexpiry-finish').click();await p.locator('#dnsexpiry-back').click();await open();
   stage='compare';await p.getByRole('button',{name:/期限の違いを比べる/}).click();await sequence(['answer:new','answer:old']);await act('compare:short');if(!(await p.locator('#dnsexpiry-status').innerText()).includes('期限'))throw Error('wrong comparison hint missing');await act('compare:long');if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#dnsexpiry-finish').click();if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');await p.locator('#dnsexpiry-back').click();await p.reload();await p.locator('#continue').click();await open();if(!(await p.getByRole('button',{name:/期限の違いを比べる/}).getAttribute('aria-label'))?.includes('達成済み'))throw Error('completion lost');
   results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
