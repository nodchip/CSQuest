import test from 'node:test';
import assert from 'node:assert/strict';
import {vectorLeft,vectorRight,vectorKeys,vectorAssignment,vectorCreate,vectorRestore,vectorDone} from '../src/parallel-vector-add.js';
test('all eight workers have independent indices and the two out of range workers skip',()=>{
 const expected=[[0,3],[1,6],[2,5],[3,8],[4,7],[5,10],[6,null],[7,null]];
 for(let b=0;b<2;b++)for(let l=0;l<4;l++){const r=vectorAssignment(b,l);assert.deepEqual([r.index,r.value],expected[4*b+l]);}
 assert.deepEqual(vectorLeft.map((x,i)=>x+vectorRight[i]),[3,6,5,8,7,10]);assert.throws(()=>vectorAssignment(2,0));assert.throws(()=>vectorAssignment(0,-1));
});
test('all workers and the independent execution reflection are required',()=>{
 const q=vectorCreate();q.seen=[...vectorKeys];q.reflection='independent';assert.equal(vectorDone(q),true);for(const k of vectorKeys)assert.equal(vectorDone({...q,seen:q.seen.filter(x=>x!==k)}),false);assert.equal(vectorDone({...q,reflection:'ordered'}),false);
});
test('draft records are copied and invalid indices and markers rejected',()=>{
 const q=vectorCreate();q.seen=['0:0'];const r=vectorRestore(q);r.seen.push('1:3');assert.deepEqual(q.seen,['0:0']);assert.throws(()=>vectorRestore({...q,seen:['0:0','0:0']}));assert.throws(()=>vectorRestore({...q,seen:['1:4']}));assert.throws(()=>vectorRestore({...q,index:8}));
});
