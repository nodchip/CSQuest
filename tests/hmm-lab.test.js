import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmmTags,restoreHmmTags,hmmLabWords,hmmLabPaths,hmmLabResult} from '../src/hmm-tags.js';

test('three-word experiment shows all optimal paths, totals and each prefix maximum',()=>{
 const emit={light:{N:1,V:1},stone:{N:2,V:1},other:{N:1,V:2}},start={N:3,V:2};
 let ties=0;
 for(const a of hmmLabWords)for(const b of hmmLabWords)for(const c of hmmLabWords){
  const words=[a,b,c],result=hmmLabResult(words);
  const independent=path=>[...path].reduce((score,tag,i)=>score*(i===0?start[tag]:(path[i-1]===tag?1:3))*emit[words[i]][tag],1);
  const scores=hmmLabPaths.map(path=>({path,score:independent(path)})),max=Math.max(...scores.map(x=>x.score));
  assert.deepEqual(result.paths,scores);assert.deepEqual(result.best,scores.filter(x=>x.score===max).map(x=>x.path));
  assert.equal(result.total,scores.reduce((sum,x)=>sum+x.score,0));assert.equal(result.denominator,5120);
  for(let i=0;i<3;i++)for(const tag of ['N','V']){
   const candidates=[...new Set(hmmLabPaths.map(p=>p.slice(0,i+1)))].filter(p=>p.endsWith(tag));
   assert.equal(result.stages[i][tag].score,Math.max(...candidates.map(independent)));
  }
  if(result.best.length>1)ties++;
 }
 assert.ok(ties>0,'test inputs include ties');
 assert.throws(()=>hmmLabResult(['light','stone']));
});

test('experiment survives reload and legacy records remain valid',()=>{
 const s=createHmmTags();s.lab={words:['other','stone','light'],guess:'NVN',checked:true};
 const restored=restoreHmmTags(s);assert.deepEqual(restored.lab,s.lab);assert.notEqual(restored.lab.words,s.lab.words);
 const {lab,...legacy}=s;assert.deepEqual(restoreHmmTags(legacy).lab,createHmmTags().lab);
 assert.throws(()=>restoreHmmTags({...s,lab:{...s.lab,words:['light','bad','stone']}}));
 assert.throws(()=>restoreHmmTags({...s,lab:{...s.lab,guess:null}}));
});
