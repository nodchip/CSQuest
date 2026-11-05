import test from 'node:test';
import assert from 'node:assert/strict';
import {visualStudyQuestions,visualStudyCreate,visualStudyCorrect,visualStudyRestore} from '../src/visual-study-plan.js';
import {createStudy,restoreStudy} from '../src/usability.js';
test('the selected plan needs each task, audience, measures, order, and limited interpretation',()=>{const s=visualStudyCreate();assert.equal(visualStudyCorrect(s),false);for(const [id,q] of Object.entries(visualStudyQuestions))s.answers[id]=q.correct;assert.equal(visualStudyCorrect(s),true);for(const [id,q] of Object.entries(visualStudyQuestions)){const wrong=Object.keys(q.options).find(v=>v!==q.correct);assert.equal(visualStudyCorrect({...s,answers:{...s.answers,[id]:wrong}}),false);}});
test('existing drafts migrate and plan choices restore independently',()=>{const old=createStudy();delete old.visualPlan;assert.deepEqual(restoreStudy(old).visualPlan,visualStudyCreate());const s=visualStudyCreate();s.answers.task='compare';const copy=visualStudyRestore(s);copy.answers.task='';assert.equal(s.answers.task,'compare');assert.throws(()=>visualStudyRestore({...s,answers:{...s.answers,task:'bad'}}));});
