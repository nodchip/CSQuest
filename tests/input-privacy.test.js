import {test} from 'node:test';
import assert from 'node:assert/strict';
import {privacyScenes,privacyCreate,privacyStep,privacyComplete,privacyRestore} from '../src/input-privacy.js';

test('each situation requires inspection and an appropriate option before reflection',()=>{
 const q=privacyCreate();for(const [id,scene] of Object.entries(privacyScenes)){q.scene=id;assert.throws(()=>privacyStep(q,`choose:${scene.best}`));for(const k of Object.keys(scene.options)){privacyStep(q,`inspect:${k}`);assert.deepEqual(privacyRestore(q),q);}const bad=Object.keys(scene.options).find(k=>k!==scene.best);privacyStep(q,`choose:${bad}`);assert(!privacyComplete(q));privacyStep(q,`choose:${scene.best}`);}assert(!privacyComplete(q));q.answer='limits';assert(privacyComplete(q));
});
test('saved state rejects unknown, duplicated and premature choices',()=>{
 const q=privacyCreate();for(const bad of [{...q,inspected:{...q.inspected,crowd:['touch','touch']}},{...q,choices:{...q.choices,crowd:'touch'}},{...q,inspected:{...q.inspected,ar:['camera']}},{...q,scene:'unknown'}])assert.throws(()=>privacyRestore(bad));
});
