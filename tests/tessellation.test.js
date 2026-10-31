import test from 'node:test';
import assert from 'node:assert/strict';
import {tessellationCases,tessCross,tessEar,createTessTrial,tessStep,createTessellation,tessComplete,restoreTessellation} from '../src/tessellation.js';
function twiceArea(points,keys){return Math.abs(keys.reduce((sum,k,i)=>{const a=points[k],b=points[keys[(i+1)%keys.length]];return sum+a[0]*b[1]-a[1]*b[0];},0));}
test('every valid ear-cutting path yields three positive triangles with original total area',()=>{
 for(const [id,item] of Object.entries(tessellationCases)){const stack=[createTessTrial(id)];let solved=0;while(stack.length){const s=stack.pop();if(s.done){solved++;assert.equal(s.triangles.length,3);for(const tri of s.triangles)assert.ok(twiceArea(item.points,tri)>0);assert.equal(s.triangles.reduce((sum,tri)=>sum+twiceArea(item.points,tri),0),twiceArea(item.points,Object.keys(item.points)));continue;}for(const v of s.remaining){const n=tessStep(s,v);if(n.history.length>s.history.length)stack.push(n);}}assert.ok(solved>0);}
 const s=createTessTrial('concave');assert.equal(tessEar('concave',s.remaining,'D').ok,false);assert.equal(tessEar('concave',s.remaining,'A').ok,false);
});
test('both polygons and replay validation',()=>{
 const s=createTessellation();for(const id of Object.keys(tessellationCases)){while(!s.trials[id].done){const current=s.trials[id],vertex=current.remaining.find(v=>tessEar(id,current.remaining,v).ok);assert.ok(vertex);s.trials[id]=tessStep(current,vertex);}}assert.equal(tessComplete(s),true);const r=restoreTessellation({selected:'concave',histories:{convex:s.trials.convex.history,concave:s.trials.concave.history}});assert.equal(tessComplete(r),true);assert.throws(()=>restoreTessellation({selected:'concave',histories:{convex:[],concave:['D']}}),RangeError);
});
