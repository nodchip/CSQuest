import test from 'node:test';
import assert from 'node:assert/strict';
import {markovLongStep,markovLongForecast,markovStarts,createMarkovLongRun,markovLongRunAct,restoreMarkovLongRun,markovLongRunComplete} from '../src/markov-long-run.js';
const act=(s,a)=>{const r=markovLongRunAct(s,a);assert.equal(r.ok,true,r.message);return r.state;};
test('all 25 transition pairs evolve exact fractions and preserve stationary distributions',()=>{
 for(let q=0;q<=4;q++)for(let r=0;r<=4;r++){
  const forecast=markovLongForecast(q,r);
  if(q+r===0)assert.equal(forecast.kind,'all-stationary');
  else {const p=forecast.stationary;assert.deepEqual(markovLongStep(p,q,r),p);assert.equal(forecast.kind,q+r===8?'periodic':'convergent');}
  for(const initial of Object.values(markovStarts)){
   let p={n:initial.n,d:initial.d},independent=p.n/p.d;
   for(let day=0;day<8;day++){p=markovLongStep(p,q,r);independent=independent*(1-q/4)+(1-independent)*(r/4);assert.ok(Math.abs(p.n/p.d-independent)<1e-12);assert.ok(p.n>=0&&p.n<=p.d);}
  }
 }
 assert.throws(()=>markovLongStep({n:2,d:1},1,2),RangeError);
});
test('periodic, fixed and mixing examples have distinct behavior',()=>{
 let p={n:1,d:1};assert.deepEqual(markovLongStep(p,4,4),{n:0,d:1});assert.deepEqual(markovLongStep({n:0,d:1},4,4),p);
 assert.deepEqual(markovLongStep({n:1,d:2},4,4),{n:1,d:2});assert.deepEqual(markovLongStep(p,0,0),p);
 assert.deepEqual(markovLongForecast(1,2).stationary,{n:2,d:3});
});
test('all six observations and the correct reflection are needed; replay preserves progress',()=>{
 let s=createMarkovLongRun();assert.equal(markovLongRunAct(s,'observe').ok,false);
 for(const [q,r,start] of [[1,2,'sun'],[1,2,'fog'],[4,4,'sun'],[4,4,'half'],[0,0,'sun'],[0,0,'fog']])for(const a of [`q:${q}`,`r:${r}`,`start:${start}`,'step','step','observe'])s=act(s,a);
 for(const a of ['answer:always','check'])s=act(s,a);assert.equal(markovLongRunComplete(s),false);
 for(const a of ['answer:limits','check'])s=act(s,a);assert.equal(markovLongRunComplete(s),true);
 assert.deepEqual(restoreMarkovLongRun(JSON.parse(JSON.stringify(s))),s);assert.throws(()=>restoreMarkovLongRun({history:['observe']}),RangeError);
});
