import test from 'node:test';
import assert from 'node:assert/strict';
import {relationalCounts,relationalProbability,createRelationalWeather,relationalComplete,restoreRelationalWeather} from '../src/relational-weather.js';
import {createBayes,restoreBayes} from '../src/bayes.js';

test('shared and separate weather produce the correct joint counts and posteriors',()=>{
 assert.deepEqual(relationalCounts(true),[[34,16],[16,34]]);
 assert.deepEqual(relationalCounts(false),[[25,25],[25,25]]);
 assert.equal(relationalProbability('sharedWet'),68);
 assert.equal(relationalProbability('sharedDry'),32);
 assert.equal(relationalProbability('separateWet'),50);
 assert.equal(relationalProbability('separateDry'),50);
 const s=createRelationalWeather();s.answers={sharedWet:68,sharedDry:32,separateWet:50,separateDry:50};s.checked={sharedWet:true,sharedDry:true,separateWet:true,separateDry:true};
 assert.equal(relationalComplete(s),true);
 const copy=restoreRelationalWeather(s);copy.answers.sharedWet=50;assert.equal(relationalComplete(copy),false);assert.equal(s.answers.sharedWet,68);
 assert.throws(()=>restoreRelationalWeather({...s,answers:{...s.answers,sharedWet:75}}));
});
test('earlier saved bayes drafts retain their selections and get a fresh comparison',()=>{
 const {relational,...old}=createBayes();old.choices.wet.denominator=[0,1];
 const copy=restoreBayes(old);assert.deepEqual(copy.choices.wet.denominator,[0,1]);assert.deepEqual(copy.relational,createRelationalWeather());
});
