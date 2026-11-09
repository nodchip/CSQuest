// Focused quest UI checks using an isolated browser context and an unlocked fixture.
async page => {
 const context=await page.context().browser().newContext({viewport:{width:390,height:844}}),p=await context.newPage();
 const source=page.url(); let stage='fixture';
 try{
  await p.goto(new URL('./',source).href);
  const fixture=await p.evaluate(async()=>{const t=await import('./src/tower-gate.js'),f=await import('./src/forge-station.js');return {place:'station',program:['forward','forward'],executed:true,completed:['forest','branch','river','harbor-message','archive-search','windmill-lamp','search-bfs','search-weighted','search-compare','data-record','data-filter','data-join',...t.towerGateIds,...f.forgeStationIds],bridgeOpen:true,towerGateSeen:true,forgeStationSeen:true,mapVisited:['workshop','station']};});
  const quests=await p.evaluate(async()=>{const m=await import('./src/four-regions.js');return m.fourRegionIds.flatMap(region=>Object.keys(m.fourRegions[region].quests).map(id=>({id,answers:m.fourQuests[id].scenarios.map(s=>s.answer)})));});
  const result=[];
  for(const q of quests){
   stage=q.id;
   const save={...fixture,place:'four-quest',fourActive:q.id,fourDrafts:{[q.id]:[]},fourSelections:{[q.id]:[]}};
   await p.evaluate(v=>localStorage.setItem('csquest-workshop-journey-v1',JSON.stringify(v)),save);await p.reload();await p.locator('#continue').click();
   await p.locator('#four-check').click();const wrong=(await p.locator('#four-status').innerText()).includes('もう一度');
   const first=q.answers[0][0];await p.locator(`[data-four-choice="${first}"]`).click();await p.reload();await p.locator('#continue').click();
   const restored=await p.locator(`[data-four-choice="${first}"]`).getAttribute('aria-pressed')==='true';
   for(const i of q.answers[0].slice(1))await p.locator(`[data-four-choice="${i}"]`).click();await p.locator('#four-check').click();
   await p.locator('#four-undo').click();const undone=(await p.locator('.panel').innerText()).includes('0 / 2');
   for(const answer of q.answers){for(const i of answer)await p.locator(`[data-four-choice="${i}"]`).click();await p.locator('#four-check').click();}
   const dialog=await p.locator('#success-dialog').isVisible();await p.locator('#review').click();await p.locator('#open-result').click();await p.locator('#finish').click();
   const completed=(await p.locator('h1').innerText()).includes('達成');result.push({id:q.id,wrong,restored,undone,dialog,completed});
  }
  return {ok:result.every(r=>r.wrong&&r.restored&&r.undone&&r.dialog&&r.completed),result};
 }catch(e){return {ok:false,stage,error:String(e),heading:await p.locator('h1').allTextContents()};}
 finally{await context.close();}
}
