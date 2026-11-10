async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'garden',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const act=async a=>p.locator(`[data-color-action="${a}"]`).click(),finish=async()=>{if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#color-finish').click();await p.locator('#color-back').click();};
   const light=async()=>{for(const x of ['toggle:R','toggle:G','check','toggle:R','toggle:G','toggle:B','check','check'])await act(x);};
   stage='light';await p.locator('#color-light').click();await act('toggle:R');await act('check');if(!(await p.locator('#color-status').innerText()).includes('目標色'))throw Error('wrong color feedback missing');await p.reload();await p.locator('#continue').click();if(await p.locator('[data-color-action="toggle:R"]').getAttribute('aria-pressed')!=='true')throw Error('selection not restored');await act('toggle:G');if(!(await p.locator('body').innerText()).includes('結果：黄'))throw Error('yellow label missing');for(const x of ['check','toggle:R','toggle:G','toggle:B','check','check'])await act(x);await finish();if(await p.locator('#color-compare').count())throw Error('advanced opened after one');
   await p.locator('#color-light').click();await p.locator('#color-restart').click();await light();await finish();if(await p.locator('#color-compare').count())throw Error('replay opened advanced');
   stage='filter';await p.locator('#color-filter').click();for(const x of ['toggle:C','toggle:Y'])await act(x);if(!(await p.locator('body').innerText()).includes('結果：緑'))throw Error('green label missing');for(const x of ['check','toggle:C','toggle:M','check','check'])await act(x);await finish();if(!await p.locator('#color-compare').isVisible())throw Error('advanced missing');
   stage='compare';await p.locator('#color-compare').click();for(const x of ['toggle:G','record','mode:cmy','toggle:C','toggle:Y','record','toggle:Y','check'])await act(x);if(!(await p.locator('#color-status').innerText()).includes('両方'))throw Error('changed record not invalidated');for(const x of ['toggle:Y','record','check','toggle:B','record','mode:cmy','toggle:C','toggle:M','record','check'])await act(x);await finish();await p.reload();await p.locator('#continue').click();if(!(await p.locator('#color-compare').innerText()).includes('達成済み'))throw Error('completion not restored');if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
