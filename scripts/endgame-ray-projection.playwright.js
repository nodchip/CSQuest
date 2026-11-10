async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'garden',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const open=async()=>{await p.locator('#garden-open-quests').click();for(let i=0;i<20;i++){const group=p.getByRole('button',{name:/光の道への橋を調べる/});if(await group.count()){await group.click();return;}const next=p.getByRole('button',{name:'次の種類 →'});if(!await next.count())throw Error('category missing');await next.click();}throw Error('too many pages');};
   const act=async x=>p.locator(`[data-rayprojection-action="${x}"]`).click(),sequence=async xs=>{for(const x of xs)await act(x);};
   await open();if(await p.getByRole('button',{name:/二つの橋を比べる/}).count())throw Error('advanced opened early');
   stage='axis';await p.getByRole('button',{name:/横の光の道へ橋をかける/}).focus();await p.keyboard.press('Enter');await p.locator('[data-rayprojection-action="choose:1.5"]').focus();await p.keyboard.press('Enter');if(!(await p.locator('#rayprojection-status').innerText()).includes('２つ以上'))throw Error('wrong answer hint missing');await act('trial:0');await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('t=0：点'))throw Error('partial state lost');await sequence(['trial:1.5','choose:1.5']);await p.locator('#rayprojection-finish').click();await p.locator('#rayprojection-back').click();await open();if(await p.getByRole('button',{name:/二つの橋を比べる/}).count())throw Error('advanced opened after one');
   stage='diagonal';await p.getByRole('button',{name:/斜めの光の道へ橋をかける/}).click();await sequence(['trial:3','trial:2','choose:2']);await p.locator('#rayprojection-finish').click();await p.locator('#rayprojection-back').click();await open();
   stage='compare';await p.getByRole('button',{name:/二つの橋を比べる/}).click();await sequence(['trial:0','trial:1.5','choose:1.5','trial:3','trial:2','choose:2']);await act('answer:parallel');if(!(await p.locator('#rayprojection-status').innerText()).includes('内積'))throw Error('wrong comparison hint missing');await act('answer:perpendicular');if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#rayprojection-finish').click();if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');await p.locator('#rayprojection-back').click();await p.reload();await p.locator('#continue').click();await open();if(!(await p.getByRole('button',{name:/二つの橋を比べる/}).getAttribute('aria-label'))?.includes('達成済み'))throw Error('completion lost');
   results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
