import test from 'node:test';
import assert from 'node:assert/strict';
import {applicationViews,applicationCases,applicationCreate,applicationRestore} from '../src/visualization-applications.js';
import {vfCreate,vfRestore} from '../src/vector-field-map.js';
test('each fixed application has a distinct available representation and explanation',()=>{assert.equal(Object.keys(applicationCases).length,5);assert.deepEqual(new Set(Object.values(applicationCases).map(c=>c.correct)),new Set(Object.keys(applicationViews)));for(const c of Object.values(applicationCases)){assert.ok(c.prompt);assert.ok(c.why);}});
test('older wind drafts gain independent application records',()=>{const q=vfCreate();delete q.applications;assert.deepEqual(vfRestore(q).applications,applicationCreate());const s=applicationCreate();s.answers.flow='arrows';const restored=applicationRestore(s);restored.answers.flow='';assert.equal(s.answers.flow,'arrows');assert.throws(()=>applicationRestore({...s,checked:{...s.checked,medical:true}}));});
