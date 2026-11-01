import test from 'node:test';
import assert from 'node:assert/strict';
import {hueCases,hueShifts,hueSats,hueVals,hsvRgb,hueImage,hueCreate,hueCorrect,hueComplete,hueRestore} from '../src/image-hue.js';
test('HSV conversion preserves primaries, wraparound, achromatic and value properties',()=>{
 const primaries=[[255,0,0],[255,255,0],[0,255,0],[0,255,255],[0,0,255],[255,0,255]];for(let i=0;i<6;i++)assert.deepEqual(hsvRgb(i*60,1,1),primaries[i]);assert.deepEqual(hsvRgb(360,1,1),primaries[0]);assert.deepEqual(hsvRgb(-60,1,1),primaries[5]);for(const h of hueShifts){assert.deepEqual(hsvRgb(h,0,1),[255,255,255]);assert.deepEqual(hsvRgb(h,1,0),[0,0,0]);assert.deepEqual(hsvRgb(h,0,.5),[128,128,128]);}assert.throws(()=>hsvRgb(0,-1,1));
});
test('four image targets and gray hue equivalence; all settings produce valid RGB',()=>{
 assert.deepEqual(hueImage('rotate',hueCases.rotate.target),[[0,255,0],[0,0,255],[255,0,0],[255,255,255]]);assert.deepEqual(hueImage('soft',hueCases.soft.target),[[128,128,255],[255,128,128],[128,255,128],[255,255,255]]);
 for(const id of Object.keys(hueCases))for(const shift of hueShifts)for(const sat of hueSats)for(const val of hueVals){const image=hueImage(id,{shift,sat,val});assert.equal(image.length,4);assert.ok(image.flat().every(n=>Number.isInteger(n)&&n>=0&&n<=255));if(id==='gray'&&val===100)assert.deepEqual(image,hueImage(id,hueCases.gray.target));}
});
test('all cases require matching checked output; drafts validate and copy',()=>{
 const s=hueCreate();for(const id of Object.keys(hueCases))s.trials[id]={...hueCases[id].target,checked:true};assert.equal(hueComplete(s),true);const copy=hueRestore(s);copy.trials.rotate.shift=0;assert.equal(hueCorrect('rotate',copy.trials.rotate),false);assert.equal(hueComplete(s),true);s.trials.gray.shift=30;assert.equal(hueCorrect('gray',s.trials.gray),true);s.trials.dim.val=25;assert.throws(()=>hueRestore(s));
});
