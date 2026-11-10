import test from 'node:test';
import assert from 'node:assert/strict';
import {replayLayers} from '../src/endgame-layers.js';

test('the inside destination and next-hop label are separate and ordered',()=>{
 assert.equal(replayLayers('wrap',['outer:sky']),null);
 assert.equal(replayLayers('wrap',['inner:river','outer:archive','check']),null);
 assert.equal(replayLayers('wrap',['inner:city','outer:sky','reset','inner:river','outer:sky','check']).finished,true);
 const h=['inner:river','outer:sky','check','next','inner:city','outer:harbor','check','next'];assert.equal(replayLayers('wrap',h).done,true);
});
test('relaying removes the incoming label and retains the final destination',()=>{
 let p=replayLayers('relay',['remove','outer:archive']);assert.equal(p.inner,'river');assert.equal(p.outer,'archive');
 assert.equal(replayLayers('relay',['outer:archive']),null);
 const h=['remove','outer:archive','send','next','remove','outer:windmill','send','next'];assert.equal(replayLayers('relay',h).done,true);
});
test('two routes require the next hop for each segment without changing the final destination',()=>{
 const h=['outer:sky','send','outer:archive','send'];let p=replayLayers('route',h);assert.equal(p.inner,'river');assert.equal(p.hop,2);
 assert.equal(replayLayers('route',['outer:archive','send']),null);
 p=replayLayers('route',[...h,'outer:river','send','next','outer:windmill','send','outer:sky','send','outer:city','send','next']);assert.equal(p.done,true);
});
