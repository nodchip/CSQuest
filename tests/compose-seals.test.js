import test from 'node:test';
import assert from 'node:assert/strict';
import {sealSpells,sealInputs,sealValue,composeSeal,createComposeSeals,restoreComposeSeals,composeSealsComplete,composeTrialComplete} from '../src/compose-seals.js';
test('composition applies first then second for every selection and both inputs',()=>{
 const expected={double:x=>2*x,increment:x=>x+1,square:x=>x*x};
 for(const a of Object.keys(sealSpells))for(const b of Object.keys(sealSpells))for(const x of sealInputs)assert.equal(sealValue([a,b],x),expected[b](expected[a](x)));
 const f=composeSeal('double','increment');assert.equal(f(1),3);assert.equal(f(3),7);assert.equal(composeSeal('increment','double')(3),8);
 assert.throws(()=>composeSeal('bad','double'));
});
test('seals persist independently of current selectors and both correctly tested tasks are required',()=>{
 const s=createComposeSeals();
 for(const [key,seal] of Object.entries({forward:['double','increment'],reverse:['increment','double']})){
  const t=s.trials[key];t.seal=seal;t.first='square';t.second='square';for(const x of sealInputs){t.predictions[x]=sealValue(seal,x);t.tested[x]=true;}assert.ok(composeTrialComplete(key,t));
 }
 s.answer='functions';s.checked=true;assert.ok(composeSealsComplete(restoreComposeSeals(s)));
 const bad=structuredClone(s);bad.trials.forward.seal=null;assert.throws(()=>restoreComposeSeals(bad));
 bad.trials.forward.seal=['double','increment'];bad.trials.forward.predictions[1]=8;assert.equal(composeSealsComplete(restoreComposeSeals(bad)),false);
});
