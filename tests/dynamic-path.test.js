import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createDynamicPath,dynamicPathAct,dynamicPathComplete,restoreDynamicPath} from '../src/dynamic-path.js';
test('the bridge closes after arrival at A and the old plan cannot pass',()=>{
 let s=createDynamicPath();assert.equal(dynamicPathAct(s,'move:G').ok,false);s=dynamicPathAct(s,'move:A').state;assert.equal(s.closed,true);s=dynamicPathAct(s,'move:G').state;assert.equal(s.place,'A');assert.equal(s.attempted,true);s=dynamicPathAct(s,'move:B').state;s=dynamicPathAct(s,'move:G').state;assert.equal(s.place,'G');assert.equal(s.arrived,true);assert.equal(dynamicPathComplete(s),false);
});
test('replay validates actions and requires a checked response',()=>{
 let s=createDynamicPath();for(const a of ['move:A','move:G','move:B','move:G','answer:replan','check']){const r=dynamicPathAct(s,a);assert.equal(r.ok,true);s=r.state;}assert.equal(dynamicPathComplete(s),true);assert.deepEqual(restoreDynamicPath(s),s);assert.throws(()=>restoreDynamicPath({history:['move:B']}),RangeError);
});
