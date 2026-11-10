import test from 'node:test';
import assert from 'node:assert/strict';
import {responseFor,replayHttp} from '../src/endgame-http.js';

test('GET and HEAD of existing and unknown paths have correct status and body',()=>{
 assert.deepEqual(responseFor('GET','river'),{method:'GET',path:'river',status:200,contentType:'text/plain',body:'水辺の水位は穏やか'});
 assert.equal(responseFor('HEAD','river').body,null);
 assert.equal(responseFor('GET','missing').status,404);
 assert.equal(responseFor('HEAD','missing').body,null);
 assert.equal(responseFor('POST','river'),null);
});
test('requests require the intended path, GET and all three scenes',()=>{
 const get=p=>[`path:${p}`,'method:GET','send','check'];
 assert.equal(replayHttp('request',['path:hill','method:GET','send','check']),null);
 assert.equal(replayHttp('request',['path:river','method:HEAD','send','check']),null);
 assert.equal(replayHttp('request',['path:hill','method:GET','send','path:river','check']),null);
 assert.equal(replayHttp('request',[...get('river'),...get('hill'),...get('missing')]).done,true);
});
test('comparison requires both methods for the same intended existing path',()=>{
 assert.equal(replayHttp('compare',['path:river','method:HEAD','send','check']),null);
 const compare=p=>[`path:${p}`,'method:GET','send','method:HEAD','send','check'];
 assert.equal(replayHttp('compare',[...compare('river'),...compare('hill')]).done,true);
 assert.equal(replayHttp('compare',['path:river','method:HEAD','send','method:GET','send','check']).scene,1);
 assert.equal(replayHttp('compare',['path:hill','method:GET','send','path:river','method:HEAD','send','check']),null);
});
test('repair identifies the fault and re-requests the intended record',()=>{
 assert.equal(replayHttp('repair',['judge:content']),null);
 const h=['judge:missing','path:hill','method:GET','send','check','judge:content','path:river','method:GET','send','check'];
 assert.equal(replayHttp('repair',h).done,true);
 assert.equal(replayHttp('repair',['judge:missing','path:hill','method:GET','send','reset']).diagnosed,false);
});
