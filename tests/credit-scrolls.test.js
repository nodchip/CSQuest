import {test} from 'node:test';
import assert from 'node:assert/strict';
import {creditCases,creditChoices,createCredit,creditCorrect,creditComplete,restoreCredit} from '../src/credit-scrolls.js';
test('each fixed case accepts only its matching checked correction',()=>{for(const id of Object.keys(creditCases))for(const choice of Object.keys(creditChoices)){const s=createCredit();s.answers[id]={choice,checked:true};assert.equal(creditCorrect(s,id),choice===creditCases[id].answer);s.answers[id].checked=false;assert.equal(creditCorrect(s,id),false);}});
test('all four cases are necessary and restored choices are copied',()=>{const s=createCredit();for(const id of Object.keys(creditCases))s.answers[id]={choice:creditCases[id].answer,checked:true};const copy=restoreCredit(s);s.answers.direct.checked=false;assert.equal(creditComplete(s),false);assert.equal(creditComplete(copy),true);assert.throws(()=>restoreCredit({...copy,selected:'unknown'}),RangeError);});
