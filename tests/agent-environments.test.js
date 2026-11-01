import test from 'node:test';
import assert from 'node:assert/strict';
import {agentExpected,agentEnvironmentTrial,createAgentEnvironments,agentEnvironmentsAct,restoreAgentEnvironments,agentEnvironmentsComplete} from '../src/agent-environments.js';
const act=(s,a)=>{const r=agentEnvironmentsAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);return r.state;};
test('experiments separate hidden state, stochastic outcomes and changes while deliberating',()=>{
 const a=agentEnvironmentTrial('fog',1,'calm'),b=agentEnvironmentTrial('fog',2,'calm'),gust=agentEnvironmentTrial('fog',1,'gust'),wait=agentEnvironmentTrial('fog',1,'wait');
 assert.equal(a.observation,b.observation);assert.notEqual(a.beforeGuard,b.beforeGuard);
 assert.notEqual(a.player,gust.player);assert.equal(wait.player,0);assert.notEqual(wait.beforeGuard,wait.afterGuard);
 const still=agentEnvironmentTrial('still',1,'calm'),stillWait=agentEnvironmentTrial('still',1,'wait');assert.equal(still.player,1);assert.equal(stillWait.player,0);assert.equal(stillWait.afterGuard,null);
 assert.throws(()=>agentEnvironmentTrial('fog',3,'calm'),RangeError);
});
test('each environment requires its observations and all five classifications',()=>{
 let s=createAgentEnvironments();assert.equal(agentEnvironmentsAct(s,'check').ok,false);
 for(const a of ['run:calm','run:wait'])s=act(s,a);
 for(const [k,v] of Object.entries(agentExpected.still))s=act(s,`choose:${k}:${v}`);
 s=act(s,'check');assert.ok(s.solved.includes('still'));s=act(s,'scene:fog');
 for(const a of ['guard:1','run:calm','run:gust','run:wait','guard:2','run:calm'])s=act(s,a);
 for(const [k,v] of Object.entries(agentExpected.fog))s=act(s,`choose:${k}:${v}`);
 s=act(s,'choose:transition:deterministic');s=act(s,'check');assert.equal(agentEnvironmentsComplete(s),false);
 s=act(s,'choose:transition:stochastic');s=act(s,'check');assert.equal(agentEnvironmentsComplete(s),false);
 // The last fog experiment leaves the guard at 2; river observations must not depend on it.
 s=act(s,'scene:river');for(const a of ['run:calm','run:gust','run:wait'])s=act(s,a);
 assert.equal(s.logs['river:calm'].player,0.25);assert.equal(s.logs['river:gust'].player,0.5);assert.equal(s.logs['river:wait'].player,1);
 for(const [k,v] of Object.entries(agentExpected.river))s=act(s,`choose:${k}:${v}`);
 s=act(s,'check');assert.equal(agentEnvironmentsComplete(s),true);
 s=act(s,'choose:state:discrete');assert.equal(agentEnvironmentsComplete(s),false);
 s=act(s,'check');assert.equal(agentEnvironmentsComplete(s),false);
 s=act(s,'choose:state:continuous');s=act(s,'check');assert.equal(agentEnvironmentsComplete(s),true);
 assert.deepEqual(restoreAgentEnvironments(JSON.parse(JSON.stringify(s))),s);assert.throws(()=>restoreAgentEnvironments({history:['check']}),RangeError);
});
