import test from 'node:test';import assert from 'node:assert/strict';import {replayDnsExpiry} from '../src/endgame-dns-expiry.js';
test('independent queries return old before expiry and new at or after expiry',()=>{
 const short=replayDnsExpiry('short',['answer:old','answer:new']);
 assert.deepEqual(short.results.map(x=>[x.time,x.ttl,x.answer,x.source,x.stale]),[[1,2,'192.0.2.42','cache',true],[3,2,'192.0.2.84','authority',false]]);
 const long=replayDnsExpiry('long',['answer:old','answer:old','answer:new']);
 assert.deepEqual(long.results.map(x=>[x.time,x.ttl,x.answer,x.source,x.stale]),[[1,4,'192.0.2.42','cache',true],[3,4,'192.0.2.42','cache',true],[4,4,'192.0.2.84','authority',false]]);
});
test('incorrect and post-completion actions are rejected; comparison requires both cases',()=>{
 assert.equal(replayDnsExpiry('short',['answer:new']),null);assert.equal(replayDnsExpiry('short',['answer:old','answer:new','answer:new']),null);
 const h=['answer:new','answer:old'];assert.equal(replayDnsExpiry('compare',h).done,false);assert.equal(replayDnsExpiry('compare',[...h,'compare:long']).done,true);assert.equal(replayDnsExpiry('compare',[...h,'compare:short']),null);
 assert.equal(replayDnsExpiry('bogus',[]),null);
});
