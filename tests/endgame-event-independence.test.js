import test from 'node:test';import assert from 'node:assert/strict';import {replayEventIndependence} from '../src/endgame-event-independence.js';
test('the eight equiprobable cards give independently expected overlaps and fractions',()=>{
 for(const [kind,overlap,history] of [
 ['balanced',2,['toggle:0','toggle:1','check','relation:independent']],
 ['linked',3,['toggle:0','toggle:1','toggle:2','check','relation:dependent']],
 ['disjoint',0,['check','relation:dependent','answer:exclusive-dependent']]]){
  const p=replayEventIndependence(kind,history);assert.deepEqual([p.total,p.sun,p.bell,p.overlap],[8,4,4,overlap]);assert.equal(p.done,true);
 }
});
test('selection, relationship and completed histories are validated',()=>{
 for(const [kind,h] of [['balanced',['check']],['linked',['toggle:0','toggle:1','check']],['disjoint',['toggle:0','check']],['disjoint',['check','relation:independent']],['disjoint',['check','relation:dependent','answer:independent']],['balanced',['toggle:8']],['disjoint',['check','relation:dependent','answer:exclusive-dependent','check']]])assert.equal(replayEventIndependence(kind,h),null);
 assert.deepEqual(replayEventIndependence('balanced',['toggle:0','toggle:0']).selected,[]);
 assert.equal(replayEventIndependence('unknown',[]),null);
});
