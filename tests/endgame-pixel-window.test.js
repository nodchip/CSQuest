import test from 'node:test';import assert from 'node:assert/strict';import {replayPixelWindow} from '../src/endgame-pixel-window.js';
const all=[0,1,2,3,4,5,6,7,8].map(i=>`add:${i}`);
test('independent weighted sums and exact outcomes, including unclipped sharpening',()=>{
 for(const [k,sum,div,value,answer] of [['box',40,9,40/9,'40/9'],['gaussian',80,16,5,'5'],['sharp',24,1,24,'24']]){const p=replayPixelWindow(k,[...all,`answer:${answer}`]);assert.equal(p.sum,sum);assert.equal(p.divisor,div);assert.equal(p.value,value);assert.equal(p.done,true);}
});
test('duplicates, premature answers, wrong answers and post-completion input fail',()=>{
 for(const [k,h] of [['box',['answer:40/9']],['box',['add:0','add:0']],['gaussian',[...all,'answer:40/9']],['sharp',[...all,'answer:24','reset']],['box',['add:9']]])assert.equal(replayPixelWindow(k,h),null);
 assert.deepEqual(replayPixelWindow('box',['add:0','reset']).used,[]);assert.equal(replayPixelWindow('unknown',[]),null);
});
