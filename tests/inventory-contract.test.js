import {test} from 'node:test';
import assert from 'node:assert/strict';
import {contractRules,contractCases,contractResult,contractCasePass,createContract,contractComplete,restoreContract} from '../src/inventory-contract.js';

test('all rule combinations expose errors and exactly one satisfies the stated contract',()=>{
 const keys=Object.keys(contractRules),passing=[];for(let mask=0;mask<16;mask++){const rules=Object.fromEntries(keys.map((k,i)=>[k,!!(mask&(1<<i))]));if(Object.keys(contractCases).every(id=>contractCasePass(rules,id)))passing.push(mask);}
 assert.deepEqual(passing,[15]);const rules={integer:true,positive:true,enough:true,unchanged:true};assert.deepEqual(contractResult(rules,'excess'),{status:'insufficient',remaining:3});assert.deepEqual(contractResult(rules,'negative'),{status:'invalid',remaining:3});assert.deepEqual(contractResult(rules,'fraction'),{status:'invalid',remaining:3});assert.deepEqual(contractResult({...rules,integer:false},'fraction'),{status:'ok',remaining:1.5});
 assert.deepEqual(contractResult({...rules,unchanged:false},'negative'),{status:'invalid',remaining:4});assert.deepEqual(contractResult({...rules,enough:false},'excess'),{status:'ok',remaining:-2});
});
test('all cases must be run with current rules and restored state is copied',()=>{
 const s=createContract();s.rules={integer:true,positive:true,enough:true,unchanged:true};for(const id of Object.keys(contractCases))s.tested[id]=true;const copy=restoreContract(s);assert.equal(contractComplete(copy),true);s.rules.enough=false;assert.equal(contractComplete(copy),true);assert.equal(contractComplete(s),false);assert.throws(()=>restoreContract({rules:s.rules,tested:{}}),RangeError);const old=restoreContract({rules:{positive:true,enough:true,unchanged:true},tested:{normal:true,exact:true,excess:true,zero:true,negative:true}});assert.equal(old.rules.integer,false);assert.equal(old.tested.fraction,false);assert.equal(contractComplete(old),false);
});
