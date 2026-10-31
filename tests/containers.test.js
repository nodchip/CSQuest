import test from 'node:test';
import assert from 'node:assert/strict';
import {containerEvents,createContainer,containerStep,containerCorrect,containersComplete,createContainerSet,restoreContainers} from '../src/containers.js';

function run(mode,predictions){let s=createContainer(mode),i=0;for(const e of containerEvents)s=containerStep(s,e.put?`put:${e.put}`:`take:${predictions[i++]}`);return s;}
test('interleaved enqueue and push produce distinct correct sequences',()=>{
  const q=run('queue',['A','B','C','D']),s=run('stack',['C','D','B','A']);
  assert.deepEqual(q.output,['A','B','C','D']);assert.deepEqual(s.output,['C','D','B','A']);
  assert.equal(containerCorrect('delivery',q),true);assert.equal(containerCorrect('footsteps',q),false);
  assert.equal(containerCorrect('footsteps',s),true);assert.equal(containerCorrect('delivery',s),false);
  const set=createContainerSet();set.states={delivery:q,footsteps:s};assert.equal(containersComplete(set),true);
});
test('incorrect predictions preserve the state and give the appropriate rule',()=>{
  for(const [mode,wrong] of [['queue','C'],['stack','A']]){
    let s=createContainer(mode);for(const id of ['A','B','C'])s=containerStep(s,`put:${id}`);
    const next=containerStep(s,`take:${wrong}`);assert.deepEqual(next.items,s.items);assert.deepEqual(next.history,s.history);assert.ok(next.message.includes(mode==='queue'?'先':'後'));
  }
});
test('draft replay validates each operation and cannot fabricate success',()=>{
  const saved={selected:'delivery',states:{delivery:{mode:'queue',history:['put:A','put:B']},footsteps:null}};
  assert.deepEqual(restoreContainers(saved).states.delivery.items,['A','B']);
  assert.throws(()=>restoreContainers({...saved,states:{...saved.states,delivery:{mode:'queue',history:['put:A','put:B','put:C','take:C']}}}),RangeError);
  assert.throws(()=>restoreContainers({...saved,states:{...saved.states,delivery:{mode:'other',history:[]}}}),RangeError);
});
