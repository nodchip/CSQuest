import test from 'node:test';
import assert from 'node:assert/strict';
import {tools} from '../src/types.js';
import {rescueInputs,rescueCreate,rescueSelect,rescueType,rescueRun,rescueComplete,rescueRestore} from '../src/type-rescue.js';

test('all tool pairs detect incompatible types and valid pairs produce the expected traces',()=>{
 const valid=new Set(['double,positive','positive,invert']);for(const a of Object.keys(tools))for(const b of Object.keys(tools)){const s=rescueCreate();s.sequence=[a,b];const ok=valid.has(`${a},${b}`);assert.equal(rescueType(s).ok,ok);for(let i=0;i<rescueInputs.length;i++){s.selected=i;const r=rescueRun(s);assert.equal(r.ok,ok);if(ok){const input=rescueInputs[i],expected=a==='double'?input>0:!(input>0);assert.equal(r.actual,expected);assert.equal(r.correct,r.actual===(input>0));assert.equal(r.trace.length,3);}}}
});
test('type safety, a specification failure and all repaired cases are required',()=>{
 const s=rescueCreate();assert.equal(rescueRun(s).ok,false);assert.equal(rescueType(s).ok,false);rescueSelect(s,0,'positive');rescueSelect(s,1,'invert');assert.ok(rescueType(s).ok);s.selected=0;assert.equal(rescueRun(s).correct,false);rescueSelect(s,0,'double');rescueSelect(s,1,'positive');assert.deepEqual(s.runs,[]);rescueType(s);for(let i=0;i<rescueInputs.length;i++){s.selected=i;assert.ok(rescueRun(s).correct);}s.answer='both';s.checked=true;assert.ok(rescueComplete(s));const copy=rescueRestore(s);copy.runs.pop();assert.equal(s.runs.length,5);assert.throws(()=>rescueRestore({...s,typeChecked:false}));
});
