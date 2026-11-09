import test from 'node:test';
import assert from 'node:assert/strict';
import {flowerCases,runFlowers} from '../src/endgame-workshop.js';

test('the same constructed instructions count blue petals in four cases',()=>{
 const instructions=['clear','loop','take','blue','again','report'];
 assert.deepEqual(flowerCases.map(input=>runFlowers(instructions,input).output),[2,0,0,1]);
 const trace=runFlowers(instructions,['blue','red']).history;
 assert.deepEqual(trace.filter(step=>step.command==='blue').map(step=>step.count),[1,1]);
 assert.equal(runFlowers(instructions,[]).history.some(step=>step.command==='take'),false);
});
test('an equivalent program works and errors do not produce a result',()=>{
 const equivalent=['loop','take','blue','again','report'];
 assert.deepEqual(flowerCases.map(input=>runFlowers(equivalent,input).output),[2,0,0,1]);
 assert.equal(runFlowers(['blue','report'],['blue']).output,null);
 assert.equal(runFlowers(['loop','take','blue','report'],['blue']).output,null);
 assert.equal(runFlowers(['loop','again','report'],['blue']).output,null);
 assert.equal(runFlowers(['take','report'],[]).output,null);
 assert.equal(runFlowers(['unknown'],[]),null);
 assert.equal(runFlowers(['loop','loop','take','again','again','report'],[]).output,null);
 assert.equal(runFlowers(['again','loop','report'],[]).output,null);
 assert.equal(runFlowers(['take','blue','blue','report'],['blue']).output,2);
 assert.equal(runFlowers(['report','take'],['blue']).output,0);
});
