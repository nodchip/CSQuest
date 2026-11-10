import test from 'node:test';
import assert from 'node:assert/strict';
import {replayStrings} from '../src/endgame-strings.js';

test('splitting preserves an empty field between adjacent separators',()=>{
 const h=['op:split','check','op:split'];assert.deepEqual(replayStrings('split',h).value,['港','','森']);assert.equal(replayStrings('split',[...h,'check']).done,true);
 assert.equal(replayStrings('split',['check']),null);
});
test('first and all replacement differ and absent text is unchanged',()=>{
 assert.equal(replayStrings('replace',['op:first']).value,'青・赤');
 assert.equal(replayStrings('replace',['op:all']).value,'青・青');
 const h=['op:first','check','op:all','check','op:all'];assert.equal(replayStrings('replace',h).value,'森・港');assert.equal(replayStrings('replace',[...h,'check']).done,true);
 assert.equal(replayStrings('replace',['op:all','check']),null);
});
test('pipeline trims each field before removing empties and supports undo',()=>{
 const h=['op:split','op:trim','op:remove'];assert.deepEqual(replayStrings('pipeline',h).value,['水辺','街']);
 const h2=[...h,'check','op:split','op:remove','op:trim'];assert.deepEqual(replayStrings('pipeline',h2).value,['港','','森']);assert.equal(replayStrings('pipeline',[...h2,'check']),null);
 const corrected=[...h2,'undo','undo','op:trim','op:remove','check'];assert.equal(replayStrings('pipeline',corrected).done,true);
 assert.equal(replayStrings('pipeline',['op:trim']),null);
});
