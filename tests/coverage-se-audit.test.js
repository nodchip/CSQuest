import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const cases={
 teamwork:[['1','2','3a','3b','3c','4-本体','4a','4b','5','6','7a','7b','7c','8'],[10,8]],
 tools:[['1a','1b','1c','2','3','4a','4b','4c','5','6','7'],[7,3]],
 construction:[['1a','1b','2a','2b-i','2b-ii','3a','3b','3c','4a','4b','4c','5','6','7','8a','8b','9a','9b','9c','10a','10b','10c','10d','11','12a','12b','13','14'],[11,2]],
 refactoring:[['1','2a','2b','3a','3b','3c','3d','4a','4b','5a','5b','5c'],[6,0]],
 reliability:[['1','2','3','4','5','6','7','8-本体','8a','9','10','11'],[7,0]],
 formal:[['1a','1b','2a','2b','3a','3b','4a','4b'],[3,0]]
};
function rows(section){return section.split(/\r?\n/).filter(x=>/^\|\s*\d/.test(x)).map(x=>x.split('|').slice(1,-1).map(s=>s.trim()));}
test('SE ledgers preserve all enumerated topic details and independently numbered learning outcomes',()=>{for(const [name,[topics,[count,core]]] of Object.entries(cases)){const text=readFileSync(new URL(`../docs/coverage-se-${name}.md`,import.meta.url),'utf8');const [intro,body]=text.split('## トピック');assert.ok(intro&&body,name);const [topicText,outcomeText]=body.split('## 例示学習成果');assert.ok(topicText&&outcomeText,name);const ts=rows(topicText),os=rows(outcomeText);assert.deepEqual(ts.map(r=>r[0]),topics,name);assert.equal(os.length,count,name);os.forEach((r,i)=>{assert.equal(r[0],String(i+1),name);const expected=name==='formal'?'原典に明記なし':name==='construction'&&i>=9||name==='refactoring'&&i>=5||name==='reliability'&&i>=3?'Non-core':i<core?'CS Core':'KA Core';assert.equal(r[1],expected,name);});for(const r of [...ts,...os]){assert.equal(r.length,5,name);assert.ok(['未照合','部分','完了'].includes(r[3]),name);assert.ok(r[2]&&r[4],name);}}});
test('formal method outcomes have no invented category',()=>{const text=readFileSync(new URL('../docs/coverage-se-formal.md',import.meta.url),'utf8');assert.match(text,/例示学習成果には個別の Core 区分の見出しがない/);});
