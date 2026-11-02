import test from 'node:test';
import assert from 'node:assert/strict';
import {microSurfaces,microAngles,microTrace,microCreate,microInspect,microRestore,microComplete} from '../src/microfacet-mirrors.js';
test('every facet follows vector reflection for all source and viewing angles',()=>{
 for(const s of Object.keys(microSurfaces))for(const light of microAngles)for(const view of microAngles){const r=microTrace(s,light,view);let matches=0;
  for(const f of r.facets){const rad=x=>x*Math.PI/180,source=[Math.sin(rad(light)),Math.cos(rad(light))],normal=[Math.sin(rad(f.normal)),Math.cos(rad(f.normal))],dot=source[0]*normal[0]+source[1]*normal[1],ref=[2*dot*normal[0]-source[0],2*dot*normal[1]-source[1]],viewVector=[Math.sin(rad(view)),Math.cos(rad(view))];const match=Math.hypot(ref[0]-viewVector[0],ref[1]-viewVector[1])<1e-9;assert.equal(f.match,match);matches+=Number(match);}
  assert.equal(r.matches,matches);
 }
 assert.deepEqual(['smooth','rough'].flatMap(s=>[0,30].map(v=>microTrace(s,0,v).matches)),[6,0,2,1]);
});
test('four observations restore and both reflections are required',()=>{
 const q=microCreate();microInspect(q);assert.deepEqual(microRestore(q),q);assert.throws(()=>microRestore({...q,seen:['rough:0:45']}));for(const s of ['smooth','rough'])for(const v of [0,30]){q.surface=s;q.view=v;microInspect(q);}q.reflection='distribution';assert.equal(microComplete(q),false);q.limits='geometry';assert.equal(microComplete(q),true);
});
