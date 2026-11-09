import test from 'node:test';
import assert from 'node:assert/strict';
import {runScenarios} from '../src/engine.js';
import {journeyQuests,unlocked,completeQuest,validDraft} from '../src/workshop-journey-data.js';

test('travel requires two distinct workshop quests and ignores retries and the destination',()=>{
  let done=[];
  done=completeQuest(done,'forest');
  done=completeQuest(done,'forest');
  assert.deepEqual(done,['forest']);
  assert.equal(unlocked(done),false);
  assert.equal(unlocked([...done,'river']),false);
  for(const second of ['branch','loop','workshop-steps']) assert.equal(unlocked(completeQuest(done,second)),true);
  assert.equal(unlocked(['branch','loop']),true);
});

test('each new quest accepts its intended solution and rejects a misleading attempt',()=>{
  const solutions={branch:['forward','ifWall','forward'],loop:['twice','right','twice'],river:['forward','ifWall','forward']};
  const failures={branch:['forward','forward'],loop:['twice','twice'],river:['forward','right','forward']};
  for(const [id,quest] of Object.entries(journeyQuests)){
    assert.equal(runScenarios(quest.level,solutions[id]).success,true,id);
    assert.equal(runScenarios(quest.level,failures[id]).success,false,id);
  }
  const partial=runScenarios(journeyQuests.river.level,failures.river);
  assert.deepEqual(partial.cases.map(item=>item.success),[true,false]);
});

test('saved drafts reject unknown commands, excessive length and executed empty programs',()=>{
  assert.equal(validDraft('branch',{program:['forward','ifWall'],executed:false}),true);
  assert.equal(validDraft('branch',{program:[],executed:true}),false);
  assert.equal(validDraft('branch',{program:['right'],executed:false}),false);
  assert.equal(validDraft('loop',{program:['forward','forward','forward','forward'],executed:false}),false);
  assert.equal(validDraft('unknown',{program:[],executed:false}),false);
});
