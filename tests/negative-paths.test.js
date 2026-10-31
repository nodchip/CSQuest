import test from 'node:test';
import assert from 'node:assert/strict';
import {negativeEdges,createNegativeTrial,negativeStep,createNegative,negativeComplete,restoreNegative} from '../src/negative-paths.js';
test('greedy settlement stops at cost four although the alternative path costs three',()=>{
 const direct=negativeEdges.sa.cost+negativeEdges.ag.cost,via=negativeEdges.sb.cost+negativeEdges.ba.cost+negativeEdges.ag.cost;assert.equal(direct,4);assert.equal(via,3);let s=createNegativeTrial('greedy');assert.equal(negativeStep(s,'A').history.length,0);for(const n of ['S','A','G'])s=negativeStep(s,n);assert.equal(s.done,true);assert.equal(s.dist.G,4);
});
test('all possible edge orders converge, require a no-change pass and restore safely',()=>{
 const stack=[createNegativeTrial('relax')],seen=new Set();let terminals=0;while(stack.length){const s=stack.pop(),key=JSON.stringify([s.dist,s.seen.slice().sort(),s.changed,s.round,s.done]);if(seen.has(key))continue;seen.add(key);if(s.done){terminals++;assert.equal(s.dist.G,3);assert.equal(s.dist.A,1);assert.ok(s.round<=4);continue;}for(const e of Object.keys(negativeEdges).filter(e=>!s.seen.includes(e)))stack.push(negativeStep(s,e));}assert.ok(terminals>0);
 const states=createNegative();for(const n of ['S','A','G'])states.trials.greedy=negativeStep(states.trials.greedy,n);while(!states.trials.relax.done){for(const e of Object.keys(negativeEdges))states.trials.relax=negativeStep(states.trials.relax,e);}assert.equal(negativeComplete(states),true);assert.equal(negativeComplete(restoreNegative({selected:'relax',histories:{greedy:states.trials.greedy.history,relax:states.trials.relax.history}})),true);assert.throws(()=>restoreNegative({selected:'greedy',histories:{greedy:['A'],relax:[]}}),RangeError);
});
