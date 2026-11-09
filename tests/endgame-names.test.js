import test from 'node:test';
import assert from 'node:assert/strict';
import {replayNames} from '../src/endgame-names.js';

test('names resolve independently, absent names are not guessed and an expired cache is refreshed',()=>{
 const actions=['lookup','address:21','lookup','address:35','lookup','missing','cache','lookup','address:48'];
 const result=replayNames(actions);
 assert.equal(result.done,true);assert.deepEqual(result.answers,[21,35,null,21,48]);
 assert.equal(result.cache['灯花の街の掲示係'].until,4);
 assert.equal(replayNames([...actions,'lookup']),null);
});
test('wrong addresses, guessing a missing name and using an expired cache fail',()=>{
 assert.equal(replayNames(['lookup','address:35']),null);
 assert.equal(replayNames(['lookup','address:21','cache']),null);
 assert.equal(replayNames(['lookup','address:21','lookup','address:35','lookup','address:21']),null);
 const throughCache=['lookup','address:21','lookup','address:35','lookup','missing','cache'];
 const beforeExpiry=replayNames(throughCache);
 assert.equal(beforeExpiry.cache['水辺の村の掲示係'].address,35);
 assert.equal(beforeExpiry.cache['山の掲示係'],undefined);
 assert.equal(replayNames([...throughCache,'cache']),null);
 assert.equal(replayNames([...throughCache,'lookup','address:21']),null);
});
