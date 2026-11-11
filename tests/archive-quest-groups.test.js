import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {archiveQuestGroups} from '../src/archive-quest-groups.js';

test('文庫の依頼は重複なく49件あり未開放が残ると全体は未達成',()=>{
 const groups=archiveQuestGroups(['archive-search','archive-filter','archive-searches'],false);
 const all=groups.flatMap(g=>g.quests);
 assert.equal(all.length,49);assert.equal(new Set(all).size,49);
 assert.equal(groups.reduce((n,g)=>n+g.remaining,0),0);
 assert.equal(groups.every(g=>g.complete),false);
});
test('二つの準備を終えるとそれぞれの発展依頼が開く',()=>{
 const before=archiveQuestGroups([],true).flatMap(g=>g.available);
 assert.equal(before.includes('archive-tree-compare'),false);
 const after=archiveQuestGroups(['archive-tree-search','archive-tree-insert'],true).flatMap(g=>g.available);
 assert.equal(after.includes('archive-tree-compare'),true);
 assert.equal(after.includes('archive-strings-pipeline'),false);
});
test('すべて達成した分類だけに完了が付く',()=>{
 const groups=archiveQuestGroups([],true);
 const done=archiveQuestGroups(groups[0].quests,true);
 assert.equal(done[0].complete,true);assert.equal(done[1].complete,false);
 assert.ok(archiveQuestGroups(groups.flatMap(g=>g.quests),true).every(g=>g.complete));
});
test('各発展依頼は対応する二つがそろうまで開かない',()=>{
 const prerequisites={
  'archive-utfmessage-combine':['archive-utfmessage-ascii','archive-utfmessage-kana'],
  'archive-bstd-two':['archive-bstd-leaf','archive-bstd-single'],
  'archive-tree-compare':['archive-tree-search','archive-tree-insert'],
  'archive-complexity-compare':['archive-complexity-linear','archive-complexity-binary'],
  'archive-hash-deletion':['archive-hash-chain','archive-hash-linear'],
  'archive-collections-choose':['archive-collections-list','archive-collections-map'],
  'archive-avlbranches-lr':['archive-avlbranches-ll','archive-avlbranches-rr'],
  'archive-quickstones-duplicates':['archive-quickstones-first','archive-quickstones-middle'],
  'archive-treeorders-post':['archive-treeorders-pre','archive-treeorders-in'],
  'archive-linkedletters-compare':['archive-linkedletters-insert','archive-linkedletters-remove'],
  'archive-scrollretrieval-compare':['archive-scrollretrieval-narrow','archive-scrollretrieval-broad'],
  'archive-stack-undo':['archive-stack-stack','archive-stack-compare'],
  'archive-strings-pipeline':['archive-strings-split','archive-strings-replace'],
  'archive-expression-evaluate':['archive-expression-precedence','archive-expression-association'],
  'archive-version-release':['archive-version-snapshot','archive-version-merge'],
 };
 for(const [id,inputs] of Object.entries(prerequisites)){
  const available=done=>archiveQuestGroups(done,true).flatMap(g=>g.available).includes(id);
  assert.equal(available([inputs[0]]),false,id);
  assert.equal(available(inputs),true,id);
 }
});
