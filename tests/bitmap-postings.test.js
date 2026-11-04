import test from 'node:test';
import assert from 'node:assert/strict';
import {bitmapFromPostings,bitmapCombine,bitmapRuns,bitmapForOrder,createBitmapExercise,restoreBitmapExercise} from '../src/bitmap-postings.js';
import {postings,createWordIndex,restoreWordIndex} from '../src/word-index.js';

test('bitmap operations match set intersection and union for all four-document subsets',()=>{
 const ids=['a','b','c','d'];
 for(let x=0;x<16;x++)for(let y=0;y<16;y++){
  const left=ids.filter((_,i)=>x&(1<<i)),right=ids.filter((_,i)=>y&(1<<i));
  for(const kind of ['and','or']){
   const bits=bitmapCombine(bitmapFromPostings(left),bitmapFromPostings(right),kind);
   assert.deepEqual(ids.filter((_,i)=>bits[i]),ids.filter(id=>kind==='and'?left.includes(id)&&right.includes(id):left.includes(id)||right.includes(id)));
   assert.deepEqual(bitmapRuns(bits).flatMap(r=>Array(r.count).fill(r.bit)),bits);
  }
 }
 assert.deepEqual(bitmapFromPostings(postings('月草')),[1,1,0,0]);
 assert.deepEqual(bitmapRuns(bitmapFromPostings(postings('解毒'))),[{bit:1,count:1},{bit:0,count:3}]);
 assert.deepEqual(bitmapForOrder(['a','b'],'original'),[1,1,0,0]);
 assert.deepEqual(bitmapForOrder(['a','b'],'interleaved'),[1,0,1,0]);
 assert.equal(bitmapRuns(bitmapForOrder(['a','b'],'original')).length,2);
 assert.equal(bitmapRuns(bitmapForOrder(['a','b'],'interleaved')).length,4);
 assert.throws(()=>bitmapForOrder(['a'],'missing'));
});
test('old drafts initialize choices and saved answers remain independent',()=>{
 const old=createWordIndex();delete old.bitmap;assert.deepEqual(restoreWordIndex(old).bitmap,createBitmapExercise());
 const b=createBitmapExercise();b.answers.and={guess:'1000',checked:true};old.bitmap=b;
 const restored=restoreWordIndex(old);assert.deepEqual(restored.bitmap,b);restored.bitmap.answers.and.checked=false;assert.equal(b.answers.and.checked,true);
 const prior=structuredClone(b);delete prior.order;assert.equal(restoreBitmapExercise(prior).order,'original');
 b.order='interleaved';assert.equal(restoreBitmapExercise(b).order,'interleaved');
 assert.throws(()=>restoreBitmapExercise({...b,order:'bad'}));
 assert.throws(()=>restoreBitmapExercise({...b,answers:{...b.answers,or:{guess:null,checked:true}}}));
});
