const groups=[
 {id:'delivery',title:'荷物と届け先を確かめる',quests:['data-record','data-filter','data-join','valley-records']},
 {id:'lists',title:'名簿と発送札を整える',quests:['valley-query-lab','valley-tables-lab','valley-integrity-lab']},
 {id:'relations',title:'記録の関係を整理する',quests:['valley-modeling-one','valley-modeling-many','valley-modeling-lookup']},
 {id:'transactions',title:'荷物の移動を記録する',quests:['valley-transaction-commit','valley-transaction-rollback','valley-transaction-isolation']},
 {id:'query-join',title:'荷物と届け先の表を調べる',quests:['valley-query-join','valley-query-select','valley-query-compose']},
];
const prerequisites={
 'valley-integrity-lab':['valley-query-lab','valley-tables-lab'],
 'valley-modeling-lookup':['valley-modeling-one','valley-modeling-many'],
 'valley-transaction-isolation':['valley-transaction-commit','valley-transaction-rollback'],
 'valley-query-compose':['valley-query-join','valley-query-select'],
};
export function valleyQuestGroups(completed,endgameAvailable){
 const done=new Set(completed);
 return groups.map(g=>{const available=g.quests.filter(id=>done.has(id)||(g.id==='delivery'||endgameAvailable)&&(!prerequisites[id]||prerequisites[id].every(x=>done.has(x))));return {...g,available,remaining:available.filter(id=>!done.has(id)).length,complete:g.quests.every(id=>done.has(id))};});
}
