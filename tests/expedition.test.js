import test from 'node:test';
import assert from 'node:assert/strict';
import {expeditionMaps,expeditionStep,createExpeditionTrial,createExpedition,restoreExpedition,expeditionComplete} from '../src/expedition.js';

test('independent search finds the required minimum number of moves in each map',()=>{
  for(const [id,map] of Object.entries(expeditionMaps)){
    const queue=[{place:'S',key:false,rune:false,moves:0}],seen=new Set();let min=null;
    while(queue.length){const s=queue.shift(),key=`${s.place}-${s.key}-${s.rune}`;if(seen.has(key))continue;seen.add(key);if(s.place==='G'){min=s.moves;break;}
      for(const [a,b] of map.edges){const next=a===s.place?b:b===s.place?a:null;if(!next||next==='G'&&!(s.key&&s.rune))continue;queue.push({place:next,key:s.key||next==='K',rune:s.rune||next==='R',moves:s.moves+1});}}
    assert.equal(min,map.budget);
  }
});
test('prerequisites, exhaustion, successful routes, and saved histories',()=>{
  let s=createExpeditionTrial('old');s=expeditionStep(s,'A');assert.equal(expeditionStep(s,'activate').active,false);assert.equal(expeditionStep(s,'G').place,'A');s=expeditionStep(s,'S');s=expeditionStep(s,'A');s=expeditionStep(s,'S');s=expeditionStep(s,'A');s=expeditionStep(s,'S');assert.equal(s.status,'failed');
  const set=createExpedition();for(const [id,actions] of Object.entries({old:['K','S','A','R','A','activate','G'],bridge:['K','A','R','A','activate','G']}))set.states[id]=actions.reduce(expeditionStep,set.states[id]);assert.equal(expeditionComplete(set),true);
  const saved={selected:'old',histories:Object.fromEntries(Object.entries(set.states).map(([id,state])=>[id,state.history]))};assert.deepEqual(restoreExpedition(saved),set);assert.throws(()=>restoreExpedition({...saved,histories:{...saved.histories,old:['A','activate']}}),RangeError);assert.throws(()=>expeditionStep(set.states.old,'A'),RangeError);
});
