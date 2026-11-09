async page=>{
 const results=[];
 for(const width of [320,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width:width===320?213:width,height:width===320?600:900},deviceScaleFactor:width===320?1.5:1}),p=await c.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);
   const fixture=await p.evaluate(async()=>{
    const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');
    return {place:'choices',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};
   });
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   stage='entry';await p.locator('#flower-lab').click();await p.locator('[data-flower-add="loop"]').click();await p.locator('#flower-start').click();
   if(!(await p.locator('#flower-retry').getAttribute('aria-label')).includes('繰り返しは一組'))throw Error('empty trace error not announced');
   await p.locator('#flower-retry').click();await p.locator('#flower-undo').click();
   await p.locator('[data-flower-add="report"]').click();await p.locator('#flower-start').click();await p.locator('#flower-step').click();
   if(!await p.locator('#flower-retry').count())throw Error('wrong program did not offer retry');
   if(!(await p.locator('#flower-retry').getAttribute('aria-label')).includes('青は2枚'))throw Error('wrong result not announced');
   await p.locator('#flower-retry').click();await p.locator('#flower-undo').click();
   if(!(await p.evaluate(()=>document.activeElement?.dataset.flowerAdd)))throw Error('focus lost after removing last card');
   for(const id of ['clear','loop','take','blue','again','report'])await p.locator(`[data-flower-add="${id}"]`).click();
   await p.locator('#flower-start').click();await p.locator('#flower-step').click();
   if(!(await p.locator('#flower-step').getAttribute('aria-label')).includes('箱の数は0'))throw Error('state not announced');
   await p.reload();await p.locator('#continue').click();
   if(!(await p.locator('body').innerText()).includes('直前に行ったこと：数の箱を０にする'))throw Error('step not restored');
   let emptyConditionSeen=false;stage='solve';for(let i=0;i<4;i++){
    if(i)await p.locator('#flower-start').click();
    while(await p.locator('#flower-step').count()){
     await p.locator('#flower-step').click();if((await p.locator('body').innerText()).includes('札が残っていないので、繰り返しを終えます。'))emptyConditionSeen=true;
     if(!await p.evaluate(()=>{const r=document.activeElement.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;}))throw Error('step focus is off-screen');
    }
    if(!(await p.locator('body').innerText()).includes('正しく数えられました'))throw Error('trial not accepted '+i);
    await p.locator('#flower-next').click();
   }
   if(!emptyConditionSeen)throw Error('empty loop condition not explained');
   if(!await p.locator('#success-dialog').isVisible())throw Error('success not shown');
   await p.locator('#flower-finish').click();await p.locator('#flower-back').click();
   if(!(await p.locator('#flower-lab').innerText()).includes('達成済み'))throw Error('completion missing');
   results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
