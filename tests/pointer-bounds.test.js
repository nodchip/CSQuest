import {test} from 'node:test';
import assert from 'node:assert/strict';
import {boundsCases,boundsResult,createBounds,boundsComplete,restoreBounds} from '../src/pointer-bounds.js';

test('page permissions differ from a read-only capability for every byte of each access',()=>{
 assert.deepEqual(Object.keys(boundsCases).map(boundsResult),[
  {page:true,capability:true},{page:true,capability:false},
  {page:true,capability:false},{page:true,capability:false}
 ]);
 assert.throws(()=>boundsResult('unknown'),RangeError);
});
test('completion requires checked correct predictions for every case and draft restoration copies choices',()=>{
 const s=createBounds();for(const id of Object.keys(boundsCases))s.choices[id]={...boundsResult(id),checked:true};
 const copy=restoreBounds(s);assert.equal(boundsComplete(copy),true);s.choices.crossing.capability=true;
 assert.equal(boundsComplete(s),false);assert.equal(boundsComplete(copy),true);
 copy.choices.inside.checked=false;assert.equal(boundsComplete(copy),false);
 assert.throws(()=>restoreBounds({...s,selected:'unknown'}),RangeError);
});
