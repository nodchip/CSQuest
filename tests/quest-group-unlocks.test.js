import test from 'node:test';
import assert from 'node:assert/strict';
import {cityQuestGroups} from '../src/city-quest-groups.js';
import {riverQuestGroups} from '../src/river-quest-groups.js';
import {mountainQuestGroups} from '../src/mountain-quest-groups.js';
import {harborQuestGroups} from '../src/harbor-quest-groups.js';
import {workshopQuestGroups} from '../src/workshop-quest-groups.js';
import {archiveQuestGroups} from '../src/archive-quest-groups.js';
import {windmillQuestGroups} from '../src/windmill-quest-groups.js';
import {valleyQuestGroups} from '../src/valley-quest-groups.js';
import {forgeStationQuestGroups} from '../src/forge-station-quest-groups.js';
import {towerGateQuestGroups} from '../src/tower-gate-quest-groups.js';
import {lateRegionQuestGroups} from '../src/late-region-quest-groups.js';
import {cityGroupPlan,riverGroupPlan,mountainGroupPlan,harborGroupPlan,questGroupPlans,unlockedQuestGroups,updateQuestGroupNotices,validQuestGroupNotices} from '../src/quest-group-unlocks.js';

const groups=cityQuestGroups([],true), ids=done=>unlockedQuestGroups(groups,cityGroupPlan,done).map(group=>group.id);
test('city starts with the local work and two endgame choices',()=>{
 assert.deepEqual(new Set(ids([])),new Set(['local','dependency','sorting']));
});

test('new unlocks are pending until read and remain read after reload',()=>{
 const state={completed:[]};
 const update=()=>updateQuestGroupNotices(state,{city:cityQuestGroups(state.completed,true)});
 update();
 assert.deepEqual(state.questGroups.pending,{});
 state.completed=['city-sorting-insertion'];update();
 assert.deepEqual(state.questGroups.pending.city,[]);
 state.completed.push('city-sorting-selection');update();
 assert.deepEqual(state.questGroups.pending.city,['mergeruns']);
 update();assert.deepEqual(state.questGroups.pending.city,['mergeruns']);
 state.questGroups=JSON.parse(JSON.stringify(state.questGroups));
 assert(validQuestGroupNotices(state.questGroups));
 state.questGroups.pending.city=[];update();
 assert.deepEqual(state.questGroups.pending.city,[]);
});

test('legacy saves keep available groups visible without old notifications',()=>{
 const state={completed:['city-sorting-insertion','city-sorting-selection']};
 updateQuestGroupNotices(state,{city:cityQuestGroups(state.completed,true)},true);
 assert.deepEqual(new Set(state.questGroups.known.city),new Set(cityQuestGroups(state.completed,true).map(g=>g.id)));
 assert.deepEqual(state.questGroups.pending,{});
 updateQuestGroupNotices(state,{city:cityQuestGroups(state.completed,true)});
 assert.deepEqual(state.questGroups.pending.city,[]);
});

test('invalid notice records cannot replace saved adventure data',()=>{
 assert(!validQuestGroupNotices({known:{city:['local','local']},pending:{}}));
 assert(!validQuestGroupNotices({known:{unknown:['local']},pending:{}}));
 assert(!validQuestGroupNotices({known:{city:'local'},pending:{}}));
});

test('the opening quest counts towards the workshop unlock',()=>{
 const state={completed:['forest'],executed:false};
 const update=()=>updateQuestGroupNotices(state,{workshop:workshopQuestGroups(state.completed,true,state.executed)});
 update();
 state.executed=true;update();
 assert(state.questGroups.pending.workshop.includes('flower'));
});
test('two related completions open only the next kind of work',()=>{
 assert(!ids(['city-sorting-insertion']).includes('mergeruns'));
 const after=ids(['city-sorting-insertion','city-sorting-selection']);
 assert(after.includes('mergeruns'));assert(!after.includes('radixparcel'));assert(!after.includes('coinplan'));
 assert(ids(['city-mergeruns-first','city-mergeruns-second']).includes('radixparcel'));
});
test('a previous partial achievement remains visible after migration',()=>{
 assert(ids(['city-radixparcel-ones']).includes('radixparcel'));
 assert(ids(['city-depflow-line','city-depflow-branch']).includes('coinplan'));
});
test('the plan covers each group and each prerequisite can supply two quests',()=>{
 const planned=[...cityGroupPlan.start,...Object.keys(cityGroupPlan.after)];
 assert.equal(new Set(planned).size,groups.length);
 assert.deepEqual(new Set(planned),new Set(groups.map(group=>group.id)));
 for(const source of Object.values(cityGroupPlan.after))assert(groups.find(group=>group.id===source)?.quests.length>=2);
});

