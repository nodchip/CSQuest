async page=>{
 const out=[];
 for(const width of [320,390,768,1280]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.setDefaultTimeout(5000);p.on('pageerror',e=>errors.push(String(e)));let stage='start';
  try{
   await p.goto('http://127.0.0.1:8767/');
   const s={place:'journey-quest',program:['forward','forward'],executed:true,forestProgram:[],forestExecuted:false,completed:['forest'],drafts:{branch:{program:['forward','ifWall','forward'],executed:false}},activeQuest:'branch',storyHeard:['workshop'],mapVisited:['workshop'],legacyUnlocked:[]};
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-story-v2',JSON.stringify(v)),s);await p.reload();await p.locator('#continue').click();
   stage='quest';await p.locator('#execute').click();await p.locator('#return').click();if(await p.getByText('新しい旅先が見つかりました').count())throw Error('notice before result');
   stage='notice';await p.locator('#back').click();await p.getByRole('heading',{name:'新しい旅先が見つかりました'}).waitFor();for(const n of ['水辺の村','灯花の街','風の港町'])if(!await p.getByText(n,{exact:true}).count())throw Error('missing '+n);
   if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('notice overflow');await p.locator('.travel-unlock-list img').first().waitFor();await p.waitForFunction(()=>[...document.querySelectorAll('.travel-unlock-list img')].every(i=>i.complete&&i.naturalWidth>0));
   await p.reload();await p.locator('#continue').click();await p.getByRole('heading',{name:'新しい旅先が見つかりました'}).waitFor();
   stage='map';await p.locator('#unlock-map').press('Enter');for(const id of ['river','city','harbor']){const button=p.locator(`[data-travel-place="${id}"]`);if(!(await button.getAttribute('aria-label')).includes('新しい旅先')||!(await button.innerText()).includes('NEW'))throw Error('missing marker '+id);}
   await p.locator('[data-travel-place="river"]').click();await p.locator('#travel-depart').click();
   stage='visit';await p.locator('#travel').click();if((await p.locator('[data-travel-place="river"]').getAttribute('aria-label')).includes('新しい旅先'))throw Error('visited marker remains');if(!(await p.locator('[data-travel-place="city"]').getAttribute('aria-label')).includes('新しい旅先'))throw Error('other marker missing');
   await p.reload();await p.locator('#continue').click();if(await p.getByRole('heading',{name:'新しい旅先が見つかりました'}).count())throw Error('notice repeated');out.push({width,ok:true,errors});
  }catch(e){out.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close()}
 }
 return {ok:out.every(x=>x.ok),out};
}
