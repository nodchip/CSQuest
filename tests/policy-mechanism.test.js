import test from 'node:test';
import assert from 'node:assert/strict';
import {gatePeople,gateObjects,gateRules,gateMechanisms,gateBit,gateResults,createPolicyLab,restorePolicyLab,policyLabComplete} from '../src/policy-mechanism.js';
test('every grant mask is compared with both stated policies for every subject and object',()=>{
 assert.deepEqual(Object.keys(gatePeople).flatMap(p=>Object.keys(gateObjects).map(o=>gateBit(p,o))),[1,2,4,8]);
 for(const rule of Object.keys(gateRules))for(let mask=0;mask<16;mask++){const results=gateResults(rule,mask);assert.equal(results.length,4);assert.equal(results.every(r=>r.correct),mask===gateRules[rule].mask);for(const r of results)assert.equal(r.actual,Boolean(mask&gateBit(r.person,r.object)));}
});
test('both representations and policies must each be checked and match',()=>{
 const s=createPolicyLab();for(const id of Object.keys(gateRules))for(const m of Object.keys(gateMechanisms)){s.trials[id][m]=gateRules[id].mask;s.trials[id].checked[m]=true;}s.answer='policy';s.checked=true;assert.equal(policyLabComplete(s),true);s.trials.urgent.acl^=2;assert.equal(policyLabComplete(s),false);s.trials.urgent.acl^=2;const r=restorePolicyLab(s);r.trials.normal.checked.acl=false;assert.equal(s.trials.normal.checked.acl,true);assert.equal(policyLabComplete(r),false);assert.throws(()=>restorePolicyLab({...s,trials:{...s.trials,normal:{...s.trials.normal,acl:16}}}));
});
