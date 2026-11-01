import test from 'node:test';
import assert from 'node:assert/strict';
import {hashKeys,hashQueries,createHashDirectory,insertHashDirectory,findHashDirectory,createHashDirectoryQuest,hashDirectoryAct,restoreHashQuest,hashQuestComplete} from '../src/hash-directory.js';
function permutations(a){return a.length?a.flatMap((v,i)=>permutations(a.filter((_,j)=>j!==i)).map(rest=>[v,...rest])):[[]];}
function inspect(t,expected){
 assert.equal(t.directory.length,2**t.depth);const contents=[];
 for(const b of Object.values(t.buckets)){assert.ok(b.depth<=t.depth);assert.ok(b.keys.length<=2);const refs=t.directory.map((id,i)=>id===b.id?i:null).filter(i=>i!==null);assert.equal(refs.length,2**(t.depth-b.depth));assert.ok(refs.every(i=>(i&((1<<b.depth)-1))===(refs[0]&((1<<b.depth)-1))));for(const k of b.keys){assert.equal(t.directory[k&((1<<t.depth)-1)],b.id);contents.push(k);}}
 assert.deepEqual(contents.sort((a,b)=>a-b),expected);assert.ok(t.directory.every(id=>Object.hasOwn(t.buckets,id)));
}
test('全720挿入順で案内表・桶の深さと探索結果を検証する',()=>{
 for(const order of permutations(hashKeys)){let t=createHashDirectory(),inserted=[];for(const key of order){t=insertHashDirectory(t,key).tree;inserted.push(key);inspect(t,[...inserted].sort((a,b)=>a-b));}assert.equal(t.depth,3);for(const [name,q] of Object.entries(hashQueries)){const result=findHashDirectory(t,name);assert.deepEqual(result.found,hashKeys.filter(k=>q.lo<=k&&k<=q.hi));assert.equal(new Set(result.buckets).size,result.buckets.length);if(q.kind==='point')assert.equal(result.buckets.length,1);else assert.equal(result.buckets.length,Object.keys(t.buckets).length);}}
});
test('探索と振り返り、履歴の再生',()=>{let s=createHashDirectoryQuest();const act=a=>{const r=hashDirectoryAct(s,a);assert.equal(r.ok,true,`${a}: ${r.message}`);s=r.state;};for(const k of hashKeys)act(`insert:${k}`);for(const k of Object.keys(hashQueries)){act(`query:${k}`);act('run');}assert.deepEqual(s.results.range.found,[1,2,3,4]);act('answer:tradeoff');assert.equal(hashQuestComplete(s),false);act('check');assert.equal(hashQuestComplete(s),true);assert.deepEqual(restoreHashQuest(JSON.parse(JSON.stringify(s))),s);});
test('不正な札、重複と途中記録を拒否する',()=>{let t=insertHashDirectory(createHashDirectory(),0).tree;assert.throws(()=>insertHashDirectory(t,0));assert.throws(()=>insertHashDirectory(t,5));assert.throws(()=>findHashDirectory(t,'unknown'));assert.equal(hashDirectoryAct(createHashDirectoryQuest(),'run').ok,false);assert.throws(()=>restoreHashQuest({history:['run']}));assert.throws(()=>restoreHashQuest({history:[null]}));});
