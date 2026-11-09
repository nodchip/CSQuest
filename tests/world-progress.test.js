import test from 'node:test';
import assert from 'node:assert/strict';
import {worldRegionQuests,worldRegionProgress,helpedRegionCount,worldFinaleReady} from '../src/world-progress.js';

test('six different regions need two different quests each',()=>{
 const regions=['workshop','city','archive','windmill','mountain','valley'];
 const six=regions.flatMap(region=>worldRegionQuests[region].slice(0,2));
 assert.equal(helpedRegionCount(six),6);
 assert.equal(worldFinaleReady(six),true);
 assert.equal(worldFinaleReady(six.slice(0,-1)),false);
 const repeated=[...six.slice(0,-1),six.at(-2)];
 assert.equal(worldFinaleReady(repeated),false);
 assert.equal(worldRegionProgress(repeated).valley,1);
});

test('extra completions in one place never fill another place',()=>{
 const completed=[...worldRegionQuests.workshop,...worldRegionQuests.mountain,...worldRegionQuests.city];
 assert.equal(worldRegionProgress(completed).workshop,2);
 assert.equal(helpedRegionCount(completed),3);
 assert.equal(worldFinaleReady(completed),false);
});

test('eight or more completed quests do not replace two in each of six regions',()=>{
 const a=worldRegionQuests.workshop.slice(0,3),b=worldRegionQuests.city.slice(0,2),c=worldRegionQuests.archive.slice(0,3);
 assert.equal([...a,...b,...c].length,8);
 assert.equal(helpedRegionCount([...a,...b,...c]),3);
 assert.equal(worldFinaleReady([...a,...b,...c]),false);
});

test('each existing quest belongs to at most one region',()=>{
 const ids=Object.values(worldRegionQuests).flat();
 assert.equal(new Set(ids).size,ids.length);
});
