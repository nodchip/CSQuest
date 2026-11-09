import test from 'node:test';
import assert from 'node:assert/strict';
import {replayCollections} from '../src/endgame-collections.js';
const run=(op,field,value)=>[`op:${op}`,field,...value?[`value:${value}`]:[],'run'];
test('list preserves duplicate values and positions shift after removal',()=>{
 const h=[...run('insert','index:1','A'),...run('insert','index:2','B'),...run('insert','index:3','A'),...run('read','index:2'),...run('delete','index:2'),...run('read','index:4'),...run('read','index:2')];
 const p=replayCollections('list',h);assert.equal(p.done,true);assert.deepEqual(p.items,['A','A']);assert.match(p.results[3].last,/B/);assert.match(p.results[5].last,/範囲外/);assert.match(p.results[6].last,/A/);
 assert.equal(replayCollections('list',['op:insert','index:2','value:A','run']),null);
});
test('dictionary distinguishes an empty stored value from a missing key',()=>{
 const h=[...run('put','key:11','moon'),...run('put','key:12','empty'),...run('put','key:11','star'),...run('read','key:12'),...run('read','key:13'),...run('delete','key:13'),...run('read','key:11')];
 const p=replayCollections('map',h);assert.equal(p.done,true);assert.deepEqual(p.entries,{11:'star',12:'empty'});assert.match(p.results[3].last,/空の名前/);assert.match(p.results[4].last,/未登録/);assert.match(p.results[6].last,/星の本/);
});
test('operate a structure before selecting it for the stated need',()=>{
 assert.equal(replayCollections('choose',['choose:map','trial:putMoon','trial:putStar','trial:get','check']),null);
 assert.equal(replayCollections('choose',['choose:queue','check']),null);
 const h=['choose:map','trial:putMoon','trial:putStar','trial:get','choose:queue','trial:addA','trial:addB','trial:take','check','choose:map','trial:putMoon','trial:putStar','trial:get','check','choose:set','trial:addA','trial:addB','trial:addA','check'];assert.equal(replayCollections('choose',h).done,true);
 const p=replayCollections('choose',['choose:set','trial:addA','trial:addB','trial:addA']);assert.deepEqual(p.trialItems,['アオイ','ナギ']);
 const q=replayCollections('choose',['choose:queue','trial:addA','trial:addB','trial:take']);assert.deepEqual(q.trialItems,['ナギ']);assert.match(q.trialLast,/アオイ/);
 const m=replayCollections('choose',['choose:map','trial:putMoon','trial:putStar','trial:get']);assert.deepEqual(m.trialEntries,{'11':'星の本'});assert.match(m.trialLast,/星の本/);
});
