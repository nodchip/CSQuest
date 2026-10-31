import test from 'node:test';
import assert from 'node:assert/strict';
import {createProcessPages,processPageStep,processPagesComplete,restoreProcessPages} from '../src/process-pages.js';
test('identical virtual pages can refer to private or shared physical frames',()=>{const s=createProcessPages();for(const [id,bValue,aValue] of [['private',0,7],['shared',7,3]]){let t=s.trials[id];t=processPageStep(t,'a-write');assert.equal(processPageStep(t,'b-read',id==='private'?7:0),null);t=processPageStep(t,'b-read',bValue);t=processPageStep(t,'b-write');t=processPageStep(t,'a-read',aValue);assert.equal(t.stage,'done');s.trials[id]=t;}s.answer='mapping';s.checked=true;assert.equal(processPagesComplete(s),true);assert.deepEqual(restoreProcessPages(s),s);});
test('replay rejects a forged read or invalid history',()=>{const s=createProcessPages();assert.throws(()=>restoreProcessPages({...s,trials:{...s.trials,private:{...s.trials.private,history:[['a-write',null],['b-read',7]]}}}));});
