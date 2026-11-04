// Open a CS Quest build before running with browser_run_code_unsafe.
// All eight regions are reached by completing quests through the interface.
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
  const open=async n=>{await p.locator('#quest-search').fill(String(n));await p.locator('.quest-grid [data-level]').click();};
  const finish=async (heading,count)=>{if(!await p.getByRole('heading',{name:heading,exact:true}).isVisible())throw new Error(`Quest result missing: ${heading}`);await p.locator('#return').click();if(!(await p.locator('.story-count').innerText()).includes(`${count} / 8`))throw new Error(`Expected ${count} regions.`);};
  await open(22);
  for(const k of ['text','keyboard','label'])await p.locator(`[data-improve="${k}"]`).click();
  for(const k of ['color','keys','reader'])await p.locator(`[data-visitor="${k}"]`).click();
  await finish('三つの使い方で案内を確かめました！',2);
  await open(6);await p.locator('[data-gate="0"]').selectOption('OR');await p.locator('[data-gate="1"]').selectOption('NAND');await p.locator('#circuit-test').click();await finish('灯火の門が開きました！',3);
  await open(8);for(let i=0;i<8&&!await p.locator('#return').count();i++)await p.locator('[data-inspect]').first().click();await finish('調査隊を見つけました！',4);
  if(!await p.locator('.story-count').innerText().then(t=>t.includes('4 / 8'))||!await p.locator('.story-dialogue').innerText().then(t=>t.includes('つながる道')))throw new Error('Four-region story missing.');
  await open(11);for(const [role,resource] of [['keeper','records'],['keeper','supplies'],['courier','supplies']])await p.locator(`[data-role="${role}"][data-resource="${resource}"]`).click();await p.locator('#access-test').click();await finish('城門の備えが整いました！',5);
  await open(12);for(const k of ['herb','east','available'])await p.locator(`[data-filter="${k}"]`).click();await p.locator('#catalog-test').click();await finish('薬師に薬草を届けました！',6);
  await open(14);for(let i=0;i<6;i++)await p.locator('[data-run-job]').first().click();await p.locator('[data-schedule-policy="rr"]').click();for(let i=0;i<6;i++)await p.locator('[data-run-job]').first().click();await finish('みんなの仕事が終わりました！',7);
  await open(1201);for(const i of [1,0,0,2,0,1])await p.locator(`[data-heap-page="${i}"]`).click();await finish('書庫の札を整理しました！',8);
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
  // A damaged finale draft must remain recoverable even after solving it.
  await p.evaluate(()=>localStorage.setItem('csquest-draft-v1:story-beacon','{broken'));
  await p.reload();await p.waitForSelector('#story-finale');await p.locator('#story-finale').click();
  if(!await p.locator('#discard-protected-draft').isVisible())throw new Error('Damaged finale draft was not protected.');
  for(let i=0;i<7;i++)for(let n=0;n<3;n++)await p.locator(`[data-beacon-tile="${i}"]`).click();
  await p.locator('#beacon-check').click();
  if(!await p.locator('#discard-protected-draft').isVisible())throw new Error('Recovery disappeared after solving.');
  await p.locator('#discard-protected-draft').click();
  for(let i=0;i<7;i++)for(let n=0;n<3;n++)await p.locator(`[data-beacon-tile="${i}"]`).click();
  await p.locator('#beacon-check').click();await p.locator('#return').click();await p.reload();await p.waitForSelector('#story-finale');
  if(!await p.locator('.story-dialogue').innerText().then(t=>t.includes('再び輝く道しるべ')))throw new Error('Recovered ending did not persist.');
  await p.locator('#story-finale').click();
  if(!await p.locator('#reset-draft').isVisible())throw new Error('Completed finale cannot be replayed.');
  if(errors.length)throw new Error(JSON.stringify(errors));
  return {actualQuests:[1,22,6,8,11,12,14,1201],seededOtherRegions:0,checkedFourRegionStory:true,finaleRetryAndResume:true,endingPersisted:true,damagedDraftRecovered:true,finaleReplay:true,errors};
 } finally {await context.close();}
}
