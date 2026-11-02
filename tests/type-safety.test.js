import test from 'node:test';
import assert from 'node:assert/strict';
import {safetyCases,safetyType,safetyValue,safetyStep,safetyCurrent,safetyStatus,safetyCreate,safetyObserve,safetyAdvance,safetyComplete,safetyRestore} from '../src/type-safety.js';

test('bounded generated typed closed expressions progress and preserve type under the normal rules',()=>{
 let terms=[0,1,true,false];const base=[...terms];
 for(let depth=0;depth<2;depth++){const previous=[...terms];terms=[...terms,...previous.map(x=>['succ',x])];for(const c of previous)for(const a of base)for(const b of base)terms.push(['if',c,a,b]);}
 for(const term of terms){const type=safetyType(term),next=safetyStep(term);if(type!==null){assert.ok(safetyValue(term)||next!==null,JSON.stringify(term));if(next!==null)assert.equal(safetyType(next),type,JSON.stringify(term));}if(safetyValue(term))assert.equal(next,null);}
});
test('the fixed examples distinguish stuck, conservative rejection, and two broken properties',()=>{
 assert.equal(safetyType(safetyCases.stuck.term),null);assert.equal(safetyStatus('stuck',0),'stuck');
 assert.equal(safetyType(safetyCases.conservative.term),null);assert.equal(safetyCurrent('conservative',1),0);
 assert.equal(safetyType(safetyCases.brokenPreservation.term),'number');assert.equal(safetyType(safetyCurrent('brokenPreservation',1)),'light');
 assert.equal(safetyType(safetyCases.brokenProgress.term),'number');assert.equal(safetyStatus('brokenProgress',0),'stuck');
 assert.deepEqual([0,1,2].map(i=>safetyStatus('normal',i)),['step','step','value']);
});
test('each step requires a correct observation and saved positions are validated',()=>{
 const s=safetyCreate();for(const id of Object.keys(safetyCases)){const t=s.trials[id];assert.equal(safetyAdvance(id,t),false);t.choice='incorrect';assert.equal(safetyObserve(id,t),false);while(true){t.choice=safetyStatus(id,t.steps);assert.ok(safetyObserve(id,t));if(t.choice!=='step')break;assert.ok(safetyAdvance(id,t));}}
 s.progress='value-or-step';s.preservation='same-type';s.checked=true;assert.ok(safetyComplete(s));assert.deepEqual(safetyRestore(s),s);
 const bad=structuredClone(s);bad.trials.normal.steps=3;assert.throws(()=>safetyRestore(bad));bad.trials.normal.steps=2;bad.trials.normal.choice='step';assert.throws(()=>safetyRestore(bad));
});
