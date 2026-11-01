import test from 'node:test';
import assert from 'node:assert/strict';
import {wordDocuments,postings,wordIdf,wordScore,createWordIndex,restoreWordIndex,wordIndexComplete,bigramCount,bigramScore,bigramComplete} from '../src/word-index.js';
test('postings deduplicate repeated terms; TF-IDF uses document counts',()=>{
 assert.deepEqual(postings('月草'),['a','b']);assert.deepEqual(postings('解毒'),['a']);assert.equal(wordDocuments.b.filter(x=>x==='月草').length,2);assert.equal(wordIdf('月草'),1);assert.equal(wordIdf('解毒'),2);assert.deepEqual(['a','b','c','d'].map(wordScore),[3,2,0,0]);assert.throws(()=>postings('存在しない'),RangeError);
});
test('completion requires both posting lists, both scores, ranking and an explicit check',()=>{
 const s=createWordIndex();s.selected.moon=['b','a'];s.selected.antidote=['a'];s.scores={a:'3',b:'2'};s.winner='a';assert.equal(wordIndexComplete(s),false);s.checked=true;assert.equal(wordIndexComplete(s),false);s.bigram={selected:['a','b'],scores:{a:'2',b:'1'},checked:true};assert.equal(wordIndexComplete(s),false);s.bloom.inserted=['moon','antidote'];s.bloom.answers={moon:'maybe',herb:'maybe',fire:'absent'};s.bloom.checked={moon:true,herb:true,fire:true};assert.equal(wordIndexComplete(s),true);const restored=restoreWordIndex(s);s.selected.moon.pop();assert.equal(wordIndexComplete(s),false);assert.equal(restored.selected.moon.length,2);restored.selected.antidote=['a','a'];assert.throws(()=>restoreWordIndex(restored),RangeError);
});

test('bigram frequency respects order and overlapping occurrences; old drafts gain an incomplete exercise',()=>{
 assert.equal(bigramCount(['月','草','月','草'],['月','草']),2);
 assert.equal(bigramCount(['草','月'],['月','草']),0);
 assert.equal(bigramCount(['月','月','月'],['月','月']),2);
 assert.deepEqual(['a','b','c','d'].map(bigramScore),[2,1,0,0]);
 const old=createWordIndex();delete old.bigram;assert.equal(bigramComplete(restoreWordIndex(old).bigram),false);
 const s=createWordIndex();s.bigram={selected:['a','b'],scores:{a:'2',b:'1'},checked:true};assert.equal(bigramComplete(s.bigram),true);
 const copy=restoreWordIndex(s);copy.bigram.selected.push('c');assert.equal(bigramComplete(copy.bigram),false);assert.equal(bigramComplete(s.bigram),true);
 assert.throws(()=>restoreWordIndex({...s,bigram:{...s.bigram,selected:['a','a']}}));
});
