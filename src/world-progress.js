import {workshopQuestIds} from './workshop-journey-data.js?v=world-finale1';
import {cityQuestIds} from './workshop-city.js';
import {midQuests} from './midgame.js';
import {mountainIds} from './mountain.js';
import {expansionQuests} from './adventure-expansion.js';
import {towerGateQuests} from './tower-gate.js';
import {forgeStationQuests} from './forge-station.js';
import {fourRegions} from './four-regions.js?v=world-finale1';
import {newEntrances} from './new-entrances.js';

// Quest IDs, not visits or attempts, are the source of progress. The names
// remain stable so achievements from existing saves continue to count.
const idsFor=(quests,region)=>Object.entries(quests).filter(([,q])=>q.region===region).map(([id])=>id);
export const worldRegionQuests={
 workshop:[...workshopQuestIds,...idsFor(newEntrances,'workshop')],
 river:['river',...idsFor(newEntrances,'river')],
 city:cityQuestIds,
 harbor:['harbor-message',...idsFor(newEntrances,'harbor')],
 archive:[...idsFor(midQuests,'archive'),...idsFor(newEntrances,'archive')],
 windmill:[...idsFor(midQuests,'windmill'),...idsFor(newEntrances,'windmill')],
 mountain:[...mountainIds,...idsFor(expansionQuests,'mountain')],
 valley:[...idsFor(expansionQuests,'valley'),...idsFor(newEntrances,'valley')],
 sky:idsFor(towerGateQuests,'tower'),
 mist:idsFor(towerGateQuests,'gate'),
 forge:idsFor(forgeStationQuests,'forge'),
 station:[...idsFor(forgeStationQuests,'station'),...idsFor(newEntrances,'station')],
 ...Object.fromEntries(Object.entries(fourRegions).map(([id,region])=>[id,[...Object.keys(region.quests),...idsFor(newEntrances,id)]])),
};

export function worldRegionProgress(completed){
 const unique=new Set(completed);
 return Object.fromEntries(Object.entries(worldRegionQuests).map(([region,ids])=>[region,Math.min(2,ids.filter(id=>unique.has(id)).length)]));
}

export function helpedRegionCount(completed){
 return Object.values(worldRegionProgress(completed)).filter(count=>count===2).length;
}

export function worldFinaleReady(completed){
 return helpedRegionCount(completed)>=6;
}
