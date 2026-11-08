// Full clean journey. Run with browser_run_code_unsafe after opening the local build.
async page => {
 const context=await page.context().browser().newContext({viewport:{width:1200,height:900}});
 const p=await context.newPage(); let stage='start';
 try{
  await p.goto(new URL('./',page.url()).href);
  const click=async s=>p.locator(s).click({timeout:12000});
  const actions=async (attr,values)=>{for(const x of values)await click(`[${attr}="${x}"]`);};
  const travel=async id=>{await click('#travel');await click(`[data-travel-place="${id}"]`);await click('#travel-depart');};
  const finish=async()=>{await click('#finish');await click('#back');};
  const journey=async moves=>{await click('#accept');await actions('data-command',moves);await click('#execute');await click('#return');await click('#back');};
  stage='opening';await click('#new');await click('#next');await click('#accept');await actions('data-command',['forward','forward']);await click('#execute');await click('#return');await click('#back');
  stage='forest';await click('#outside');await click('#forest-accept');await actions('data-command',['forward','right','forward']);await click('#execute');await click('#return');await click('#back');
  stage='branch';await click('[data-encounter="branch"]');await journey(['forward','ifWall','forward']);
  stage='river';await travel('river');await click('#help');await journey(['forward','ifWall','forward']);await click('#back');
  stage='harbor';await travel('harbor');await click('#help');await actions('data-point',['light','hill','home']);await click('#finish');await click('#travel');await click('[data-travel-place="archive"]');await click('#travel-depart');
  stage='archive';await click('[data-mid-quest="archive-search"]');await actions('data-mid-action',['pick:0','pick:4']);await click('#finish');await click('#travel');await click('[data-travel-place="windmill"]');await click('#travel-depart');
  stage='windmill';await click('[data-mid-quest="windmill-lamp"]');await actions('data-mid-action',['AND','test']);await click('#finish');await click('#back');await click('#bridge');await click('#open');await click('#mountain');
  stage='mountain';for(const [id,path] of Object.entries({'mountain-connect':['ridge','village'],'mountain-hops':['ridge','village'],'mountain-time':['forest','stream','village']})){await click(`[data-mountain-quest="${id}"]`);await actions('data-mountain-next',path);await finish();}
  stage='search';for(const [id,path] of Object.entries({'search-bfs':['s','a','b','t'],'search-weighted':['s','a','b','c','t'],'search-compare':['hops','time']})){await click(`[data-expansion="${id}"]`);await actions('data-expansion-action',path);await finish();}await click('#crossing');await click('#valley');
  stage='valley';for(const [id,path] of Object.entries({'data-record':['swap:0','swap:1','find:10'],'data-filter':['pick:A','pick:D','check'],'data-join':['A:10','B:20','C:10','D:10']})){await click(`[data-expansion="${id}"]`);await actions('data-expansion-action',path);await finish();}
  stage='tower';await travel('sky');for(const [id,path] of Object.entries({'tower-forward':['A:west','B:east','C:west'],'tower-packets':['1','2','3'],'tower-retry':['send','wait','send','wait','send','wait']})){await click(`[data-tg-quest="${id}"]`);await actions('data-tg-action',path);await finish();}
  stage='gate';await travel('mist');for(const [id,path] of Object.entries({'gate-verify':['directory','call:trusted','confirmed'],'gate-access':['cycle:ren','cycle:yuno','cycle:yuno','check'],'gate-integrity':['spot:1','restore']})){await click(`[data-tg-quest="${id}"]`);await actions('data-tg-action',path);await finish();}await click('#milestone');await click('#travel');await click('[data-travel-place="forge"]');await click('#travel-depart');
  stage='forge';for(const [id,path] of Object.entries({'forge-bits':['toggle:0','toggle:2','check','toggle:1','toggle:2','check'],'forge-cpu':['fetch','decode','execute','fetch','decode','execute'],'forge-memory':['read:B','value:7','write:B','read:B'],'forge-cache':['cache','store','cache']})){await click(`[data-fs-quest="${id}"]`);await actions('data-fs-action',path);await finish();}
  stage='station';await travel('station');for(const [id,path] of Object.entries({'station-fcfs':['B','C','A'],'station-round':['A','B','A','B'],'station-lock':['take:B','work:B','release:B','take:A','work:A','release:A'],'station-memory':['slot:1','slot:2','place','slot:0','place']})){await click(`[data-fs-quest="${id}"]`);await actions('data-fs-action',path);await finish();}await click('#milestone');
  stage='four-regions';const regions=await p.evaluate(async()=>{const m=await import('./src/four-regions.js');return m.fourRegionIds.map(region=>({region,quests:Object.entries(m.fourRegions[region].quests).slice(0,2).map(([id,q])=>({id,answers:q.scenarios.map(s=>s.answer)}))}));});
  if(new URL(page.url()).searchParams.has('reverse'))regions.reverse();
  for(const r of regions){await travel(r.region);for(const q of r.quests){await click(`[data-four-quest="${q.id}"]`);for(const answer of q.answers){for(const i of answer)await click(`[data-four-choice="${i}"]`);await click('#four-check');}await click('#finish');await click('#four-back');}}
  stage='festival';await click('#four-festival');const heading=await p.locator('h1').innerText();await click('#four-back');
  stage='remaining';const remaining=await p.evaluate(async()=>{const m=await import('./src/four-regions.js');return [...m.fourRegionIds].reverse().map(region=>({region,quests:Object.entries(m.fourRegions[region].quests).slice(2).map(([id,q])=>({id,answers:q.scenarios.map(s=>s.answer)}))}));});
  for(const r of remaining){if((await p.locator('header small').innerText())!==(await p.evaluate(async region=>(await import('./src/four-regions.js')).fourRegions[region].name,r.region)))await travel(r.region);for(const q of r.quests){await click(`[data-four-quest="${q.id}"]`);for(const answer of q.answers){for(const i of answer)await click(`[data-four-choice="${i}"]`);await click('#four-check');}await click('#finish');await click('#four-back');}}
  const state=await p.evaluate(()=>JSON.parse(localStorage.getItem('csquest-workshop-journey-v1')));return {ok:state.fourFestivalSeen&&regions.every(r=>r.quests.every(q=>state.completed.includes(q.id)))&&remaining.every(r=>r.quests.every(q=>state.completed.includes(q.id))),heading,completed:state.completed.length,festivalSeen:state.fourFestivalSeen};
 }catch(e){return {ok:false,stage,error:String(e),heading:await p.locator('h1').allTextContents(),url:p.url(),body:(await p.locator('body').innerText()).slice(0,1200)};}
 finally{await context.close();}
}
