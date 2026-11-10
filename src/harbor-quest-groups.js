const groups=[
 {id:'local',title:'知らせと荷物を運ぶ',local:true,quests:['harbor-message','harbor-parallel']},
 {id:'counting',title:'旅支度や役割を選ぶ',quests:['harbor-counting-gear','harbor-counting-roles','harbor-counting-pigeon']},
 {id:'deadlock',title:'道具を借りる順番を考える',quests:['harbor-deadlock-cycle','harbor-deadlock-order','harbor-deadlock-fairness']},
 {id:'performance',title:'荷物を数える時間を調べる',quests:['harbor-performance-serial','harbor-performance-parallel','harbor-performance-overhead']},
 {id:'cooperation',title:'荷数の札と知らせをまとめる',quests:['harbor-count','harbor-join','harbor-lock']},
 {id:'condition',title:'届く荷物を待つ',quests:['harbor-condition-wait','harbor-condition-notify','harbor-condition-recheck']},
 {id:'parallel-map',title:'札を分けて数える',quests:['harbor-parallel-map','harbor-parallel-reduce','harbor-parallel-pipeline']},
];
const prerequisites={
 'harbor-counting-pigeon':['harbor-counting-gear','harbor-counting-roles'],
 'harbor-deadlock-fairness':['harbor-deadlock-cycle','harbor-deadlock-order'],
 'harbor-performance-overhead':['harbor-performance-serial','harbor-performance-parallel'],
 'harbor-lock':['harbor-count','harbor-join'],
 'harbor-condition-recheck':['harbor-condition-wait','harbor-condition-notify'],
 'harbor-parallel-pipeline':['harbor-parallel-map','harbor-parallel-reduce'],
};
export function harborQuestGroups(completed,endgameAvailable){
 const done=new Set(completed);
 return groups.map(g=>{const available=g.quests.filter(id=>done.has(id)||(g.local||endgameAvailable)&&(!prerequisites[id]||prerequisites[id].every(x=>done.has(x))));return {...g,available,remaining:available.filter(id=>!done.has(id)).length,complete:g.quests.every(id=>done.has(id))};});
}
