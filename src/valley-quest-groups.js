const groups=[
 {id:'delivery',title:'荷物と届け先を確かめる',quests:['data-record','data-filter','data-join','valley-records']},
 {id:'lists',title:'名簿と発送札を整える',quests:['valley-query-lab','valley-tables-lab','valley-integrity-lab']},
 {id:'relations',title:'記録の関係を整理する',quests:['valley-modeling-one','valley-modeling-many','valley-modeling-lookup']},
 {id:'transactions',title:'荷物の移動を記録する',quests:['valley-transaction-commit','valley-transaction-rollback','valley-transaction-isolation']},
 {id:'group-ledger',title:'地域ごとの数量を集計する',quests:['valley-groupledger-count','valley-groupledger-sum','valley-groupledger-compare']},
 {id:'leftjoin',title:'薬草と札を左結合する',quests:['valley-leftjoin-all','valley-leftjoin-on','valley-leftjoin-where']},
 {id:'sqlnull',title:'未記入の数量を調べる',quests:['valley-sqlnull-equal','valley-sqlnull-missing','valley-sqlnull-compound']},
 {id:'query-join',title:'荷物と届け先の表を調べる',quests:['valley-query-join','valley-query-select','valley-query-compose']},
 {id:'ledgersplit',title:'村の台帳を分けて結ぶ',quests:['valley-ledgersplit-update','valley-ledgersplit-village','valley-ledgersplit-name']},
 {id:'journal',title:'途切れた台帳を立て直す',quests:['valley-journal-undo','valley-journal-redo','valley-journal-decide']},
];
const prerequisites={
 'valley-leftjoin-where':['valley-leftjoin-all','valley-leftjoin-on'],
 'valley-integrity-lab':['valley-query-lab','valley-tables-lab'],
 'valley-modeling-lookup':['valley-modeling-one','valley-modeling-many'],
 'valley-transaction-isolation':['valley-transaction-commit','valley-transaction-rollback'],
 'valley-groupledger-compare':['valley-groupledger-count','valley-groupledger-sum'],
 'valley-sqlnull-compound':['valley-sqlnull-equal','valley-sqlnull-missing'],
 'valley-query-compose':['valley-query-join','valley-query-select'],
 'valley-ledgersplit-name':['valley-ledgersplit-update','valley-ledgersplit-village'],
 'valley-journal-decide':['valley-journal-undo','valley-journal-redo'],
};
export function valleyQuestGroups(completed,endgameAvailable){
 const done=new Set(completed);
 return groups.map(g=>{const available=g.quests.filter(id=>done.has(id)||(g.id==='delivery'||endgameAvailable)&&(!prerequisites[id]||prerequisites[id].every(x=>done.has(x))));return {...g,available,remaining:available.filter(id=>!done.has(id)).length,complete:g.quests.every(id=>done.has(id))};});
}
