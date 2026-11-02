import test from 'node:test';
import assert from 'node:assert/strict';
import {narrowingCases,narrowingUnify,narrowingReplay,narrowingCreate,narrowingStep,narrowingDone,narrowingComplete,narrowingRestore} from '../src/narrowing.js';

test('unification yields a zero case and a successor with an unconstrained natural',()=>{
 assert.deepEqual(narrowingUnify('zero'),{term:'０',status:'unified'});assert.deepEqual(narrowingUnify('succ'),{term:'後続(?Y)',status:'unified'});const r=narrowingReplay('narrowLight',[{action:'open:zero'},{action:'unify:zero'},{action:'eval:zero'},{action:'open:succ'},{action:'unify:succ'},{action:'eval:succ'}]);for(let n=0;n<20;n++)assert.equal(n===0,n===0?r.branches.zero.result:r.branches.succ.result);
});
test('waiting requires an external binding and evaluates according to its shape',()=>{
 for(const [id,kind,result] of [['waitZero','zero',true],['waitSucc','succ',false]]){const s=narrowingCreate();s.selected=id;assert.equal(narrowingStep(s,'eval').ok,false);assert.ok(narrowingStep(s,'try').ok);assert.equal(narrowingReplay(id,s.trials[id]).binding,null);assert.ok(narrowingStep(s,`bind:${kind}`).ok);assert.ok(narrowingStep(s,'eval').ok);s.guess=!result;assert.equal(narrowingStep(s,'check').ok,false);s.guess=result;assert.ok(narrowingStep(s,'check').ok);assert.ok(narrowingDone(id,s.trials[id]));}
});
test('both narrowing branches remain independent and are tested against each goal',()=>{
 for(const id of ['narrowLight','narrowDark']){const s=narrowingCreate();s.selected=id;for(const kind of ['succ','zero']){for(const op of ['open','unify','eval'])assert.ok(narrowingStep(s,`${op}:${kind}`).ok);s.guess=(kind==='zero')===narrowingCases[id].goal;assert.ok(narrowingStep(s,`check:${kind}`).ok);}assert.ok(narrowingDone(id,s.trials[id]));const r=narrowingReplay(id,s.trials[id]);assert.equal(r.branches.zero.binding,'０');assert.equal(r.branches.succ.binding,'後続(?Y)');}
});
test('all 70 interleavings of independent branch operations give the same answers',()=>{
 for(const id of ['narrowLight','narrowDark']){let terminals=0;const walk=history=>{const r=narrowingReplay(id,history);if(r.branches.zero.checked&&r.branches.succ.checked){terminals++;assert.equal(r.branches.zero.result,true);assert.equal(r.branches.succ.result,false);return;}for(const kind of ['zero','succ']){const b=r.branches[kind];if(b.checked)continue;const action=`${['open','unify','eval','check'][b.stage]}:${kind}`,entry={action};if(b.stage===3)entry.guess=(kind==='zero')===narrowingCases[id].goal;walk([...history,entry]);}};walk([]);assert.equal(terminals,70);}
});
test('restore rejects forged or out-of-order choices and completion needs all four cases',()=>{
 const s=narrowingCreate();assert.equal(narrowingComplete(s),false);assert.throws(()=>narrowingReplay('waitZero',[{action:'bind:zero'}]));assert.throws(()=>narrowingReplay('narrowLight',[{action:'open:zero'},{action:'eval:zero'}]));for(const id of Object.keys(narrowingCases)){s.selected=id;if(narrowingCases[id].mode==='wait'){for(const a of ['try',`bind:${narrowingCases[id].external}`,'eval'])narrowingStep(s,a);s.guess=narrowingCases[id].external==='zero';narrowingStep(s,'check');}else for(const kind of ['zero','succ']){for(const op of ['open','unify','eval'])narrowingStep(s,`${op}:${kind}`);s.guess=(kind==='zero')===narrowingCases[id].goal;narrowingStep(s,`check:${kind}`);}}s.answer='wait-branch';s.checked=true;assert.ok(narrowingComplete(s));const out=narrowingRestore(s);out.trials.waitZero.pop();assert.notEqual(out.trials.waitZero.length,s.trials.waitZero.length);
});
