import test from 'node:test';
import assert from 'node:assert/strict';
import {forgeStationIds,forgeStationReplay,forgeStationConverged,validForgeStationDrafts} from '../src/forge-station.js';
const paths={
 'forge-bits':['toggle:0','toggle:2','check','toggle:1','toggle:2','check'],
 'forge-cpu':['fetch','decode','execute','fetch','decode','execute'],
 'forge-memory':['read:B','value:7','write:B','read:B'],
 'forge-cache':['cache','store','cache'],
 'station-fcfs':['B','C','A'],
 'station-round':['A','B','A','B'],
 'station-lock':['take:B','work:B','release:B','take:A','work:A','release:A'],
 'station-memory':['slot:1','slot:2','place','slot:0','place'],
};
for(const [id,path] of Object.entries(paths))test(`${id}: partial save, completion and error`,()=>{for(let i=0;i<path.length;i++){const h=path.slice(0,i);assert.equal(forgeStationReplay(id,h).done,false);assert.equal(validForgeStationDrafts({[id]:h}),true);}assert.equal(forgeStationReplay(id,path).done,true);assert.throws(()=>forgeStationReplay(id,['invalid']));assert.throws(()=>forgeStationReplay(id,[...path,'invalid']));});
test('both lock orders work and a second holder is rejected',()=>{assert.equal(forgeStationReplay('station-lock',['take:A','work:A','release:A','take:B','work:B','release:B']).done,true);assert.throws(()=>forgeStationReplay('station-lock',['take:A','take:B']));});
test('either pair of adjacent spaces works, but a gap does not',()=>{assert.equal(forgeStationReplay('station-memory',['slot:0','slot:1','place','slot:2','place']).done,true);assert.throws(()=>forgeStationReplay('station-memory',['slot:0','slot:2','place']));});
test('milestone requires all eight, malformed drafts rejected',()=>{assert.equal(forgeStationConverged(forgeStationIds.slice(1)),false);assert.equal(forgeStationConverged(forgeStationIds),true);assert.equal(validForgeStationDrafts({'station-fcfs':['A']}),false);assert.equal(validForgeStationDrafts({unknown:[]}),false);});
