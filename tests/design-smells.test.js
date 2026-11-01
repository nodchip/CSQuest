import test from 'node:test';
import assert from 'node:assert/strict';
import {designCases,runDesignCase,designSuite,createDesignSmells,designSmellsAct,restoreDesignSmells,designSmellsComplete} from '../src/design-smells.js';
const act=(s,a)=>{const r=designSmellsAct(s,a);assert.equal(r.ok,true,r.message);return r.state;};
test('both initial designs preserve the contract, while defects have distinct observable effects',()=>{
 assert.ok(designSuite('separate',false).every(t=>t.pass));assert.ok(designSuite('shared',false).every(t=>t.pass));
 const fee=designSuite('fee',false);assert.equal(fee.find(x=>x.id==='delivery1').actual.cost,10);assert.equal(fee.find(x=>x.id==='delivery1').wanted.cost,13);
 const late=designSuite('late',false).find(x=>x.id==='shortage');assert.deepEqual(late.actual,{accepted:false,stock:-1,cost:null});assert.deepEqual(late.wanted,{accepted:false,stock:2,cost:null});
 assert.throws(()=>runDesignCase('shared',false,{...designCases[0]}),RangeError);
});
test('changing only one duplicated rule misses the delivery boundary; shared rule updates both',()=>{
 const separate=designSuite('separate',true),shared=designSuite('shared',true);
 assert.equal(separate.find(x=>x.id==='shop3').pass,true);assert.equal(separate.find(x=>x.id==='delivery3').pass,false);
 assert.ok(shared.every(t=>t.pass));
});
test('all six comparisons and the right conclusion are needed; replay rejects tampering',()=>{
 let s=createDesignSmells();for(const v of ['separate','shared','fee','late'])for(const a of [`variant:${v}`,'run'])s=act(s,a);
 for(const v of ['separate','shared'])for(const a of [`variant:${v}`,'new','run'])s=act(s,a);
 for(const a of ['answer:separate','check'])s=act(s,a);assert.equal(designSmellsComplete(s),false);
 for(const a of ['answer:shared','check'])s=act(s,a);assert.equal(designSmellsComplete(s),true);
 assert.deepEqual(restoreDesignSmells(JSON.parse(JSON.stringify(s))),s);
 assert.throws(()=>restoreDesignSmells({history:['variant:unknown']}),RangeError);
});
