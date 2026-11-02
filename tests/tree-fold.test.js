import test from 'node:test';
import assert from 'node:assert/strict';
import {treeFoldCases,foldNode,foldPaths,foldExpected,foldReplay,foldCreate,foldTry,foldComplete,foldRestore} from '../src/tree-fold.js';

test('every valid postorder gives the same sum and count while leaving the tree untouched',()=>{
 const original=JSON.stringify(treeFoldCases);for(const [id,expected] of [['empty',0],['sum',6],['count',3]]){let orders=0;const walk=history=>{const values=foldReplay(id,history),remaining=foldPaths(id).filter(path=>!Object.hasOwn(values,path));if(!remaining.length){orders++;assert.equal(values[''],expected);return;}let choices=0;for(const path of remaining){const e=foldExpected(id,path,values);if(e.ready){choices++;walk([...history,{path,value:e.value}]);}}assert.ok(choices);};walk([]);assert.equal(orders,id==='empty'?1:80);}assert.equal(JSON.stringify(treeFoldCases),original);
});
test('early parent, wrong answer and corrupt or duplicate history are rejected',()=>{
 const s=foldCreate();s.selected='sum';s.choice=6;assert.equal(foldTry(s).ok,false);s.path='LL';s.choice=1;assert.equal(foldTry(s).ok,false);s.choice=0;assert.ok(foldTry(s).ok);assert.throws(()=>foldReplay('sum',[{path:'',value:6}]));assert.throws(()=>foldReplay('sum',[{path:'LL',value:0},{path:'LL',value:0}]));assert.throws(()=>foldNode('sum','LLL'));
});
test('both reductions, empty case, reflection and valid copied restore are required',()=>{
 const s=foldCreate();for(const id of Object.keys(treeFoldCases)){s.selected=id;while(true){const values=foldReplay(id,s.histories[id]);if(Object.hasOwn(values,''))break;const path=foldPaths(id).find(p=>foldExpected(id,p,values).ready);s.path=path;s.choice=foldExpected(id,path,values).value;assert.ok(foldTry(s).ok);}}
 s.answer='variants';s.checked=true;assert.ok(foldComplete(s));const copy=foldRestore(s);copy.histories.sum.pop();assert.equal(s.histories.sum.length,7);assert.throws(()=>foldRestore({...s,path:'LLL'}));
});
