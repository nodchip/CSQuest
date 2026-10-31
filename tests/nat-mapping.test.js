import test from 'node:test';
import assert from 'node:assert/strict';
import {createNat,natStep,natComplete,restoreNat} from '../src/nat-mapping.js';
test('two private clients share the outside address with distinct ports in either send order',()=>{
 for(const [first,second] of [['a','b'],['b','a']]){let s=createNat();s=natStep(s,'send',first);s=natStep(s,'send',second);assert.deepEqual(s.mappings,[{client:first,port:4000},{client:second,port:4001}]);const before=s.history.length;assert.equal(natStep(s,'reply',4000,second).history.length,before);s=natStep(s,'reply',4000,first);s=natStep(s,'reply',4001,second);s=natStep(s,'reply',4002,'none');s.reason='encryption';s.checked=true;assert.equal(natComplete(s),false);s.reason='mapping';assert.equal(natComplete(s),true);assert.deepEqual(restoreNat(s),s);}
});
test('repeat sends reuse the mapping and saved histories are validated',()=>{
 let s=createNat();s=natStep(s,'send','a');s=natStep(s,'send','a');assert.deepEqual(s.mappings,[{client:'a',port:4000}]);const copy=restoreNat(s);copy.history.push(['reply',4001,'a']);assert.throws(()=>restoreNat(copy));assert.equal(s.history.length,2);
});
