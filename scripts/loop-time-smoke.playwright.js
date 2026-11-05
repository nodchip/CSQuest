// Open the build first, then run this snippet with browser_run_code_unsafe.
async page => {
 const context=await page.context().browser().newContext({viewport:{width:390,height:844}});
 try {
  const p=await context.newPage(),url=page.url();
  async function openQuest(){await p.locator('#quest-search').fill('799');await p.locator('button[data-level]').click();}
  await p.goto(url);await openQuest();
  for(const [mode,rate,guess,n] of [['frame','slow',60,2],['frame','fast',120,4],['fixed','slow',60,2],['fixed','fast',60,4]]){
   await p.locator(`[data-lt-mode="${mode}"]`).click();await p.locator(`[data-lt-rate="${rate}"]`).click();
   await p.locator(`[data-lt-guess="${guess}"]`).click();for(let i=0;i<n;i++)await p.locator('[data-lt-advance="5"]').click();
   await p.locator('#lt-check').click();
  }
  await p.locator('[data-lt-answer="time"]').click();
  if(!await p.getByText('時をそろえました！').count())throw new Error('元の依頼が達成されていません');
  await p.locator('#catchup-step').click();await p.locator('[data-lt-mode="frame"]').click();
  await p.goto(url);await openQuest();
  if(!await p.getByText(/描画 1 \/ 6 回/).count()||!await p.getByText('時をそろえました！').count())throw new Error('達成後の実験が復元されません');
  return {completed:true,catchupRestored:true};
 } finally {await context.close();}
}
