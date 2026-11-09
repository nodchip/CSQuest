// Exercise the new story from a fresh, isolated save. Run through Playwright MCP.
async page=>{
 const c=await page.context().browser().newContext({viewport:{width:1200,height:900}}),p=await c.newPage(),errors=[];
 p.on('pageerror',e=>errors.push(String(e)));let stage='start';
 try{
  await p.goto(new URL('./',page.url()).href);
  const click=async s=>p.locator(s).click({timeout:10000});
  const actions=async (attr,values)=>{for(const x of values)await click(`[${attr}="${x}"]`);};
  const travel=async id=>{await click(await p.locator('#travel').count()?'#travel':'#back');await click(`[data-travel-place="${id}"]`);await click('#travel-depart');};
  const journey=async moves=>{await click('#accept');await actions('data-command',moves);await click('#execute');await click('#return');await click('#back');};
  const newQuest=async id=>{const q=await p.evaluate(async id=>(await import('./src/new-entrances.js')).newEntrances[id],id);await click(`[data-new-quest="${id}"]`);for(const s of q.scenarios){for(const n of s.answer)await click(`[data-new-choice="${n}"]`);await click('#new-check');}await click('#finish');await click('#new-back');};
  const midQuest=async (id,moves)=>{await click(`[data-mid-quest="${id}"]`);await actions('data-mid-action',moves);await click('#finish');await click('#back');};
  const fsQuest=async(id,moves)=>{await click(`[data-fs-quest="${id}"]`);await actions('data-fs-action',moves);await click('#finish');await click('#back');};
  stage='opening';await click('#new');await click('#next');await click('#accept');await actions('data-command',['forward','forward']);await click('#execute');await click('#return');await click('#back');
  stage='workshop';await click('#outside');await click('#forest-accept');await actions('data-command',['forward','right','forward']);await click('#execute');await click('#return');await click('#back');await click('[data-encounter="branch"]');await journey(['forward','ifWall','forward']);await newQuest('workshop-steps');
  const visits={
   river:async()=>{stage='river';await travel('river');await click('#help');await journey(['forward','ifWall','forward']);await newQuest('river-signals');},
   harbor:async()=>{stage='harbor';await travel('harbor');await click('#help');await actions('data-point',['light','hill','home']);await click('#finish');await click('#back');await newQuest('harbor-parallel');},
   city:async()=>{stage='city';await travel('city');await click('#market');await click('[data-city-quest="city-sort"]');await actions('data-swap',[0,1,2,1,0]);await click('#finish');await click('#back');await click('#guild');await click('[data-city-quest="city-queue"]');for(const s of ['#queue-put','#queue-put','#queue-put','[data-take="A"]','#queue-put','[data-take="B"]','[data-take="C"]','[data-take="D"]'])await click(s);await click('#finish');await click('#back');},
  };
  const reverse=new URL(page.url()).searchParams.has('reverse');for(const id of reverse?['city','harbor','river']:['river','harbor','city'])await visits[id]();
  stage='archive';await travel('archive');await midQuest('archive-search',['pick:0','pick:4']);await midQuest('archive-filter',['book','mountain','test']);await newQuest('archive-searches');
  stage='windmill';await travel('windmill');await midQuest('windmill-lamp',['AND','test']);await midQuest('windmill-order',['A','B','C','D']);await newQuest('windmill-signals');
  stage='mountain';await travel('mountain');for(const [id,path] of Object.entries({'mountain-connect':['ridge','village'],'mountain-hops':['ridge','village']})){await click(`[data-mountain-quest="${id}"]`);await actions('data-mountain-next',path);await click('#finish');await click('#back');}
  stage='valley';await travel('valley');for(const [id,path] of Object.entries({'data-filter':['pick:A','pick:D','check'],'data-join':['A:10','B:20','C:10','D:10']})){await click(`[data-expansion="${id}"]`);await actions('data-expansion-action',path);await click('#finish');await click('#back');}await newQuest('valley-records');
  stage='sky';await travel('sky');for(const [id,path] of Object.entries({'tower-forward':['A:west','B:east','C:west'],'tower-packets':['1','2','3']})){await click(`[data-tg-quest="${id}"]`);await actions('data-tg-action',path);await click('#finish');await click('#back');}
  stage='mist';await travel('mist');for(const [id,path] of Object.entries({'gate-verify':['directory','call:trusted','confirmed'],'gate-access':['cycle:ren','cycle:yuno','cycle:yuno','check']})){await click(`[data-tg-quest="${id}"]`);await actions('data-tg-action',path);await click('#finish');await click('#back');}
  stage='forge';await travel('forge');await fsQuest('forge-bits',['toggle:0','toggle:2','check','toggle:1','toggle:2','check']);await fsQuest('forge-cpu',['fetch','decode','execute','fetch','decode','execute']);
  stage='station';await travel('station');await fsQuest('station-fcfs',['B','C','A']);await newQuest('station-sharing');
  stage='climax';await click('#world-finale-open');const steps=await p.evaluate(async()=>(await import('./src/story-climax.js')).climaxSteps);for(let i=0;i<steps.length;i++){await click(`[data-climax-action="${steps[i].answer}"]`);if(i===steps.length-1||steps[i+1].quest!==steps[i].quest)await click('#climax-continue');}await click('#climax-finish');
  stage='four-regions';if(!(await p.locator('.travel-scene').innerText()).includes('今いる場所：風待ちの駅'))throw Error('集いの後に旅の出発地点が変わりました');const regions=await p.evaluate(async()=>{const m=await import('./src/four-regions.js'),needed={garden:'garden-sets',observatory:'observatory-evaluate',tailor:'tailor-testing',guide:'guide-access'};return m.fourRegionIds.map(region=>{const entries=Object.entries(m.fourRegions[region].quests),chosen=entries.slice(0,2),required=entries.find(([id])=>id===needed[region]);if(required&&!chosen.some(([id])=>id===required[0]))chosen.push(required);return {region,quests:chosen.map(([id,q])=>({id,answers:q.scenarios.map(s=>s.answer)}))};});});
  for(const [index,r] of regions.entries()){if(index)await click('#travel');await click(`[data-travel-place="${r.region}"]`);await click('#travel-depart');for(const q of r.quests){await click(`[data-four-quest="${q.id}"]`);for(const answer of q.answers){for(const i of answer)await click(`[data-four-choice="${i}"]`);await click('#four-check');}await click('#finish');await click('#four-back');}const extra={garden:'garden-mosaic',observatory:'observatory-devices',guide:'guide-privacy'}[r.region];if(extra)await newQuest(extra);}
  const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('csquest-workshop-journey-v1')));
  const entries=['observatory-evaluate','archive-searches','forge-bits','valley-records','river-signals','garden-mosaic','guide-access','garden-sets','tower-forward','station-sharing','harbor-parallel','workshop-steps','tailor-testing','gate-access','guide-privacy','windmill-signals','observatory-devices'];
  const missing=entries.filter(id=>!saved.completed.includes(id));
  return {ok:saved.storyClimaxComplete&&regions.every(r=>r.quests.every(q=>saved.completed.includes(q.id)))&&!errors.length&&!missing.length,stage,reverse,completed:saved.completed.length,missing,errors};
 }catch(e){return {ok:false,stage,error:String(e),heading:await p.locator('h1').allTextContents(),body:(await p.locator('body').innerText()).slice(0,1500),errors};}
 finally{await c.close();}
}
