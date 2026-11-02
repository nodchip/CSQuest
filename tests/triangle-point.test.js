import {test} from 'node:test';
import assert from 'node:assert/strict';
import {trianglePointResult,trianglePointCreate,trianglePointComplete,trianglePointRestore} from '../src/triangle-point.js';

test('all integer points match independent triangle inequalities and vertex cases',()=>{
 for(let x=0;x<=4;x++)for(let y=0;y<=3;y++){
  const outside=x*3<y||x+y>4,vertex=(x===0&&y===0)||(x===4&&y===0)||(x===1&&y===3),edge=y===0||x*3===y||x+y===4;
  const expected=outside?'outside':vertex?'vertex':edge?'edge':'inside';const r=trianglePointResult(x,y);assert.equal(r.status,expected,`${x},${y}`);assert.equal(r.sides.reduce((a,b)=>a+b,0),12);
 }
 assert.deepEqual(trianglePointResult(1,1),{sides:[4,6,2],status:'inside'});assert.deepEqual(trianglePointResult(3,2),{sides:[8,-3,7],status:'outside'});assert.throws(()=>trianglePointResult(1.5,1));
});
test('all four placements must be checked and restored independently',()=>{
 const q=trianglePointCreate();q.trials.inside={x:1,y:1,checked:true};q.trials.edge={x:2,y:0,checked:true};q.trials.vertex={x:0,y:0,checked:true};q.trials.outside={x:3,y:2,checked:true};assert.equal(trianglePointComplete(q),true);const copy=trianglePointRestore(q);copy.trials.inside.x=4;assert.equal(trianglePointComplete(q),true);assert.equal(trianglePointComplete(copy),false);assert.throws(()=>trianglePointRestore(copy));
});
