import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mipBase,mipReduce,mipCenter,mipCreate,mipSetCell,mipGridCorrect,mipChooseLod,mipChooseGuess,mipCheck,mipRestore} from '../src/texture-mipmap.js';

test('block averages build a pyramid and center blends two bilinear samples',()=>{
 const level1=mipReduce(mipBase,4);assert.deepEqual(level1,[0,2,0,0]);assert.deepEqual(mipReduce(level1,2),[0.5]);
 assert.deepEqual([0,0.5,1].map(mipCenter),[0,0.25,0.5]);
 assert.throws(()=>mipReduce([1,2],2));assert.throws(()=>mipCenter(2));
});
test('incorrect grid and predictions can be retried; drafts remain independent',()=>{
 const s=mipCreate();for(let i=0;i<4;i++)mipSetCell(s,i,0);s.gridChecked=true;assert.equal(mipGridCorrect(s),false);
 mipSetCell(s,1,2);s.gridChecked=true;assert(mipGridCorrect(s));
 for(const [lod,value] of [[0,0],[0.5,0.25],[1,0.5]]){mipChooseLod(s,lod);mipChooseGuess(s,1);assert.equal(mipCheck(s),false);mipChooseGuess(s,value);assert(mipCheck(s));}
 const copy=mipRestore(s);copy.checked.pop();assert.equal(s.checked.length,3);assert.throws(()=>mipRestore({...s,checked:[0,0]}));assert.throws(()=>mipRestore({...s,feedback:true,guess:null}));
});
