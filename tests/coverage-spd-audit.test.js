import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const cases={
 'web':[['1','2-本体','2a','2b','3','4','5','6','7a','7b','7c','8a','8b','9a','9b','9c','9d','10a','10b'],['1','2','3','4','5','6']],
 'mobile':[['1a','1b','2a','2b','3a','3b','3c','4a','4b','5a','5b','5c','5d','6a','6b','6c','6d','7','8a','8b','8c','8d'],['1','2','3','4','5']],
 'embedded':[['1a','1b','2a','2b','2c','3a','3b','3c','3d','3e','3f','3g','3h','4','5a','5b','5c','5d','5e','6','7a','7b','7c','7d','8','9','10','11'],['1','2','3','4','5','6','7','8','9','10']],
 'sep-mobile':[['1','2','3','4','5'],['1','2','3','4','5']],
 'sep-web':[['1','2','3','4','5','6','7','8','9'],['1','2','3','4','5']],
 'sep-game':[['1a','1b','2a','2b','3a','3b','3c','4a','4b','5a','5b'],['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15']],
 'sep-robotics':[['1','2','3','4','5'],['1','2','3','4','5']],
 'sep-interactive':[['1','2','3','4'],['1','2','3']]
};
function rows(section){return section.split(/\r?\n/).filter(x=>/^\|\s*\d/.test(x)).map(x=>x.split('|').slice(1,-1).map(s=>s.trim()));}
test('SPD ledgers retain every identified source item with explicit coverage and limits',()=>{for(const [name,[topics,outcomes]] of Object.entries(cases)){const text=readFileSync(new URL(`../docs/coverage-spd-${name}.md`,import.meta.url),'utf8');const [intro,body]=text.split('## トピック');assert.ok(intro&&body,name);const [topicText,outcomeText]=body.split('## 例示学習成果');assert.ok(topicText&&outcomeText,name);for(const [actual,expected] of [[rows(topicText),topics],[rows(outcomeText),outcomes]]){assert.deepEqual(actual.map(r=>r[0]),expected,name);for(const r of actual){assert.equal(r.length,5,name);assert.ok(['KA Core','Non-core'].includes(r[1]),name);assert.ok(['未照合','部分','完了'].includes(r[3]),name);assert.ok(r[2]&&r[4],name);}}}});
test('source Web heading inconsistency stays explicit in the ledger',()=>{const text=readFileSync(new URL('../docs/coverage-spd-sep-web.md',import.meta.url),'utf8');assert.match(text,/mobile\/mobile apps/);});
