import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyTypedRoutes,createTypedRoutes,checkTypedRoutes,typedRoutesComplete,restoreTypedRoutes} from '../src/typed-routes.js';
test('all 64 relations classify by per-input number of outputs',()=>{
 for(let a=0;a<8;a++)for(let b=0;b<8;b++){
  const bits=x=>[0,1,2].filter(i=>x&(1<<i));const aa=bits(a),bb=bits(b);
  const expected=!aa.length||!bb.length?'missing':aa.length>1||bb.length>1?'multiple':aa[0]===bb[0]?'same':'different';
  assert.equal(classifyTypedRoutes([a,b]),expected);
 }
 assert.throws(()=>classifyTypedRoutes([8,0]));
});
test('correct predictions across all four examples and both cardinalities are required',()=>{
 let s=createTypedRoutes();s.guess=true;assert.deepEqual(checkTypedRoutes(s).tested,[]);
 for(const [rows,guess] of [[[0,0],false],[[1,1],true],[[1,2],true],[[3,1],false]]){s.rows=rows;s.guess=guess;s=checkTypedRoutes(s);}
 assert.equal(typedRoutesComplete(s),false);s.forward=9;s.reverse=8;s.answer='total';s.checked=true;assert.ok(typedRoutesComplete(restoreTypedRoutes(s)));
 assert.throws(()=>restoreTypedRoutes({...s,tested:['same','same']}));
});
