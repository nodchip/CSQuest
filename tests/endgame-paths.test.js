import test from 'node:test';
import assert from 'node:assert/strict';
import {replayPaths} from '../src/endgame-paths.js';

test('an unguarded back door permits entry and both paths can be checked after repair',()=>{
 const result=replayPaths(['test:guest:back','guard:back','test:guest:front','test:guest:back','test:keeper:front','test:keeper:back']);
 assert.equal(result.sawLeak,true);assert.equal(result.done,true);assert.deepEqual(result.guarded,{front:true,back:true});
 assert.equal(replayPaths(['test:guest:back']).last.allowed,true);
 assert.equal(replayPaths(['test:guest:back','guard:back','test:guest:back']).last.allowed,false);
 for(const door of ['front','back']){
  assert.equal(replayPaths(['test:guest:back','guard:back',`test:guest:${door}`]).last.allowed,false);
  assert.equal(replayPaths(['test:guest:back','guard:back',`test:keeper:${door}`]).last.allowed,true);
 }
});
test('repair or observation alone cannot bypass all checks',()=>{
 assert.equal(replayPaths(['guard:back','test:guest:front','test:guest:back','test:keeper:front','test:keeper:back']).done,false);
 assert.equal(replayPaths(['test:guest:back','guard:back','test:guest:front','guard:front']).tested.length,0);
 assert.equal(replayPaths(['test:unknown:back']),null);
});
