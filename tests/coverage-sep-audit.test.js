import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const cases={
 context:{topics:[8,4],outcomes:[11,5]},
 'ethical-analysis':{topics:[9,4],outcomes:[10,6]},
 'professional-ethics':{topics:[15,7],outcomes:[14,6]},
 communication:{topics:[8,6],outcomes:[9,7]},
 history:{topics:[8,2],outcomes:[6,2]},
 economies:{topics:[5,0],outcomes:[5,0]},
 security:{topics:[10,6],outcomes:[8,5]},
 deia:{topics:[9,6],outcomes:[11,7]}
};
function rows(section){return section.split(/\r?\n/).filter(x=>/^\|\s*\d/.test(x)).map(x=>x.split('|').slice(1,-1).map(s=>s.trim()));}
test('all SEP ledgers preserve numbered source topics and outcomes with correct core categories',()=>{for(const [name,counts] of Object.entries(cases)){const text=readFileSync(new URL(`../docs/coverage-sep-${name}.md`,import.meta.url),'utf8');const [intro,body]=text.split('## トピック');assert.ok(intro&&body,name);const [topics,outcomes]=body.split('## 例示学習成果');assert.ok(topics&&outcomes,name);for(const [section,[count,core]] of [[topics,counts.topics],[outcomes,counts.outcomes]]){const entries=rows(section);assert.equal(entries.length,count,name);entries.forEach((r,i)=>{assert.equal(r.length,5,name);assert.equal(r[0],String(i+1),name);assert.equal(r[1],i<core?'CS Core':'KA Core',name);assert.ok(['未照合','部分','完了'].includes(r[3]),name);assert.ok(r[2]&&r[4],name);});}}});
test('uncertain relationships and the lack of a confirmed attack remain explicit',()=>{const security=readFileSync(new URL('../docs/coverage-sep-security.md',import.meta.url),'utf8');const deia=readFileSync(new URL('../docs/coverage-sep-deia.md',import.meta.url),'utf8');assert.match(security,/停止は原因不明/);assert.match(deia,/開発チームの多様性と影響の比較は未照合/);});
