import {test} from 'node:test';
import assert from 'node:assert/strict';
import {casInitial,casExecute,casReplay,casCreate,casStep,casTrialDone,casComplete,casRestore} from '../src/cas-counter.js';

test('all finite CAS interleavings preserve successful update count and terminate with two',()=>{
 let leaves=0,failures=0;function explore(s){assert.equal(s.value,Object.values(s.workers).filter(w=>w.stage==='done').length);if(Object.values(s.workers).every(w=>w.stage==='done')){assert.equal(s.value,2);leaves++;if(Object.values(s.workers).some(w=>w.failed))failures++;return;}for(const id of ['A','B']){const w=s.workers[id];if(w.stage==='done')continue;const next=structuredClone(s);casExecute(next,`${w.stage==='ready'?'read':'swap'}:${id}`);explore(next);}}explore(casInitial('cas'));assert(leaves>1);assert(failures>0);
});
test('lock holder can block another; invalid release and forged histories fail',()=>{
 const s=casInitial('lock');casExecute(s,'acquire:A');casExecute(s,'acquire:B');assert.equal(s.owner,'A');assert(s.blocked);assert.equal(s.workers.B.stage,'ready');assert.throws(()=>casExecute(s,'release:A'));assert.throws(()=>casReplay('cas',['swap:A']));
});
test('both demonstrations and the system-wide progress reflection are required',()=>{
 const q=casCreate();for(const [id,actions] of [['lock',['acquire:A','acquire:B','read:A','write:A','release:A','acquire:B','read:B','write:B','release:B']],['cas',['read:A','read:B','swap:B','swap:A','read:A','swap:A']]]){q.selected=id;for(const a of actions){casStep(q,a);assert.deepEqual(casRestore(q),q);}assert(casTrialDone(id,q.trials[id]));}assert(!casComplete(q));q.answer='system';assert(casComplete(q));const bad=structuredClone(q);bad.trials.cas=['swap:A'];assert.throws(()=>casRestore(bad));
});
