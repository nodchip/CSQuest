import test from 'node:test';import assert from 'node:assert/strict';import {replayScopeLight} from '../src/endgame-scope-light.js';
test('scope and call combinations resolve to independent expected boxes',()=>{
 assert.deepEqual(replayScopeLight('lexical',['box:workshop','box:workshop']).results.map(x=>x.value),[1,1]);
 assert.deepEqual(replayScopeLight('dynamic',['box:workshop','box:room']).results.map(x=>x.value),[1,2]);
});
test('comparison requires both outcomes, rejects wrong or extra histories',()=>{
 const h=['box:workshop','box:room'];assert.equal(replayScopeLight('compare',h).done,false);assert.equal(replayScopeLight('compare',[...h,'answer:dynamic']).done,true);
 assert.equal(replayScopeLight('dynamic',['box:room']),null);assert.equal(replayScopeLight('compare',[...h,'answer:lexical']),null);assert.equal(replayScopeLight('lexical',['box:workshop','box:workshop','box:room']),null);assert.equal(replayScopeLight('bad',[]),null);
});
