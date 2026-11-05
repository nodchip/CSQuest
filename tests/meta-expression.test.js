import test from 'node:test';
import assert from 'node:assert/strict';
import {metaExpressions,metaTransform,metaEvaluate,createMetaLab,restoreMetaLab} from '../src/meta-expression.js';
import {reflectionCreate,reflectionRestore} from '../src/reflection-menu.js';
test('both rewrites return expected syntax and counterexample only appears for x times zero with input two',()=>{const before=JSON.stringify(metaExpressions);for(const e of ['add0','mul1','mul0'])for(const rule of ['safe','naive'])for(const x of [0,2]){const r=metaEvaluate(e,rule,x);assert.equal(r.equal,!(e==='mul0'&&rule==='naive'&&x===2));assert.equal(r.output,e==='mul0'&&rule==='safe'?'zero':'x');}assert.equal(JSON.stringify(metaExpressions),before);assert.throws(()=>metaTransform('bad','safe'));});
test('old reflection drafts migrate and separate histories are validated',()=>{const q=reflectionCreate();delete q.meta;assert.deepEqual(reflectionRestore(q).meta,createMetaLab());const m=createMetaLab();m.seen=['mul0:naive:2'];const n=restoreMetaLab(m);n.seen.push('add0:safe:0');assert.equal(m.seen.length,1);assert.throws(()=>restoreMetaLab({...m,seen:['bad']}));});
