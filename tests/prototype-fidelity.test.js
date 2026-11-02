import {test} from 'node:test';
import assert from 'node:assert/strict';
import {prototypeOptions,prototypeScenes,prototypeCreate,prototypeStep,prototypeComplete,prototypeRestore} from '../src/prototype-fidelity.js';

test('both investigation goals require all comparisons and the reflection',()=>{const q=prototypeCreate();for(const [id,scene] of Object.entries(prototypeScenes)){q.scene=id;assert.throws(()=>prototypeStep(q,`choose:${scene.best}`));for(const option of Object.keys(prototypeOptions)){prototypeStep(q,`inspect:${option}`);assert.deepEqual(prototypeRestore(q),q);}const wrong=Object.keys(prototypeOptions).find(x=>x!==scene.best);prototypeStep(q,`choose:${wrong}`);assert(!prototypeComplete(q));prototypeStep(q,`choose:${scene.best}`);}assert(!prototypeComplete(q));q.answer='purpose';assert(prototypeComplete(q));});
test('saved state rejects unknown, repeated and prematurely chosen options',()=>{const q=prototypeCreate();for(const bad of [{...q,inspected:{...q.inspected,early:['paper','paper']}},{...q,choices:{...q.choices,later:'paper'}},{...q,scene:'other'}])assert.throws(()=>prototypeRestore(bad));});
