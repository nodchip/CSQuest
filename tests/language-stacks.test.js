import {test} from 'node:test';
import assert from 'node:assert/strict';
import {languageTrace,languageProof,languageRequired,hierarchyMembership,createLanguageStacks,languageStacksComplete,restoreLanguageStacks} from '../src/language-stacks.js';

test('２つの門で０〜４個の a と b をすべて試す',()=>{
 for(let n=0;n<=4;n++)for(let m=0;m<=4;m++){
  assert.equal(languageTrace('stack',n,m,n+m).outcome,n===m?'accept':'reject');
  assert.equal(languageTrace('finite',n,m,n+m).outcome,n===m&&n<=3?'accept':'reject');
 }
 assert.deepEqual(languageTrace('stack',4,3,5),{text:'aaaabbb',phase:'b',count:3,outcome:null});
 assert.equal(languageTrace('finite',4,4,4).phase,'dead');assert.throws(()=>languageTrace('stack',4,4,9),RangeError);
});
test('３状態への全81割当てで重複した２接頭辞と同じ続きが矛盾を生む',()=>{
 for(let code=0;code<81;code++){
  let value=code;const states=Array.from({length:4},()=>{const n=value%3;value=Math.floor(value/3);return n;});
  const pairs=[];for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)if(states[i]===states[j])pairs.push([i,j]);assert.ok(pairs.length>0);
  for(const [i,j] of pairs)for(const d of ['accept','reject']){const r=languageProof(states,i,j,d);assert.equal(r.left,'a'.repeat(i)+'b'.repeat(i));assert.equal(r.right,'a'.repeat(j)+'b'.repeat(i));assert.notEqual(r.leftCorrect,r.rightCorrect);}
 }
 assert.throws(()=>languageProof([0,1,2,0],0,1,'accept'),RangeError);assert.throws(()=>languageProof([0,1,2,0],3,0,'accept'),RangeError);
});
test('４観察と２つの仮定、振り返りを検査して復元する',()=>{
 const s=createLanguageStacks();s.observed=[...languageRequired];s.i=0;s.j=1;s.proof=['accept','reject'];s.answer='memory';assert.equal(languageStacksComplete(s),false);s.checked=true;assert.equal(languageStacksComplete(s),true);
 const r=restoreLanguageStacks(s);r.states[0]=2;assert.equal(s.states[0],0);
 for(const p of [{n:5},{step:7},{states:[0,1,2,0]},{proof:['accept','accept']},{observed:['bad']},{answer:'bad'},{checked:1}])assert.throws(()=>restoreLanguageStacks({...s,...p}),RangeError);
});
test('four examples match the nested language classes',()=>{const expected={star:[true,true,true,true],pairs:[false,true,true,true],triples:[false,false,true,true],halting:[false,false,false,true]};for(const [example,answers] of Object.entries(expected))assert.deepEqual(['regular','contextFree','contextSensitive','recognizable'].map(c=>hierarchyMembership(example,c)),answers);assert.throws(()=>hierarchyMembership('bad','regular'));});
test('hierarchy restores old drafts and rejects invalid new records',()=>{const old=createLanguageStacks();delete old.hierarchy;assert.deepEqual(restoreLanguageStacks(old).hierarchy,{example:'star',category:'regular',guess:null,observed:[],checked:false});const q=createLanguageStacks();q.hierarchy={example:'pairs',category:'regular',guess:'no',observed:['pairs:regular'],checked:true};const r=restoreLanguageStacks(q);r.hierarchy.observed.push('star:regular');assert.equal(q.hierarchy.observed.length,1);q.hierarchy.observed=['pairs:regular','pairs:regular'];assert.throws(()=>restoreLanguageStacks(q));q.hierarchy=null;assert.throws(()=>restoreLanguageStacks(q));});
