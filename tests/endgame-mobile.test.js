import test from 'node:test';
import assert from 'node:assert/strict';
import {replayLayers,replayOffline,replayConflict,conditionalSave} from '../src/endgame-mobile.js';

test('each layer route returns a concrete success, value or failure',()=>{
 const route=op=>[`choose:${op}`,'go:service','go:storage','go:service','go:screen'];
 const p=replayLayers([...route('save'),...route('read'),...route('save')]);
 assert.equal(p.done,true);assert.deepEqual(p.results.map(r=>[r.stored,r.response]),[[3,'saved'],[5,'value:5'],[2,'failed']]);
 assert.equal(replayLayers(['choose:save','go:storage']),null);
 assert.equal(replayLayers(['choose:read']),null);
});
test('stale drafts remain intact and both save orders preserve the two intended edits',()=>{
 const server={version:2,wind:'西',sky:'晴れ'},sameContentStale={base:1,wind:'西',sky:'晴れ'};
 assert.deepEqual(conditionalSave(server,sameContentStale),{ok:false,server,draft:sameContentStale});
 assert.deepEqual(conditionalSave(server,{base:2,wind:'西',sky:'曇り'}).server,{version:3,wind:'西',sky:'曇り'});
 const a=['send:A','send:B'];const rejected=replayConflict(a).state;
 assert.deepEqual(rejected.server,{version:2,wind:'西',sky:'晴れ'});
 assert.deepEqual(rejected.drafts.B,{base:1,wind:'東',sky:'曇り'});
 assert.equal(replayConflict([...a,'send:B']),null);
 const h=[...a,'refresh:B','merge:B','send:B','check','send:B','send:A','refresh:A','merge:A','send:A','check'];
 const done=replayConflict(h);assert.equal(done.done,true);
 assert.deepEqual(done.results.map(r=>r.server),[{version:3,wind:'西',sky:'曇り'},{version:3,wind:'西',sky:'曇り'}]);
 assert.equal(replayConflict(['send:A','send:B','merge:B']),null);
});
test('acknowledgement loss retains pending and a retry reuses the observation ID',()=>{
 const h=['observe:A','connect','send:A'];const p=replayOffline(h);
 assert.deepEqual(p.pending,['A']);assert.deepEqual(p.recorded,['A']);assert.deepEqual(p.sent,[]);
 assert.equal(replayOffline(['observe:A','send:A']),null);
 assert.equal(replayOffline([...h,'forget:A']),null);
 const done=replayOffline([...h,'send:A','observe:B','send:B']);
 assert.equal(done.done,true);assert.deepEqual(done.recorded,['A','B']);assert.deepEqual(done.sent,['A','B']);
});
