import test from 'node:test';
import assert from 'node:assert/strict';
import {classificationTreeResult,createClassificationTree,classificationTreeComplete,restoreClassificationTree} from '../src/classification-tree.js';

test('all trees use the correct majority leaf and root impurity',()=>{
 for(const data of ['and','xor'])for(const root of ['x','y'])for(const left of [false,true])for(const right of [false,true]){
  const result=classificationTreeResult(data,root,[left,right]);
  assert.equal(result.rootImpurity,data==='and'?.375:.5);assert.equal(result.after,data==='and'?.25:.5);assert.equal(result.gain,data==='and'?.125:0);
  for(const row of result.rows){const group=result.rows.filter(q=>q[root]===row[root]&&(![left,right][row[root]]||q[root==='x'?'y':'x']===row[root==='x'?'y':'x']));const positive=group.filter(q=>q.label===1).length;assert.equal(row.prediction,positive>group.length-positive?1:0);assert.equal(row.label,data==='and'?row.x*row.y:(row.x+row.y)%2);}
  assert.equal(result.correct,result.rows.filter(r=>r.label===r.prediction).length);
 }
 for(const d of ['and','xor'])assert.equal(classificationTreeResult(d,'x',[true,true]).correct,4);
});
test('completion and saved data require both depths in each dataset',()=>{
 const s=createClassificationTree();s.observed=['and,00','and,11','xor,00','xor,11'];s.answer='limits';s.checked=true;const copy=restoreClassificationTree(s);assert.equal(classificationTreeComplete(copy),true);copy.branches[0]=true;assert.equal(s.branches[0],false);assert.equal(classificationTreeComplete({...s,answer:'perfect'}),false);assert.throws(()=>restoreClassificationTree({...s,observed:['xor,00','xor,00']}));
});
