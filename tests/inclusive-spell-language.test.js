import test from 'node:test';
import assert from 'node:assert/strict';
import {createInclusiveSpell,spellEvaluate,spellRun,spellComplete,restoreInclusiveSpell} from '../src/inclusive-spell-language.js';
test('the three design choices independently change their respective observations',()=>{const base=createInclusiveSpell(),before=spellEvaluate(base.options);for(const k of Object.keys(base.options)){const after=spellEvaluate({...base.options,[k]:true});for(const field of Object.keys(base.options))assert.equal(after[field]!==before[field],field===k);}});
test('completion requires both observed configurations and the reflection',()=>{let s=spellRun(createInclusiveSpell());assert.equal(s.baseline,true);s.options={language:true,label:true,date:true};s=spellRun(s);s.answer='one';s.checked=true;assert.equal(spellComplete(s),false);s.answer='choice';assert.equal(spellComplete(s),true);assert.deepEqual(restoreInclusiveSpell(s),s);assert.throws(()=>restoreInclusiveSpell({...s,options:{}}));});
