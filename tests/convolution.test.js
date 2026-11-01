import test from 'node:test';
import assert from 'node:assert/strict';
import {convolutionWindow,poolPairs,createConvolution,convolutionAct,restoreConvolution,convolutionComplete} from '../src/convolution.js';
const act=(s,a)=>{const r=convolutionAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
const run=(s)=>['start','step','step','step','step','step','pool'].reduce(act,s);
test('同じ重みを５か所に適用し、ReLU と幅２の最大値を計算する',()=>{
 const cases={ 'early-rise':[[1,0,-1,0,0],[1,0,0,0,0],[1,0]],'late-rise':[[0,0,1,0,-1],[0,0,1,0,0],[0,1]],'early-fall':[[-1,0,1,0,0],[0,0,1,0,0],[0,1]],'late-fall':[[0,0,-1,0,1],[0,0,0,0,1],[0,0]]};
 for(const [key,[raw,activation,pooled]] of Object.entries(cases)){const [pattern,filter]=key.split('-');const w=Array.from({length:5},(_,i)=>convolutionWindow(pattern,filter,i));assert.deepEqual(w.map(x=>x.raw),raw);assert.deepEqual(w.map(x=>x.activation),activation);assert.deepEqual(poolPairs(activation),pooled);}
 assert.throws(()=>convolutionWindow('early','rise',5));assert.throws(()=>poolPairs([1,2]));
});
test('実行中の条件は固定され、４組合せと振り返りが必要',()=>{
 let s=createConvolution();s=act(s,'start');s=act(s,'pattern:late');for(let i=0;i<5;i++)s=act(s,'step');s=act(s,'pool');assert.ok(s.results['early-rise']);assert.equal(s.results['late-rise'],undefined);
 for(const [p,f] of [['late','rise'],['early','fall'],['late','fall']]){s=act(s,`pattern:${p}`);s=act(s,`filter:${f}`);s=run(s);}
 s=act(s,'share:same');s=act(s,'pool:loss');assert.equal(convolutionComplete(s),false);s=act(s,'check');assert.equal(convolutionComplete(s),true);assert.deepEqual(restoreConvolution(JSON.parse(JSON.stringify(s))),s);
});
test('不正な順序や途中記録は拒否する',()=>{assert.equal(convolutionAct(createConvolution(),'pool').ok,false);assert.throws(()=>restoreConvolution({history:['step']}));assert.throws(()=>restoreConvolution({history:[null]}));assert.throws(()=>restoreConvolution({history:Array(129).fill('start')}));});
