import {productCases,productResult} from '../src/matrix-product.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {matrixCases,applyMatrix,matrixDet,matrixCorrect,createMatrix,restoreMatrix,matrixComplete} from '../src/matrix.js';

test('all 81 matrices preserve vector addition and match target columns',()=>{
  const solutions=Object.fromEntries(Object.keys(matrixCases).map(id=>[id,0]));
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(let c=-1;c<=1;c++)for(let d=-1;d<=1;d++){
    const m=[a,b,c,d],first=applyMatrix(m,[1,0]),second=applyMatrix(m,[0,1]),sum=applyMatrix(m,[1,1]);
    assert.deepEqual(sum,[first[0]+second[0],first[1]+second[1]]);assert.equal(matrixDet(m),a*d-b*c);
    for(const [id,target] of Object.entries(matrixCases)){const expected=a===target.e1[0]&&c===target.e1[1]&&b===target.e2[0]&&d===target.e2[1];assert.equal(matrixCorrect(id,{matrix:m}),expected);if(expected)solutions[id]++;}
  }assert.deepEqual(solutions,{rotation:1,shear:1,collapse:1});
});
test('all three checked targets are required and singularity differs',()=>{
  const s=createMatrix();s.trials.rotation={matrix:[0,-1,1,0],cell:0,checked:true};s.trials.shear={matrix:[1,1,0,1],cell:0,checked:true};s.trials.collapse={matrix:[1,1,0,0],cell:0,checked:true};
  assert.deepEqual(Object.values(s.trials).map(x=>matrixDet(x.matrix)),[1,1,0]);assert.equal(matrixComplete(s),false);
  for(const id of Object.keys(productCases)){const r=productResult(id);s.products[id]={shape:r?`${r.length}x${r[0].length}`:'none',cell:r?String(r[0][0]):'none',checked:true};}
  assert.equal(matrixComplete(s),true);const {products,...old}=s;assert.equal(matrixComplete(restoreMatrix(old)),false);s.trials.rotation.checked=false;assert.equal(matrixComplete(s),false);
});
test('restoration copies the matrix and rejects invalid entries',()=>{
  const s=createMatrix(),restored=restoreMatrix(s);s.trials.rotation.matrix[0]=0;assert.equal(restored.trials.rotation.matrix[0],1);
  s.trials.rotation.matrix[0]=2;assert.throws(()=>restoreMatrix(s),RangeError);assert.throws(()=>applyMatrix([1,2],[1,2]),RangeError);
});
