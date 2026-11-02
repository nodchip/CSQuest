import {test} from 'node:test';
import assert from 'node:assert/strict';
import {pouchDesigns,pouchActions} from '../src/pouch-encapsulation.js';
import {oopFestivalCreate,oopFestivalTest,oopFestivalSignal,oopFestivalSignals,oopFestivalRequired,oopFestivalComplete,oopFestivalRestore} from '../src/oop-festival.js';

test('all bag trials preserve other bag and obey independent privacy and bounds checks',()=>{
 const q=oopFestivalCreate();for(const [design,d] of Object.entries(pouchDesigns)){q.design=design;for(const [action,a] of Object.entries(pouchActions)){const r=oopFestivalTest(q,action),target=action==='direct'?8:action==='withdraw'?-1:3+a.amount,blocked=action==='direct'?d.private:d.checked&&(target<0||target>5);assert.equal(r.blocked,blocked);assert.equal(r.a,blocked?3:target);assert.equal(r.b,1);assert.equal(r.valid,r.a>=0&&r.a<=5);}}
});
test('shared signal dispatch consumes each spirit separately and preserves the other',()=>{
 for(const order of [['a','c'],['c','a']]){const q=oopFestivalCreate();assert.equal(oopFestivalSignal(q,order[0]).result,order[0]==='a'?'red':'blue');let s=oopFestivalSignals(q.signals);assert.equal(s.objects[order[1]].charge,1);assert.equal(oopFestivalSignal(q,order[1]).result,order[1]==='a'?'red':'blue');assert.throws(()=>oopFestivalSignal(q,order[0]));}
});
test('required comparisons, both signals, safe design and reflection are required and restored',()=>{
 const q=oopFestivalCreate();for(const [d,a] of oopFestivalRequired){q.design=d;oopFestivalTest(q,a);assert.deepEqual(oopFestivalRestore(q),q);}q.design='hiddenChecked';q.answer='both';assert.equal(oopFestivalComplete(q),false);oopFestivalSignal(q,'a');oopFestivalSignal(q,'c');assert.equal(oopFestivalComplete(q),true);const bad=structuredClone(q);bad.signals=['a','a'];assert.throws(()=>oopFestivalRestore(bad));bad.signals=[];bad.last={design:'openLoose',action:'add'};assert.throws(()=>oopFestivalRestore(bad));
});
