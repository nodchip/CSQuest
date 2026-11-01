import test from 'node:test';
import assert from 'node:assert/strict';
import {bellDistribution,createBellComparison,bellComparisonAct,bellComparisonComplete,restoreBellComparison} from '../src/bell-comparison.js';

const close=(actual,expected)=>actual.forEach((v,i)=>assert.ok(Math.abs(v-expected[i])<1e-12,`${v} != ${expected[i]}`));
function act(s,a){const r=bellComparisonAct(s,a);assert.equal(r.ok,true,r.message);return r.state;}
test('Bell state and mixture have identical Z correlations but distinct X correlations',()=>{
 for(const prep of ['bell','mixture'])for(const flip of [false,true])for(const basis of ['Z','X']){
  const r=bellDistribution(prep,flip,basis);
  const expected=basis==='Z'?(flip?[0,.5,.5,0]:[.5,0,0,.5]):prep==='bell'?[.5,0,0,.5]:[.25,.25,.25,.25];
  close(r.joint,expected);close(r.marginalB,[.5,.5]);
  assert.ok(Math.abs(r.joint.reduce((a,b)=>a+b,0)-1)<1e-12);
 }
 assert.throws(()=>bellDistribution('other',false,'Z'),RangeError);
});
test('all six observations and correct reflection are required; progress replays',()=>{
 let s=createBellComparison();
 for(const a of ['observe','basis:X','observe','prep:mixture','observe','basis:Z','observe','prep:bell','flip','observe','basis:X','observe'])s=act(s,a);
 assert.equal(s.seen.length,6);assert.equal(bellComparisonComplete(s),false);
 s=act(s,'answer:signal');s=act(s,'check');assert.equal(bellComparisonComplete(s),false);
 s=act(s,'answer:coherence');s=act(s,'check');assert.equal(bellComparisonComplete(s),true);
 assert.deepEqual(restoreBellComparison(JSON.parse(JSON.stringify(s))),s);
 assert.throws(()=>restoreBellComparison({history:['observe','bad']}),RangeError);
 assert.throws(()=>restoreBellComparison({history:Array(101).fill('flip')}),RangeError);
});
