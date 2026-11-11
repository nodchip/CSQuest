async page=>{
 const out=[];
 for(const width of [320,390,768,1280]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.setDefaultTimeout(5000);p.on('pageerror',e=>errors.push(String(e)));let stage='old-save';
  try{
   await p.goto('http://127.0.0.1:8767/');await p.evaluate(()=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify({old:'preserve'})));await p.reload();
   if(await p.locator('#continue').isEnabled())throw Error('old save imported');if(!(await p.evaluate(()=>localStorage.getItem('csquest-workshop-journey-v1'))).includes('preserve'))throw Error('old save removed');
   const base={place:'harbor',program:['forward','forward'],executed:true,completed:['forest','branch','river','city-sort','harbor-message'],storyHeard:['workshop','river','city'],storyReflectionSeen:false,storyGatheringSeen:false,mapVisited:['workshop','river','city','harbor']};
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-story-v2',JSON.stringify(v)),base);await p.reload();await p.locator('#continue').click();
   stage='third-clue';if((await p.locator('header small').innerText())!=='風の港町')throw Error('wrong place in header');if(!(await p.locator('body').innerText()).includes('別の便'))throw Error('harbor clue missing');await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('別の便'))throw Error('unheard clue lost');
   await p.locator('#story-conversation-next').press('Enter');stage='reflection';if(!(await p.locator('h1').textContent()).includes('思い返す'))throw Error('reflection missing');await p.locator('#story-conversation-next').press('Enter');
   stage='history';const body=await p.locator('body').innerText();if(body.includes('12の土地')||body.includes('/ 12'))throw Error('premature counter');await p.getByRole('button',{name:'これまでの出来事を見る'}).click();const history=await p.locator('body').innerText();if(!history.includes('水辺の道しるべ')||history.includes('星鉄の鍛冶街'))throw Error('clue history or undiscovered place wrong');
   if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('overflow');out.push({width,ok:errors.length===0,errors});
  }catch(e){out.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:out.every(x=>x.ok),out};
}
