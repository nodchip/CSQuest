import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {replayGardenConstraint as replay} from '../src/endgame-garden-constraint.js';
test('chain propagation and two-color triangle failure',()=>{const c=replay('chain',['revise:BC','revise:AB','check']);assert.deepEqual(c.domains,{A:['red'],B:['blue'],C:['red']});assert.equal(c.done,true);const t=replay('triangle',['try:red','try:blue','answer:none']);assert.equal(t.done,true);assert.deepEqual(t.tried,['red','blue']);});
test('all six three-color assignments accepted and invalid or premature histories rejected',()=>{for(const a of ['red','blue','green'])for(const b of ['red','blue','green'])for(const c of ['red','blue','green']){if(new Set([a,b,c]).size!==3)continue;assert.equal(replay('three',[`set:A:${a}`,`set:B:${b}`,`set:C:${c}`,'check']).done,true);}assert.equal(replay('chain',['revise:AB']),null);assert.equal(replay('triangle',['try:red','answer:none']),null);assert.equal(replay('three',['set:A:red','set:B:red']),null);assert.equal(replay('chain',['revise:BC','revise:AB','check','reset']),null);assert.deepEqual(replay('triangle',['try:red','reset']).tried,[]);});
test('independent exhaustive triangle assignments and arc support',()=>{
 const valid=cs=>cs.flatMap(a=>cs.flatMap(b=>cs.map(c=>[a,b,c]))).filter(([a,b,c])=>a!==b&&b!==c&&a!==c);
 assert.equal(valid(['red','blue']).length,0);assert.equal(valid(['red','blue','green']).length,6);
 for(const a of ['red','blue'])assert.ok(['red','blue'].some(b=>a!==b));
});
