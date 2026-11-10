import test from 'node:test';
import assert from 'node:assert/strict';
import {mean,populationVariance,replayVariance} from '../src/endgame-variance.js';
test('signed deviations can cancel despite spread',()=>{
 assert.equal(mean([1,1,3,3]),2);
 assert.equal(replayVariance('deviation',['diff:1']),null);
 const h=['diff:-1','diff:-1','diff:1','diff:1','check','diff:-2','diff:0','diff:0','diff:2','check'];
 assert.equal(replayVariance('deviation',h).done,true);
});
test('population variance averages squared deviations rather than raw values',()=>{
 assert.equal(populationVariance([1,1,3,3]),1);
 assert.equal(populationVariance([0,2,2,4]),2);
 assert.equal(populationVariance([2,2,2,2]),0);
 const h=['square:1','square:1','square:1','square:1','answer:1','check','square:4','square:0','square:0','square:4','answer:2','check','square:0','square:0','square:0','square:0','answer:0','check'];
 assert.equal(replayVariance('variance',h).done,true);
 assert.equal(replayVariance('variance',['square:1','answer:1']),null);
});
test('same mean does not imply same variance',()=>{
 assert.equal(replayVariance('compare',['compare:B','check','compare:A','check','compare:B','check','compare:equal','check']).done,true);
 assert.equal(replayVariance('compare',['compare:equal']),null);
});

test('repeated correct answers cannot advance without a check',()=>{
 const compared=replayVariance('compare',['compare:B','compare:B']);
 assert.equal(compared.scene,0);
 assert.equal(compared.done,false);
 const squared=['square:1','square:1','square:1','square:1','answer:1','answer:1'];
 const variance=replayVariance('variance',squared);
 assert.equal(variance.scene,0);
 assert.equal(variance.done,false);
});
test('an incorrect choice can be corrected, and a partial history can resume or reset',()=>{
 const partial=['diff:-1'];
 assert.equal(replayVariance('deviation',[...partial,'diff:1']),null);
 assert.deepEqual(replayVariance('deviation',JSON.parse(JSON.stringify(partial))).answers,[-1]);
 assert.deepEqual(replayVariance('deviation',[...partial,'reset']).answers,[]);
 const correct=[...partial,'diff:-1','diff:1','diff:1','check','diff:-2','diff:0','diff:0','diff:2','check'];
 assert.equal(replayVariance('deviation',correct).done,true);
 assert.equal(replayVariance('deviation',[...correct,'reset']),null);
 assert.equal(replayVariance('deviation',[...correct,'check']),null);
});
test('population variance handles a shifted mean and identical values',()=>{
 assert.equal(mean([5,5,7,7]),6);
 assert.equal(populationVariance([5,5,7,7]),1);
 assert.equal(populationVariance([8,8,8,8]),0);
 assert.equal(populationVariance([0,0,0,4]),3);
 assert.equal(replayVariance('variance',['square:1','reset','square:1']).answers.length,1);
 assert.equal(replayVariance('compare',['compare:A']),null);
 assert.equal(replayVariance('compare',['compare:B','check']).scene,1);
});
