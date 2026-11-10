import test from 'node:test';
import assert from 'node:assert/strict';
import {replayColor,colorHex} from '../src/endgame-color.js';

test('additive primaries make yellow, white, and black without any light',()=>{
 const h=['toggle:R','toggle:G'];assert.equal(colorHex(replayColor('light',h).output),'#ffff00');
 assert.equal(replayColor('light',[...h,'check','toggle:R','toggle:G','toggle:B','check','check']).done,true);
 assert.equal(replayColor('light',['toggle:R','check']),null);
});
test('ideal cyan, magenta and yellow filters remove red, green and blue',()=>{
 const p=replayColor('filter',['toggle:C','toggle:Y']);assert.equal(colorHex(p.output),'#00ff00');
 assert.equal(replayColor('filter',['toggle:C','toggle:Y','check','toggle:C','toggle:M','check','check']).done,true);
 assert.equal(replayColor('filter',['toggle:R']),null);
});
test('comparison records both models and invalidates a changed selection',()=>{
 const h=['toggle:G','record','mode:cmy','toggle:C','toggle:Y','record'];assert.equal(replayColor('compare',[...h,'check']).scene,1);
 assert.equal(replayColor('compare',[...h,'toggle:Y','check']),null);
 assert.equal(replayColor('compare',[...h,'check','toggle:B','record','mode:cmy','toggle:C','toggle:M','record','check']).done,true);
});
