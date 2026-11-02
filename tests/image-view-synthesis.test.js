import test from 'node:test';
import assert from 'node:assert/strict';
import {ibrCapture,ibrBlend,ibrWarp,ibrCreate,ibrShoot,ibrInspect,ibrRestore,ibrComplete} from '../src/image-view-synthesis.js';
const ids=a=>a.map(x=>x?.id??'空');
test('reference reprojection aligns visible points and cannot invent a point hidden in both inputs',()=>{
 const l=ibrCapture('open',-1),r=ibrCapture('open',1),truth=ids(ibrCapture('open',0)),warp=ibrWarp(l,r),blend=ibrBlend(l,r);assert.equal(truth[3],'赤');assert.equal(truth[4],'青');assert.equal(warp[3],'赤');assert.equal(warp[4],'青');assert.ok(blend.some(x=>x.includes('各半分')));
 const hl=ibrCapture('hidden',-1),hr=ibrCapture('hidden',1),ht=ids(ibrCapture('hidden',0)),hw=ibrWarp(hl,hr);assert.ok(!ids(hl).includes('青'));assert.ok(!ids(hr).includes('青'));assert.equal(ht[3],'青');assert.equal(hw[3],'未確定');assert.equal(hw[2],'赤');assert.equal(hw[5],'金');
});
test('both references, four reconstructions, and both reflections are needed and restore validates',()=>{
 const q=ibrCreate();ibrShoot(q,'left');assert.throws(()=>ibrInspect(q));assert.deepEqual(ibrRestore(q),q);assert.throws(()=>ibrShoot(q,'left'));for(const s of ['open','hidden']){q.scene=s;if(s==='hidden')ibrShoot(q,'left');ibrShoot(q,'right');for(const m of ['blend','warp']){q.method=m;ibrInspect(q);}}q.alignment='parallax';assert.equal(ibrComplete(q),false);q.occlusion='missing';assert.equal(ibrComplete(q),true);
});
