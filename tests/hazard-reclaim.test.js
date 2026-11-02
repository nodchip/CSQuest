import {test} from 'node:test';
import assert from 'node:assert/strict';
import {hazardActions,hazardInitial,hazardExecute,hazardReplay,hazardCreate,hazardStep,hazardDone,hazardComplete,hazardRestore} from '../src/hazard-reclaim.js';

for(const [id,steps] of [['unsafe',['read','retire','scan','touch']],['protected',['read','publish','validate','retire','scan','touch','clear','scan']],['late',['read','retire','scan','publish','validate','discard']]])test(`${id}: each step follows the stated schedule and restores`,()=>{
 const s=hazardInitial(id),h=[];for(const action of steps){for(const wrong of Object.keys(hazardActions).filter(a=>a!==action))assert.throws(()=>hazardExecute(structuredClone(s),wrong));hazardExecute(s,action);h.push(action);assert.deepEqual(hazardReplay(id,h),s);}assert(hazardDone(id,h));assert.throws(()=>hazardExecute(s,'scan'));
 if(id==='unsafe'){assert(s.freed);assert.equal(s.touch,'unsafe');}else if(id==='protected'){assert.equal(s.touch,'safe');assert(s.freed);assert.equal(s.hazard,null);}else{assert(s.freed);assert.equal(s.valid,false);assert.equal(s.touch,null);assert.equal(s.local,null);}
});
test('protected scan defers reclamation until the reader clears the hazard',()=>{
 const before=hazardReplay('protected',['read','publish','validate','retire','scan']);assert(before.retired);assert(!before.freed);assert.equal(before.lastScan,'deferred');const after=hazardReplay('protected',['read','publish','validate','retire','scan','touch','clear','scan']);assert(after.freed);assert.equal(after.lastScan,'freed');
});
test('three scenarios and reflection required; forged order rejected',()=>{
 const q=hazardCreate();for(const [id,steps] of [['unsafe',['read','retire','scan','touch']],['protected',['read','publish','validate','retire','scan','touch','clear','scan']],['late',['read','retire','scan','publish','validate','discard']]]){q.selected=id;for(const action of steps){hazardStep(q,action);assert.deepEqual(hazardRestore(q),q);}}assert(!hazardComplete(q));q.answer='validate';assert(hazardComplete(q));const bad=structuredClone(q);bad.trials.protected=['read','retire'];assert.throws(()=>hazardRestore(bad));
});
