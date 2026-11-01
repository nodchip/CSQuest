import test from 'node:test';
import assert from 'node:assert/strict';
import {imageStorageCases,imageStorageSize,imageStorageCreate,imageStorageComplete,imageStorageRestore} from '../src/image-storage.js';
test('four uncompressed image and video sizes use pixel channels and frames',()=>{assert.deepEqual(Object.values(imageStorageCases).map(imageStorageSize),[192,256,384,5760]);assert.equal(imageStorageSize(imageStorageCases.video),30*imageStorageSize(imageStorageCases.rgb));});
test('each correct checked case is required and drafts are copied and validated',()=>{const s=imageStorageCreate();for(const [id,c] of Object.entries(imageStorageCases))s.trials[id]={answer:imageStorageSize(c),checked:true};assert.equal(imageStorageComplete(s),true);const restored=imageStorageRestore(s);restored.trials.rgb.checked=false;assert.equal(imageStorageComplete(restored),false);assert.equal(s.trials.rgb.checked,true);s.trials.wide.answer=99;assert.throws(()=>imageStorageRestore(s));});
