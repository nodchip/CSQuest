import {storyRegions,worldRegionQuests} from './world-progress.js';
import {storyClueRegions} from './adventure-rumors.js';

// Change to true only while testing locally; false keeps debug mode disabled.
export const GATHERING_DEBUG_ENABLED=false;

export function gatheringDebugState(){
 const completed=[...new Set(storyRegions.flatMap(region=>worldRegionQuests[region].slice(0,2)))].filter(id=>id!=='city-queue');
 return {place:'city',program:['forward','forward'],executed:true,completed,storyHeard:[...storyClueRegions],storyReflectionSeen:true,storyGatheringSeen:false};
}
