import test from 'node:test';
import assert from 'node:assert/strict';
import {participationCases,participationCreate,participationRestore} from '../src/inclusive-participation.js';
import {cycleCreate,cycleRestore} from '../src/inclusive-cycle.js';
test('each fixed participant request has an available response and explanation',()=>{for(const c of Object.values(participationCases)){assert.ok(c.request);assert.ok(c.why);assert.ok(Object.hasOwn(c.options,c.correct));}assert.equal(Object.keys(participationCases).length,3);});
test('old inclusive-design records migrate and independent choices are copied',()=>{const q=cycleCreate();delete q.participation;assert.deepEqual(cycleRestore(q).participation,participationCreate());const s=participationCreate();s.answers.text='adapt';const copy=participationRestore(s);copy.answers.text='';assert.equal(s.answers.text,'adapt');assert.throws(()=>participationRestore({...s,checked:{...s.checked,pace:true}}));});
