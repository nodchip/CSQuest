import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bundleCases,bundlePass,runBundle,createBundle,bundleComplete,restoreBundle} from '../src/bundle-withdrawal.js';
test('two successful compositions and an unsafe one are distinguished at boundaries',()=>{
 for(const plan of ['precheck','rollback'])for(const id of Object.keys(bundleCases))assert.equal(bundlePass(plan,id),true,`${plan} ${id}`);
 assert.deepEqual(runBundle('sequential','secondShort').stock,[1,0]);assert.equal(bundlePass('sequential','secondShort'),false);assert.deepEqual(runBundle('rollback','secondShort').stock,[3,0]);assert.deepEqual(runBundle('precheck','exact').stock,[0,0]);assert.deepEqual(runBundle('rollback','firstShort').stock,[1,3]);assert.throws(()=>runBundle('invalid','normal'),RangeError);
});
test('a valid plan must be tried in every case and restored state is independent',()=>{
 const s=createBundle();s.plan='rollback';for(const id of Object.keys(bundleCases))s.tested[id]=true;const copy=restoreBundle(s);assert.equal(bundleComplete(copy),true);s.tested.exact=false;assert.equal(bundleComplete(copy),true);assert.equal(bundleComplete(s),false);assert.throws(()=>restoreBundle({...copy,plan:'bad'}),RangeError);
});
