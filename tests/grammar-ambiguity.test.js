import test from 'node:test';
import assert from 'node:assert/strict';
import {ambiguityCases,ambiguitySides,ambiguityResult,createAmbiguity,ambiguityCorrect,ambiguityComplete,restoreAmbiguity} from '../src/grammar-ambiguity.js';
test('each unparenthesized expression has the two different binary groupings',()=>{
 for(const [id,c] of Object.entries(ambiguityCases)){const [a,b,d]=c.values,left=ambiguityResult(id,'left'),right=ambiguityResult(id,'right');assert.equal(left.result,(a-b)-d);assert.equal(right.result,a-(b-d));assert.notEqual(left.expression,right.expression);assert.notEqual(left.result,right.result);}
 assert.throws(()=>ambiguityResult('bad','left'));assert.throws(()=>ambiguityResult('moon','bad'));
});
test('both trees and both explanations must be confirmed in each case',()=>{
 const s=createAmbiguity();for(const [id,t] of Object.entries(s.trials)){t.seen=Object.keys(ambiguitySides);t.meaning='ambiguous';t.fix='either';t.checked=true;assert.equal(ambiguityCorrect(id,t),false);t.fix='left';assert.equal(ambiguityCorrect(id,t),true);}assert.equal(ambiguityComplete(s),true);assert.deepEqual(restoreAmbiguity(s),s);const copy=restoreAmbiguity(s);copy.trials.moon.seen.pop();assert.equal(ambiguityComplete(copy),false);assert.equal(s.trials.moon.seen.length,2);assert.throws(()=>restoreAmbiguity({...s,selected:'bad'}));
});
