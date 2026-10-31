import {test} from 'node:test';
import assert from 'node:assert/strict';
import {dhScenario,createDh,dhComplete,restoreDh} from '../src/dh-interception.js';
test('the shared value agrees directly but an intermediary learns two separate values',()=>{
 const direct=dhScenario('direct'),attack=dhScenario('intercept');assert.deepEqual([direct.A,direct.B,direct.E,direct.alice,direct.bob],[8,19,17,2,2]);assert.deepEqual([attack.alice,attack.bob,attack.attackerAlice,attack.attackerBob],[12,15,12,15]);assert.equal(dhScenario('authenticated').rejected,true);assert.throws(()=>dhScenario('other'),RangeError);
});
test('all three scenarios must be tested and saved selections are validated and copied',()=>{
 const s=createDh();s.tested=['direct','intercept'];assert.equal(dhComplete(s),false);s.tested.push('authenticated');const copy=restoreDh(s);s.tested.pop();assert.equal(dhComplete(copy),true);assert.throws(()=>restoreDh({...s,tested:['direct','direct']}),RangeError);
});
