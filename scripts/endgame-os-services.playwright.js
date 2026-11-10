async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'station',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const act=async a=>p.locator(`[data-os-action="${a}"]`).click(),finish=async()=>{if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#os-finish').click();await p.locator('#os-back').click();};
   const queue=async()=>{for(const x of ['arrive:A','arrive:B','print','print','check','arrive:B','arrive:A','print','print','check'])await act(x);};
   stage='queue';await p.locator('#os-queue').click();for(const x of ['arrive:B','arrive:A','print','print','check'])await act(x);if(!(await p.locator('#os-status').innerText()).includes('指定された順'))throw Error('wrong order feedback missing');await act('reset');await act('arrive:A');await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('待ち：A'))throw Error('queue not restored');for(const x of ['arrive:B','print','print','check','arrive:B','arrive:A','print','print','check'])await act(x);await finish();if(await p.locator('#os-access').count())throw Error('advanced opened after one');
   await p.locator('#os-queue').click();await p.locator('#os-restart').click();await queue();await finish();if(await p.locator('#os-access').count())throw Error('replay opened advanced');
   stage='storage';await p.locator('#os-storage').click();for(const x of ['draft','restart','read'])await act(x);if(!(await p.locator('#os-status').innerText()).includes('ありません'))throw Error('unsaved loss missing');await act('check');if(!(await p.locator('#os-status').innerText()).includes('保存'))throw Error('unsaved feedback missing');await act('reset');for(let i=0;i<2;i++)for(const x of ['draft','save','restart','read','check'])await act(x);await finish();if(!await p.locator('#os-access').isVisible())throw Error('advanced missing');
   stage='access';await p.locator('#os-access').click();for(const x of ['draft','save','restart','read:B'])await act(x);if(!(await p.locator('#os-status').innerText()).includes('拒否'))throw Error('access denial missing');await act('read:A');if(!(await p.locator('#os-status').innerText()).includes('Ａの荷札'))throw Error('owner read missing');await act('check');await finish();await p.reload();await p.locator('#continue').click();if(!(await p.locator('#os-access').innerText()).includes('達成済み'))throw Error('completion not restored');if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
