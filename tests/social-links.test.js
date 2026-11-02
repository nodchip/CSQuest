import test from 'node:test';
import assert from 'node:assert/strict';
import {socialEdges,socialReach,socialPathValid,socialNext,socialCreate,socialCheck,socialComplete,socialRestore} from '../src/social-links.js';

test('six graph conditions agree with independently enumerated reachable nodes',()=>{
 const expected=[['ABCDEF','AB','ABC'],['ABCDEF','ABDEF','ABCEF']];
 for(const extra of [false,true])for(const [i,removed] of [null,'C','D'].entries()){
  assert.equal(socialReach(extra,removed).join(''),expected[Number(extra)][i]);assert.ok(socialEdges(extra,removed).every(edge=>!edge.includes(removed)));
 }
 assert.throws(()=>socialReach(false,'A'),RangeError);assert.throws(()=>socialEdges('yes',null),RangeError);
});
test('correct predictions for all four changes and both reflections are required and saved results are validated',()=>{
 const q=socialCreate();assert.throws(()=>socialCheck(q),RangeError);q.removed='C';q.prediction=6;socialCheck(q);assert.equal(q.checked.length,0);
 for(const [extra,removed,n] of [[false,'C',2],[false,'D',3],[true,'C',5],[true,'D',5]]){q.extra=extra;q.removed=removed;q.prediction=n;socialCheck(q);}
 assert.equal(socialComplete(q),false);q.reflection='limited';q.privacy='consent';assert.equal(socialComplete(q),true);const restored=socialRestore(q);restored.checked.pop();assert.equal(q.checked.length,4);assert.throws(()=>socialRestore({...q,last:{...q.last,actual:6}}),RangeError);assert.throws(()=>socialRestore({...q,checked:['0:C','0:C']}),RangeError);
});
test('tracing follows existing edges without repeats and old drafts gain an initial path',()=>{
 assert.deepEqual(socialNext(false,null,['A']),['B','C']);assert.deepEqual(socialNext(false,'C',['A','B']),[]);
 assert.deepEqual(socialNext(true,'C',['A','B']),['E']);assert.ok(socialPathValid(true,'C',['A','B','E','F','D']));
 for(const path of [[],['B'],['A','F'],['A','B','A'],['A','C']])assert.equal(socialPathValid(true,'C',path),false);
 const q=socialCreate();delete q.path;assert.deepEqual(socialRestore(q).path,['A']);q.path=['A','C','D'];const restored=socialRestore(q);restored.path.pop();assert.deepEqual(q.path,['A','C','D']);assert.throws(()=>socialRestore({...q,removed:'C'}),RangeError);
});
