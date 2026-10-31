import test from 'node:test';
import assert from 'node:assert/strict';
import {createBalancerTrial,balancerNext,balancerStep,createBalancer,balancerCorrect,balancerComplete,restoreBalancer} from '../src/balancer-health.js';
test('round robin and a delayed health check have the expected fixed sequences',()=>{
 let normal=createBalancerTrial();for(const target of ['a','b','a','b']){assert.equal(balancerNext('healthy',normal),target);normal=balancerStep('healthy',normal,'send',target);}assert.deepEqual(normal.results.map(r=>r.success),[true,true,true,true]);
 let failure=createBalancerTrial();failure=balancerStep('failure',failure,'send','a');failure=balancerStep('failure',failure,'send','b');assert.equal(failure.failed,true);failure=balancerStep('failure',failure,'probe');for(const target of ['a','a'])failure=balancerStep('failure',failure,'send',target);assert.deepEqual(failure.results.map(r=>[r.target,r.success]),[['a',true],['b',false],['a',true],['a',true]]);
});
test('wrong guesses do not advance and the repair history is replayed',()=>{
 const s=createBalancer();for(const id of ['healthy','failure']){let t=s.trials[id];assert.equal(balancerStep(id,t,'send','b').count,0);for(let i=0;i<4;i++){if(id==='failure'&&i===2)t=balancerStep(id,t,'probe');t=balancerStep(id,t,'send',balancerNext(id,t));}t.reason='instant';t.checked=true;assert.equal(balancerCorrect(id,t),false);t.reason='snapshot';s.trials[id]=t;}assert.equal(balancerComplete(s),true);assert.deepEqual(restoreBalancer(s),s);const copy=restoreBalancer(s);copy.trials.failure.history[0]=['send','b'];assert.throws(()=>restoreBalancer(copy));assert.deepEqual(s.trials.failure.history[0],['send','a']);
});
