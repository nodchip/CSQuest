import test from 'node:test';
import assert from 'node:assert/strict';
import {replaySpanJourney,advanceSpanJourney} from '../src/endgame-span-journey.js';
test('fixed combinations and independence decisions',()=>{
 let p=replaySpanJourney('basis',['try:2,1','answer:independent']);assert.deepEqual(p.results[0].sum,[2,1]);assert.equal(p.done,true);
 p=replaySpanJourney('repeat',['try:2,0','try:0,1','answer:dependent']);assert.deepEqual(p.results.map(x=>x.sum),[[2,2],[2,2]]);assert.equal(p.done,true);
 p=replaySpanJourney('outside',['try:1,0','try:0,1','reason:equal','answer:dependent']);assert.deepEqual(p.results.map(x=>x.sum),[[1,1],[2,2]]);assert.equal(p.done,true);
});
test('insufficient examples and wrong responses are rejected; restore and reset',()=>{
 assert.equal(advanceSpanJourney('repeat',['try:2,0'],'answer:dependent'),null);
 assert.equal(advanceSpanJourney('outside',['try:1,0','try:0,1'],'answer:dependent'),null);
 let h=JSON.parse(JSON.stringify(['try:1,0','try:0,1']));h=advanceSpanJourney('outside',h,'reason:equal');assert.equal(replaySpanJourney('outside',h).reason,true);
 assert.deepEqual(advanceSpanJourney('outside',h,'reset'),[]);
 assert.equal(advanceSpanJourney('basis',['try:2,1'],'answer:dependent'),null);
});
