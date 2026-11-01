import {test} from 'node:test';
import assert from 'node:assert/strict';
import {simulateScroll,scrollRequired,createUniversalScroll,universalScrollComplete,restoreUniversalScroll} from '../src/universal-scroll.js';

test('同じ解釈器が３種類の規則と４入力を実行する',()=>{
 for(const bits of ['00','01','10','11']){
  const flip=c=>c==='0'?'1':'0',single=simulateScroll('single',bits,1),both=simulateScroll('both',bits,2),cycle=simulateScroll('loop',bits,1);
  assert.equal(single.tape.join(''),flip(bits[0])+bits[1]);assert.equal(single.status,'halt');
  assert.equal(both.tape.join(''),flip(bits[0])+flip(bits[1]));assert.equal(both.status,'halt');
  assert.equal(cycle.tape.join(''),bits);assert.equal(cycle.state,'q0');assert.equal(cycle.head,0);assert.equal(cycle.status,'cycle');
  assert.throws(()=>simulateScroll('loop',bits,2),RangeError);
 }
 const first=simulateScroll('both','01',1);assert.deepEqual(first.tape,[1,1]);assert.equal(first.head,1);assert.equal(first.state,'q1');assert.equal(first.status,'running');
});
test('指定した巻物と入力および２つの振り返りが必要',()=>{
 const s=createUniversalScroll();s.observed=[...scrollRequired];s.answer='description';s.halting='limited';assert.equal(universalScrollComplete(s),false);s.checked=true;assert.equal(universalScrollComplete(s),true);
 const r=restoreUniversalScroll(s);r.observed.pop();assert.equal(s.observed.length,5);
 for(const p of [{program:'bad'},{bits:'02'},{program:'single',steps:2},{observed:['bad']},{observed:['single,00','single,00']},{answer:'bad'},{checked:1}])assert.throws(()=>restoreUniversalScroll({...s,...p}),RangeError);
});
