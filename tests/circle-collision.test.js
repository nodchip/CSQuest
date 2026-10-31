import {test} from 'node:test';
import assert from 'node:assert/strict';
import {circleStatus,createCircle,circleComplete,restoreCircle} from '../src/circle-collision.js';

test('all grid positions agree with an independent distance comparison including equality',()=>{
 for(let x=0;x<=4;x++)for(let y=0;y<=3;y++){const distance=Math.hypot(x,y),expected=distance<3?'overlap':distance===3?'touch':'separate';assert.equal(circleStatus(x,y),expected);}
 assert.equal(circleStatus(2,2),'overlap');assert.equal(circleStatus(3,0),'touch');assert.equal(circleStatus(3,1),'separate');assert.throws(()=>circleStatus(-1,0),RangeError);
});
test('each checked case must match its target and saved positions are copied',()=>{
 const s=createCircle();s.trials.separate={x:3,y:1,checked:true};s.trials.touch={x:3,y:0,checked:true};s.trials.overlap={x:2,y:2,checked:true};const copy=restoreCircle(s);assert.equal(circleComplete(copy),true);s.trials.touch.y=1;assert.equal(circleComplete(copy),true);assert.throws(()=>restoreCircle(s),RangeError);
});
