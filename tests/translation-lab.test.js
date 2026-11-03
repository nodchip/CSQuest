import test from 'node:test';
import assert from 'node:assert/strict';
import {translationWords,translationScenes,translationEvaluate,translationMarker,translationCreate,translationRestore,translationRequired,translationDone} from '../src/translation-lab.js';
test('unigram and bigram overlap count each reference occurrence at most once',()=>{
 for(const [scene,{reference}] of Object.entries(translationScenes))for(const a of Object.keys(translationWords))for(const b of Object.keys(translationWords))for(const c of Object.keys(translationWords)){
  const words=[a,b,c],actual=translationEvaluate(scene,words),pool=reference.slice();let uni=0;for(const w of words){const i=pool.indexOf(w);if(i>=0){pool.splice(i,1);uni++;}}
  const pairs=[reference.slice(0,2).join('/'),reference.slice(1,3).join('/')];let bi=0;for(let i=0;i<2;i++){const j=pairs.indexOf(words.slice(i,i+2).join('/'));if(j>=0){pairs.splice(j,1);bi++;}}
  assert.deepEqual(actual,{unigrams:uni,bigrams:bi,exact:words.join('/')===reference.join('/')});
 }
 assert.deepEqual(translationEvaluate('cross',['river','cross','mira']),{unigrams:3,bigrams:0,exact:false});
 assert.deepEqual(translationEvaluate('cross',['mira','mira','mira']),{unigrams:1,bigrams:0,exact:false});
 assert.throws(()=>translationEvaluate('constructor',['mira','cross','river']));
});
test('comparison markers identify only the specified scene and arrangement',()=>{
 assert.equal(translationMarker('cross',['mira','cross','river']),'cross:correct');assert.equal(translationMarker('cross',['river','cross','mira']),'cross:order');assert.equal(translationMarker('cross',['mira','cross','bank']),'cross:sense');assert.equal(translationMarker('visit',['mira','visit','bank']),'visit:correct');assert.equal(translationMarker('visit',['mira','cross','bank']),null);
});
test('completion and restored drafts require all four comparisons and both insights',()=>{
 const q=translationCreate();q.seen=[...translationRequired];q.reflection='order';q.limits='human';assert.equal(translationDone(q),true);
 for(const key of translationRequired)assert.equal(translationDone({...q,seen:q.seen.filter(x=>x!==key)}),false);
 assert.equal(translationDone({...q,reflection:'bag'}),false);assert.equal(translationDone({...q,limits:'perfect'}),false);
 const r=translationRestore(q);r.slots[0]='mira';r.seen.pop();assert.equal(q.slots[0],null);assert.equal(q.seen.length,4);
 assert.throws(()=>translationRestore({...q,slots:['constructor',null,null]}));assert.throws(()=>translationRestore({...q,seen:['cross:order','cross:order']}));
});
