import test from 'node:test';
import assert from 'node:assert/strict';
import {bucketCases,createBucketTrial,stepBucket,createBucketSet,bucketComplete,restoreBucketSet} from '../src/bucket-sort.js';

test('distribution and stable adjacent swaps produce the sorted input in each example',()=>{
  const all=createBucketSet();for(const [id,data] of Object.entries(bucketCases)){let s=createBucketTrial(id);for(const item of data.items)s=stepBucket(s,`bucket:${Math.floor(item.value/25)}`);assert.equal(s.phase,'sort');for(let i=0;i<4;i++)while(s.buckets[i].some((x,j,b)=>j+1<b.length&&x.value>b[j+1].value))s=stepBucket(s,`sort:${i}`);s=stepBucket(s,'gather');assert.deepEqual(s.output,data.items.slice().sort((a,b)=>a.value-b.value));all.trials[id]=s;}assert.ok(bucketComplete(all));assert.deepEqual(all.trials.first.output.filter(x=>x.value===17).map(x=>x.id),['B','F']);
});
test('wrong ranges and premature collection do not advance and partial histories restore',()=>{
  let s=createBucketTrial('first');assert.equal(stepBucket(s,'bucket:3').history.length,0);s=stepBucket(s,'bucket:2');const histories={first:s.history,second:[]};assert.equal(restoreBucketSet({selected:'first',histories}).trials.first.buckets[2][0].id,'A');assert.throws(()=>restoreBucketSet({selected:'first',histories:{...histories,first:['gather']}}));
});
