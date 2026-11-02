import {test} from 'node:test';
import assert from 'node:assert/strict';
import {segmentResult,segmentCreate,segmentComplete,segmentRestore} from '../src/segment-contact.js';

test('all 400 ordered endpoint pairs agree with independent horizontal-line intersection',()=>{
 for(let cx=0;cx<=4;cx++)for(let cy=0;cy<=3;cy++)for(let dx=0;dx<=4;dx++)for(let dy=0;dy<=3;dy++){
  const c={x:cx,y:cy},d={x:dx,y:dy};let expected;
  if(cx===dx&&cy===dy)expected='invalid';
  else if(cy===1&&dy===1)expected='overlap';
  else if((cy<1&&dy<1)||(cy>1&&dy>1)||cy===dy)expected='separate';
  else {const t=(1-cy)/(dy-cy),x=cx+t*(dx-cx);expected=t===0||t===1||x===0||x===4?'touch':'cross';}
  assert.equal(segmentResult(c,d).status,expected,`${cx},${cy};${dx},${dy}`);assert.equal(segmentResult(d,c).status,expected);
 }
 assert.throws(()=>segmentResult({x:-1,y:0},{x:2,y:2}));
});
test('all four arrangements must be checked and restored copies are independent',()=>{
 const q=segmentCreate();q.trials.cross={c:{x:2,y:0},d:{x:2,y:2},checked:true};q.trials.touch={c:{x:2,y:1},d:{x:2,y:2},checked:true};q.trials.overlap={c:{x:1,y:1},d:{x:3,y:1},checked:true};q.trials.separate={c:{x:0,y:0},d:{x:4,y:0},checked:true};assert.equal(segmentComplete(q),true);const copy=segmentRestore(q);copy.trials.cross.d.y=0;assert.equal(segmentComplete(q),true);assert.equal(segmentComplete(copy),false);assert.throws(()=>segmentRestore(copy));
});
