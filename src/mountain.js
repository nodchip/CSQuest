export const mountainQuests={
  'mountain-connect':{title:'山の集落へ知らせを届ける',short:'つながる道を探す',goal:'中継所から山の集落へ、つながった道をたどって知らせを届ける'},
  'mountain-hops':{title:'少ない中継で届ける',short:'道の数が少ない経路を探す',goal:'中継所から山の集落まで、通る道の数が最も少ない経路を選ぶ'},
  'mountain-time':{title:'早く届く道を探す',short:'所要時間が短い経路を探す',goal:'中継所から山の集落まで、所要時間の合計が最も短い経路を選ぶ'},
};
export const mountainIds=Object.keys(mountainQuests);
export const mountainButtonOrder=['start','lookout','ridge','forest','village','stream'];
export const mountainNames={start:'中継所',ridge:'尾根',forest:'森の道',stream:'小川',lookout:'見晴らし台',village:'山の集落'};
// Roads are one-way in this exercise: every arrow represents a permitted route.
export const mountainRoads={start:[['ridge',5],['forest',2],['lookout',1]],ridge:[['village',5]],forest:[['stream',2]],stream:[['village',2]],lookout:[],village:[]};
export function mountainReplay(id,route){
  if(!mountainIds.includes(id)||!Array.isArray(route)||route.length>5)throw new RangeError('道の記録を読み込めません。');
  let here='start',time=0;
  const visited=new Set([here]);
  for(const next of route){
    const edge=mountainRoads[here].find(([node])=>node===next);
    if(!edge||visited.has(next)||here==='village')throw new RangeError('つながった道を選んでください。');
    time+=edge[1];here=next;visited.add(next);
  }
  const arrived=here==='village',hops=route.length;
  const done=arrived&&(id==='mountain-connect'||id==='mountain-hops'&&hops===2||id==='mountain-time'&&time===6);
  return {here,time,hops,arrived,done,next:mountainRoads[here].map(([node])=>node)};
}
export function validMountainRoutes(routes){
  if(!routes||typeof routes!=='object'||Array.isArray(routes))return false;
  try{return Object.entries(routes).every(([id,route])=>{mountainReplay(id,route);return true;});}catch{return false;}
}