test('only distinct completed quests count towards an unlock',()=>{
 const repeated=[{id:'first',quests:['one','one']},{id:'next',quests:['two']}];
 assert.deepEqual(unlockedQuestGroups(repeated,{start:['first'],after:{next:'first'}},['one']).map(g=>g.id),['first']);
});

test('a newly added group without a rollout rule remains accessible',()=>{
 const extended=[...groups,{id:'new-group',quests:['new-quest']}];
 assert(unlockedQuestGroups(extended,cityGroupPlan,[]).some(group=>group.id==='new-group'));
});

test('riverside opens related work in stages and preserves older achievements',()=>{
 const groups=riverQuestGroups([],true);
 const ids=done=>unlockedQuestGroups(groups,riverGroupPlan,done).map(g=>g.id);
 assert.deepEqual(new Set(ids([])),new Set(['local','types','herbcomb']));
 assert(!ids(['river-herbcomb-list']).includes('samplingbias'));
 assert(ids(['river-herbcomb-list','river-herbcomb-sort']).includes('samplingbias'));
 assert(!ids(['river-herbcomb-list','river-herbcomb-sort']).includes('intervalsample'));
 assert(ids(['river-samplingbias-near','river-samplingbias-pairs']).includes('intervalsample'));
 assert(ids(['river-intervalsample-inside']).includes('intervalsample'));
});

const factories={
  workshop:(done,endgame)=>workshopQuestGroups(done,endgame,done.includes('workshop-opening')),
  city:cityQuestGroups,river:riverQuestGroups,mountain:mountainQuestGroups,harbor:harborQuestGroups,
  archive:archiveQuestGroups,windmill:windmillQuestGroups,valley:valleyQuestGroups,
  ...Object.fromEntries(['forge','station'].map(region=>[region,(done,endgame)=>forgeStationQuestGroups(region,done,endgame)])),
  ...Object.fromEntries(['sky','mist'].map(region=>[region,(done,endgame)=>towerGateQuestGroups(region,done,endgame)])),
  ...Object.fromEntries(['tailor','guide','garden','observatory'].map(region=>[region,(done,endgame)=>lateRegionQuestGroups(region,done,endgame)]))
 };
test('plans reach every quest through existing availability rules',()=>{
 assert.deepEqual(new Set(Object.keys(factories)),new Set(Object.keys(questGroupPlans)));
 for(const [region,getGroups] of Object.entries(factories)){
  const plan=questGroupPlans[region];
  const all=getGroups([],true), planned=[...plan.start,...Object.keys(plan.after)];
  assert.equal(new Set(planned).size,all.length,region);
  assert.deepEqual(new Set(planned),new Set(all.map(g=>g.id)),region);
  assert(plan.start.length>=2&&plan.start.length<=3,region);
  assert.equal(new Set(Object.values(plan.after)).size,Object.values(plan.after).length,`${region}: one new group per prerequisite`);
  for(const source of Object.values(plan.after))assert(getGroups([],true).find(g=>g.id===source)?.quests.length>=2,`${region}: ${source}`);
  for(const reverse of [false,true]){
   const done=new Set();
   for(let step=0;step<all.flatMap(g=>g.quests).length;step++){
    const available=unlockedQuestGroups(getGroups([...done],true),plan,done).flatMap(g=>g.available).filter(id=>!done.has(id));
    const next=reverse?available.at(-1):available[0];
    if(!next)break;
    done.add(next);
   }
   assert.deepEqual(done,new Set(all.flatMap(g=>g.quests)),`${region}: ${reverse?'reverse':'forward'}`);
  }
 }
});

test('each region retains its existing pre-endgame quests',()=>{
 for(const [region,getGroups] of Object.entries(factories)){
  const done=new Set();
  for(let step=0;step<100;step++){
   const groups=getGroups([...done],false);
   const next=unlockedQuestGroups(groups,questGroupPlans[region],done).flatMap(g=>g.available).find(id=>!done.has(id));
   if(!next)break;
   done.add(next);
  }
  const stranded=getGroups([...done],false).flatMap(g=>g.available).filter(id=>!done.has(id));
  assert.deepEqual(stranded,[],region);
 }
});
