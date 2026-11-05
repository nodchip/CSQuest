// Open the build first, then run this snippet with browser_run_code_unsafe.
async page => {
 const results=[];
 for(const width of [390,1280]){
  const context=await page.context().browser().newContext({viewport:{width,height:844}});
  try{
   const p=await context.newPage(),url=page.url();
   async function open(number){await p.locator('#quest-search').fill(number);await p.locator('button[data-level]').click();}
   await p.goto(url);await open('1299');
   for(const mode of ['left','right'])for(const [target,n] of [['one',1],['two',2],['three',3]]){
    await p.locator(`[data-lr-mode="${mode}"]`).click();await p.locator(`[data-lr-target="${target}"]`).click();
    const actions=mode==='left'?[...Array(n-1).fill('grow'),'base']:['begin',...Array(n-1).fill('add'),'end'];
    for(const action of actions)await p.locator(`[data-lr-rule="${action}"]`).click();
    await p.locator('#lr-check').click();
   }
   await p.locator('[data-lr-reflection="same-strings"]').click();
   if(!await p.getByText('二つの規則を比べました！').count())throw Error('依頼を達成できません');
   await p.locator('#lr-assoc-run').click();await p.locator('[data-lr-mode="right"]').click();
   await p.goto(url);await open('1299');
   if(!(await p.locator('body').innerText()).includes('試した結合：1 / 2'))throw Error('達成後の比較が復元されません');
   await p.locator('[data-lr-assoc="right"]').focus();await p.keyboard.press('Enter');
   await p.locator('#lr-assoc-run').focus();await p.keyboard.press('Enter');
   await p.locator('[data-lr-assoc-answer="same"]').click();await p.locator('#lr-assoc-check').click();
   if(!(await p.locator('body').innerText()).includes('両方を計算し、結果を見比べましょう'))throw Error('誤答が受理されました');
   await p.locator('[data-lr-assoc-answer="different"]').click();await p.locator('#lr-assoc-check').click();
   if(!(await p.locator('body').innerText()).includes('左は３、右は７'))throw Error('比較結果が不正です');
   if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('画面が横にはみ出します');
   await p.locator('#back').click();await open('1265');
   await p.locator('[data-lr-guess="go"]').click();await p.locator('#lr-train').click();
   if(!(await p.locator('body').innerText()).includes('学習 1 / 4'))throw Error('別の依頼が操作できません');
   results.push({width,completion:true,restore:true,comparison:true,otherQuest:true});
  }finally{await context.close();}
 }
 return results;
}
