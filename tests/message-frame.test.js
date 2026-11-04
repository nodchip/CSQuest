import test from 'node:test';
import assert from 'node:assert/strict';
import {frameMessages,frameInputs,frameModes,frameStreamPatterns,frameStreamTrace,frameIssueTrace,frameEncode,frameDecode,messageFrameCreate,messageFrameDone,messageFrameComplete,messageFrameRestore} from '../src/message-frame.js';

test('both formats round-trip every symbol sequence up to eight and can grow or shrink',()=>{
 for(let len=0;len<=8;len++)for(let bits=0;bits<2**len;bits++){const symbols=Array.from({length:len},(_,i)=>1+((bits>>i)&1));for(const mode of frameModes)assert.deepEqual(frameDecode(frameEncode(symbols,mode)),{ok:true,symbols});}
 assert.deepEqual(frameEncode(frameMessages.repeat.symbols,'rle'),[1,4,4,1,2,2]);assert.equal(frameEncode(frameMessages.repeat.symbols,'rle').length<frameEncode(frameMessages.repeat.symbols,'raw').length,true);assert.equal(frameEncode(frameMessages.alternate.symbols,'rle').length>frameEncode(frameMessages.alternate.symbols,'raw').length,true);
});
test('invalid lengths, symbols, runs and expansion are rejected before expansion',()=>{
 for(const id of ['length','odd','expansion'])assert.equal(frameDecode(frameInputs[id].frame).ok,false);
 for(const frame of [[2,0],[0,1,3],[1,2,0,1],[1,2,255,1],[1,4,5,1,5,2],[0,0,1],[0,-1],[-1,0]])assert.equal(frameDecode(frame).ok,false);
});
test('all encodings, checked inputs and reflection are needed; restored state is independent',()=>{
 const s=messageFrameCreate();for(const key of Object.keys(s.encoded))s.encoded[key]=true;for(const [id,item] of Object.entries(frameInputs)){const answer=frameDecode(item.frame).ok?'accept':'reject';s.trials[id]={answer,checked:true};assert.equal(messageFrameDone(id,s.trials[id]),true);}assert.equal(messageFrameComplete(s),false);s.reflection='bounds';assert.equal(messageFrameComplete(s),true);const copy=messageFrameRestore(s);copy.trials.odd.answer='accept';assert.equal(messageFrameComplete(copy),false);assert.equal(messageFrameComplete(s),true);copy.encoded['repeat:rle']='yes';assert.throws(()=>messageFrameRestore(copy));
});
test('chunk boundaries do not determine message boundaries in the fixed stream',()=>{
 const split=frameStreamTrace('split');
 assert.deepEqual(split[0],{chunk:[0],buffer:[0],messages:[]});
 assert.deepEqual(split[1].messages,[]);
 assert.deepEqual(split[2].messages,[[1,2]]);assert.deepEqual(split[2].buffer,[0,1]);
 for(const id of Object.keys(frameStreamPatterns)){
  const end=frameStreamTrace(id).at(-1);assert.deepEqual(end.buffer,[]);assert.deepEqual(end.messages,[[1,2],[2]]);
 }
 assert.throws(()=>frameStreamTrace('unknown'));
 const old=messageFrameCreate();delete old.streamPattern;delete old.streamStep;
 assert.equal(messageFrameRestore(old).streamStep,0);
 assert.equal(messageFrameRestore({...old,streamPattern:'split',streamStep:2}).streamStep,2);
 assert.throws(()=>messageFrameRestore({...old,streamPattern:'whole',streamStep:2}));
});
test('EOF distinguishes a clean boundary and truncated frames; oversized length is rejected immediately',()=>{
 const complete=frameIssueTrace('complete');assert.deepEqual(complete.map(s=>s.status),['open','open','complete']);assert.deepEqual(complete.at(-1).messages,[[1,2]]);
 const header=frameIssueTrace('header');assert.deepEqual(header.map(s=>s.status),['open','truncated-header']);
 const body=frameIssueTrace('body');assert.deepEqual(body.map(s=>s.status),['open','truncated-body']);
 const length=frameIssueTrace('length');assert.deepEqual(length.map(s=>s.status),['invalid-header']);assert.deepEqual(length[0].buffer,[0,9]);
 assert.throws(()=>frameIssueTrace('unknown'));const old=messageFrameCreate();delete old.issueCase;delete old.issueStep;
 assert.equal(messageFrameRestore(old).issueStep,0);assert.equal(messageFrameRestore({...old,issueCase:'body',issueStep:2}).issueStep,2);
 assert.throws(()=>messageFrameRestore({...old,issueCase:'length',issueStep:2}));
});
test('validation continues after a valid frame and rejects malformed bodies',()=>{
 const after=frameIssueTrace('after');assert.equal(after.length,1);assert.equal(after[0].status,'invalid-header');
 assert.deepEqual(after[0].messages,[[1,2]]);assert.deepEqual(after[0].buffer,[0,9]);
 const bad=frameIssueTrace('invalid');assert.equal(bad.length,1);assert.equal(bad[0].status,'invalid-body');
 assert.deepEqual(bad[0].messages,[]);assert.deepEqual(bad[0].buffer,[0,2,1,9]);
});
