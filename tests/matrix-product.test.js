import test from 'node:test';
import assert from 'node:assert/strict';
import {multiplyMatrices,productMatrices,productCases,productResult,productCorrect,productsComplete,createProducts,restoreProducts} from '../src/matrix-product.js';

test('rectangular products calculate row by column and respect operand order',()=>{
  assert.deepEqual(productResult('ab'),[[1,2],[1,2]]);
  assert.deepEqual(productResult('ba'),[[1,2,0],[0,1,1],[1,3,1]]);
  assert.equal(productResult('ac'),null);
  assert.deepEqual(productResult('ca'),[[2,4,0],[0,1,1]]);
  assert.throws(()=>multiplyMatrices([[1],[1,2]],[[1]]));
  for(const a of Object.values(productMatrices))for(const b of Object.values(productMatrices)){
    const result=multiplyMatrices(a,b);assert.equal(result===null,a[0].length!==b.length);
    if(result)for(let i=0;i<a.length;i++)for(let j=0;j<b[0].length;j++)assert.equal(result[i][j],a[i].reduce((s,v,k)=>s+v*b[k][j],0));
  }
});
test('all predictions, including an undefined product, are required and old drafts are migrated',()=>{
  const s=createProducts();for(const id of Object.keys(productCases)){const r=productResult(id);s[id]={shape:r?`${r.length}x${r[0].length}`:'none',cell:r?String(r[0][0]):'none',checked:true};assert.ok(productCorrect(id,s[id]));}
  assert.ok(productsComplete(s));assert.deepEqual(restoreProducts(s),s);assert.equal(productsComplete(restoreProducts(undefined)),false);
  assert.equal(productCorrect('ac',{shape:'none',cell:'0',checked:true}),false);
  assert.throws(()=>restoreProducts({...s,ab:{shape:'99',cell:'1',checked:true}}));
});
