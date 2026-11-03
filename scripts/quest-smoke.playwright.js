// Run as a Playwright browser_run_code_unsafe snippet. Open the target build in
// the supplied page first; the smoke test runs in a separate browser context.
async (page) => {
  const url = page.url();
  if (!/^https?:\/\//.test(url)) throw new Error('Open the target CS Quest page first.');
  const context = await page.context().browser().newContext();
  try {
    const p = await context.newPage();
    const errors = [];
    p.on('pageerror', error => errors.push(error.message));
    await p.goto(url, {waitUntil:'networkidle'});
    await p.waitForSelector('#quest-search');
    const total = await p.evaluate(async () => {
      const {regions} = await import(new URL('src/world.js', location.href));
      return regions.reduce((sum, region) => sum + region.quests.length, 0);
    });
    let checked = 0;
    const issues = [];
    for (let begin = 1; begin <= total; begin += 200) {
      const batch = await p.evaluate(async ({begin,end}) => {
        const issues = [];
        let checked = 0;
        const accessibleName = element => {
          let name = element.getAttribute('aria-label') || '';
          const refs = element.getAttribute('aria-labelledby');
          if (refs) name += ' ' + refs.split(/\s+/).map(id => document.getElementById(id)?.textContent || '').join(' ');
          if (element.labels) name += ' ' + [...element.labels].map(label => label.textContent).join(' ');
          if (element.tagName === 'BUTTON') name += ' ' + element.textContent;
          if (['button','submit','reset'].includes(element.type)) name += ' ' + element.value;
          return (name + ' ' + (element.getAttribute('title') || '')).trim();
        };
        for (let n = begin; n <= end; n++) {
          const input = document.querySelector('#quest-search');
          if (!input) { issues.push({n, reason:'search missing'}); break; }
          input.value = String(n);
          input.dispatchEvent(new Event('input', {bubbles:true}));
          const cards = [...document.querySelectorAll('.quest-grid [data-level]')];
          if (cards.length !== 1) { issues.push({n, reason:'search count', count:cards.length}); continue; }
          const number = cards[0].querySelector('.card-top span')?.textContent?.match(/^QUEST\s+(\d+)$/)?.[1];
          if (Number(number) !== n) issues.push({n, reason:'wrong search result'});
          const story = cards[0].querySelector('.card-story')?.textContent?.trim();
          cards[0].click();
          const app = document.querySelector('#app');
          const back = document.querySelector('#back');
          if (!back) { issues.push({n, reason:'back missing'}); break; }
          if (!story || !app.textContent.includes(story)) issues.push({n, reason:'story missing'});
          const ids = new Set();
          for (const element of app.querySelectorAll('[id]')) {
            if (element.id && ids.has(element.id)) issues.push({n,reason:'duplicate id',id:element.id});
            ids.add(element.id);
          }
          for (const element of app.querySelectorAll('button,input,select,textarea')) {
            if (element.type === 'hidden' || element.getAttribute('aria-hidden') === 'true' || !element.getClientRects().length) continue;
            if (!accessibleName(element)) issues.push({n,reason:'unnamed control',tag:element.tagName,id:element.id});
          }
          for (const element of app.querySelectorAll('img')) {
            if (!element.hasAttribute('alt') && element.getAttribute('aria-hidden') !== 'true') issues.push({n,reason:'image without alt'});
          }
          const reset = app.querySelector('#reset-draft:not([hidden]):not(:disabled)');
          if (reset && reset.getClientRects().length) {
            reset.focus();
            reset.click();
            await new Promise(resolve => setTimeout(resolve,0));
            if (document.activeElement === document.body && app.querySelector('#reset-draft:not([hidden]):not(:disabled)')) issues.push({n,reason:'reset focus lost'});
          }
          const backAfterReset = document.querySelector('#back');
          if (!backAfterReset) { issues.push({n,reason:'back missing after reset'}); break; }
          backAfterReset.click();
          checked++;
        }
        return {checked,issues};
      }, {begin,end:Math.min(begin + 199,total)});
      checked += batch.checked;
      issues.push(...batch.issues);
      if (batch.issues.some(issue => ['search missing','back missing','back missing after reset'].includes(issue.reason))) break;
    }
    if (issues.length || errors.length || checked !== total) {
      throw new Error(JSON.stringify({url,total,checked,issues,errors}));
    }
    // Reproduce the previously broken duplicate-reset case with an unreadable
    // draft. The context is isolated from the player's own saved progress.
    const draftKey = 'csquest-draft-v1:archive-missing-indicator';
    await p.evaluate(key => localStorage.setItem(key,'not-json'),draftKey);
    await p.locator('#quest-search').fill('699');
    await p.locator('.quest-grid [data-level]').click();
    if (await p.locator('#reset-draft').count() !== 1) throw new Error('Quest 699 has duplicate reset buttons.');
    await p.locator('#indicator-village').selectOption('south');
    const preserved = await p.evaluate(key => localStorage.getItem(key),draftKey);
    if (preserved !== 'not-json') throw new Error('The unreadable draft was not preserved.');
    await p.locator('#discard-protected-draft').focus();
    await p.keyboard.press('Enter');
    await p.waitForFunction(key => localStorage.getItem(key) === null && document.activeElement?.id === 'reset-draft',draftKey);
    if (await p.locator('#indicator-village').inputValue() !== 'north') throw new Error('Quest 699 did not reset.');
    await p.locator('#indicator-village').selectOption('south');
    await p.locator('#reset-draft').focus();
    await p.keyboard.press('Enter');
    await p.waitForFunction(() => document.activeElement?.id === 'reset-draft');
    if (await p.locator('#indicator-village').inputValue() !== 'north') throw new Error('Quest 699 did not reset from the keyboard.');
    const focusAfterChoice = await p.evaluate(async () => {
      const reset = document.querySelector('#reset-draft');
      reset.focus();
      reset.click();
      document.querySelector('#back').focus();
      await new Promise(resolve => setTimeout(resolve,10));
      return document.activeElement?.id;
    });
    if (focusAfterChoice !== 'back') throw new Error('Reset stole focus after it was moved.');
    return {url,total,checked,protectedDraftRecovery:true,errors};
  } finally {
    await context.close();
  }
}
