import test from 'node:test';
import assert from 'node:assert/strict';
import {energyMaps,energyDirections,energyCell,createEnergy,energyStep,restoreEnergy,energyComplete} from '../src/robot-energy.js';
const play=(id,steps)=>steps.reduce(energyStep,createEnergy(id));
test('both routes reach the goal with charging and correctly account for water',()=>{
  const upper=play('upper',['north','east','east','charge','east','east','south']);assert.equal(upper.status,'found');assert.equal(upper.energy,1);
  const lower=play('lower',['south','east','charge','east','east','east','north']);assert.equal(lower.status,'found');assert.equal(lower.energy,0);
});
test('independent reachability search finds a charging route but no route without charging',()=>{
  for(const [id,map] of Object.entries(energyMaps)){
    const reachable=allow=>{const queue=[{x:0,y:1,energy:map.initial,charged:false}],seen=new Set();while(queue.length){const s=queue.shift(),key=JSON.stringify(s);if(seen.has(key))continue;seen.add(key);if(s.x===4&&s.y===1)return true;if(allow&&!s.charged&&s.x===map.charger[0]&&s.y===map.charger[1])queue.push({...s,energy:map.max,charged:true});for(const d of Object.values(energyDirections)){const x=s.x+d.dx,y=s.y+d.dy;if(x<0||x>=5||y<0||y>=3)continue;const type=energyCell(id,x,y),cost=type==='water'?2:1;if(type!=='wall'&&s.energy>=cost)queue.push({...s,x,y,energy:s.energy-cost});}}return false;};
    assert.equal(reachable(false),false);assert.equal(reachable(true),true);
  }
});
test('illegal moves do not advance, exhaustion can be retried, and only valid histories restore',()=>{
  let s=createEnergy('upper');assert.equal(energyStep(s,'charge').history.length,0);s=energyStep(s,'east');assert.equal(energyStep(s,'east').history.length,1);
  s=play('upper',['south','east','east','east']);assert.equal(s.status,'failed');
  const saved={selected:'lower',history:{upper:['north','east','east','charge'],lower:['south','east']}};const restored=restoreEnergy(saved);assert.equal(restored.states.upper.energy,4);assert.equal(energyComplete(restored),false);assert.throws(()=>restoreEnergy({...saved,history:{...saved.history,upper:['charge']}}),RangeError);
});
