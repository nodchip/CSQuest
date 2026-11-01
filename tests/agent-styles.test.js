import test from 'node:test';
import assert from 'node:assert/strict';
import {agentStyleScenes,agentStylePolicies,agentStyleRun,createAgentStyles,agentStylesAct,restoreAgentStyles,agentStylesComplete} from '../src/agent-styles.js';
const act=(s,a)=>{const r=agentStylesAct(s,a);assert.equal(r.ok,true,r.message);return r.state;};
test('the three specified policies produce the expected routes and expected costs',()=>{
 const expected={clear:{reflex:['short',true,1],goal:['short',true,1],utility:['short',true,1]},blocked:{reflex:['short',false,null],goal:['safe',true,3],utility:['safe',true,3]},danger:{reflex:['short',true,5],goal:['short',true,5],utility:['safe',true,3]}};
 for(const [scene,policies] of Object.entries(expected))for(const [policy,[route,arrives,cost]] of Object.entries(policies)){
  const r=agentStyleRun(scene,policy);assert.equal(r.route,route);assert.equal(r.arrives,arrives);assert.equal(r.expectedCost,cost);
 }
 assert.throws(()=>agentStyleRun('unknown','goal'),RangeError);
});
test('nine trials and a nuanced reflection are required, and progress can be replayed',()=>{
 let s=createAgentStyles();for(const scene of Object.keys(agentStyleScenes))for(const policy of Object.keys(agentStylePolicies))for(const a of [`scene:${scene}`,`policy:${policy}`,'run'])s=act(s,a);
 for(const a of ['answer:reflex','check'])s=act(s,a);assert.equal(agentStylesComplete(s),false);
 for(const a of ['answer:context','check'])s=act(s,a);assert.equal(agentStylesComplete(s),true);
 assert.deepEqual(restoreAgentStyles(JSON.parse(JSON.stringify(s))),s);assert.throws(()=>restoreAgentStyles({history:['scene:bad']}),RangeError);
});
