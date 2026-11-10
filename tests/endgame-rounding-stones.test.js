import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {roundingStoneComparison,replayRoundingStones} from '../src/endgame-rounding-stones.js';
test('1.0625 は1と1.125の中間で偶数側1',()=>{assert.equal(replayRoundingStones('even',['answer:1.125']),null);assert.equal(replayRoundingStones('even',['answer:1']).done,true);});
test('1.1875 は1.125と1.25の中間で偶数側1.25',()=>{assert.equal(replayRoundingStones('odd',['answer:1.125']),null);assert.equal(replayRoundingStones('odd',['answer:1.25']).done,true);});
test('丸めを各加算後に行うと順によって1と1.125になる',()=>{assert.deepEqual(roundingStoneComparison(),{leftFirst:1,left:1,rightFirst:0.125,right:1.125});assert.equal(replayRoundingStones('compare',['try:left','answer:different']),null);let h=['try:right','try:left'];assert.deepEqual(replayRoundingStones('compare',JSON.parse(JSON.stringify(h))).tried,['right','left']);assert.equal(replayRoundingStones('compare',[...h,'answer:same']),null);assert.equal(replayRoundingStones('compare',[...h,'answer:different']).done,true);assert.equal(replayRoundingStones('compare',[...h,'answer:different','reset']),null);});
test('途中操作とリセット',()=>{assert.deepEqual(replayRoundingStones('compare',['try:left','reset']).tried,[]);assert.equal(replayRoundingStones('even',['check']),null);assert.equal(replayRoundingStones('unknown',[]),null);});
