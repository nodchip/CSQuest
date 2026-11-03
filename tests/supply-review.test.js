import test from 'node:test';
import assert from 'node:assert/strict';
import {supplyCases,supplyCreate,supplyCanTest,supplyCaseDone,supplyDone,supplyRestore} from '../src/supply-review.js';
test('each fictional dependency scenario requires the matching evidence and decision',()=>{
 const q=supplyCreate();for(const [id,c] of Object.entries(supplyCases)){const s=q.cases[id];s.path=s.integrity=s.advisory=true;s.tested=c.expected===c.received;assert.equal(supplyCanTest(id,s),s.tested);s.decision=c.decision;s.reason=c.reason;s.checked=true;assert.equal(supplyCaseDone(id,s),true);}
 q.reflection='limits';assert.equal(supplyDone(q),true);q.cases.old.reason='checks';assert.equal(supplyDone(q),false);
});
test('tampered artifacts cannot be tested and saved evidence is validated and copied',()=>{
 const q=supplyCreate(),s=q.cases.altered;s.path=s.integrity=true;assert.equal(supplyCanTest('altered',s),false);s.tested=true;assert.throws(()=>supplyRestore(q));s.tested=false;const copy=supplyRestore(q);copy.cases.old.path=true;assert.equal(q.cases.old.path,false);
});
