import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fabricationInitial,fabricationExecute,fabricationReplay,fabricationCreate,fabricationStep,fabricationComplete,fabricationRestore} from '../src/fabrication-workshop.js';

test('both methods accept only the target among all 64 height combinations',()=>{
 for(const id of ['add','cut'])for(let a=0;a<=3;a++)for(let b=0;b<=3;b++)for(let c=0;c<=3;c++){
  const s=fabricationInitial(id);for(const [i,h] of [a,b,c].entries())for(let n=0;n<(id==='add'?h:3-h);n++)fabricationExecute(s,`column:${i}`);
  assert.deepEqual(s.heights,[a,b,c]);if(a===2&&b===3&&c===1){fabricationExecute(s,'check');assert(s.done);}else assert.throws(()=>fabricationExecute(s,'check'));
 }
});
test('forming requires heat, shape, cool, and check in order',()=>{
 const s=fabricationInitial('form'),actions=['heat','shape','cool','check'];for(const action of actions){for(const bad of actions.filter(x=>x!==action))assert.throws(()=>fabricationExecute(structuredClone(s),bad));fabricationExecute(s,action);}assert(s.done);assert.throws(()=>fabricationExecute(s,'cool'));assert.throws(()=>fabricationReplay('form',['shape']));
});
test('all three trials and reflection required, drafts replay and invalid histories fail',()=>{
 const q=fabricationCreate();for(const [id,steps] of [['add',['column:0','column:0','column:1','column:1','column:1','column:2','check']],['cut',['column:0','column:2','column:2','check']],['form',['heat','shape','cool','check']]]){q.selected=id;for(const a of steps){fabricationStep(q,a);assert.deepEqual(fabricationRestore(q),q);}}assert(!fabricationComplete(q));q.answer='mechanism';assert(fabricationComplete(q));const bad=structuredClone(q);bad.trials.add=['column:0','check'];assert.throws(()=>fabricationRestore(bad));assert.throws(()=>fabricationReplay('add',Array(31).fill('column:0')));
});

test('drafts from before the planning exercise remain usable', () => {
 const old=fabricationCreate();delete old.plan;old.trials.add=['column:0'];
 const restored=fabricationRestore(old);
 assert.deepEqual(restored.plan,{method:'add',quantity:1,checked:[]});
 assert.deepEqual(restored.trials.add,['column:0']);
});
