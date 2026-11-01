import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spaceInitial,spaceOperations,spaceTargets,spaceTransform,spaceReplay,spaceMatches,createTransformSpace,transformSpaceComplete,restoreTransformSpace} from '../src/transform-space.js';

test('右手系の各回転、移動および４つの目標',()=>{
 assert.deepEqual(spaceTransform(spaceInitial,'rz'),[[0,1,0],[-1,0,1]]);
 assert.deepEqual(spaceTransform(spaceInitial,'rx'),[[1,0,0],[0,-1,1]]);
 assert.deepEqual(spaceTransform(spaceInitial,'ry'),[[0,0,-1],[1,1,0]]);
 for(const [target,ops] of Object.entries({flat:['rz'],tilt:['rx'],sideways:['ry'],order:['rz','tx']}))assert.ok(spaceMatches(target,ops));
 assert.notDeepEqual(spaceReplay(['tx','rz']),spaceReplay(['rz','tx']));assert.equal(spaceMatches('order',['tx','rz']),false);
 for(const op of ['rz','rx','ry'])assert.deepEqual(spaceReplay([op,op,op,op]),spaceInitial);
});
test('操作列を同次座標の行列積による計算と照合する',()=>{
 const matrices={rz:[[0,-1,0,0],[1,0,0,0],[0,0,1,0],[0,0,0,1]],rx:[[1,0,0,0],[0,0,-1,0],[0,1,0,0],[0,0,0,1]],ry:[[0,0,1,0],[0,1,0,0],[-1,0,0,0],[0,0,0,1]],tx:[[1,0,0,1],[0,1,0,0],[0,0,1,0],[0,0,0,1]]};
 const multiply=(m,v)=>m.map(row=>row.reduce((a,n,i)=>a+n*v[i],0));
 let sequences=[[]];for(let i=0;i<4;i++)sequences.push(...sequences.filter(x=>x.length===i).flatMap(x=>spaceOperations.map(op=>[...x,op])));
 for(const ops of sequences){const expected=spaceInitial.map(p=>ops.reduce((v,op)=>multiply(matrices[op],v),[...p,1]).slice(0,3));assert.deepEqual(spaceReplay(ops),expected);}
});
test('４目標と振り返りが必要で、途中記録は検証して複製する',()=>{
 const s=createTransformSpace();s.solved=Object.keys(spaceTargets);s.answer='extra';assert.equal(transformSpaceComplete(s),false);s.checked=true;assert.equal(transformSpaceComplete(s),true);
 const r=restoreTransformSpace(s);r.solved.pop();assert.equal(s.solved.length,4);
 for(const p of [{target:'bad'},{history:['bad']},{history:Array(13).fill('rz')},{solved:['flat','flat']},{answer:'bad'},{checked:1}])assert.throws(()=>restoreTransformSpace({...s,...p}),RangeError);
});
