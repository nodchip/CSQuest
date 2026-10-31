import test from 'node:test';
import assert from 'node:assert/strict';
import {validationOutcome,createValidation,restoreValidation,validationComplete} from '../src/control-validation.js';
test('each configuration distinguishes legitimate and attacker access',()=>{
 for(const id of ['backup','message']){assert.equal(validationOutcome(id,'fixed','legitimate'),true);assert.equal(validationOutcome(id,'fixed','attacker'),false);assert.equal(validationOutcome(id,'blocked','legitimate'),false);assert.equal(validationOutcome(id,'blocked','attacker'),false);assert.equal(validationOutcome(id,'broken','attacker'),true);}assert.equal(validationOutcome('backup','broken','legitimate'),true);assert.equal(validationOutcome('message','broken','legitimate'),false);assert.throws(()=>validationOutcome('backup','other','attacker'));
});
test('both actors must be tested before and after repair and drafts are independent',()=>{
 const s=createValidation();for(const id of ['backup','message']){s.options[id]='fixed';s.tests[id].broken=['legitimate','attacker'];s.tests[id].fixed=['legitimate','attacker'];}s.answer='both';s.checked=true;assert.equal(validationComplete(s),true);const copy=restoreValidation(s);copy.tests.backup.fixed.pop();assert.equal(validationComplete(copy),false);assert.equal(validationComplete(s),true);assert.throws(()=>restoreValidation({...s,options:{backup:'unknown',message:'fixed'}}));
});
