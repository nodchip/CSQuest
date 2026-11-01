import test from 'node:test';
import assert from 'node:assert/strict';
import {hmmPathNumerator,hmmViterbi,createHmmTags,hmmTagsStep,hmmTagsComplete,restoreHmmTags} from '../src/hmm-tags.js';

test('Viterbi scores agree with independent enumeration for all observation sequences through length five',()=>{
 const emit={light:[1,1],stone:[2,1],other:[1,2]},init=[3,2],transition=[[1,3],[3,1]];
 function examine(words){const result=hmmViterbi(words);let best=0;for(let mask=0;mask<2**words.length;mask++){const path=Array.from({length:words.length},(_,i)=>(mask>>i)&1);let score=init[path[0]]*emit[words[0]][path[0]];for(let i=1;i<words.length;i++)score*=transition[path[i-1]][path[i]]*emit[words[i]][path[i]];best=Math.max(best,score);assert.equal(hmmPathNumerator(words,path.map(n=>n?'V':'N').join('')),score);}assert.equal(result.best.score,best);assert.equal(result.denominator,5*4**(2*words.length-1));}
 function visit(prefix,n){if(!n){examine(prefix);return;}for(const w of Object.keys(emit))visit([...prefix,w],n-1);}for(let n=1;n<=5;n++)visit([],n);
});
test('fixed example and replay require correct predictions',()=>{
 const model=hmmViterbi(['light','stone']);assert.equal(model.stages[0].N.score,3);assert.equal(model.stages[0].V.score,2);assert.equal(model.stages[1].N.score,12);assert.equal(model.stages[1].N.previous,'V');assert.equal(model.stages[1].V.score,9);assert.equal(model.stages[1].V.previous,'N');assert.equal(model.best.path,'VN');assert.deepEqual(['NN','NV','VN','VV'].map(p=>hmmPathNumerator(['light','stone'],p)),[6,9,12,2]);
 const history=['first:3,2','candidate:V:12','candidate:N:9','path:VN'];let s=createHmmTags();assert.equal(hmmTagsStep(s,'first:2,3').history.length,0);for(const action of history)s=hmmTagsStep(s,action);assert.equal(hmmTagsComplete({...s,answer:'sequence',checked:true}),true);assert.throws(()=>hmmTagsStep(s,'path:VN'));assert.equal(hmmTagsComplete(restoreHmmTags({history,previous:null,score:null,answer:'sequence',checked:true})),true);assert.throws(()=>restoreHmmTags({history:['first:2,3'],previous:null,score:null,answer:null,checked:false}));
});
