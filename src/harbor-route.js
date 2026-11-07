export const harborNodes={port:'港',light:'灯台',fog:'霧の岬',village:'浜辺の中継所',hill:'丘の中継所',home:'家'};
export const harborEdges={port:['light','fog','village'],light:['hill'],fog:[],village:['hill'],hill:['home'],home:[]};
export function harborUnlocked(completed){return ['river','city-sort','city-queue'].some(id=>completed.includes(id));}
export function validHarborRoute(route){
  return Array.isArray(route)&&route.length<=4&&route.every((id,index)=>index===0?harborEdges.port.includes(id):(harborEdges[route[index-1]]??[]).includes(id));
}
export function harborNext(route){if(!validHarborRoute(route))throw new RangeError('経路が不正です。');return harborEdges[route.at(-1)??'port'];}
export function harborDelivered(route){return validHarborRoute(route)&&route.at(-1)==='home';}
