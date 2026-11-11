import test from 'node:test';import assert from 'node:assert/strict';import {replayEtagMap} from '../src/endgame-etag-map.js';
const unchanged=['predict:200','get','predict:304','get','next'];
const changed=['predict:200','get','update','predict:200','get','next'];
const full=['predict:200','get','predict:200','get','update','predict:200','get','next'];
const conditional=['predict:200','get','predict:304','get','update','predict:200','get','next'];
test('304 reuses cached body while changed version produces new 200',()=>{
 const u=replayEtagMap('unchanged',unchanged),c=replayEtagMap('changed',changed);
 assert.deepEqual(u.results[0].reports.map(x=>[x.status,x.body,x.cache,x.sent]),[[200,8,1,null],[304,0,1,'"map-v1"']]);
 assert.deepEqual(c.results[0].reports.map(x=>[x.status,x.body,x.cache,x.sent]),[[200,8,1,null],[200,8,2,'"map-v1"']]);
});
test('same fixed sequence sends 24 vs 16 body units and correct answers are required',()=>{
 const h=[...full,...conditional],p=replayEtagMap('compare',h);assert.deepEqual(p.results.map(x=>x.units),[24,16]);assert.equal(p.done,false);assert.equal(replayEtagMap('compare',[...h,'answer:revalidate']).done,true);
 for(const [kind,hist] of [['unchanged',['get']],['unchanged',['predict:304']],['unchanged',['predict:200','get','predict:200']],['changed',['predict:200','get','predict:200']],['unchanged',[...unchanged,'get']],['compare',[...h,'answer:forever']]])assert.equal(replayEtagMap(kind,hist),null);
 assert.equal(replayEtagMap('unchanged',['predict:200','reset']).index,0);
});
