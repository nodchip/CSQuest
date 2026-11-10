import test from 'node:test';
import assert from 'node:assert/strict';
import {replayEthics} from '../src/endgame-ethics.js';
test('consequences and relevant questions reject unsupported absolute claims and allow correction',()=>{
 for(const kind of ['impact','questions']){
  assert.equal(replayEthics(kind,['select:a','select:c','check']),null);
  const h=['select:c','select:c','select:a','select:b','check'];
  assert.equal(replayEthics(kind,h).scene,1);
  assert.equal(replayEthics(kind,[...h,'select:b','select:a','check']).done,true);
 }
});
test('both coherent plans are accepted in both situations with matching reasons and residual risks',()=>{
 for(const first of ['counter','none'])for(const second of ['counter','none']){
  const h=[`plan:${first}`,`reason:${first}`,`risk:${first}`,'check',`plan:${second}`,`reason:${second}`,`risk:${second}`,'check'];
  assert.equal(replayEthics('decision',h).done,true);
 }
 assert.equal(replayEthics('decision',['plan:counter','reason:counter','risk:none','check']),null);
 assert.equal(replayEthics('decision',['plan:counter','reason:counter','plan:none','risk:none','check']),null);
});
