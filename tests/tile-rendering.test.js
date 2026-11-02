import {test} from 'node:test';
import assert from 'node:assert/strict';
import {tileReplay,tileCreate,tileStep,tileComplete,tileRestore} from '../src/tile-rendering.js';

test('both opaque draw orders yield the same pixels but different modeled shading counts',()=>{
 for(const mode of ['immediate','tiled'])for(const order of ['far','near']){const seq=order==='far'?['far','mid','near']:['near','mid','far'],h=seq.map(x=>`draw:${x}`);const pre=tileReplay(mode,order,h);assert.deepEqual(pre.pixels.map(p=>p.color),['赤','青']);assert.equal(pre.tested,5);assert.equal(pre.shaded,order==='far'?5:2);assert.equal(pre.writes,mode==='immediate'?pre.shaded:0);if(mode==='tiled')h.push('flush');const r=tileReplay(mode,order,h);assert.equal(r.writes,mode==='tiled'?2:r.shaded);assert.equal(r.finished,true);assert.throws(()=>tileReplay(mode,order,[...h,'flush']));}
});
test('four trials, validated replay and the draw-order conclusion are required',()=>{
 let q=tileCreate();for(const mode of ['immediate','tiled'])for(const order of ['far','near']){q.mode=mode;q.order=order;while(tileReplay(mode,order,q.histories[`${mode}:${order}`]).next){const next=tileReplay(mode,order,q.histories[`${mode}:${order}`]).next;tileStep(q,next);q=tileRestore(q);}}q.reflection='fixed';assert.equal(tileComplete(q),false);q.reflection='order';assert.equal(tileComplete(q),true);const copy=tileRestore(q);copy.histories['tiled:near'].pop();assert.equal(tileComplete(copy),false);assert.equal(tileComplete(q),true);assert.throws(()=>tileRestore({...q,histories:{...q.histories,'immediate:far':['draw:near']}}));
});
