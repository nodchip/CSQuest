import {sortingLevel,swapAdjacent,isSorted} from './sorting.js';
import {createContainer,containerStep,containerEvents} from './containers.js';

export const cityQuestIds=['city-sort','city-queue'];
export const adviceOptions={
  workshop:[['forest','森の入口で薬草を届ける'],['branch','木立で届けものをする'],['loop','水路の灯りを届ける']],
  river:[['river','水辺の道を照らす']],
  city:[['city-sort','市場の品札を並べる'],['city-queue','ギルドの荷物を届ける']],
};
export function recommend(place,completed){return adviceOptions[place]?.find(([id])=>!completed.includes(id))??null;}
export function validAnnouncements(value){return Array.isArray(value)&&new Set(value).size===value.length&&value.every(key=>Object.entries(adviceOptions).some(([place,options])=>options.some(([id])=>key===`${place}:${id}`)));}
export function restoreCitySort(history){
  if(!Array.isArray(history)||history.length>500)throw new RangeError('品札の記録が不正です。');
  let values=[...sortingLevel.initial];
  for(const index of history)values=swapAdjacent(values,index);
  return {values,done:isSorted(values)};
}
export function restoreCityQueue(history){
  if(!Array.isArray(history)||history.length>containerEvents.length)throw new RangeError('荷物の記録が不正です。');
  let state=createContainer('queue');
  for(const action of history){const next=containerStep(state,action);if(next.history.length!==state.history.length+1)throw new RangeError('荷物の記録が不正です。');state=next;}
  return state;
}
