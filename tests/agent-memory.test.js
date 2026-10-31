import test from 'node:test';
import assert from 'node:assert/strict';
import {agentCases,createAgentPolicy,runAgent,restoreAgent,agentComplete} from '../src/agent-memory.js';

test('no fixed choice can solve both cases without memory; exactly one remembered mapping can',()=>{
 for(const fallback of ['left','right']){const p={...createAgentPolicy(),fallback,tested:true};assert.equal(Object.keys(agentCases).filter(id=>runAgent(p,id).success).length,1);assert.equal(agentComplete(p),false);}
 for(const sun of ['left','right'])for(const moon of ['left','right']){const p={...createAgentPolicy(),memory:true,sun,moon,tested:true};assert.equal(agentComplete(p),sun==='left'&&moon==='right');assert.equal(runAgent(p,'sun').remembered,'sun');assert.equal(runAgent(p,'moon').remembered,'moon');}
});
test('saving validates the policy and success requires the trial to be run',()=>{
 const p={...createAgentPolicy(),memory:true,moon:'right'};assert.equal(agentComplete(p),false);p.tested=true;const restored=restoreAgent(p);assert.equal(agentComplete(restored),true);p.moon='left';assert.equal(restored.moon,'right');assert.throws(()=>restoreAgent({...restored,sun:'up'}),RangeError);
});
