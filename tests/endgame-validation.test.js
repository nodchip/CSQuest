import test from 'node:test';
import assert from 'node:assert/strict';
import {expectedAcceptance,boundaryDevice,replayBoundary,replayValidation,regressionDevice,replayRegression} from '../src/endgame-validation.js';

test('explicit boundary behaviour and the two defects',()=>{
 assert.deepEqual([0,1,2,3,4].map(expectedAcceptance),[false,true,true,true,false]);
 assert.deepEqual([0,1,2,3,4].map(n=>boundaryDevice('reject-one',n)),[false,false,true,true,false]);
 assert.deepEqual([0,1,2,3,4].map(n=>boundaryDevice('accept-four',n)),[false,true,true,true,true]);
 assert.equal(boundaryDevice('accept-four',5),null);assert.equal(expectedAcceptance(1.5),false);
 assert.equal(replayBoundary(['try:2','report:2']),null);
 assert.equal(replayBoundary(['report:1']),null);
 assert.equal(replayBoundary(['try:1','try:2','report:1','try:4','report:4']).done,true);
});
test('expected change differs from the regression and repaired sample is limited',()=>{
 assert.deepEqual([0,1,2,3,4,5].map(n=>regressionDevice('old',n)),[false,true,true,true,false,false]);
 assert.deepEqual([0,1,2,3,4,5].map(n=>regressionDevice('changed',n)),[false,true,true,false,true,false]);
 assert.deepEqual([0,1,2,3,4,5].map(n=>regressionDevice('fixed',n)),[false,true,true,true,true,false]);
 const h=['try:old:4','try:changed:4','answer:planned','try:old:3','try:changed:3','answer:regression','try:fixed:0','try:fixed:3','try:fixed:4','try:fixed:5','answer:limited'];
 assert.equal(replayRegression(h).done,true);assert.equal(replayRegression(['try:changed:4','answer:planned']),null);
 assert.equal(replayRegression(['try:old:4','try:changed:4','answer:regression']),null);
});
test('a conclusion needs all four observations and distinguishes spec from need',()=>{
 assert.equal(replayValidation(['try:4','answer:spec-only']),null);
 const trials=['try:1','try:2','try:3','try:4'];
 assert.equal(replayValidation([...trials,'answer:both']),null);
 assert.equal(replayValidation([...trials,'answer:spec-only',...trials,'answer:neither',...trials,'answer:both']).done,true);
});
