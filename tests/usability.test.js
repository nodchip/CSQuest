import test from 'node:test';
import assert from 'node:assert/strict';
import {studyVisitors,studyQuestions,studyAnswers,studyAverage,createStudy,restoreStudy,studyComplete} from '../src/usability.js';
test('matched observations have the stated means while one visitor is slower on B',()=>{
  assert.equal(studyAverage('a'),22.5);assert.equal(studyAverage('b'),19.75);assert.ok(studyVisitors.rei.b>studyVisitors.rei.a);
  assert.equal(Object.values(studyVisitors).filter(v=>v.order==='Ａ → Ｂ').length,2);assert.equal(Object.values(studyVisitors).filter(v=>v.order==='Ｂ → Ａ').length,2);
});
test('all observations, deliberate checking, and all conclusions are required',()=>{
  const s=createStudy();s.observed=Object.keys(studyVisitors);s.answers={...studyAnswers};assert.equal(studyComplete(s),false);s.checked=true;assert.equal(studyComplete(s),true);
  for(const [id,q] of Object.entries(studyQuestions))for(const value of Object.keys(q.options))if(value!==studyAnswers[id])assert.equal(studyComplete({...s,answers:{...s.answers,[id]:value}}),false);
});
test('restoration rejects invalid observations and fabricated checks without all observations',()=>{
  const s=createStudy();s.observed=['rei'];assert.deepEqual(restoreStudy(s),s);assert.throws(()=>restoreStudy({...s,checked:true}),RangeError);assert.throws(()=>restoreStudy({...s,observed:['rei','rei']}),RangeError);assert.throws(()=>restoreStudy({...s,answers:{...s.answers,average:'unknown'}}),RangeError);
});
