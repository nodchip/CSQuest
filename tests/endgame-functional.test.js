import test from 'node:test';
import assert from 'node:assert/strict';
import {replayFunctional} from '../src/endgame-functional.js';

test('mapping transforms each element without mutating the original input',()=>{
 assert.deepEqual(replayFunctional('map',['op:inc']).value,[2,4,3]);
 assert.equal(replayFunctional('map',['op:double','check']),null);
 assert.equal(replayFunctional('map',['op:inc','check','op:double','check']).done,true);
});
test('fold uses zero for the empty input and sums signed values',()=>{
 const h=['step','step','step','check','check','step','step'];const p=replayFunctional('fold',h);assert.equal(p.total,2);assert.equal(replayFunctional('fold',[...h,'check']).done,true);
 assert.equal(replayFunctional('fold',['step','check']),null);
});
test('changing operation order changes the result and undo supports correction',()=>{
 const wrong=['op:inc','op:filter','op:sum'];assert.equal(replayFunctional('pipeline',wrong).value,9);assert.equal(replayFunctional('pipeline',[...wrong,'check']),null);
 const correct=['op:filter','op:inc','op:sum'];assert.equal(replayFunctional('pipeline',correct).value,7);
 assert.equal(replayFunctional('pipeline',[...correct,'check','op:filter','op:inc','op:sum','check']).done,true);
 assert.equal(replayFunctional('pipeline',[...correct,'op:inc']),null);
 assert.equal(replayFunctional('pipeline',[...correct,'undo']).value.join(','),'4,3');
});
