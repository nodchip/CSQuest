import test from 'node:test';
import assert from 'node:assert/strict';
import {messages,bag,bigrams,pairPresent,createWordOrder,restoreWordOrder,wordOrderComplete} from '../src/word-order.js';
test('identical unigram counts hide the reversal, while ordered pairs differ',()=>{
 assert.deepEqual(bag(messages.a),bag(messages.b));assert.notDeepEqual(bigrams(messages.a),bigrams(messages.b));assert.equal(pairPresent('a','dragon'),true);assert.equal(pairPresent('b','dragon'),false);assert.equal(pairPresent('a','knight'),false);assert.equal(pairPresent('b','knight'),true);assert.equal(pairPresent('a','help'),true);assert.equal(pairPresent('b','help'),true);
});
test('completion needs the comparisons, distinguishing pairs, roles and explicit check',()=>{
 const s={bag:'same',bigram:'different',pairA:'dragon',pairB:'knight',actorA:'dragon',actorB:'knight',checked:true};assert.equal(wordOrderComplete(s),true);for(const k of ['bag','bigram','pairA','pairB','actorA','actorB'])assert.equal(wordOrderComplete({...s,[k]:''}),false);assert.equal(wordOrderComplete({...s,checked:false}),false);assert.deepEqual(restoreWordOrder(createWordOrder()),createWordOrder());assert.throws(()=>restoreWordOrder({...s,pairA:'invalid'}),RangeError);
});
