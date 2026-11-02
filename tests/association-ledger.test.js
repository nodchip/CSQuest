import test from 'node:test';
import assert from 'node:assert/strict';
import {assocRules,assocCounts,assocQualifies,assocCreate,assocCheck,assocThresholdCorrect,assocComplete,assocRestore} from '../src/association-ledger.js';

test('counts use joint support and directional antecedent confidence',()=>{
 const expected={hb:[4,3,true],bh:[5,3,false],hcb:[3,2,false],cb:[4,3,true]};
 for(const [id,[left,both,qualified]] of Object.entries(expected)){const c=assocCounts(id);assert.deepEqual([c.total,c.leftCount,c.bothCount,assocQualifies(id)],[6,left,both,qualified]);}
 assert.throws(()=>assocCounts('missing'),RangeError);
});
test('every threshold subset, inspection, wrong predictions and save restoration are checked',()=>{
 const q=assocCreate(),ids=Object.keys(assocRules);for(let mask=0;mask<16;mask++){q.threshold=ids.filter((_,i)=>mask&(1<<i));assert.equal(assocThresholdCorrect(q),mask===9);}
 q.left=4;q.both=3;assert.throws(()=>assocCheck(q),RangeError);q.seen=['hb:left','hb:both'];q.both=2;assocCheck(q);assert.equal(q.last.correct,false);assert.deepEqual(q.checked,[]);
 for(const id of ids){q.rule=id;q.seen=[...new Set([...q.seen,`${id}:left`,`${id}:both`])];const c=assocCounts(id);q.left=c.leftCount;q.both=c.bothCount;assocCheck(q);}
 q.threshold=['cb','hb'];q.thresholdChecked=true;assert.equal(assocComplete(q),false);q.reflection='limited';assert.equal(assocComplete(q),true);const saved=assocRestore(q);saved.threshold.pop();assert.equal(q.threshold.length,2);assert.throws(()=>assocRestore({...q,last:{...q.last,correct:false}}),RangeError);assert.throws(()=>assocRestore({...q,threshold:['hb','hb']}),RangeError);
});
