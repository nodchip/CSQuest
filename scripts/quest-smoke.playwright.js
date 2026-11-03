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
      const batch = await p.evaluate(({begin,end}) => {
        const issues = [];
        let checked = 0;
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
          back.click();
          checked++;
        }
        return {checked,issues};
      }, {begin,end:Math.min(begin + 199,total)});
      checked += batch.checked;
      issues.push(...batch.issues);
      if (batch.issues.some(issue => ['search missing','back missing'].includes(issue.reason))) break;
    }
    if (issues.length || errors.length || checked !== total) {
      throw new Error(JSON.stringify({url,total,checked,issues,errors}));
    }
    return {url,total,checked,errors};
  } finally {
    await context.close();
  }
}
