import {test} from 'node:test';
import assert from 'node:assert/strict';
import {codeCases,codeQuestCreate,codeQuestCheck,codeQuestDone,codeQuestRestore} from '../src/professional-code.js';
test('both cases require the applicable principle and a concrete next investigation',()=>{const q=codeQuestCreate();for(const [id,c] of Object.entries(codeCases)){q.selected=id;q.trials[id].guidance=c.guidance;q.trials[id].action='assume';assert.equal(codeQuestCheck(q),false);q.trials[id].action=c.action;assert.equal(codeQuestCheck(q),true);}q.reflection='automatic';assert.equal(codeQuestDone(q),false);q.reflection='guidance';assert.equal(codeQuestDone(q),true);});
test('restore validates and copies records',()=>{const q=codeQuestCreate();q.trials.keyboard={guidance:'access',action:'test',checked:true};const r=codeQuestRestore(q);r.trials.keyboard.action='assume';assert.equal(q.trials.keyboard.action,'test');assert.throws(()=>codeQuestRestore(r));});
