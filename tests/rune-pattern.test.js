import test from 'node:test';
import assert from 'node:assert/strict';
import {runeWords,createPatterns,patternMatches,patternCorrect,patternsComplete,restorePatterns} from '../src/rune-pattern.js';

function independentlyMatches(word,s){for(let i=0;i<word.length;i++){if(word[i]!=='A'||(s.start==='begin'&&i!==0))continue;const min=s.tail==='none'?0:s.repeat==='one'||s.repeat==='oneOrMore'?1:0,max=s.tail==='none'?0:s.repeat==='one'?1:word.length;for(let n=min;n<=max;n++){const end=i+1+n;if(end>word.length||(s.end==='end'&&end!==word.length))continue;const chars=word.slice(i+1,end);if(s.tail!=='bc'||[...chars].every(c=>c==='B'||c==='C'))return true;}}return false;}
test('every tile combination matches an independent finite-string interpretation',()=>{
  for(const start of ['any','begin'])for(const tail of ['none','any','bc'])for(const repeat of ['one','zeroOrMore','oneOrMore'])for(const end of ['any','end']){const state={start,tail,repeat,end};assert.deepEqual(patternMatches(state),runeWords.filter(word=>independentlyMatches(word,state)));}
});
test('three objectives require the right matches and saved tiles are validated',()=>{
  const s=createPatterns();Object.assign(s.trials.contains,{checked:true});Object.assign(s.trials.two,{start:'begin',tail:'any',repeat:'one',end:'end',checked:true});Object.assign(s.trials.group,{start:'begin',tail:'bc',repeat:'oneOrMore',end:'end',checked:true});assert.ok(patternsComplete(s));assert.ok(patternsComplete(restorePatterns(s)));
  assert.equal(patternCorrect({...s.trials.group,repeat:'zeroOrMore'}),false);
  assert.throws(()=>restorePatterns({...s,trials:{...s.trials,two:{...s.trials.two,tail:'unknown'}}}));
});
