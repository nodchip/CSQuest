import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createTestFirst,stepTestFirst,testFirstResult,testFirstComplete,restoreTestFirst} from '../src/test-first.js';
test('red, repair, green, tidy and rerun are required; boundary tests expose both initial defects',()=>{
 let s=createTestFirst();s=stepTestFirst(s,'rule:positive');assert.equal(s.rules.positive,false);for(const id of ['normal','zero','exact'])s=stepTestFirst(s,`test:${id}`);s=stepTestFirst(s,'run');assert.equal(s.sawRed,true);assert.equal(testFirstResult(s,'normal').pass,true);assert.equal(testFirstResult(s,'zero').pass,false);assert.equal(testFirstResult(s,'exact').pass,false);s=stepTestFirst(s,'rule:positive');s=stepTestFirst(s,'rule:inclusive');s=stepTestFirst(s,'run');assert.equal(testFirstComplete(s),false);s=stepTestFirst(s,'tidy');assert.equal(testFirstComplete(s),false);s=stepTestFirst(s,'run');assert.equal(testFirstComplete(s),true);s=stepTestFirst(s,'rule:positive');assert.equal(testFirstComplete(s),false);
});
test('restore replays state rather than trusting forged test results',()=>{
 let s=createTestFirst();s=stepTestFirst(s,'test:zero');s=stepTestFirst(s,'run');const copy=restoreTestFirst({...s,sawRed:false,rules:{positive:true,inclusive:true}});assert.equal(copy.sawRed,true);assert.equal(copy.rules.positive,false);assert.throws(()=>restoreTestFirst({history:['rule:bad']}),RangeError);
});
