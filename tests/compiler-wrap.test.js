import {test} from 'node:test';
import assert from 'node:assert/strict';
import {compilerWrapModes,compilerWrapInputs,compilerWrapRun,compilerWrapCreate,compilerWrapCheck,compilerWrapComplete,compilerWrapRestore} from '../src/compiler-wrap.js';

test('all signed 8-bit values preserve semantics with the guard but not unconditional opening',()=>{
 const failures=[];for(let n=-128;n<=127;n++){const expected=n===127?-128:n+1;for(const mode of Object.keys(compilerWrapModes)){const r=compilerWrapRun(mode,n);assert.equal(r.sum,expected);assert.equal(r.source,n!==127);assert.equal(r.target,mode==='fold'?true:n!==127);if(mode==='fold'&&!r.equal)failures.push(n);else if(mode!=='fold')assert.equal(r.equal,true);}}assert.deepEqual(failures,[127]);assert.throws(()=>compilerWrapRun('guard',128));assert.throws(()=>compilerWrapRun('bad',0));
});
test('both predictions for each required boundary and the reflection are validated on restore',()=>{
 const q=compilerWrapCreate();for(const mode of ['fold','guard'])for(const value of compilerWrapInputs){q.mode=mode;q.input=value;const t=q.trials[mode][value],r=compilerWrapRun(mode,value);t.source=!r.source;t.target=r.target;assert.equal(compilerWrapCheck(q),false);t.source=r.source;assert.equal(compilerWrapCheck(q),true);assert.deepEqual(compilerWrapRestore(q),q);}assert.equal(compilerWrapComplete(q),false);q.answer='wrap';assert.equal(compilerWrapComplete(q),true);const bad=structuredClone(q);bad.trials.fold[127].source=true;assert.throws(()=>compilerWrapRestore(bad));
});
