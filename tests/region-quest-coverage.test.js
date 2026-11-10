import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {travelPlaces} from '../src/travel-map.js';
import {worldRegionQuests} from '../src/world-progress.js';
import {workshopQuestGroups} from '../src/workshop-quest-groups.js';
import {riverQuestGroups} from '../src/river-quest-groups.js';
import {cityQuestGroups} from '../src/city-quest-groups.js';
import {harborQuestGroups} from '../src/harbor-quest-groups.js';
import {archiveQuestGroups} from '../src/archive-quest-groups.js';
import {windmillQuestGroups} from '../src/windmill-quest-groups.js';
import {mountainQuestGroups} from '../src/mountain-quest-groups.js';
import {valleyQuestGroups} from '../src/valley-quest-groups.js';
import {forgeStationQuestGroups} from '../src/forge-station-quest-groups.js';
import {towerGateQuestGroups} from '../src/tower-gate-quest-groups.js';
import {lateRegionQuestGroups} from '../src/late-region-quest-groups.js';
import {legacyQuestTitles} from '../src/legacy-quest-titles.js';
import {fourQuests} from '../src/four-regions.js';
import {expansionQuests} from '../src/adventure-expansion.js';
import {newEntrances} from '../src/new-entrances.js';
const catalogs={
 workshop:(done=[])=>workshopQuestGroups(done,false,true),river:(done=[])=>riverQuestGroups(done,false),city:(done=[])=>cityQuestGroups(done,false),harbor:(done=[])=>harborQuestGroups(done,false),
 archive:(done=[])=>archiveQuestGroups(done,false),windmill:(done=[])=>windmillQuestGroups(done,false),mountain:(done=[])=>mountainQuestGroups(done),valley:(done=[])=>valleyQuestGroups(done,false),
 forge:(done=[])=>forgeStationQuestGroups('forge',done,false),station:(done=[])=>forgeStationQuestGroups('station',done,false),sky:(done=[])=>towerGateQuestGroups('sky',done,false),mist:(done=[])=>towerGateQuestGroups('mist',done,false),
 ...Object.fromEntries(['garden','observatory','tailor','guide'].map(id=>[id,(done=[])=>lateRegionQuestGroups(id,done,false)])),
};
test('地図上の各地域で物語の進行に使う依頼を分類から選べる',()=>{
 assert.deepEqual([...travelPlaces.map(p=>p.id)].sort(),Object.keys(catalogs).sort());
 for(const [region,quests] of Object.entries(worldRegionQuests)){
  const ids=catalogs[region]().flatMap(g=>g.quests),unique=new Set(ids);
  assert.equal(unique.size,ids.length,`${region} の重複`);
  for(const id of quests)assert.ok(unique.has(id),`${region} に ${id} がない`);
 }
});

test('各地域の画面で達成状態を参照する依頼も分類に含む',async()=>{
 const {readFile}=await import('node:fs/promises');
 const source=await readFile(new URL('../src/workshop-preview.js',import.meta.url),'utf8');
 const ranges={
  workshop:['choices','flowerLab'],river:['river','city'],city:['cityPerson','cityQuest'],harbor:['harbor','harborQuest'],
  archive:['midRegion','setupMidQuestNavigation'],windmill:['midRegion','setupMidQuestNavigation'],
  mountain:['mountainRegion','mountainQuest'],valley:['valleyRegion','tablesLab'],
  forge:['forgeStationRegion','schedulingLab'],station:['forgeStationRegion','schedulingLab'],
  sky:['towerGateRegion','accessLab'],mist:['towerGateRegion','accessLab'],
  garden:['fourRegion','transactionLab'],observatory:['fourRegion','transactionLab'],tailor:['fourRegion','transactionLab'],guide:['fourRegion','transactionLab'],
 };
 for(const [region,[start,end]] of Object.entries(ranges)){
  const first=source.indexOf(`function ${start}(`),last=source.indexOf(`function ${end}(`,first);
  assert.ok(first>=0&&last>first,`${region} の画面が見つからない`);
  const prefix=({sky:'tower',mist:'gate'})[region]??region;
  const ids=new Set(catalogs[region]().flatMap(g=>g.quests));
  const referenced=[...source.slice(first,last).matchAll(/state\.completed\.includes\('([^']+)'\)/g)].map(m=>m[1]).filter(id=>id.startsWith(prefix+'-'));
  for(const id of referenced)assert.ok(ids.has(id),`${region} の ${id} が分類にない`);
 }
});

test('旧記録の達成済み依頼は解放条件が未達でも分類に残り名前を確認できる',()=>{
 for(const [region,getGroups] of Object.entries(catalogs)){
  const original=getGroups();
  for(const group of original){
   for(const id of group.quests.filter(id=>!group.available.includes(id))){
    const restored=getGroups([id]).find(item=>item.id===group.id);
    assert.ok(restored?.available.includes(id),`${region}: ${id} が旧記録から消えた`);
    assert.ok(legacyQuestTitles[id]||fourQuests[id]?.title||expansionQuests[id]?.title||newEntrances[id]?.title,`${region}: ${id} の名前がない`);
   }
  }
 }
});
