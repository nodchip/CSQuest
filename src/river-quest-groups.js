const groups=[
 {id:'local',title:'村の道と水門を手伝う',local:true,quests:['river','river-signals']},
 {id:'types',title:'水門の札と道具を確かめる',quests:['river-type-tools','river-type-record','river-type-branch']},
 {id:'samplingbias',title:'薬草の選び方を調べる',quests:['river-samplingbias-near','river-samplingbias-pairs','river-samplingbias-compare']},
 {id:'intervalsample',title:'薬草の標本と区間を調べる',quests:['river-intervalsample-inside','river-intervalsample-outside','river-intervalsample-coverage']},
 {id:'numbers',title:'水辺の数札を整理する',quests:['river-functional-map','river-functional-fold','river-functional-pipeline']},
];
const prerequisites={
 'river-samplingbias-compare':['river-samplingbias-near','river-samplingbias-pairs'],
 'river-type-branch':['river-type-tools','river-type-record'],
 'river-intervalsample-coverage':['river-intervalsample-inside','river-intervalsample-outside'],
 'river-functional-pipeline':['river-functional-map','river-functional-fold'],
};
export function riverQuestGroups(completed,endgameAvailable){
 const done=new Set(completed);
 return groups.map(g=>{const available=g.quests.filter(id=>done.has(id)||(g.local||endgameAvailable)&&(!prerequisites[id]||prerequisites[id].every(x=>done.has(x))));return {...g,available,remaining:available.filter(id=>!done.has(id)).length,complete:g.quests.every(id=>done.has(id))};});
}
