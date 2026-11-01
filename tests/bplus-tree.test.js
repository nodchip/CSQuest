import test from 'node:test';
import assert from 'node:assert/strict';
import {bplusKeys,bplusQueries,createBplusTree,insertBplus,findBplus,createBplusQuest,bplusAct,restoreBplusQuest,bplusComplete} from '../src/bplus-tree.js';
function permutations(a){return a.length?a.flatMap((v,i)=>permutations(a.filter((_,j)=>j!==i)).map(rest=>[v,...rest])):[[]];}
function inspect(t,expected){
 const leaves=[],visited=new Set(),depths=new Set();
 function walk(id,depth){const p=t.pages[id];assert.ok(p);assert.equal(visited.has(id),false);visited.add(id);assert.ok(p.keys.length<=2);assert.deepEqual(p.keys,[...p.keys].sort((a,b)=>a-b));
  if(p.leaf){leaves.push(p);depths.add(depth);return p.keys;}
  assert.equal(p.children.length,p.keys.length+1);const parts=p.children.map(c=>walk(c,depth+1));for(let i=0;i<p.keys.length;i++){assert.equal(p.keys[i],parts[i+1][0]);assert.ok(parts[i].at(-1)<p.keys[i]);}return parts.flat();}
 assert.deepEqual(walk(t.root,0),expected);assert.equal(depths.size,1);assert.equal(visited.size,Object.keys(t.pages).length);for(let i=0;i<leaves.length;i++)assert.equal(leaves[i].next,leaves[i+1]?.id??null);
}
test('６札の全720挿入順で B+ 木の境目・葉の連結・範囲検索を検証',()=>{
 for(const order of permutations(bplusKeys)){let tree=createBplusTree(),inserted=[];for(const key of order){tree=insertBplus(tree,key).tree;inserted.push(key);inspect(tree,[...inserted].sort((a,b)=>a-b));}for(let lo=0;lo<=70;lo+=10)for(let hi=lo;hi<=70;hi+=10)assert.deepEqual(findBplus(tree,lo,hi).found,bplusKeys.filter(k=>k>=lo&&k<=hi));}
});
test('指定した検索をすべて行い、振り返ると達成し保存から再生できる',()=>{
 let s=createBplusQuest();const act=a=>{const r=bplusAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);s=r.state;};for(const k of bplusKeys)act(`insert:${k}`);assert.ok(Object.values(s.tree.pages).some(p=>!p.leaf));for(const key of Object.keys(bplusQueries)){act(`query:${key}`);act('run');}assert.deepEqual(s.results.range.found,[20,30,40,50]);act('answer:tradeoff');assert.equal(bplusComplete(s),false);act('check');assert.equal(bplusComplete(s),true);assert.deepEqual(restoreBplusQuest(JSON.parse(JSON.stringify(s))),s);
});
test('重複・不正な札と不正な履歴を拒否する',()=>{let t=insertBplus(createBplusTree(),10).tree;assert.throws(()=>insertBplus(t,10));assert.throws(()=>insertBplus(t,15));assert.throws(()=>findBplus(t,5,4));assert.equal(bplusAct(createBplusQuest(),'run').ok,false);assert.throws(()=>restoreBplusQuest({history:['run']}));assert.throws(()=>restoreBplusQuest({history:[null]}));});
