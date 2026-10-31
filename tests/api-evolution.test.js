import {test} from 'node:test';
import assert from 'node:assert/strict';
import {evolutionResult,evolutionVersionWorks,createEvolution,evolutionComplete,restoreEvolution} from '../src/api-evolution.js';
test('compatibility is evaluated against old and new consumers, including the implicit order dependency',()=>{
 assert.deepEqual(['archive','first','newcomer'].map(c=>evolutionResult('reorder',c).ok),[true,false,true]);assert.deepEqual(['archive','first','newcomer'].map(c=>evolutionResult('rename',c).ok),[false,false,true]);assert.deepEqual(['archive','first','newcomer'].map(c=>evolutionResult('coexist',c).ok),[true,true,true]);assert.deepEqual(['reorder','rename','coexist'].filter(evolutionVersionWorks),['coexist']);assert.throws(()=>evolutionResult('unknown','first'),RangeError);
});
test('all consumer-version pairs and a compatible choice are required; drafts are independent',()=>{
 const s=createEvolution();for(const t of Object.values(s.tested))for(const k of Object.keys(t))t[k]=true;s.choice='coexist';s.checked=true;const copy=restoreEvolution(s);s.tested.reorder.first=false;assert.equal(evolutionComplete(copy),true);assert.equal(evolutionComplete(s),false);copy.choice='reorder';assert.equal(evolutionComplete(copy),false);assert.throws(()=>restoreEvolution({...copy,choice:'bad'}),RangeError);
});
