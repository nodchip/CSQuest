import test from 'node:test';
import assert from 'node:assert/strict';
import {precisionBaseResult,createPrecisionBase,precisionBaseComplete,restorePrecisionBase} from '../src/precision-base.js';

test('all populations and policies give exact confusion counts and derived metrics',()=>{
 const expected={rare:{none:[0,0,10,90],strict:[5,9,5,81],wide:[9,36,1,54]},balanced:{none:[0,0,50,50],strict:[25,5,25,45],wide:[45,20,5,30]}};
 for(const pop of Object.keys(expected))for(const policy of Object.keys(expected[pop])){const r=precisionBaseResult(pop,policy);assert.deepEqual([r.tp,r.fp,r.fn,r.tn],expected[pop][policy]);assert.equal(r.precision,r.tp+r.fp?r.tp/(r.tp+r.fp):null);assert.equal(r.recall,r.tp/(r.tp+r.fn));assert.equal(r.fpr,r.fp/(r.fp+r.tn));assert.equal(r.accuracy,(r.tp+r.tn)/100);}
 assert.equal(precisionBaseResult('rare','strict').precision,5/14);assert.equal(precisionBaseResult('balanced','strict').precision,25/30);
});
test('all six observations and the correct interpretation are required',()=>{
 const s=createPrecisionBase();s.observed=['rare,none','rare,strict','rare,wide','balanced,none','balanced,strict','balanced,wide'];s.answer='composition';s.checked=true;const copy=restorePrecisionBase(s);assert.equal(precisionBaseComplete(copy),true);copy.observed.pop();assert.equal(s.observed.length,6);assert.equal(precisionBaseComplete(copy),false);assert.throws(()=>restorePrecisionBase({...s,observed:['rare,none','rare,none']}));
});
