import test from 'node:test';
import assert from 'node:assert/strict';
import {intentSignals,intentPosterior,intentRecommendation,intentCreate,intentObserve,intentCheck,intentDone,intentRestore,intentRequired} from '../src/goal-inference.js';
test('posterior uses prior and likelihood; compare the expected values with asking',()=>{
 const red=intentPosterior(50,'red'),blue=intentPosterior(50,'blue'),neutral=intentPosterior(50,'middle'),rare=intentPosterior(10,'red');
 assert.equal(Object.values(intentSignals).reduce((sum,x)=>sum+x.a,0),10);assert.equal(Object.values(intentSignals).reduce((sum,x)=>sum+x.b,0),10);
 assert.equal(red.a/red.total,0.8);assert.equal(blue.b/blue.total,0.8);assert.equal(neutral.a/neutral.total,0.5);assert.equal(rare.a/rare.total,4/13);
 assert.deepEqual([red,blue,neutral,rare].map(intentRecommendation),['red','blue','ask','ask']);assert.equal(intentRecommendation({a:3,b:1,total:4}),'ask');
});
test('observation, correct actions, reflection and restoration are required',()=>{let q=intentCreate();q.choice='red';assert.equal(intentCheck(q),null);q.choice=null;for(const key of intentRequired){const [prior,signal]=key.split(':');q.prior=Number(prior);q.signal=signal;intentObserve(q);q.choice='red';if(key!=='50:red')assert.equal(intentCheck(q).ok,false);q.choice=key==='50:red'?'red':key==='50:blue'?'blue':'ask';assert.equal(intentCheck(q).ok,true);}assert.equal(intentDone(q),false);q.reflection='uncertain';q=intentRestore(q);assert.equal(intentDone(q),true);assert.throws(()=>intentRestore({...q,observed:false,choice:'red'}),RangeError);});
