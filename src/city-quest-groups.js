const groups=[
 {id:'local',title:'市場とギルドを手伝う',local:true,quests:['city-sort','city-queue']},
 {id:'dependency',title:'祭りの準備の順番を考える',quests:['city-depflow-line','city-depflow-branch','city-depflow-cycle']},
 {id:'mergeruns',title:'品札の列を合わせる',quests:['city-mergeruns-first','city-mergeruns-second','city-mergeruns-compare']},
 {id:'sorting',title:'市場の札の並べ方を調べる',quests:['city-sorting-insertion','city-sorting-selection','city-sorting-compare']},
];
export function cityQuestGroups(completed,endgameAvailable){
 const done=new Set(completed);
 return groups.map(g=>{const available=g.quests.filter(id=>done.has(id)||(g.local||endgameAvailable)&&(id!=='city-sorting-compare'||done.has('city-sorting-insertion')&&done.has('city-sorting-selection'))&&(id!=='city-mergeruns-compare'||done.has('city-mergeruns-first')&&done.has('city-mergeruns-second'))&&(id!=='city-depflow-cycle'||done.has('city-depflow-line')&&done.has('city-depflow-branch')));return {...g,available,remaining:available.filter(id=>!done.has(id)).length,complete:g.quests.every(id=>done.has(id))};});
}
