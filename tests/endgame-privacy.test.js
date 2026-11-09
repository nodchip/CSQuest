import test from 'node:test';
import assert from 'node:assert/strict';
import {replayPrivacy} from '../src/endgame-privacy.js';

test('receiving and planning use different information with limited retention',()=>{
 assert.equal(replayPrivacy('collection',['choose:ticket','test','choose:count','test','choose:restricted','test']).done,true);
 assert.equal(replayPrivacy('collection',['choose:address','choose:ticket','test']).scene,1);
 for(const wrong of [['test'],['choose:address','test'],['choose:ticket','test','choose:names','test'],['choose:ticket','test','choose:count','test','choose:forever','test']])assert.equal(replayPrivacy('collection',wrong),null);
});
test('pseudonyms, linkability and hypothetical unlinkability are distinct',()=>{
 const steps=['choose:pseudonym','test','choose:infer','test','choose:assumption','test'];
 assert.equal(replayPrivacy('identity',steps).done,true);
 assert.equal(replayPrivacy('identity',['choose:pseudonym','test','choose:safe','choose:infer','test']).scene,2);
 for(const wrong of [['choose:anonymous','test'],['choose:pseudonym','test','choose:safe','test'],['choose:pseudonym','test','choose:infer','test','choose:guarantee','test']])assert.equal(replayPrivacy('identity',wrong),null);
 assert.equal(replayPrivacy('identity',[...steps,'test']),null);
 assert.equal(replayPrivacy('unknown',[]),null);
});
test('combined records and small aggregates need context-specific safeguards',()=>{
 assert.equal(replayPrivacy('safeguards',['choose:private','test','choose:combine','test','choose:risk','test']).done,true);
 assert.equal(replayPrivacy('safeguards',['choose:public','test']),null);
 assert.equal(replayPrivacy('safeguards',['choose:public','choose:private','test']).scene,1);
 assert.equal(replayPrivacy('safeguards',['choose:private','test','choose:anonymous','test']),null);
 assert.equal(replayPrivacy('safeguards',['choose:private','test','choose:combine','test','choose:always','test']),null);
});
