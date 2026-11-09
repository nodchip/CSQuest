// Full fresh-save journey. Run through browser_run_code_unsafe against the local site.
async page => {
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
  stage='opening';await click('#new');await click('#next');await click('#accept');await actions('data-command',['forward','forward']);await click('#execute');await click('#return');await click('#back');
  stage='workshop';await click('#outside');await click('#forest-accept');await actions('data-command',['forward','right','forward']);await click('#execute');await click('#return');await click('#back');await click('[data-encounter="branch"]');await journey(['forward','ifWall','forward']);await newQuest('workshop-steps');
  const visits={
   river:async()=>{stage='river';await travel('river');await click('#help');await journey(['forward','ifWall','forward']);await newQuest('river-signals');},
   harbor:async()=>{stage='harbor';await travel('harbor');await click('#help');await actions('data-point',['light','hill','home']);await click('#finish');await click('#back');await newQuest('harbor-parallel');},
   city:async()=>{stage='city';await travel('city');await click('#market');await click('[data-city-quest="city-sort"]');await actions('data-swap',[0,1,2,1,0]);await click('#finish');await click('#back');await click('#guild');await click('[data-city-quest="city-queue"]');for(const selector of ['#queue-put','#queue-put','#queue-put','[data-take="A"]','#queue-put','[data-take="B"]','[data-take="C"]','[data-take="D"]'])await click(selector);await click('#finish');await click('#back');},
  };
  const reverse=new URL(page.url()).searchParams.has('reverse');
  for(const id of reverse?['city','harbor','river']:['river','harbor','city'])await visits[id]();
  stage='archive';await travel('archive');await midQuest('archive-search',['pick:0','pick:4']);await midQuest('archive-filter',['book','mountain','test']);await newQuest('archive-searches');
  stage='windmill';await travel('windmill');await midQuest('windmill-lamp',['AND','test']);await midQuest('windmill-order',['A','B','C','D']);await newQuest('windmill-signals');
  const defer=new URL(page.url()).searchParams.has('defer');let ending=[];
  const finale=async()=>{await click('#world-finale-open');await click('[data-finale-place="workshop"]');await click('[data-finale-place="river"]');await click('#finale-connect');ending=await p.locator('h2').allTextContents();await click('#finale-back');};
  stage='finale';if(!defer)await finale();
  stage='mountain';await travel('mountain');for(const [id,path] of Object.entries({'mountain-connect':['ridge','village'],'mountain-hops':['ridge','village']})){await click(`[data-mountain-quest="${id}"]`);await actions('data-mountain-next',path);await click('#finish');await click('#back');}
  stage='valley';await travel('valley');for(const [id,path] of Object.entries({'data-filter':['pick:A','pick:D','check'],'data-join':['A:10','B:20','C:10','D:10']})){await click(`[data-expansion="${id}"]`);await actions('data-expansion-action',path);await click('#finish');await click('#back');}await newQuest('valley-records');
  stage='sky';await travel('sky');for(const [id,path] of Object.entries({'tower-forward':['A:west','B:east','C:west'],'tower-packets':['1','2','3']})){await click(`[data-tg-quest="${id}"]`);await actions('data-tg-action',path);await click('#finish');await click('#back');}
  stage='mist';await travel('mist');for(const [id,path] of Object.entries({'gate-verify':['directory','call:trusted','confirmed'],'gate-access':['cycle:ren','cycle:yuno','cycle:yuno','check']})){await click(`[data-tg-quest="${id}"]`);await actions('data-tg-action',path);await click('#finish');await click('#back');}
  const fourQuest=async id=>{const q=await p.evaluate(async id=>(await import('./src/four-regions.js')).fourQuests[id],id);await click(`[data-four-quest="${id}"]`);for(const scene of q.scenarios){for(const n of scene.answer)await click(`[data-four-choice="${n}"]`);await click('#four-check');}await click('#finish');await click('#four-back');};
  stage='garden';await travel('garden');for(const id of ['garden-sets','garden-logic'])await fourQuest(id);await newQuest('garden-mosaic');
  stage='forge';await travel('forge');await click('[data-fs-quest="forge-bits"]');await actions('data-fs-action',['toggle:0','toggle:2','check','toggle:1','toggle:2','check']);await click('#finish');await click('#back');
  stage='station';await travel('station');await newQuest('station-sharing');
  stage='observatory';await travel('observatory');await fourQuest('observatory-evaluate');await newQuest('observatory-devices');
  stage='tailor';await travel('tailor');await fourQuest('tailor-testing');await fourQuest('tailor-needs');
  stage='guide';await travel('guide');await fourQuest('guide-access');await newQuest('guide-privacy');
  const entries=['observatory-evaluate','archive-searches','forge-bits','valley-records','river-signals','garden-mosaic','guide-access','garden-sets','tower-forward','station-sharing','harbor-parallel','workshop-steps','tailor-testing','gate-access','guide-privacy','windmill-signals','observatory-devices'];
  const beforeFinale=await p.evaluate(()=>JSON.parse(localStorage.getItem('csquest-workshop-journey-v1')));
  const allEntries=entries.every(id=>beforeFinale.completed.includes(id));
  if(defer&&(!allEntries||beforeFinale.worldFinaleSeen))throw Error('17分野の入口を一区切りより前に遊べませんでした。');
  if(defer)await finale();
  stage='garden-again';await travel('garden');const basics=(await p.locator('body').innerText()).includes('基礎の一区切りです');
  const state=await p.evaluate(()=>JSON.parse(localStorage.getItem('csquest-workshop-journey-v1')));
  return {ok:state.worldFinaleSeen&&ending.includes('つながった道')&&basics&&allEntries&&errors.length===0,stage,defer,reverse,ending,basics,allEntries,completed:state.completed,place:state.place,errors};
 }catch(e){return {ok:false,stage,error:String(e),heading:await p.locator('h1').allTextContents(),body:(await p.locator('body').innerText()).slice(0,1200),errors};}
 finally{await c.close();}
}
