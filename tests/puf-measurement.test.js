import {test} from 'node:test';
import assert from 'node:assert/strict';
import {pufDistance,pufResults,createPuf,pufComplete,restorePuf} from '../src/puf-measurement.js';
test('zero and one mismatch thresholds expose false rejection and false acceptance',()=>{
 assert.deepEqual(pufResults(0).map(s=>[s.distance,s.accepted]),[[0,true],[1,false],[1,false],[3,false]]);
 assert.deepEqual(pufResults(1).map(s=>s.accepted),[true,true,true,false]);assert.throws(()=>pufDistance('bad','10110010'),RangeError);
});
test('both experiments and the checked comparison are required and saved data is copied',()=>{
 const s=createPuf();s.tested=[0,1];s.tradeoff='both';s.checked=true;const copy=restorePuf(s);assert.equal(pufComplete(copy),true);s.tested.pop();assert.equal(pufComplete(s),false);copy.tradeoff='safe';assert.equal(pufComplete(copy),false);assert.throws(()=>restorePuf({...s,tested:[0,0]}),RangeError);
});
