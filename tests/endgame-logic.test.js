import test from 'node:test';
import assert from 'node:assert/strict';
import {unifyExample,derived,replayLogic} from '../src/endgame-logic.js';
test('same variable is consistent and distinct constants do not unify',()=>{
 assert.equal(unifyExample(['X','X'],['アオ','アオ']),'アオ');
 assert.equal(unifyExample(['X','X'],['アオ','ビー']),null);
 assert.equal(unifyExample(['X','赤'],['ビー','赤']),'ビー');
 assert.equal(unifyExample(['赤','X'],['ビー','赤']),null);
 assert.equal(unifyExample(['X','赤'],['ビー']),null);
 const h=['answer:アオ','check','answer:なし','check','answer:ビー','check','answer:なし','check'];assert.equal(replayLogic('unify',h).done,true);assert.equal(replayLogic('unify',[...h,'check']),null);
});
test('facts join in the stated direction and share the intermediate flower',()=>{
 const c={care:[['アオ','赤'],['ビー','青']],bloom:['青']};assert.deepEqual(derived(c),[['ビー','青']]);
 assert.equal(replayLogic('combine',['person:アオ','flower:青','check']),null);
 const partial=['person:アオ','flower:青','person:ビー'];assert.deepEqual(replayLogic('combine',JSON.parse(JSON.stringify(partial))).flower,null);
 const h=['person:アオ','flower:赤','check','person:ビー','flower:青','check','person:なし','check'];const result=replayLogic('combine',h);assert.equal(result.done,true);assert.deepEqual(result.results,[['アオ','赤'],['ビー','青'],null]);
});
test('derivation rejects reversed evidence, permits retry and checks both examples',()=>{
 assert.equal(replayLogic('derive',['answer:ビー','check']),null);
 const done=['answer:ビー','reset','answer:アオ','check','answer:ビー','check'];assert.equal(replayLogic('derive',done).done,true);
 assert.deepEqual(derived({care:[['赤','アオ']],bloom:['赤']}),[]);
});
