async page=>{
 const results=[];
 for(const width of [213,390,1200]){
  const c=await page.context().browser().newContext({viewport:{width,height:900}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));let stage='fixture';
  try{
   await p.goto(new URL('./',page.url()).href);const fixture=await p.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'garden',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),fixture);await p.reload();await p.locator('#continue').click();
   const open=async()=>{await p.locator('#garden-open-quests').click();for(let i=0;i<25;i++){const group=p.getByRole('button',{name:/灯り絵に窓を重ねる/});if(await group.count()){await group.click();return;}const next=p.getByRole('button',{name:'次の種類 →'});if(!await next.count())throw Error('category missing');await next.click();}throw Error('too many pages');};
   const act=async x=>p.locator(`[data-pixelwindow-action="${x}"]`).click(),add=async(start=0)=>{for(let i=start;i<9;i++)await act(`add:${i}`);};
   await open();if(await p.getByRole('button',{name:/中央の違いを強める/}).count())throw Error('advanced opened early');
   stage='box';await p.getByRole('button',{name:/周りを平均する/}).click();await p.locator('[data-pixelwindow-action="add:0"]').focus();await p.keyboard.press('Enter');if(!(await p.locator('[data-pixelwindow-action="add:1"]').evaluate(e=>document.activeElement===e)))throw Error('next cell focus lost');await p.reload();await p.locator('#continue').click();if(!(await p.locator('body').innerText()).includes('計算済み：1 / 9'))throw Error('partial state lost');await add(1);await act('answer:5');if(!(await p.locator('#pixelwindow-status').innerText()).includes('合計'))throw Error('wrong answer hint missing');await act('answer:40/9');await p.locator('#pixelwindow-finish').focus();await p.keyboard.press('Enter');if(!(await p.locator('#pixelwindow-status').evaluate(e=>document.activeElement===e)))throw Error('result focus lost');await p.locator('#pixelwindow-back').click();await open();if(await p.getByRole('button',{name:/中央の違いを強める/}).count())throw Error('advanced opened after one');
   stage='gaussian';await p.getByRole('button',{name:/中央を重く平均する/}).click();await add();await act('answer:5');await p.locator('#pixelwindow-finish').click();await p.locator('#pixelwindow-back').click();await open();
   stage='sharp';await p.getByRole('button',{name:/中央の違いを強める/}).click();await add();await act('answer:24');if(!await p.locator('#success-dialog').isVisible())throw Error('success missing');await p.locator('#pixelwindow-finish').click();if(await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');await p.locator('#pixelwindow-back').click();await p.reload();await p.locator('#continue').click();await open();if(!(await p.getByRole('button',{name:/中央の違いを強める/}).getAttribute('aria-label'))?.includes('達成済み'))throw Error('completion lost');
   results.push({width,ok:errors.length===0,errors});
  }catch(e){results.push({width,ok:false,stage,error:String(e),errors});}finally{await c.close();}
 }
 return {ok:results.every(r=>r.ok),results};
}
