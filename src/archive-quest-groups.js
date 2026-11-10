const groups = [
 {id:'local', title:'文庫と橋を手入れする', quests:['archive-search','archive-filter','archive-searches']},
 {id:'tree', title:'枝分かれ棚で探す', quests:['archive-search-lab','archive-tree-search','archive-tree-insert','archive-tree-compare']},
 {id:'complexity', title:'探し方を比べる', quests:['archive-complexity-linear','archive-complexity-binary','archive-complexity-compare']},
 {id:'hash', title:'番号棚を整える', quests:['archive-hash-chain','archive-hash-linear','archive-hash-deletion']},
 {id:'collections', title:'本の記録を整理する', quests:['archive-collections-list','archive-collections-map','archive-collections-choose']},
 {id:'stack', title:'積んだ札と編集を戻す', quests:['archive-stack-stack','archive-stack-compare','archive-stack-undo']},
 {id:'strings', title:'届け札を整える', quests:['archive-strings-split','archive-strings-replace','archive-strings-pipeline']},
 {id:'expressions', title:'計算札を組み立てる', quests:['archive-expression-precedence','archive-expression-association','archive-expression-evaluate']},
 {id:'versions', title:'道案内帳の版を整える', quests:['archive-version-snapshot','archive-version-merge','archive-version-release']},
];
const prerequisites={
 'archive-tree-compare':['archive-tree-search','archive-tree-insert'],
 'archive-complexity-compare':['archive-complexity-linear','archive-complexity-binary'],
 'archive-hash-deletion':['archive-hash-chain','archive-hash-linear'],
 'archive-collections-choose':['archive-collections-list','archive-collections-map'],
 'archive-stack-undo':['archive-stack-stack','archive-stack-compare'],
 'archive-strings-pipeline':['archive-strings-split','archive-strings-replace'],
 'archive-expression-evaluate':['archive-expression-precedence','archive-expression-association'],
 'archive-version-release':['archive-version-snapshot','archive-version-merge'],
};
export function archiveQuestGroups(completed,endgameAvailable){
 const done=new Set(completed);
 return groups.map(group=>{
  const available=group.quests.filter(id=>done.has(id)||(group.id==='local'||endgameAvailable)&&(!prerequisites[id]||prerequisites[id].every(id=>done.has(id))));
  return {...group,available,remaining:available.filter(id=>!done.has(id)).length,complete:group.quests.every(id=>done.has(id))};
 });
}
