const groups=[
 {id:'routes',title:'山道をたどる',quests:['mountain-connect','mountain-hops','mountain-time']},
 {id:'primroads',title:'集落を道でつなぐ',quests:['mountain-primroads-forest','mountain-primroads-ties','mountain-primroads-compare']},
 {id:'astar',title:'見積もりを使って道を探す',quests:['mountain-astar-uniform','mountain-astar-astar','mountain-astar-compare']},
 {id:'search',title:'道の調べ方を比べる',quests:['search-bfs','search-weighted','search-compare']},
 {id:'negativejourney',title:'返礼のある道を調べる',quests:['mountain-negativejourney-greedy','mountain-negativejourney-relax','mountain-negativejourney-compare']},
 {id:'ropegcd',title:'二本の綱を同じ長さに切る',quests:['mountain-ropegcd-first','mountain-ropegcd-second','mountain-ropegcd-third']},
];
export function mountainQuestGroups(completed,endgameAvailable=false){
 const done=new Set(completed),ready=groups[0].quests.every(id=>done.has(id));
 return groups.map(g=>{const available=g.quests.filter(id=>done.has(id)||g.id==='routes'||(g.id==='negativejourney'?endgameAvailable&&(id!=='mountain-negativejourney-compare'||done.has('mountain-negativejourney-greedy')&&done.has('mountain-negativejourney-relax')):g.id==='ropegcd'?endgameAvailable&&(id!=='mountain-ropegcd-third'||done.has('mountain-ropegcd-first')&&done.has('mountain-ropegcd-second')):g.id==='astar'?endgameAvailable&&(id!=='mountain-astar-compare'||done.has('mountain-astar-uniform')&&done.has('mountain-astar-astar')):g.id==='primroads'?endgameAvailable&&(id!=='mountain-primroads-compare'||done.has('mountain-primroads-forest')&&done.has('mountain-primroads-ties')):ready));return {...g,available,remaining:available.filter(id=>!done.has(id)).length,complete:g.quests.every(id=>done.has(id))};});
}

export function mountainQuestSelector(id){if(['mountain-astar-','mountain-primroads-','mountain-ropegcd-','mountain-negativejourney-'].some(prefix=>id.startsWith(prefix)))return `#${id.slice('mountain-'.length)}`;return id.startsWith('mountain-')?`[data-mountain-quest="${id}"]`:`[data-expansion="${id}"]`;}
