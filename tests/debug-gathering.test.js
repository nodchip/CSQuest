import test from 'node:test';
import assert from 'node:assert/strict';
import {GATHERING_DEBUG_ENABLED,gatheringDebugState} from '../src/debug-gathering-state.js';
import {worldFinaleReady} from '../src/world-progress.js';

test('debug is disabled and its fixture leaves exactly the intended quest',()=>{
 assert.equal(GATHERING_DEBUG_ENABLED,false);
 const {completed}=gatheringDebugState();
 assert.equal(worldFinaleReady(completed),false);
 assert.equal(completed.includes('city-queue'),false);
 assert.equal(worldFinaleReady([...completed,'city-queue']),true);
});
