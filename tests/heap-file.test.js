import test from 'node:test';
import assert from 'node:assert/strict';
import {heapFileCreate,heapFileState,heapFileAct,heapFileRestore,heapFileDone} from '../src/heap-file.js';

test('heap file reuses free slots and scans every page',()=>{
 let q=heapFileCreate();
 assert.equal(heapFileAct(q,'insert',0),null);
 q=heapFileAct(q,'insert',1);
 assert.deepEqual(heapFileState(q.actions).pages,[[8,2],[6,5],[3,7]]);
 assert.equal(heapFileAct(q,'delete',2),null);
 q=heapFileAct(q,'delete',0);
 q=heapFileAct(q,'insert',0);
 assert.deepEqual(heapFileState(q.actions).pages,[[9,2],[6,5],[3,7]]);
 for(const i of [2,0,1]){q=heapFileAct(q,'scan',i);if(i!==1)assert.equal(heapFileDone(q),false);}
 assert.equal(heapFileDone(q),true);
 assert.deepEqual(heapFileState(q.actions).found,[{page:2,value:3}]);
 assert.deepEqual(heapFileRestore(q),q);
});

test('history is replayed and invalid or repeated actions cannot restore',()=>{
 assert.throws(()=>heapFileRestore({actions:[{type:'insert',page:0}]}));
 assert.throws(()=>heapFileRestore({actions:[{type:'scan',page:0}]}));
 let q=heapFileCreate();for(const [type,page] of [['insert',1],['delete',0],['insert',0],['scan',2]])q=heapFileAct(q,type,page);
 assert.equal(heapFileAct(q,'scan',2),null);
 assert.throws(()=>heapFileRestore({actions:[...q.actions,{type:'scan',page:2}]}));
 const restored=heapFileRestore(q);restored.actions[0].page=2;assert.equal(q.actions[0].page,1);
});
