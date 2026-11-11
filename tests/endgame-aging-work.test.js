import test from 'node:test';import assert from 'node:assert/strict';import {replayAgingWork} from '../src/endgame-aging-work.js';
const fixed=['high','high','high','high','high','next'],aging=['high','high','low','high','high','next'];
test('fixed and aging results have independently expected orders and backlogs',()=>{
 assert.deepEqual(replayAgingWork('fixed',fixed).results,[{mode:'fixed',lowDone:false,backlog:0,order:['high','high','high','high','high']}]);
 assert.deepEqual(replayAgingWork('aging',aging).results,[{mode:'aging',lowDone:true,backlog:1,order:['high','high','low','high','high']}]);
});
test('wrong priority, early finish, and post-completion actions rejected',()=>{
 for(const [k,h] of [['fixed',['low']],['aging',['high','high','high']],['aging',['next']],['fixed',[...fixed,'high']],['aging',['high','high','low','low']]])assert.equal(replayAgingWork(k,h),null);
 assert.equal(replayAgingWork('aging',['high','reset']).state.time,0);const h=[...fixed,...aging];assert.equal(replayAgingWork('compare',h).done,false);assert.equal(replayAgingWork('compare',[...h,'answer:backlog']).done,true);assert.equal(replayAgingWork('compare',[...h,'answer:guarantee']),null);
});
