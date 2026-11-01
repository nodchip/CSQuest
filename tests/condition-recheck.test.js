import test from 'node:test';
import assert from 'node:assert/strict';
import {conditionModes,conditionSequence,conditionReplay,createConditionRecheck,conditionRecheckComplete,restoreConditionRecheck} from '../src/condition-recheck.js';
test('a broadcast does not reserve the item for both awakened consumers',()=>{
 const once=conditionReplay('once',conditionSequence('once'));assert.equal(once.a,'完了');assert.equal(once.items,0);assert.equal(once.error,true);
 const seq=conditionSequence('loop'),afterRecheck=conditionReplay('loop',seq.slice(0,7));assert.equal(afterRecheck.b,'再び待機中');assert.equal(afterRecheck.lock,'空き');assert.equal(afterRecheck.error,false);
 const final=conditionReplay('loop',seq);assert.equal(final.a,'完了');assert.equal(final.b,'完了');assert.equal(final.delivered,2);assert.equal(final.items,0);assert.equal(final.error,false);
 assert.throws(()=>conditionReplay('loop',['wakeA']));assert.throws(()=>conditionReplay('once',['waitA','waitB','put','wakeB']));
});
test('two complete comparisons and a qualified conclusion are required',()=>{
 const s=createConditionRecheck();for(const id of Object.keys(conditionModes))s.histories[id]=conditionSequence(id);s.answer='recheck';s.checked=true;assert.ok(conditionRecheckComplete(s));assert.deepEqual(restoreConditionRecheck(s),s);s.histories.loop.pop();assert.equal(conditionRecheckComplete(s),false);assert.throws(()=>restoreConditionRecheck({...s,histories:{...s.histories,once:['put']}}));
});
