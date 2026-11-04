import test from 'node:test';
import assert from 'node:assert/strict';
import {growthCases,growthDistribution,growthDistributionSizes,searchTrace,worstComparisons,growthCorrect,createGrowth,restoreGrowth,growthComplete} from '../src/search-growth.js';

test('both algorithms agree on membership for all modeled sizes and targets',()=>{
  for(let size=1;size<=64;size++)for(let target=0;target<=2*size+1;target++)for(const mode of ['linear','binary']){
    const result=searchTrace(size,target,mode),exists=target>=2&&target<=2*size&&target%2===0;
    assert.equal(result.found,exists);assert.ok(result.visited.length>=1&&result.visited.length<=size);if(exists)assert.equal(result.visited.at(-1),target);
  }
});
test('worst counts follow linear and binary bounds for powers of two',()=>{
  for(const size of [8,16,32,64]){assert.equal(worstComparisons(size,'linear'),size);assert.equal(worstComparisons(size,'binary'),Math.log2(size)+1);}
  assert.deepEqual(Object.values(growthCases).map(({size,target})=>['linear','binary'].map(method=>searchTrace(size,target,method).visited.length)),[[8,4],[64,7],[1,6]]);
});
test('completion and restoration require each checked comparison',()=>{
  const state=createGrowth();for(const [id,task] of Object.entries(growthCases))state.choices[id]={linear:searchTrace(task.size,task.target,'linear').visited.length,binary:searchTrace(task.size,task.target,'binary').visited.length,checked:true};
  assert.equal(growthComplete(state),true);const restored=restoreGrowth(state);state.choices.first.binary=4;assert.equal(growthCorrect('first',state.choices.first),false);assert.equal(growthComplete(restored),true);
  state.choices.first.binary=99;assert.throws(()=>restoreGrowth(state),RangeError);
});
test('successful-search distribution counts each existing book equally',()=>{
 const a=growthDistribution(8,'linear'),b=growthDistribution(8,'binary');
 assert.deepEqual([a.minimum,a.maximum,a.total,a.count],[1,8,36,8]);
 assert.deepEqual([b.minimum,b.maximum,b.total,b.count],[1,4,21,8]);
 assert.deepEqual(b.histogram,[{count:1,frequency:1},{count:2,frequency:2},{count:3,frequency:4},{count:4,frequency:1}]);
 for(const size of growthDistributionSizes)for(const mode of ['linear','binary']){const d=growthDistribution(size,mode);assert.equal(d.histogram.reduce((sum,h)=>sum+h.frequency,0),size);assert.equal(d.histogram.reduce((sum,h)=>sum+h.count*h.frequency,0),d.total);}
 assert.throws(()=>growthDistribution(7,'linear'));assert.throws(()=>growthDistribution(8,'other'));
 const old=createGrowth();delete old.distributionSize;assert.equal(restoreGrowth(old).distributionSize,8);assert.equal(restoreGrowth({...old,distributionSize:64}).distributionSize,64);assert.throws(()=>restoreGrowth({...old,distributionSize:7}));
});
