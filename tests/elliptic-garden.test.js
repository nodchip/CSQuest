import test from 'node:test';
import assert from 'node:assert/strict';
import {curveGenerator,curvePoints,pointId,addCurvePoints,curveMultiple,curveExchange,createEllipticGarden,ellipticGardenComplete,restoreEllipticGarden} from '../src/elliptic-garden.js';
test('the curve contains 18 affine points and a cyclic group of order 19',()=>{
 const points=curvePoints(),generated=Array.from({length:19},(_,i)=>pointId(curveMultiple(i)));
 assert.equal(points.length,19);assert.equal(new Set(generated).size,19);assert.deepEqual(new Set(generated),new Set(points.map(pointId)));
 assert.equal(curveMultiple(19),null);assert.deepEqual(curveMultiple(2),{x:6,y:3});
 assert.deepEqual(addCurvePoints(curveGenerator,curveMultiple(18)),{point:null,kind:'inverse',slope:null});
});
test('all pairs agree with cyclic group addition and all 324 exchanges agree',()=>{
 for(let a=0;a<19;a++)for(let b=0;b<19;b++){
  assert.equal(pointId(addCurvePoints(curveMultiple(a),curveMultiple(b)).point),pointId(curveMultiple((a+b)%19)));
  if(a&&b){const exchange=curveExchange(a,b);assert.equal(pointId(exchange.sharedA),pointId(exchange.sharedB));assert.equal(pointId(exchange.sharedA),pointId(curveMultiple(a*b%19)));}
 }
});
test('completion and saved choices are validated',()=>{
 const s=createEllipticGarden();s.observed=['identity','inverse','doubling','generic','discrete','shared'];s.answer='small';s.checked=true;assert.ok(ellipticGardenComplete(restoreEllipticGarden(s)));
 assert.throws(()=>restoreEllipticGarden({...s,additionGuess:'0,0'}));assert.throws(()=>restoreEllipticGarden({...s,m:19}));
});
