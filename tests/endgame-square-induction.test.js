import test from 'node:test';import assert from 'node:assert/strict';import {replaySquareInduction} from '../src/endgame-square-induction.js';
test('two independent squares require the right and lower edge',()=>{
 assert.deepEqual(replaySquareInduction('one',['right','bottom','bottom','check']),{n:1,right:1,bottom:2,step:0,done:true});
 assert.deepEqual(replaySquareInduction('two',['bottom','right','bottom','right','bottom','check']),{n:2,right:2,bottom:3,step:0,done:true});
});
test('base, arbitrary hypothesis, 2k+1, next square and conclusion are necessary',()=>{
 const proof=['answer:base','answer:hypothesis','answer:twoKOne','answer:next','answer:induction'];
 assert.equal(replaySquareInduction('proof',proof).done,true);assert.equal(replaySquareInduction('proof',proof.slice(0,4)).done,false);
 for(const [k,h] of [['one',['right','check']],['one',['right','right']],['one',['right','bottom','bottom','check','reset']],['two',['bottom','bottom','bottom','right','check']],['proof',['answer:future']],['proof',['answer:base','answer:future']],['proof',[...proof,'answer:base']]])assert.equal(replaySquareInduction(k,h),null);
 assert.deepEqual(replaySquareInduction('two',['bottom','right','reset']),replaySquareInduction('two',[]));
});
