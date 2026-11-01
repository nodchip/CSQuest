import test from 'node:test';
import assert from 'node:assert/strict';
import {contextGrammarRules,grammarApply,grammarReplay,createContextGrammar,contextGrammarComplete,restoreContextGrammar} from '../src/context-grammar.js';

test('bounded derivations produce exactly the four expected terminal words',()=>{
 const seen=new Set(['S']),queue=['S'],terminals=new Set();
 for(let i=0;i<queue.length;i++){
  const word=queue[i];if(/^[abc]+$/.test(word))terminals.add(word);
  for(let rule=0;rule<contextGrammarRules.length;rule++)for(let position=0;position<word.length;position++){
   if(!word.slice(position).startsWith(contextGrammarRules[rule][0]))continue;
   let next;try{next=grammarApply(word,rule,position);}catch(e){if(e instanceof RangeError)continue;throw e;}
   assert.ok(next.length>=word.length);if(!seen.has(next)){seen.add(next);queue.push(next);}
  }
 }
 assert.deepEqual([...terminals].sort(),['aaaabbbbcccc','aaabbbccc','aabbcc','abc'].sort());
});
test('context and position are enforced and histories resume faithfully',()=>{
 const history=[{rule:0,position:0},{rule:1,position:1},{rule:2,position:3},{rule:3,position:1},{rule:4,position:2},{rule:5,position:3},{rule:6,position:4}];
 assert.equal(grammarReplay(history),'aabbcc');assert.throws(()=>grammarApply('aBC',4,1));assert.throws(()=>grammarReplay([{rule:2,position:0}]));
 const s=createContextGrammar();s.history=history;s.observed=['abc','aabbcc'];s.answer='context';s.checked=true;assert.equal(contextGrammarComplete(restoreContextGrammar(s)),true);assert.equal(contextGrammarComplete({...s,answer:'free'}),false);assert.equal(contextGrammarComplete({...s,observed:['abc']}),false);
});
