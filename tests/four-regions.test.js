import test from 'node:test';
import assert from 'node:assert/strict';
import {fourRegions,fourRegionIds,fourQuestIds,fourQuests,fourResults,festivalProgress,festivalReady,validFourDrafts,validFourSelections,checkFourAnswer} from '../src/four-regions.js';

test('four independent regions each have four quests with two or three scenarios',()=>{
 assert.equal(fourRegionIds.length,4);
 assert.equal(fourQuestIds.length,18);
 assert.deepEqual(Object.keys(fourResults).sort(),[...fourQuestIds].sort());
 for(const region of fourRegionIds){
  assert.equal(Object.keys(fourRegions[region].quests).length,4);
  for(const q of Object.values(fourRegions[region].quests)){
   assert.ok(q.scenarios.length>=2&&q.scenarios.length<=3);
   for(const s of q.scenarios){
    assert.ok(s.prompt&&s.hint&&s.choices.length>=2);
    assert.ok(s.answer.length>0&&s.answer.length<s.choices.length);
    assert.equal(new Set(s.answer).size,s.answer.length);
    assert.ok(s.answer.every(n=>Number.isInteger(n)&&n>=0&&n<s.choices.length));
   }
  }
 }
 for(const result of Object.values(fourResults))assert.ok(result.thanks&&result.lesson);
});
test('partial selections survive reload and malformed selections are rejected',()=>{
 const id='garden-combinations',first=fourQuests[id].scenarios[0].answer;
 assert.equal(validFourSelections({[id]:[0]},{}),true);
 assert.equal(validFourSelections({[id]:[0,0]},{}),false);
 assert.equal(validFourSelections({[id]:[100]},{}),false);
 assert.equal(validFourSelections({unknown:[]},{}),false);
 assert.equal(validFourSelections({[id]:[1]},{[id]:[first]}),true);
 assert.equal(validFourSelections({[id]:[1]},{[id]:fourQuests[id].scenarios.map(s=>s.answer)}),false);
});
test('each saved situation is complete and can be restored independently',()=>{
 for(const id of fourQuestIds){
  const q=fourQuests[id],first=q.scenarios[0].answer;
  assert.ok(validFourDrafts({[id]:[first]}));
  assert.ok(checkFourAnswer(id,0,first));
  assert.equal(checkFourAnswer(id,0,[]),false);
  assert.equal(checkFourAnswer(id,0,[...first,first[0]]),false);
  assert.equal(validFourDrafts({[id]:[[]]}),false);
  assert.equal(validFourDrafts({[id]:q.scenarios.map(s=>s.answer).concat([first])}),false);
 }
 assert.equal(validFourDrafts({unknown:[]}),false);
});
test('festival requires two distinct quests in each region',()=>{
 const ids=fourRegionIds.map(r=>Object.keys(fourRegions[r].quests));
 assert.equal(festivalReady([]),false);
 assert.equal(festivalReady([...ids[0],...ids[1]]),false);
 assert.equal(festivalReady([ids[0][0],ids[0][0],...ids.slice(1).flatMap(a=>a.slice(0,2))]),false);
 assert.equal(festivalProgress([...ids[0],...ids[1]])[fourRegionIds[0]],2);
 assert.equal(festivalReady(ids.flatMap(a=>a.slice(0,2))),true);
 assert.equal(festivalReady(ids.flat()),true);
});
test('additional requests at a festival location also count as distinct help',()=>{
 assert.equal(festivalProgress(['garden-mosaic','garden-sets']).garden,2);
 assert.equal(festivalProgress(['garden-mosaic','garden-mosaic']).garden,1);
});
test('repair and observation require the right actions in order',()=>{
 for(const id of ['tailor-debug','guide-observe']){
  for(let i=0;i<fourQuests[id].scenarios.length;i++){
   const answer=fourQuests[id].scenarios[i].answer;
   assert.ok(checkFourAnswer(id,i,answer));
   assert.equal(checkFourAnswer(id,i,[...answer].reverse()),false);
   assert.equal(validFourDrafts({[id]:[[...fourQuests[id].scenarios[0].answer].reverse()]}),false);
  }
 }
});
test('logical OR includes both lights and excludes both off',()=>{
 const choices=fourQuests['garden-logic'].scenarios[1].choices;
 const indices=['赤だけ','赤と青','青だけ'].map(x=>choices.indexOf(x));
 assert.ok(indices.every(i=>i>=0));
 assert.ok(checkFourAnswer('garden-logic',1,indices));
 assert.equal(checkFourAnswer('garden-logic',1,[choices.indexOf('赤だけ'),choices.indexOf('青だけ')]),false);
 assert.equal(checkFourAnswer('garden-logic',1,[...indices,choices.indexOf('どちらも消灯')]),false);
});
test('cloud classification uses shape independent of colour',()=>{
 const q=fourQuests['observatory-classify'];
 for(const [i,feature] of ['もこもこ','細長い'].entries()){
  const s=q.scenarios[i];
  const matching=s.choices.map((x,index)=>x.includes(feature)?index:-1).filter(x=>x>=0);
  assert.equal(matching.length,2);
  assert.ok(checkFourAnswer('observatory-classify',i,matching));
 }
});
