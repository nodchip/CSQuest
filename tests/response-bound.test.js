import test from 'node:test';
import assert from 'node:assert/strict';
import {responseCases,responseTrial,responseNext,responseStep,responseCreate,responseComplete,responseRestore} from '../src/response-bound.js';

test('fixed point iterations include the release at zero but exclude one at the exact endpoint',()=>{
 const expected={a:[2,3,3],b:[3,4,4],c:[2,4,4],d:[3,5,7]};
 for(const id of Object.keys(responseCases)){const t=responseTrial(id);while(t.phase==='working'){const {arrivals,total}=responseNext(id,t);assert.equal(arrivals,t.values.at(-1)<=4?1:2);t.guess=total;assert.ok(responseStep(id,t));}assert.deepEqual(t.values,expected[id]);assert.equal(t.phase,id==='d'?'late':'stable');}
});
test('wrong choices cannot advance and every configuration and reflection are required',()=>{
 const s=responseCreate(),first=s.trials.a;first.guess=7;assert.equal(responseStep('a',first),false);assert.deepEqual(first.values,[2]);
 for(const id of Object.keys(responseCases)){const t=s.trials[id];while(t.phase==='working'){t.guess=responseNext(id,t).total;assert.ok(responseStep(id,t));}}assert.equal(responseComplete(s),false);s.answer='boundary';s.checked=true;assert.ok(responseComplete(s));const copy=responseRestore(s);copy.trials.a.values.pop();assert.equal(s.trials.a.values.length,3);assert.throws(()=>responseRestore({...s,trials:{...s.trials,a:{values:[2,4],guess:null}}}));
});

test('the computed outcomes agree with an independent tick-by-tick priority schedule',()=>{
 for(const [id,c] of Object.entries(responseCases)){
  let high=0,low=c.low,finished=null;
  for(let time=0;time<6;time++){
   if(time%4===0)high+=c.high;
   if(high>0)high--;else if(low>0){low--;if(low===0)finished=time+1;}
  }
  const t=responseTrial(id);while(t.phase==='working'){t.guess=responseNext(id,t).total;responseStep(id,t);}
  if(t.phase==='stable')assert.equal(t.values.at(-1),finished);else assert.equal(finished,null);
 }
});
