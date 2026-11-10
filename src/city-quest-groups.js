const groups=[
 {id:'local',title:'市場とギルドを手伝う',local:true,quests:['city-sort','city-queue']},
 {id:'sorting',title:'市場の札の並べ方を調べる',quests:['city-sorting-insertion','city-sorting-selection','city-sorting-compare']},
];
export function cityQuestGroups(completed,endgameAvailable){
 const done=new Set(completed);
 return groups.map(g=>{const available=g.quests.filter(id=>done.has(id)||(g.local||endgameAvailable)&&(id!=='city-sorting-compare'||done.has('city-sorting-insertion')&&done.has('city-sorting-selection')));return {...g,available,remaining:available.filter(id=>!done.has(id)).length,complete:g.quests.every(id=>done.has(id))};});
}
