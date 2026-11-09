import test from 'node:test';
import assert from 'node:assert/strict';
import {replayForecast,replayForecastErrors} from '../src/endgame-ai.js';

test('fixed unseen examples distinguish prediction and actual result',()=>{
 const result=replayForecast(['rain','sun','rain','rain','rain','rain','cloud','uncertain']);
 assert.deepEqual(result.results,[true,true,false,true,false,false]);assert.equal(result.done,true);
 assert.equal(replayForecast(['sun']),null);assert.equal(replayForecast(['rain','sun','rain','rain','rain','rain','cloud','certain']),null);
});
test('all four prediction-result categories and the stated tradeoff',()=>{
 assert.equal(replayForecastErrors(['hit','miss','false-alarm','clear','B']).done,true);
 assert.equal(replayForecastErrors(['hit','false-alarm']),null);
 assert.equal(replayForecastErrors(['hit','miss','false-alarm','clear','A']),null);
});
