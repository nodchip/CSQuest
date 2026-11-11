import test from 'node:test';
import assert from 'node:assert/strict';
import {storyClueDetails,storyClueRegions,storyReflectionReady,validStoryHeard} from '../src/adventure-rumors.js';
import {storyRegions} from '../src/world-progress.js';

test('all original story regions have their own speaker and recorded clue',()=>{
 assert.deepEqual(new Set(storyClueRegions),new Set(storyRegions));
 for(const id of storyRegions){const c=storyClueDetails[id];assert.ok(c.speaker&&c.line&&c.note);}
 assert.equal(new Set(storyRegions.map(id=>storyClueDetails[id].note)).size,storyRegions.length);
});
test('reflection requires three distinct non-workshop stories',()=>{
 assert.equal(storyReflectionReady(['workshop','river','city']),false);
 assert.equal(storyReflectionReady(['river','river','city']),false);
 assert.equal(storyReflectionReady(['river','city','harbor']),true);
 assert.equal(validStoryHeard(['river','city','harbor']),true);
 assert.equal(validStoryHeard(['river','river']),false);
 assert.equal(validStoryHeard(['unknown']),false);
});
