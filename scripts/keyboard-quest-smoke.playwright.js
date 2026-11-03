// Run with browser_run_code_unsafe after opening the target CS Quest build.
// A separate context protects the player's saved progress.
async page => {
 const url=page.url();if(!/^https?:\/\//.test(url))throw new Error('Open the target CS Quest page first.');
 const context=await page.context().browser().newContext();
 try {
  const p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  const open=async n=>{await p.goto(url);await p.waitForSelector('#quest-search');await p.locator('#quest-search').fill(String(n));await p.getByRole('button',{name:new RegExp(`QUEST ${n}`)}).click();};
  const press=async (selector,expected)=>{await p.locator(selector).focus();await p.keyboard.press('Enter');if(expected&&!await p.locator(expected).evaluate(e=>e===document.activeElement))throw new Error(`focus after ${selector}: expected ${expected}`);};
  await open(1190);await press('[data-vfs-choice=fd]','[data-vfs-choice=fd]');await press('[data-vfs-choice=path]','[data-vfs-choice=vfs]');
  for(const [a,b] of [['vfs','method'],['method','fd'],['fd','fd']])await press(`[data-vfs-choice=${a}]`,`[data-vfs-choice=${b}]`);
  await press('[data-vfs-choice=fd]','[data-vfs-case=proc]');await p.keyboard.press('Enter');
  for(const [a,b] of [['path','vfs'],['vfs','method'],['method','fd'],['fd','fd']])await press(`[data-vfs-choice=${a}]`,`[data-vfs-choice=${b}]`);
  await press('[data-vfs-choice=fd]','[data-vfs-answer=shared]');
  await open(1188);await press('[data-deepq-guess="4"]');await press('#deepq-train','#deepq-train');await press('[data-deepq-guess="1"]');await press('#deepq-train','[data-deepq-guess="0"]');await press('[data-deepq-guess="4"]');await press('#deepq-train','#deepq-sync');await press('#deepq-sync','[data-deepq-guess="0"]');await press('[data-deepq-guess="2"]');await press('#deepq-train','[data-deepq-answer=shared]');
  await open(1187);await press('[data-irl-step=safe]','#irl-retry');await press('#irl-retry','#irl-retry');await press('[data-irl-step=explore]','[data-irl-step=claim]');await press('[data-irl-step=claim]','[data-irl-pick=a]');
  if(errors.length)throw new Error(JSON.stringify(errors));return {quests:[1187,1188,1190],errors};
 } finally {await context.close();}
}
