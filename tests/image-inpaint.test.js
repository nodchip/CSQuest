import test from 'node:test';
import assert from 'node:assert/strict';
import {inpaintCases,inpaintMissing,inpaintInitial,inpaintNext,inpaintValues,inpaintCreate,inpaintMaskCorrect,inpaintComplete,inpaintRestore} from '../src/image-inpaint.js';
test('Jacobi updates use previous iteration simultaneously and preserve known pixels',()=>{
 const a=inpaintInitial('even'),b=inpaintNext(a),c=inpaintNext(b);assert.deepEqual(inpaintMissing.map(i=>a[i]),[0,0]);assert.deepEqual(inpaintMissing.map(i=>b[i]),[3,3]);assert.deepEqual(inpaintMissing.map(i=>c[i]),[3.75,3.75]);assert.deepEqual(inpaintMissing.map(i=>inpaintValues('edge',1)[i]),[3.5,4.5]);assert.deepEqual(inpaintMissing.map(i=>inpaintValues('edge',2)[i]),[4.625,5.375]);
 for(const id of Object.keys(inpaintCases))for(let n=0;n<=8;n++){const a=inpaintValues(id,n);for(let i=0;i<25;i++)if(!inpaintMissing.includes(i))assert.equal(a[i],inpaintCases[id].pixels[i]);assert.ok(a.every(v=>v>=0&&v<=6));}const edge=inpaintValues('edge',8);assert.ok(Math.abs(edge[12]-74/15)<.001);assert.ok(Math.abs(edge[13]-86/15)<.001);assert.throws(()=>inpaintValues('edge',9));
});
test('completion needs both masks, six updates and checked ambiguity answer',()=>{
 const s=inpaintCreate();s.answer='ambiguous';s.checked=true;assert.equal(inpaintComplete(s),false);for(const id of Object.keys(inpaintCases))s.trials[id]={mask:[12,13],confirmed:true,steps:6};assert.equal(inpaintComplete(s),true);const copy=inpaintRestore(s);copy.trials.edge.mask.pop();assert.equal(inpaintMaskCorrect(copy.trials.edge),false);assert.equal(inpaintComplete(s),true);s.trials.edge.steps=9;assert.throws(()=>inpaintRestore(s));assert.throws(()=>inpaintRestore({...inpaintCreate(),trials:{even:{mask:[12,13],confirmed:false,steps:1}}}));
});
