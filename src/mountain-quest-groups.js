const groups=[
 {id:'routes',title:'山道をたどる',quests:['mountain-connect','mountain-hops','mountain-time']},
 {id:'astar',title:'見積もりを使って道を探す',quests:['mountain-astar-uniform','mountain-astar-astar','mountain-astar-compare']},
 {id:'search',title:'道の調べ方を比べる',quests:['search-bfs','search-weighted','search-compare']},
];
export function mountainQuestGroups(completed,endgameAvailable=false){
 const done=new Set(completed),ready=groups[0].quests.every(id=>done.has(id));
 return groups.map(g=>{const available=g.quests.filter(id=>done.has(id)||g.id==='routes'||(g.id==='astar'?endgameAvailable&&(id!=='mountain-astar-compare'||done.has('mountain-astar-uniform')&&done.has('mountain-astar-astar')):ready));return {...g,available,remaining:available.filter(id=>!done.has(id)).length,complete:g.quests.every(id=>done.has(id))};});
}
