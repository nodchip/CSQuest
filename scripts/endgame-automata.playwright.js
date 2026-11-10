async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'mist',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const act=async a=>p.locator(`[data-automata-action="${a}"]`).click(),finish=async()=>{if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#automata-finish').click();await p.locator('#automata-back').click();},trials=async()=>{for(let i=0;i<4;i++)await act(`test:${i}`);};
   const even=['set:0:red:1','set:0:blue:0','set:1:red:0','set:1:blue:1'],last=['set:0:red:0','set:0:blue:1','set:1:red:0','set:1:blue:1'];
   stage='even';await p.locator('#automata-even').click();for(const x of ['set:0:red:0',...even.slice(1)])await act(x);await trials();await act('finish');if(!(await p.locator('#automata-status').innerText()).includes('遷移'))throw Error('wrong transition feedback missing');await act('set:0:red:1');await p.reload();await p.locator('#continue').click();if(await p.locator('[data-automata-action="set:0:red:1"]').getAttribute('aria-pressed')!=='true')throw Error('transition not restored');await trials();await act('finish');await finish();if(await p.locator('#automata-both').count())throw Error('advanced opened after one');
   await p.locator('#automata-even').click();await p.locator('#automata-restart').click();for(const x of even)await act(x);await trials();await act('finish');await finish();if(await p.locator('#automata-both').count())throw Error('replay opened advanced');
   stage='last';await p.locator('#automata-last').click();for(const x of last)await act(x);await trials();if(!(await p.locator('body').innerText()).includes('札なし（空列）。期待：拒否。結果：拒否'))throw Error('empty input result missing');await act('finish');await finish();if(!await p.locator('#automata-both').isVisible())throw Error('advanced missing');
   stage='both';await p.locator('#automata-both').click();for(const x of ['step','step','step','answer:reject'])await act(x);if(!(await p.locator('#automata-status').innerText()).includes('両方'))throw Error('wrong answer feedback missing');for(const x of ['answer:accept','step','step','answer:reject','answer:reject'])await act(x);await finish();await p.reload();await p.locator('#continue').click();if(!(await p.locator('#automata-both').innerText()).includes('達成済み'))throw Error('completion not restored');if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
