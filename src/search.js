export const searchLevel = {
  id: 'forest-search', number: '08', kind: 'search', name: '霧の森の道しるべ', tag: '幅優先探索',
  title: '霧の森の捜索隊',
  story: '霧の森で調査隊が立ち往生しています。広場を近い順に調べて、入口から最も少ない道でたどり着きましょう。',
};

// All roads connect both ways and have equal length. Neighbor order breaks ties.
export const paths = {
  S: ['A','B'], A: ['S','C','D'], B: ['S','D','E'],
  C: ['A','F'], D: ['A','B','F'], E: ['B','G'],
  F: ['C','D','G'], G: ['E','F'],
};
export const places = { S:'入口', A:'苔の広場', B:'泉の広場', C:'倒木の広場', D:'石の広場', E:'花の広場', F:'古木の広場', G:'調査隊' };

export function createSearch() {
  return { queue:['S'], seen:['S'], explored:[], parents:{S:null}, status:'playing', message:'入口を調べる順番です。' };
}

export function inspectPlace(state, place) {
  if (state.status !== 'playing') throw new Error('探索は終了しています。');
  if (!state.queue.includes(place)) throw new RangeError('待ち行列にない地点です。');
  if (place !== state.queue[0]) return { ...state, message:`${place} はまだ順番ではありません。先頭の ${state.queue[0]} から調べましょう。` };
  const queue = state.queue.slice(1);
  const seen = [...state.seen];
  const parents = { ...state.parents };
  const explored = [...state.explored, place];
  if (place === 'G') return { queue, seen, parents, explored, status:'found', message:'調査隊を見つけました！' };
  const added=[];
  for (const next of paths[place]) {
    if (!seen.includes(next)) { seen.push(next); queue.push(next); parents[next]=place; added.push(next); }
  }
  return { queue, seen, parents, explored, status:'playing', message: added.length ? `${place} を調べ、${added.join('・')} を末尾に加えました。` : `${place} から新しい地点は見つかりませんでした。` };
}

export function routeTo(state, goal) {
  if (!Object.hasOwn(state.parents, goal)) return null;
  const route=[];
  for (let current=goal; current!==null; current=state.parents[current]) route.push(current);
  return route.reverse();
}
