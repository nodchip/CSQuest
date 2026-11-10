import test from 'node:test';
import assert from 'node:assert/strict';
import {classify,errors,replaySupervised,selectionCases} from '../src/endgame-supervised.js';
test('boundary is inclusive and all tied training minima are accepted',()=>{
 assert.equal(classify(3,3),'red');assert.equal(classify(2,3),'blue');
 assert.deepEqual([2,3,4].map(t=>errors([[1,'blue'],[3,'red']],t)),[0,0,1]);
 for(const first of [2,3])for(const second of [3,4])assert.equal(replaySupervised('train',['try:2','try:3','try:4',`choose:${first}`,'try:2','try:3','try:4',`choose:${second}`]).done,true);
 assert.equal(replaySupervised('train',['try:2','try:3','choose:2']),null);
});
test('evaluation labels are revealed only after every prediction and incorrect counts are rejected',()=>{
 assert.equal(replaySupervised('evaluate',['reveal']),null);
 const h=['predict','predict','predict','reveal'];assert.equal(replaySupervised('evaluate',[...h,'answer:0']),null);
 assert.equal(replaySupervised('evaluate',[...h,'answer:1','predict','predict','predict','reveal','answer:0']).done,true);
});
test('validation selects a trained candidate before a separate fixed final example',()=>{
 for(const c of selectionCases)for(const example of c.test)assert.equal([...c.train,...c.validation].some(other=>other[0]===example[0]&&other[1]===example[1]),false);
 const tried=['try:2','try:3','try:4'];
 assert.equal(replaySupervised('separate',[...tried,'choose:3']),null);
 assert.equal(replaySupervised('separate',[...tried,'choose:2','reveal']),null);
 const first=[...tried,'choose:2','predict','reveal','answer:1'];
 assert.equal(replaySupervised('separate',[...first,...tried,'choose:4','predict','reveal','answer:0']).done,true);
});
