import test from 'node:test';
import assert from 'node:assert/strict';
import {lensDepths,lensScreens,lensApertures,lensTrace,lensCreate,lensInspect,lensRestore,lensComplete} from '../src/thin-lens-focus.js';
test('three rays converge at the thin-lens image plane and blur scales with aperture',()=>{
 for(const d of Object.keys(lensDepths))for(const s of Object.keys(lensScreens))for(const a of Object.keys(lensApertures)){const r=lensTrace(d,s,a),imageDistance=1/(1-1/lensDepths[d].distance);assert.ok(Math.abs(r.imageDistance-imageDistance)<1e-12);for(const ray of r.rays){const geometric=ray.height*(1-lensScreens[s].distance/imageDistance);assert.ok(Math.abs(ray.screen-geometric)<1e-12);}if(d===s)assert.ok(r.width<1e-12);}
 assert.ok(Math.abs(lensTrace('far','near','wide').width-0.1)<1e-12);assert.ok(Math.abs(lensTrace('far','near','narrow').width-0.02)<1e-12);assert.ok(Math.abs(lensTrace('near','far','wide').width-1/15)<1e-12);
});
test('inspection history restores and the five comparisons and reflections are required',()=>{
 const q=lensCreate();lensInspect(q);assert.deepEqual(lensRestore(q),q);assert.throws(()=>lensRestore({...q,seen:['near:near:unknown']}));for(const [depth,screen,aperture] of [['far','near','wide'],['far','near','narrow'],['far','far','wide'],['near','far','wide']]){q.depth=depth;q.screen=screen;q.aperture=aperture;lensInspect(q);}q.focus='geometry';assert.equal(lensComplete(q),false);q.limits='diffraction';assert.equal(lensComplete(q),true);
});
