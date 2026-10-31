import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runIntegration,createIntegration,stepIntegration,integrationComplete,restoreIntegration} from '../src/integration-strategies.js';
test('the partial tests use stubs or drivers and complete integration uses real components',()=>{
 assert.deepEqual(runIntegration(['ui']),{trace:['画面','受付の代役'],outputs:[1]});assert.deepEqual(runIntegration(['ui','service']),{trace:['画面','受付','倉庫の代役'],outputs:[1]});assert.deepEqual(runIntegration(['store']),{trace:['倉庫を呼ぶ試験役','倉庫'],outputs:[1]});assert.deepEqual(runIntegration(['ui','store']),{trace:['画面','受付の代役','倉庫を呼ぶ試験役','倉庫'],outputs:[1,1]});assert.deepEqual(runIntegration(['ui','service','store']),{trace:['画面','受付','倉庫'],outputs:[1]});
});
test('each strategy requires its order and intermediate tests; both sandwich end orders work',()=>{
 const s=createIntegration();let t=stepIntegration(s.trials.top,'build:store');assert.deepEqual(t.built,[]);for(const [mode,order] of [['top',['ui','service','store']],['bottom',['store','service','ui']],['sandwich',['store','ui','service']]]){t=s.trials[mode];for(let i=0;i<order.length;i++){t=stepIntegration(t,`build:${order[i]}`);if(mode!=='sandwich'||i!==0)t=stepIntegration(t,'test');}s.trials[mode]=t;}assert.equal(integrationComplete(s),true);assert.equal(integrationComplete(restoreIntegration(s)),true);let other=createIntegration().trials.sandwich;for(const action of ['build:ui','build:store','test','build:service','test'])other=stepIntegration(other,action);assert.equal(other.built.length,3);assert.equal(other.tested,true);assert.throws(()=>restoreIntegration({...s,trials:{...s.trials,top:{history:['build:bad']}}}),RangeError);
});
