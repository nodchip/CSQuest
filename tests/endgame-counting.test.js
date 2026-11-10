import test from 'node:test';
import assert from 'node:assert/strict';
import {replayCounting} from '../src/endgame-counting.js';

test('product and disjoint alternatives count all distinct choices',()=>{
 const p=(a,b)=>Array.from({length:a},(_,i)=>Array.from({length:b},(_,j)=>`pick:A:${i}:${j}`)).flat();
 assert.equal(replayCounting('gear',['pick:A:0:0','pick:A:0:0']),null);
 assert.equal(replayCounting('gear',['pick:A:0:0','pick:A:00:0']),null);
 assert.equal(replayCounting('gear',['pick:B:0','check']),null);
 const h=[...p(2,3),'check',...p(3,2),'check','pick:A:0','pick:A:1','pick:B:0','pick:B:1','pick:B:2','check'];
 assert.equal(replayCounting('gear',h).done,true);
});
test('role order distinguishes six and twelve from three and six',()=>{
 const pair=(n,ordered)=>Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i!==j&&(ordered||i<j)?`pair:${i}:${j}`:null).filter(Boolean)).flat();
 assert.equal(replayCounting('roles',['pair:0:0']),null);
 const h=[...pair(3,true),'check',...pair(3,false),'check',...pair(4,true),'check',...pair(4,false),'check'];
 assert.equal(replayCounting('roles',h).done,true);
 assert.equal(replayCounting('roles',[...pair(3,true),'check','pair:0:1','pair:1:0']),null);
});
test('pigeonholes distinguish guarantee from a counterexample',()=>{
 const first=['put:0','put:1','put:2','put:0','check'];
 assert.equal(replayCounting('pigeon',[...first,'put:0','put:0','put:1','check']),null);
 assert.equal(replayCounting('pigeon',[...first,'put:0','put:1','put:2','check','put:0','put:1','put:1','check']).done,true);
 assert.equal(replayCounting('pigeon',['put:3']),null);
});
