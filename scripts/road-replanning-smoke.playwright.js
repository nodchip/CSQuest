// Open the build first, then run this snippet with browser_run_code_unsafe.
async page => {
  const context = await page.context().browser().newContext({viewport:{width:390,height:844}});
  try {
    const p = await context.newPage();
    const url = page.url();
    async function openQuest() {
      await p.locator('#quest-search').fill('797');
      await p.getByRole('button',{name:/QUEST 797\b/}).click();
    }
    await p.goto(url,{waitUntil:'networkidle'});
    await openQuest();
    for (const action of ['plan0','move','plan1','move','move','plan1','move','move','move']) {
      await p.locator(action==='move'?'#rp-move':`[data-rp-plan="${action.at(-1)}"]`).click();
    }
    await p.locator('[data-rp-answer="observe"]').click();
    if (!await p.getByText('灯りを届けました！').isVisible()) throw new Error('旅の達成が表示されません');
    await p.locator('[data-context-case="stale"]').click();
    await p.locator('[data-context-choice="verify"]').click();
    await p.reload({waitUntil:'networkidle'});
    await openQuest();
    if (await p.locator('[data-context-case="stale"]').getAttribute('aria-pressed')!=='true' ||
        !(await p.locator('[data-context-case="stale"]').innerText()).includes('✓') ||
        !await p.getByText('灯りを届けました！').isVisible()) throw new Error('達成後の比較が復元されません');
    return {completed:true,contextRestored:true};
  } finally { await context.close(); }
}
