import test from 'node:test';
import assert from 'node:assert/strict';
import {netAggReplay,netAggCreate,netAggRestore,netAggComplete} from '../src/network-aggregate.js';
const perms=xs=>xs.length?xs.flatMap((x,i)=>perms([...xs.slice(0,i),...xs.slice(i+1)]).map(rest=>[x,...rest])):[[]];
test('all 24 arrival orders preserve sum; aggregation changes only the outgoing reports',()=>{
 for(const ids of perms(['A','B','C','D'])){
  const arrivals=ids.map(id=>'receive:'+id);
  const aggregate=netAggReplay('aggregate',[...arrivals,'combine','send-sum']);assert.equal(aggregate.sum,16);assert.equal(aggregate.upstream,4);assert.equal(aggregate.downstream,1);assert.equal(aggregate.done,true);
  const direct=netAggReplay('direct',ids.flatMap(id=>['receive:'+id,'send:'+id]));assert.equal(direct.sum,16);assert.equal(direct.upstream,4);assert.equal(direct.downstream,4);assert.equal(direct.done,true);
 }
 assert.throws(()=>netAggReplay('aggregate',['receive:A','combine']));assert.throws(()=>netAggReplay('direct',['send:A']));assert.throws(()=>netAggReplay('aggregate',['receive:A','receive:A']));assert.throws(()=>netAggReplay('aggregate',['send-sum']));
});
test('incomplete histories restore and both observations and conclusions are required',()=>{
 const q=netAggCreate();q.trials.direct=['receive:A','send:A'];assert.deepEqual(netAggRestore(q),q);assert.throws(()=>netAggRestore({...q,trials:{...q.trials,aggregate:['combine']}}));
 q.trials.direct=['A','B','C','D'].flatMap(x=>['receive:'+x,'send:'+x]);q.trials.aggregate=['A','B','C','D'].map(x=>'receive:'+x).concat(['combine','send-sum']);q.flow='link';assert.equal(netAggComplete(q),false);q.information='lost';assert.equal(netAggComplete(q),true);
});
