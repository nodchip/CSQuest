import test from 'node:test';
import assert from 'node:assert/strict';
import {conceptQuestions,createConceptEnrollment,conceptEnrollmentComplete,restoreConceptEnrollment} from '../src/conceptual-enrollment.js';

test('concept requires all five checked answers, including optional participation',()=>{
  const s=createConceptEnrollment();s.answers={entities:'both',relation:'join',attribute:'participation',maximum:'manyMany',minimum:'allowed'};
  assert.equal(conceptEnrollmentComplete(s),false);s.checked=true;assert.equal(conceptEnrollmentComplete(s),true);
  for(const [key,q] of Object.entries(conceptQuestions))for(const answer of Object.keys(q.choices).filter(x=>x!==q.correct))assert.equal(conceptEnrollmentComplete({...s,answers:{...s.answers,[key]:answer}}),false);
  const copy=restoreConceptEnrollment(s);copy.answers.minimum='bothRequired';assert.equal(s.answers.minimum,'allowed');
  assert.throws(()=>restoreConceptEnrollment({...s,answers:{...s.answers,relation:'unknown'}}));
  assert.throws(()=>restoreConceptEnrollment({...s,checked:'yes'}));
});
