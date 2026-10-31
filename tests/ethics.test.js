import test from 'node:test';
import assert from 'node:assert/strict';
import {ethicsVoices,ethicsEffects,ethicsPlans,createEthics,ethicsCorrect,restoreEthics,ethicsComplete} from '../src/ethics.js';
test('each fixed plan requires its full set of stated benefits and burdens',()=>{
  const ids=Object.keys(ethicsEffects);for(const [id,plan] of Object.entries(ethicsPlans))for(let mask=0;mask<64;mask++){const effects=ids.filter((_,i)=>mask&(1<<i));assert.equal(ethicsCorrect(id,{effects}),effects.length===plan.effects.length&&plan.effects.every(x=>effects.includes(x)));}
});
test('all three choices are possible after all voices and plans have been considered',()=>{
  const s=createEthics();s.observed=Object.keys(ethicsVoices);for(const [id,plan] of Object.entries(ethicsPlans))s.plans[id]={effects:plan.effects.slice(),checked:true};
  assert.equal(ethicsComplete(s),false);for(const id of Object.keys(ethicsPlans)){s.decision=id;assert.equal(ethicsComplete(restoreEthics(s)),true);}
  s.plans.public.checked=false;assert.equal(ethicsComplete(s),false);
});
test('saved observations and effects must be valid and unique',()=>{
  const s=createEthics();assert.throws(()=>restoreEthics({...s,observed:['recipient','recipient']}),RangeError);assert.throws(()=>restoreEthics({...s,plans:{...s.plans,public:{effects:['unknown'],checked:true}}}),RangeError);
});
