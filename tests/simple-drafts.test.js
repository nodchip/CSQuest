import test from 'node:test';
import assert from 'node:assert/strict';
import {restoreAccess,restoreCatalog,restoreJoin,restoreClassification,restoreEvaluation} from '../src/simple-drafts.js';

test('access, catalog and join recompute results and reject invalid selections',()=>{
  const access=restoreAccess({policy:{keeper:['records'],courier:[],visitor:[]},tested:true});assert.ok(access.results.some(row=>!row.correct));
  assert.throws(()=>restoreAccess({policy:{keeper:['records','records'],courier:[],visitor:[]},tested:false}),RangeError);
  const catalog=restoreCatalog({filters:{herb:true},index:1,tested:true});assert.equal(catalog.index,1);assert.ok(catalog.results.some(row=>!row.correct));
  assert.throws(()=>restoreCatalog({filters:{herb:'yes'},index:0,tested:false}),RangeError);
  const join=restoreJoin({selections:{O1:'V1',O4:'none'},tested:true});assert.equal(join.results[0].correct,true);assert.equal(join.results[3].correct,true);
  assert.throws(()=>restoreJoin({selections:{O1:'V9'},tested:false}),RangeError);
});
test('classification remembers a correct earlier choice even after a wrong attempt',()=>{
  const restored=restoreClassification({index:0,attempts:[{solved:'A',last:'B'},{solved:null,last:null}]});
  assert.equal(restored.solved[0],true);assert.equal(restored.results[0].correct,false);
  assert.throws(()=>restoreClassification({index:0,attempts:[{solved:'B',last:'B'},{solved:null,last:null}]}),RangeError);
});
test('evaluation reconstructs only the requested sets',()=>{
  const state=restoreEvaluation({known:true,heldout:false});assert.equal(state.known.correct,3);assert.equal(state.heldout,null);
  assert.throws(()=>restoreEvaluation({known:true,heldout:'yes'}),RangeError);
});
