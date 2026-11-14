// Windows: install playwright-core in .browser-test and set NODE_PATH to its
// node_modules directory before running this script. Uses the installed Edge.
const {chromium}=require('playwright-core');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=process.cwd();
const server=http.createServer((req,res)=>{
 const target=path.join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname==='/'?'/index.html':new URL(req.url,'http://localhost').pathname));
 if(!target.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(target,(err,data)=>{if(err){res.writeHead(404).end();return;}const type={'.js':'text/javascript','.html':'text/html','.css':'text/css','.png':'image/png','.webp':'image/webp'}[path.extname(target)]||'application/octet-stream';res.writeHead(200,{'Content-Type':type});res.end(data);});
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const url=`http://127.0.0.1:${server.address().port}/`;
 for(const width of [390,1280]){
  const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));page.setDefaultTimeout(5000);
  try{
   await page.goto(url);
   const fixture=await page.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'city',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true,questGroups:{known:{city:['local','dependency','sorting']},pending:{}}};});
   await page.evaluate(v=>localStorage.setItem('csquest-workshop-journey-story-v2',JSON.stringify(v)),fixture);await page.reload();await page.locator('#continue').click();
   if(!(await page.locator('#city-open-quests').innerText()).includes('4件'))throw Error('initial count incorrect');
   await page.locator('#city-open-quests').focus();await page.keyboard.press('Enter');
   if(await page.getByRole('button',{name:/品札の列を合わせる/}).count())throw Error('locked group visible');
   await page.getByRole('button',{name:/市場の札の並べ方を調べる/}).click();
   await page.getByRole('button',{name:/札を挿し入れて並べる/}).click();
   const actions=async list=>{for(const a of list)await (a==='compare'?page.locator('#sorting-compare-action'):page.locator(`[data-sorting-action="${a}"]`)).click();};
   await actions(['compare','swap','compare','swap','compare','keep','compare','keep','compare','swap','compare','swap']);
   await page.locator('#sorting-finish').click();await page.locator('#sorting-back').click();
   await page.locator('#back').click();
   if(!(await page.locator('#city-open-quests').innerText()).includes('3件'))throw Error('count after first completion incorrect');
   await page.locator('#city-open-quests').click();await page.getByRole('button',{name:/市場の札の並べ方を調べる/}).click();await page.getByRole('button',{name:/小さい札を選んで並べる/}).click();
   await actions(['compare','compare','swap','compare','swap','compare','compare','swap','compare','keep']);
   await page.locator('#sorting-finish').click();await page.locator('#sorting-back').click();await page.locator('#back').click();
   if(!await page.getByText('新しい相談が届いています。').count())throw Error('notice missing');
   if(!(await page.locator('#city-open-quests').innerText()).includes('5件'))throw Error('count after unlock incorrect');
   await page.reload();await page.locator('#continue').click();if(!await page.getByText('新しい相談が届いています。').count())throw Error('notice not restored');
   await page.locator('#city-open-quests').focus();await page.keyboard.press('Enter');
   if(!await page.getByRole('button',{name:/品札の列を合わせる/}).count())throw Error('new group missing');
   if(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');
   await page.locator('#windmill-menu-back').click();if(await page.getByText('新しい相談が届いています。').count())throw Error('notice not cleared');
   await page.reload();await page.locator('#continue').click();if(await page.getByText('新しい相談が届いています。').count())throw Error('read notice returned');
   const allCity=await page.evaluate(async()=>{const m=await import('./src/city-quest-groups.js');return m.cityQuestGroups([],true).flatMap(g=>g.quests);});
   fixture.completed=[...new Set([...fixture.completed,...allCity])];delete fixture.questGroups;
   await page.evaluate(v=>localStorage.setItem('csquest-workshop-journey-story-v2',JSON.stringify(v)),fixture);await page.reload();await page.locator('#continue').click();
   if((await page.locator('#city-open-quests').getAttribute('aria-label'))!=='依頼を見る、すべて達成済み')throw Error('complete indicator missing');
   if(errors.length)throw Error(errors.join('; '));console.log(JSON.stringify({width,ok:true}));
  }catch(e){console.log(JSON.stringify({width,ok:false,error:String(e),errors}));process.exitCode=1;}
  await context.close();
 }
 for(const width of [390,1280]){
  const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage();page.setDefaultTimeout(3000);
  try{
   await page.goto(url);
   const fixture=await page.evaluate(async()=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place:'city',program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],sortingInsertionHistory:['compare'],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true};});
   await page.evaluate(v=>localStorage.setItem('csquest-workshop-journey-story-v2',JSON.stringify(v)),fixture);await page.reload();await page.locator('#continue').click();
   if(await page.getByText('新しい相談が届いています。').count())throw Error('legacy progress produced a notification');
   await page.locator('#city-open-quests').click();
   if(!await page.getByRole('button',{name:/市場の札の並べ方を調べる/}).count())await page.getByRole('button',{name:'次の種類 →'}).click();
   await page.getByRole('button',{name:/市場の札の並べ方を調べる/}).click();
   await page.getByRole('button',{name:/札を挿し入れて並べる/}).click();
   if(!(await page.locator('body').innerText()).includes('比べた回数：1'))throw Error('legacy partial work not restored');
   console.log(JSON.stringify({width,legacyPartial:true,ok:true}));
  }catch(e){console.log(JSON.stringify({width,legacyPartial:true,ok:false,error:String(e)}));process.exitCode=1;}
  await context.close();
 }
 for(const width of [390,1280]){
  const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(String(e)));page.setDefaultTimeout(3000);
  for(const [region,place] of Object.entries({workshop:'choices',city:'city',river:'river',harbor:'harbor',archive:'mid-archive',windmill:'mid-windmill',mountain:'mountain',valley:'valley',sky:'sky',mist:'mist',forge:'forge',station:'station',garden:'garden',observatory:'observatory',tailor:'tailor',guide:'guide'})){
   try{
    await page.goto(url);
    const fixture=await page.evaluate(async(place)=>{const w=await import('./src/world-progress.js'),s=await import('./src/story-climax.js');return {place,program:['forward','forward'],executed:true,completed:[...new Set([...w.storyRegions.flatMap(r=>w.worldRegionQuests[r].slice(0,2)),'garden-sets','garden-logic','observatory-classify','observatory-predict','tailor-design','tailor-testing','guide-needs','guide-signs'])],storyClimaxHistory:s.climaxSteps.map(x=>x.answer),storyClimaxComplete:true,questGroups:{known:{},pending:{}}};},place);
    await page.evaluate(v=>localStorage.setItem('csquest-workshop-journey-story-v2',JSON.stringify(v)),fixture);await page.reload();await page.locator('#continue').click();
    const open=page.locator(`#${region}-open-quests`);await open.focus();await page.keyboard.press('Enter');
    if(!await page.locator('.windmill-quest-menu .quest-nav-card').count())throw Error('no selectable groups');
    if(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth))throw Error('horizontal overflow');
    await page.locator('#windmill-menu-back').focus();await page.keyboard.press('Enter');
    if(!await open.evaluate(e=>e===document.activeElement))throw Error('focus not restored');
    delete fixture.questGroups;
    await page.evaluate(v=>localStorage.setItem('csquest-workshop-journey-story-v2',JSON.stringify(v)),fixture);await page.reload();await page.locator('#continue').click();
    if(await page.getByText('新しい相談が届いています。').count())throw Error('old save produced a notice');
    await page.locator(`#${region}-open-quests`).click();
    if(!await page.locator('.windmill-quest-menu .quest-nav-card').count())throw Error('old save has no selectable groups');
    for(let pageNumber=0;pageNumber<50;pageNumber++){
     const cards=page.locator('.windmill-quest-menu .quest-nav-list > button'),count=await cards.count();
     for(let index=0;index<count;index++){
      const name=await cards.nth(index).innerText(),expected=Number(name.match(/受けられる未達成の依頼：(\d+)件/)?.[1]??0);await cards.nth(index).click();
      if(!await page.locator('.windmill-quest-menu .quest-nav-list > button').count())throw Error('empty group: '+name);
      if(await page.locator('.windmill-quest-menu .quest-nav-list > button:not(.is-complete)').count()!==expected)throw Error('available count differs from actionable cards: '+name);
      await page.locator('#windmill-menu-back').click();
     }
     const next=page.getByRole('button',{name:'次の種類 →'});if(!await next.count())break;await next.click();
    }
    const partial=await page.evaluate(async({region,completed})=>{
     let groups;
     if(['sky','mist'].includes(region)){const m=await import('./src/tower-gate-quest-groups.js');groups=m.towerGateQuestGroups(region,completed,true);}
     else if(['forge','station'].includes(region)){const m=await import('./src/forge-station-quest-groups.js');groups=m.forgeStationQuestGroups(region,completed,true);}
     else if(['garden','observatory','tailor','guide'].includes(region)){const m=await import('./src/late-region-quest-groups.js');groups=m.lateRegionQuestGroups(region,completed,true);}
     else if(region==='workshop'){const m=await import('./src/workshop-quest-groups.js');groups=m.workshopQuestGroups(completed,true,true);}
     else {const modules={city:['city-quest-groups','cityQuestGroups'],river:['river-quest-groups','riverQuestGroups'],harbor:['harbor-quest-groups','harborQuestGroups'],archive:['archive-quest-groups','archiveQuestGroups'],windmill:['windmill-quest-groups','windmillQuestGroups'],mountain:['mountain-quest-groups','mountainQuestGroups'],valley:['valley-quest-groups','valleyQuestGroups']};const [file,fn]=modules[region],m=await import(`./src/${file}.js`);groups=m[fn](completed,true);}
     const group=groups.find(g=>g.quests.length>=3&&g.available.some(id=>!completed.includes(id))&&g.quests.filter(id=>completed.includes(id)).length<2);
     return group&&{title:group.title,id:group.available.find(id=>!completed.includes(id))};
    },{region,completed:fixture.completed});
    if(!partial)throw Error('no partial group fixture');
    fixture.completed=[...new Set([...fixture.completed,partial.id])];
    await page.evaluate(v=>localStorage.setItem('csquest-workshop-journey-story-v2',JSON.stringify(v)),fixture);await page.reload();await page.locator('#continue').click();await page.locator(`#${region}-open-quests`).click();
    let found=false;
    for(let i=0;i<50;i++){
     if(await page.getByRole('button',{name:new RegExp(partial.title)}).count()){found=true;break;}
     const next=page.getByRole('button',{name:'次の種類 →'});if(!await next.count())break;await next.click();
    }
    if(!found)throw Error('partially completed group hidden: '+partial.title);
    if(errors.length)throw Error(errors.join('; '));
    console.log(JSON.stringify({width,region,ok:true}));
   }catch(e){console.log(JSON.stringify({width,region,ok:false,error:String(e),errors}));process.exitCode=1;errors.length=0;}
  }
  await context.close();
 }
 await browser.close();server.close();
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
