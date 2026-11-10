import test from 'node:test';
import assert from 'node:assert/strict';
import {replayModeling} from '../src/endgame-modeling.js';
test('multiple parcels can reference one village and a parcel has only one village',()=>{
 const h=['set:荷１:村２','set:荷１:村１','set:荷２:村１','set:荷３:村２'];
 assert.deepEqual(replayModeling('one',h).assignments,{'荷１':'村１','荷２':'村１','荷３':'村２'});
 assert.equal(replayModeling('one',[...h,'check']).scene,1);
 assert.equal(replayModeling('one',[...h,'check','set:荷１:村２','set:荷２:村３','set:荷３:村２','check']).done,true);
 assert.equal(replayModeling('one',['set:荷１:村１','check']),null);
 assert.deepEqual(replayModeling('one',[...h,'reset']).assignments,{});
});
test('a bridge table supports multiple jobs per person and multiple people per job',()=>{
 const h=['pair:人１:依１','pair:人１:依２','pair:人２:依１'];
 assert.equal(replayModeling('many',[...h,'check']).scene,1);
 assert.equal(replayModeling('many',[...h,'check','pair:人１:依２','pair:人２:依１','pair:人２:依２','check']).done,true);
 assert.equal(replayModeling('many',[...h,'pair:人２:依２','check']),null);
 assert.equal(replayModeling('many',[...h,'pair:人１:依１']).pairs.length,2);
});
test('lookup requires both constraints to be tried and the two matching helpers selected',()=>{
 const h=['duplicate','missing','select:人１'];
 assert.equal(replayModeling('lookup',[...h,'check']).scene,1);
 assert.equal(replayModeling('lookup',[...h,'check','duplicate','missing','select:人２','select:人１','check']).done,true);
 assert.equal(replayModeling('lookup',[...h,'select:人２','check']),null);
 assert.equal(replayModeling('lookup',['duplicate','select:人１','select:人２','check']),null);
 assert.deepEqual(replayModeling('lookup',[...h,'reset']).selected,[]);
});
