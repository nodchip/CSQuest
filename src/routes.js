export const routeLevel = {
  id:'weighted-roads', number:'09', kind:'routes', name:'山道の早馬', tag:'重み付き最短経路',
  title:'峠を越える知らせ',
  story:'山の村へ急ぎの知らせを届けます。道ごとに通過時間が違うので、道の本数ではなく合計時間が最も短い経路を探しましょう。',
};

// Bidirectional roads, all travel times are positive.
export const roads = {
  S:{A:5,B:1}, A:{S:5,B:1,G:2}, B:{S:1,A:1,G:8}, G:{A:2,B:8},
};
export const labels = { S:'出発地', A:'峠', B:'泉', G:'山の村' };

export function createRouteSearch() {
  return { distances:{S:0,A:null,B:null,G:null}, parents:{S:null}, settled:[], status:'playing', message:'出発地の時間を０として始めます。' };
}

export function settlePlace(state, place) {
  if (state.status !== 'playing') throw new Error('探索は終了しています。');
  if (!Object.hasOwn(roads,place) || state.settled.includes(place) || state.distances[place] === null) throw new RangeError('確定できない地点です。');
  const unsettled=Object.keys(roads).filter(id=>!state.settled.includes(id) && state.distances[id]!==null);
  const minimum=Math.min(...unsettled.map(id=>state.distances[id]));
  if (state.distances[place]!==minimum) return {...state, message:`${place} より小さい時間の地点が残っています。`};
  const settled=[...state.settled,place];
  const distances={...state.distances};
  const parents={...state.parents};
  if (place==='G') return {...state,settled,status:'found',message:'山の村までの最短時間が確定しました。'};
  const updates=[];
  for (const [neighbor,weight] of Object.entries(roads[place])) {
    if (settled.includes(neighbor)) continue;
    const candidate=distances[place]+weight;
    if (distances[neighbor]===null || candidate<distances[neighbor]) {
      const old=distances[neighbor]; distances[neighbor]=candidate; parents[neighbor]=place;
      updates.push(`${neighbor}: ${old===null?'未発見':old} → ${candidate}`);
    }
  }
  return {distances,parents,settled,status:'playing',message: updates.length ? `${place} を確定。更新：${updates.join('、')}` : `${place} を確定。より短い道はありませんでした。`};
}

export function reconstructRoute(state, goal) {
  if (!Object.hasOwn(state.parents,goal)) return null;
  const route=[];
  for(let current=goal;current!==null;current=state.parents[current]) route.push(current);
  return route.reverse();
}
