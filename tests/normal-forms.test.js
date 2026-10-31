import test from 'node:test';
import assert from 'node:assert/strict';
import {createNormalForms,normalOutput,normalTarget,normalValid,normalFormsComplete,restoreNormalForms} from '../src/normal-forms.js';
test('canonical DNF and CNF agree with the target for every input',()=>{const s=createNormalForms();for(const [id,mask] of [['dnf',6],['cnf',9]]){for(let row=0;row<4;row++)assert.equal(normalOutput(id,mask,row),normalTarget(row));s.trials[id]={mask,observed:[0,1,2,3],done:true};}s.answer='same';s.checked=true;assert.equal(normalFormsComplete(s),true);assert.deepEqual(restoreNormalForms(s),s);});
test('each normal form has one matching selection among all 16 and invalid saves fail',()=>{for(const id of ['dnf','cnf']){const valid=Array.from({length:16},(_,mask)=>mask).filter(mask=>normalValid(id,mask));assert.deepEqual(valid,[id==='dnf'?6:9]);}const s=createNormalForms();assert.throws(()=>restoreNormalForms({...s,trials:{...s.trials,dnf:{mask:0,observed:[0,1,2,3],done:true}}}));});
