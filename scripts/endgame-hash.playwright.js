async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'mid-archive',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const act=async a=>p.locator(`[data-hash-action="${a}"]`).click();
   const chain=async()=>{for(const x of ['put:1:1','put:4:1','put:7:1','seek:4','seek:7','seek:10'])await act(x);};
   stage='chain';await p.locator('#hash-chain').click();await act('put:1:0');if(!(await p.locator('#hash-status').innerText()).includes('余り'))throw Error('incorrect placement not explained');await act('put:1:1');await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('番号4'))throw Error('chain history not restored');for(const x of ['put:4:1','put:7:1','seek:4','seek:7','seek:10'])await act(x);if(!(await p.locator('#success-dialog').innerText()).includes('番号10は棚１にありません'))throw Error('absent chain result missing');await p.locator('#hash-finish').click();await p.locator('#hash-back').click();if(await p.locator('#hash-deletion').count())throw Error('advanced opened after one');
   await p.locator('#hash-chain').click();await p.locator('#hash-restart').click();await chain();await p.locator('#hash-finish').click();await p.locator('#hash-back').click();if(await p.locator('#hash-deletion').count())throw Error('replay opened advanced');
   stage='linear';await p.locator('#hash-linear').click();for(const x of ['start','probe:1','start','probe:1','probe:2','start','probe:1','probe:2','probe:0','start','probe:1','probe:2','probe:0','start','probe:1','probe:2','probe:0'])await act(x);if(!(await p.locator('#success-dialog').innerText()).includes('番号10は全棚を一周'))throw Error('absent linear result missing');await p.locator('#hash-finish').click();await p.locator('#hash-back').click();if(!await p.locator('#hash-deletion').isVisible())throw Error('advanced not opened');
   stage='deletion';await p.locator('#hash-deletion').click();for(const x of ['delete:empty','probe:1','probe:2'])await act(x);if(!(await p.locator('#hash-status').innerText()).includes('見つかりません'))throw Error('empty result missing');for(const x of ['next','delete:mark','probe:1','probe:2','probe:0'])await act(x);if(!(await p.locator('#hash-status').innerText()).includes('見つけ'))throw Error('deleted marker result missing');await act('next');if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#hash-finish').click();if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');await p.locator('#hash-back').click();await p.reload();await p.locator('#continue').click();if(!(await p.locator('#hash-deletion').innerText()).includes('達成済み'))throw Error('completion not restored');
   results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
