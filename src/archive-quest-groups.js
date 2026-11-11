const groups = [
 {id:'bloomjourney',title:'印で巻物を探す',quests:['archive-bloomjourney-register','archive-bloomjourney-absent','archive-bloomjourney-candidate']},
 {id:'local', title:'文庫と橋を手入れする', quests:['archive-search','archive-filter','archive-searches']},
 {id:'utfmessage', title:'文字をバイトで届ける', quests:['archive-utfmessage-ascii','archive-utfmessage-kana','archive-utfmessage-combine']},
 {id:'bst-delete', title:'枝の札を取り除く', quests:['archive-bstd-leaf','archive-bstd-single','archive-bstd-two']},
 {id:'tree', title:'枝分かれ棚で探す', quests:['archive-search-lab','archive-tree-search','archive-tree-insert','archive-tree-compare']},
 {id:'complexity', title:'探し方を比べる', quests:['archive-complexity-linear','archive-complexity-binary','archive-complexity-compare']},
 {id:'hash', title:'番号棚を整える', quests:['archive-hash-chain','archive-hash-linear','archive-hash-deletion']},
 {id:'collections', title:'本の記録を整理する', quests:['archive-collections-list','archive-collections-map','archive-collections-choose']},
 {id:'avlbranches', title:'傾いた鍵の樹を整える', quests:['archive-avlbranches-ll','archive-avlbranches-rr','archive-avlbranches-lr']},
 {id:'shelfresize',title:'大きくした棚を調べる',quests:['archive-shelfresize-copy','archive-shelfresize-rehash','archive-shelfresize-compare']},
 {id:'quickstones', title:'魔石を基準で分ける', quests:['archive-quickstones-first','archive-quickstones-middle','archive-quickstones-duplicates']},
 {id:'bayesscrolls',title:'伝言を語の傾向で仕分ける',quests:['archive-bayesscrolls-training','archive-bayesscrolls-classify','archive-bayesscrolls-order']},
 {id:'fileaccess',title:'書庫の扉と本の許可を調べる',quests:['archive-fileaccess-read','archive-fileaccess-remove','archive-fileaccess-compare']},
 {id:'filenames',title:'本の名前と開いた参照を調べる',quests:['archive-filenames-alias','archive-filenames-open','archive-filenames-release']},
 {id:'lowerbound',title:'番号以上の最初の札を探す',quests:['archive-lowerbound-duplicate','archive-lowerbound-gap','archive-lowerbound-end']},
 {id:'treeorders', title:'枝の灯りを順に巡る', quests:['archive-treeorders-pre','archive-treeorders-in','archive-treeorders-post']},
 {id:'linkedletters', title:'手紙のつながりを直す', quests:['archive-linkedletters-insert','archive-linkedletters-remove','archive-linkedletters-compare']},
 {id:'scrollretrieval', title:'巻物の探し方を比べる', quests:['archive-scrollretrieval-narrow','archive-scrollretrieval-broad','archive-scrollretrieval-compare']},
 {id:'stack', title:'積んだ札と編集を戻す', quests:['archive-stack-stack','archive-stack-compare','archive-stack-undo']},
 {id:'strings', title:'届け札を整える', quests:['archive-strings-split','archive-strings-replace','archive-strings-pipeline']},
 {id:'expressions', title:'計算札を組み立てる', quests:['archive-expression-precedence','archive-expression-association','archive-expression-evaluate']},
 {id:'versions', title:'道案内帳の版を整える', quests:['archive-version-snapshot','archive-version-merge','archive-version-release']},
];
const prerequisites={
 'archive-bloomjourney-candidate':['archive-bloomjourney-register','archive-bloomjourney-absent'],
 'archive-bayesscrolls-order':['archive-bayesscrolls-training','archive-bayesscrolls-classify'],
 'archive-fileaccess-compare':['archive-fileaccess-read','archive-fileaccess-remove'],
 'archive-filenames-release':['archive-filenames-alias','archive-filenames-open'],
 'archive-lowerbound-end':['archive-lowerbound-duplicate','archive-lowerbound-gap'],
 'archive-utfmessage-combine':['archive-utfmessage-ascii','archive-utfmessage-kana'],
 'archive-bstd-two':['archive-bstd-leaf','archive-bstd-single'],
 'archive-tree-compare':['archive-tree-search','archive-tree-insert'],
 'archive-complexity-compare':['archive-complexity-linear','archive-complexity-binary'],
 'archive-hash-deletion':['archive-hash-chain','archive-hash-linear'],
 'archive-collections-choose':['archive-collections-list','archive-collections-map'],
 'archive-avlbranches-lr':['archive-avlbranches-ll','archive-avlbranches-rr'],
 'archive-shelfresize-compare':['archive-shelfresize-copy','archive-shelfresize-rehash'],
 'archive-quickstones-duplicates':['archive-quickstones-first','archive-quickstones-middle'],
 'archive-treeorders-post':['archive-treeorders-pre','archive-treeorders-in'],
 'archive-linkedletters-compare':['archive-linkedletters-insert','archive-linkedletters-remove'],
 'archive-scrollretrieval-compare':['archive-scrollretrieval-narrow','archive-scrollretrieval-broad'],
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
