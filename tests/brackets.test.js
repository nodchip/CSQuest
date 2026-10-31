import test from 'node:test';
import assert from 'node:assert/strict';
import {createBracket,bracketStep,createBracketSet,restoreBrackets,bracketsComplete} from '../src/brackets.js';

function independent(word){let depth=0;for(const c of word){depth+=c==='('?1:-1;if(depth<0)return false;}return depth===0;}
test('all parenthesis strings through length eight match the independent prefix rule',()=>{
  for(let length=0;length<=8;length++)for(let mask=0;mask<2**length;mask++){
    const word=Array.from({length},(_,i)=>mask&(1<<i)?'(':')').join('');let state=createBracket(word),depth=0;
    for(const c of word){if(c===')'&&depth===0){state=bracketStep(state,'reject');break;}state=bracketStep(state,c==='('? 'push':'pop');depth+=c==='('?1:-1;}
    if(state.status==='playing')state=bracketStep(state,depth===0?'accept':'reject');
    assert.equal(state.status==='accepted',independent(word),word);
  }
});
test('incorrect operations do not advance or modify the stack',()=>{
  let s=createBracket('()');const wrong=bracketStep(s,'pop');assert.equal(wrong.pos,0);assert.equal(wrong.stack,0);assert.deepEqual(wrong.history,[]);
  s=bracketStep(s,'push');assert.equal(bracketStep(s,'accept').status,'playing');
  assert.throws(()=>createBracket('x'),RangeError);
});
test('saved prefixes are replayed and fabricated or extra actions are rejected',()=>{
  const saved={selected:'balanced',history:{balanced:['push','push'],early:[],unfinished:[]}};
  const state=restoreBrackets(saved);assert.equal(state.states.balanced.stack,2);assert.equal(bracketsComplete(state),false);
  assert.throws(()=>restoreBrackets({...saved,history:{...saved.history,balanced:['push','pop']}}),RangeError);
  assert.throws(()=>restoreBrackets({...saved,history:{...saved.history,early:['reject']}}),RangeError);
  assert.equal(bracketsComplete(createBracketSet()),false);
});
