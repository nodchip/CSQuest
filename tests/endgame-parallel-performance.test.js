import test from 'node:test';
import assert from 'node:assert/strict';
import {elapsed,replayPerformance} from '../src/endgame-parallel-performance.js';
test('elapsed time uses fixed preparation and equal work on simultaneous workers',()=>{
 assert.deepEqual([elapsed(6,1),elapsed(6,2),elapsed(6,3),elapsed(12,1),elapsed(12,2),elapsed(12,3)],[8,5,4,14,8,6]);
 assert.equal(elapsed(7,2),null);
});
test('serial cases require preparation and all packages, support correction and replay',()=>{
 assert.equal(replayPerformance('serial',['pack:1']),null);
 const h=['prepare','pack:3','pack:3','check'];
 assert.equal(replayPerformance('serial',h).scene,1);
 assert.equal(replayPerformance('serial',[...h,'prepare','pack:3','pack:3','pack:3','pack:3','check']).done,true);
 assert.equal(replayPerformance('serial',['prepare','pack:3','reset']).packed,0);
});
test('parallel comparison tests both worker counts before accepting fastest',()=>{
 assert.equal(replayPerformance('parallel',['try:2','choose:3']),null);
 const h=['try:2','try:3','choose:3'];
 assert.equal(replayPerformance('parallel',[...h,'try:3','try:2','choose:3']).done,true);
 assert.equal(replayPerformance('parallel',['try:2','try:3','choose:2']),null);
});
test('adjustment cost produces a tie for six and three workers wins for twelve',()=>{
 assert.deepEqual([2,3,6].map(p=>elapsed(6,p,true)),[6,6,8]);
 assert.deepEqual([2,3,6].map(p=>elapsed(12,p,true)),[9,8,9]);
 for(const tied of [2,3])assert.equal(replayPerformance('overhead',['try:2','try:3','try:6',`choose:${tied}`,'try:2','try:3','try:6','choose:3']).done,true);
 assert.equal(replayPerformance('overhead',['try:2','try:3','try:6','choose:6']),null);
});
