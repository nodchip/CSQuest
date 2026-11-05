import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
const cases={
 'ar-sep':{topic:['1','1a','1b','1c','1d'],outcome:['1'],category:'Non-core'},
 'git-simulation':{topic:['1','1-応答','1a','1b','1c','1d','2','3','3a','3b','3c','3d','3e','4','4a','4b','5','5a','5b','6'],outcome:['1','2','3'],category:'KA Core'},
 'git-sep':{topic:['1a','1b','2a','2b','2c','2d','2e-i','2e-ii','2f','2g-i','2g-ii','3a','3b','4'],outcome:['1','2','3'],category:'KA Core'},
 'os-sep':{topic:['1','1-例a','1-例b','1-例c','1-例d','2','例示-プライバシー'],outcome:['1','2','3','4'],category:'KA Core'},
 'sdf-sep':{topic:['1','2','3','4'],outcome:['1','2','3','4'],category:'CS Core'}
};
function rows(section){return section.split(/\r?\n/).filter(x=>/^\|\s*(?:\d|例示-)/.test(x)).map(x=>x.split('|').slice(1,-1).map(s=>s.trim()));}
test('all remaining unit ledgers identify each topic, example and learning outcome without category inference',()=>{for(const [name,c] of Object.entries(cases)){const text=readFileSync(new URL(`../docs/coverage-${name}.md`,import.meta.url),'utf8');const [intro,body]=text.split('## トピック');assert.ok(intro&&body,name);const [topicText,outcomeText]=body.split('## 例示学習成果');assert.ok(topicText&&outcomeText,name);for(const [section,expected] of [[topicText,c.topic],[outcomeText,c.outcome]]){const entries=rows(section);assert.deepEqual(entries.map(r=>r[0]),expected,name);for(const r of entries){assert.equal(r.length,5,name);assert.ok(r[1]===c.category||r[1]===c.category+'・例',name);assert.ok(['未照合','部分','完了'].includes(r[3]),name);assert.ok(r[2]&&r[4],name);}}}});
test('query parameterization is not mislabeled as input validation',()=>{const text=readFileSync(new URL('../docs/coverage-se-construction.md',import.meta.url),'utf8');const row=rows(text).find(r=>r[0]==='10d');assert.equal(row[3],'部分');assert.match(row[4],/223/);assert.match(row[4],/妥当性検証そのものではない/);});
test('each indexed unit has a linked ledger file',()=>{const index=readFileSync(new URL('../docs/knowledge-units.md',import.meta.url),'utf8');const status=readFileSync(new URL('../docs/coverage-status.md',import.meta.url),'utf8');const units=[...index.matchAll(/^\| [A-Z]+ \| ([^|]+) \|/gm)].map(m=>m[1].trim());const links=[...status.matchAll(/\[([^\]]+)\]\((coverage-[^)]+\.md)\)/g)];const labels=links.flatMap(m=>m[1]==='SDF-Data-Structures・Algorithms・Practices'?['SDF-Data-Structures','SDF-Algorithms','SDF-Practices']:[m[1]]);assert.equal(units.length,166);assert.deepEqual(new Set(labels),new Set(units));for(const link of links)assert.ok(existsSync(new URL(`../docs/${link[2]}`,import.meta.url)),link[2]);});
