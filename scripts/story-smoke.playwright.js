// Open a CS Quest build before running with browser_run_code_unsafe.
// One quest is played; seven other region completions are seeded explicitly.
async page => {
 const url=page.url();if(!/^https?:\/\//.test(url))throw new Error('Open CS Quest first.');
 const context=await page.context().browser().newContext();
 try {
  const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(url);await p.waitForSelector('#quest-search');
  if(!await p.locator('.story-dialogue').innerText().then(t=>t.includes('消えかけた道しるべ')))throw new Error('Initial story missing.');
  await p.locator('#quest-search').fill('1');await p.locator('.quest-grid [data-level]').click();
  await p.locator('[data-command=forward]').click();await p.reload();await p.waitForSelector('#quest-search');
  await p.locator('#quest-search').fill('1');await p.locator('.quest-grid [data-level]').click();
  if(await p.locator('[data-command=forward]').count()!==1)throw new Error('Quest 1 missing.');
  await p.locator('[data-command=forward]').click();await p.locator('#execute').click();
  if(!await p.getByText('灯りを届けました！').isVisible())throw new Error('Quest 1 did not complete.');
  await p.locator('#return').click();
  if(!await p.locator('.story-count').innerText().then(t=>t.includes('1 / 8')))throw new Error('Actual quest completion did not advance the story.');
  const otherIds=await p.evaluate(async()=>{const {regions}=await import(new URL('src/world.js',location.href));return regions.filter(r=>!r.quests.includes('sequence')).map(r=>r.quests[0]);});
  if(otherIds.length!==7)throw new Error('Expected seven other regions.');
  await p.evaluate(ids=>localStorage.setItem('csquest-progress-v1',JSON.stringify(['sequence',...ids])),otherIds.slice(0,3));
  await p.reload();await p.waitForSelector('#quest-search');
  if(!await p.locator('.story-count').innerText().then(t=>t.includes('4 / 8'))||!await p.locator('.story-dialogue').innerText().then(t=>t.includes('つながる道')))throw new Error('Four-region story missing.');
  await p.evaluate(ids=>localStorage.setItem('csquest-progress-v1',JSON.stringify(['sequence',...ids])),otherIds);
  await p.reload();await p.waitForSelector('#story-finale');await p.locator('#story-finale').click();
  await p.locator('#beacon-check').click();
  if(!await p.locator('#app').innerText().then(t=>t.includes('上下の出口を両方つなげて')))throw new Error('Unsolved finale was not rejected.');
  for(let i=0;i<3;i++)for(let n=0;n<3;n++)await p.locator(`[data-beacon-tile="${i}"]`).click();
  await p.reload();await p.waitForSelector('#story-finale');await p.locator('#story-finale').click();
  for(let i=3;i<7;i++)for(let n=0;n<3;n++)await p.locator(`[data-beacon-tile="${i}"]`).click();
  await p.locator('#beacon-check').focus();await p.keyboard.press('Enter');
  if(!await p.locator('#return').isVisible())throw new Error('Finale was not solved.');
  await p.locator('#return').click();
  if(!await p.locator('.story-dialogue').innerText().then(t=>t.includes('再び輝く道しるべ')))throw new Error('Ending missing.');
  await p.reload();await p.waitForSelector('#quest-search');
  if(!await p.locator('.story-dialogue').innerText().then(t=>t.includes('再び輝く道しるべ')))throw new Error('Ending did not persist.');
  if(errors.length)throw new Error(JSON.stringify(errors));
  return {actualQuest:1,seededOtherRegions:7,checkedFourRegionStory:true,finaleRetryAndResume:true,endingPersisted:true,errors};
 } finally {await context.close();}
}
