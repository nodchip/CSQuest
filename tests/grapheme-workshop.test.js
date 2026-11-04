import {test} from 'node:test';
import assert from 'node:assert/strict';
import {graphemeCount,graphemeEncoding,graphemeCompare,graphemeCreate,graphemeCheck,graphemeDone,graphemeRestore} from '../src/grapheme-workshop.js';
test('actual UTF-16, code point and grapheme counts distinguish canonical forms and a joined emoji',()=>{for(const [id,counts] of [['composed',[1,1,1]],['decomposed',[2,2,1]],['emoji',[5,3,1]]])assert.deepEqual(['units','points','clusters'].map(m=>graphemeCount(id,m)),counts);assert.deepEqual(graphemeCompare(),{raw:false,nfc:true});assert.equal(graphemeCount('emoji','clusters',null),null);});
test('correct predictions and comparison are tracked without exposing a mutable draft',()=>{const q=graphemeCreate();for(const id of ['composed','decomposed','emoji'])for(const mode of ['units','points','clusters']){q.caseId=id;q.mode=mode;const count=graphemeCount(id,mode);q.guess=count===1?2:1;assert.equal(graphemeCheck(q).ok,false);q.guess=count;assert.equal(graphemeCheck(q).ok,true);}assert.equal(graphemeDone(q),false);q.compared=true;q.reflection='units';q.checked=true;assert.equal(graphemeDone(q),true);const copy=graphemeRestore(q);copy.seen.pop();assert.equal(q.seen.length,9);assert.throws(()=>graphemeRestore({...q,seen:['emoji:units','emoji:units']}));});
test('encoding exposes UTF-16 units separately from Unicode code points',()=>{
 assert.deepEqual(graphemeEncoding('composed'),{units:['00E9'],points:['U+00E9']});
 assert.deepEqual(graphemeEncoding('decomposed'),{units:['0065','0301'],points:['U+0065','U+0301']});
 assert.deepEqual(graphemeEncoding('emoji'),{units:['D83D','DC69','200D','D83D','DCBB'],points:['U+1F469','U+200D','U+1F4BB']});
 assert.throws(()=>graphemeEncoding('unknown'));
});
