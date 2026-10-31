import {test} from 'node:test';
import assert from 'node:assert/strict';
import {lifeNext,createLifeTrial,lifeStep,createLifeGarden,restoreLifeGarden,lifeGardenComplete} from '../src/life-garden.js';

test('block is stable, blinker alternates, and glider moves on a finite board',()=>{
 const block=[6,7,11,12],horizontal=[11,12,13],vertical=[7,12,17],glider=[1,7,10,11,12];
 assert.deepEqual(lifeNext(block),block);assert.deepEqual(lifeNext(horizontal),vertical);assert.deepEqual(lifeNext(vertical),horizontal);
 assert.deepEqual(lifeNext(glider),[5,7,11,12,16]);assert.deepEqual(lifeNext([5,7,11,12,16]),[7,10,12,16,17]);
 assert.deepEqual(lifeNext([0,4,20,24]),[]);assert.throws(()=>lifeNext([1,1]),RangeError);
});
test('predictions must match the whole next generation and saved histories are replayed',()=>{
 const trial=createLifeTrial('blinker');assert.equal(lifeStep(trial,[7,12]).history.length,0);const s=createLifeGarden();
 for(const id of Object.keys(s.trials)){let t=s.trials[id];for(let i=0;i<2;i++)t=lifeStep(t,lifeNext(t.current));s.trials[id]=t;}assert.equal(lifeGardenComplete(s),true);
 const saved={selected:'block',trials:Object.fromEntries(Object.entries(s.trials).map(([id,t])=>[id,{history:t.history,marks:[]}]))};assert.equal(lifeGardenComplete(restoreLifeGarden(saved)),true);saved.trials.block.history[0]=[];assert.throws(()=>restoreLifeGarden(saved),RangeError);
});
