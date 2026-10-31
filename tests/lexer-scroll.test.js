import test from 'node:test';
import assert from 'node:assert/strict';
import {lexerCases,lexerNext,lexerStep,createLexer,lexerComplete,restoreLexer} from '../src/lexer-scroll.js';
test('longest letter runs are classified as keywords only on exact match',()=>{
 const expected={joined:[['ifx','identifier'],['=','equal'],['12','number']],separate:[['if','keyword'],['x','identifier'],['=','equal'],['12','number']]};
 for(const [id,items] of Object.entries(expected)){let t=createLexer().trials[id];for(const [value,type] of items){const token=lexerNext(id,t.position);assert.equal(token.value,value);assert.equal(token.type,type);t=lexerStep(id,t,value.length,type);}assert.equal(lexerNext(id,t.position),null);assert.deepEqual(t.tokens.map(v=>[v.value,v.type]),items);}
 let t=createLexer().trials.joined;assert.equal(lexerStep('joined',t,2,'keyword').position,0);assert.equal(lexerStep('joined',t,3,'keyword').position,0);assert.equal(lexerCases.separate.text[2],' ');
});
test('checked completion requires both complete streams and the correct rule',()=>{
 const s=createLexer();for(const id of Object.keys(lexerCases)){let t=s.trials[id],token;while((token=lexerNext(id,t.position))!==null)t=lexerStep(id,t,token.value.length,token.type);s.trials[id]=t;}s.reason='prefix';s.checked=true;assert.equal(lexerComplete(s),false);s.reason='whole';assert.equal(lexerComplete(s),true);assert.deepEqual(restoreLexer(s),s);const copy=restoreLexer(s);copy.trials.joined.history[0]=[2,'keyword'];assert.throws(()=>restoreLexer(copy));assert.deepEqual(s.trials.joined.history[0],[3,'identifier']);
});
