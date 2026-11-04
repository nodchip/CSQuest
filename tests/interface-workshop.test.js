import {test} from 'node:test';
import assert from 'node:assert/strict';
import {interfaceCases,interfaceCreate,interfaceObserve,interfaceDone,interfaceRestore} from '../src/interface-workshop.js';

test('each comparison needs both observations and the relevant explanation',()=>{const q=interfaceCreate();for(const id of Object.keys(interfaceCases)){q.selected=id;for(const variant of ['weak','improved']){q.variant=variant;assert.ok(interfaceObserve(q));}q.answers[id]=interfaceCases[id].expected;}assert.equal(interfaceDone(q),false);q.reflection='test';assert.equal(interfaceDone(q),true);q.seen.icon.weak=false;assert.equal(interfaceDone(q),false);});
test('restoration rejects malformed answers and copies nested observations',()=>{const q=interfaceCreate();q.seen.window.weak=true;const r=interfaceRestore(q);r.seen.window.weak=false;assert.equal(q.seen.window.weak,true);assert.throws(()=>interfaceRestore({...q,answers:{...q.answers,menu:'label'}}));assert.throws(()=>interfaceRestore({...q,selected:'missing'}));});
