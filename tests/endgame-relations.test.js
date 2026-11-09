import test from 'node:test';
import assert from 'node:assert/strict';
import {replayRelation} from '../src/endgame-relations.js';

test('a relation may have multiple destinations for one flower and none for another',()=>{
 const h=['pair:0:1','pair:1:1','pair:0:0','check'];
 assert.equal(replayRelation('relation',h).scene,1);
 assert.equal(replayRelation('relation',[...h,'pair:0:1','pair:2:0','check']).done,true);
 assert.equal(replayRelation('relation',['pair:0:0','check']),null);
});
test('function requires every input once and permits repeated outputs',()=>{
 assert.equal(replayRelation('function',['pair:0:0','pair:1:0','pair:2:1','check','pair:0:1','pair:1:0','pair:2:0','check']).done,true);
 assert.equal(replayRelation('function',['pair:0:0','pair:0:1','pair:1:0','pair:2:1','check']),null);
 assert.equal(replayRelation('function',['pair:0:0','pair:1:0','check']),null);
});
test('composition uses the intermediate person and can be corrected and restored',()=>{
 const h=['pair:0:1','pair:0:1','pair:0:0','pair:1:0','pair:2:1'];
 assert.deepEqual(replayRelation('composition',h).chosen,['0:0','1:0','2:1']);
 assert.equal(replayRelation('composition',[...h,'check','pair:0:1','pair:1:0','pair:2:0','check']).done,true);
 assert.equal(replayRelation('composition',['pair:3:0']),null);
 assert.equal(replayRelation('composition',[...h,'check','pair:0:1','pair:1:0','pair:2:0','check','pair:0:0']),null);
});
