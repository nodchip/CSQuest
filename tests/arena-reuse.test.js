import {test} from 'node:test';
import assert from 'node:assert/strict';
import {arenaActions,arenaInitial,arenaResolve,arenaExpected,arenaExecute,arenaReplay,arenaCreate,arenaStep,arenaComplete,arenaRestore} from '../src/arena-reuse.js';

for(const [id,slot] of [['reuse',100],['different',200]])test(`${id}: stale keys fail and the newly allocated key works`,()=>{
 const s=arenaInitial(id),history=[];while(arenaExpected(s)){const action=arenaExpected(s);for(const wrong of Object.keys(arenaActions).filter(x=>x!==action))assert.throws(()=>arenaExecute(structuredClone(s),wrong));arenaExecute(s,action);history.push(action);assert.deepEqual(arenaReplay(id,history),s);if(s.stage===2)assert.equal(arenaResolve(s,s.old),'A');if(s.stage===3)assert.equal(arenaResolve(s,s.old),null);if(s.stage===4){assert.equal(s.fresh.slot,slot);assert.equal(arenaResolve(s,s.old),null);assert.equal(arenaResolve(s,s.fresh),'B');assert.equal(s.slots[100].item,id==='reuse'?'B':null);assert.equal(s.fresh.generation,id==='reuse'?2:1);}}assert.throws(()=>arenaExecute(s,'allocate'));
});
test('both paths and reflection required; invalid history rejected on restore',()=>{
 const q=arenaCreate();for(const id of ['reuse','different']){q.selected=id;while(true){const a=arenaExpected(arenaReplay(id,q.trials[id]));if(!a)break;arenaStep(q,a);assert.deepEqual(arenaRestore(q),q);}}assert.equal(arenaComplete(q),false);q.answer='identity';assert.equal(arenaComplete(q),true);assert.throws(()=>arenaRestore({selected:'reuse',trials:{reuse:['remove'],different:[]},answer:null}));const copy=arenaRestore(q);copy.trials.reuse.pop();assert.equal(q.trials.reuse.length,7);
});
