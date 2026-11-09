import test from 'node:test';
import assert from 'node:assert/strict';
import {worldRegionQuests,worldRegionProgress,helpedRegionCount,worldFinaleReady,storyRegions} from '../src/world-progress.js';

test('all twelve story regions need two different quests each',()=>{
 assert.equal(storyRegions.length,12);
 for(const region of storyRegions) assert.ok(worldRegionQuests[region].length>=2,region);
 const all=storyRegions.flatMap(region=>worldRegionQuests[region].slice(0,2));
 assert.equal(helpedRegionCount(all),12);
 assert.equal(worldFinaleReady(all),true);
 assert.equal(worldFinaleReady(all.slice(0,-1)),false);
 const repeated=[...all.slice(0,-1),all.at(-2)];
 assert.equal(worldFinaleReady(repeated),false);
 assert.equal(worldRegionProgress(repeated).station,1);
 for(const region of storyRegions){
  const missing=all.filter(id=>id!==worldRegionQuests[region][0]);
  assert.equal(worldFinaleReady(missing),false,region);
 }
});

test('extra completions in one place never fill another place',()=>{
 const completed=[...worldRegionQuests.workshop,...worldRegionQuests.mountain,...worldRegionQuests.city];
 assert.equal(worldRegionProgress(completed).workshop,2);
 assert.equal(helpedRegionCount(completed),3);
 assert.equal(worldFinaleReady(completed),false);
});

test('eight or more completed quests do not replace two in each region',()=>{
 const a=worldRegionQuests.workshop.slice(0,3),b=worldRegionQuests.city.slice(0,2),c=worldRegionQuests.archive.slice(0,3);
 assert.equal([...a,...b,...c].length,8);
 assert.equal(helpedRegionCount([...a,...b,...c]),3);
 assert.equal(worldFinaleReady([...a,...b,...c]),false);
});

test('lower regions and the opening lamp do not replace a story-region quest',()=>{
 const all=storyRegions.flatMap(region=>worldRegionQuests[region].slice(0,2));
 const other=worldRegionQuests.garden.slice(0,2);
 assert.equal(worldFinaleReady([...all.slice(1),...other,'opening']),false);
});

test('each existing quest belongs to at most one region',()=>{
 const ids=Object.values(worldRegionQuests).flat();
 assert.equal(new Set(ids).size,ids.length);
});
