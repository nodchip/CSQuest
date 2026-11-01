import test from 'node:test';
import assert from 'node:assert/strict';
import {selectionCases,selectionStart,selectionStep,selectionCreate,selectionRestore,selectionComplete} from '../src/selection-sort.js';

function finish(s){while(s.phase!=='done'){const action=s.phase==='place'?'place':s.items[s.min].value<=s.items[s.next].value?s.min:s.next;s=selectionStep(s,action);}return s;}
test('selection sort orders every four-item input over three values with six comparisons',()=>{
 for(let code=0;code<81;code++){let x=code;const values=Array.from({length:4},()=>{const v=x%3;x=Math.floor(x/3);return v;});let s=selectionStart('stones');s.items=values.map((value,i)=>({id:String(i),value}));s=finish(s);assert.deepEqual(s.items.map(x=>x.value),[...values].sort((a,b)=>a-b));assert.equal(s.comparisons,6);}
});
test('equal keys can reverse, wrong answers do not advance, and history restores',()=>{
 let q=selectionCreate(),s=q.states.ties;const bad=selectionStep(s,2);assert.deepEqual(bad.history,[]);s=finish(s);assert.deepEqual(s.items.map(x=>x.id),['C','B','A']);assert.equal(s.comparisons,3);q.states.ties=s;
 const partial=selectionStep(q.states.stones,1);q.states.stones=partial;const saved={selected:'ties',history:Object.fromEntries(Object.keys(selectionCases).map(id=>[id,q.states[id].history]))};const restored=selectionRestore(saved);assert.equal(restored.states.stones.comparisons,1);assert.equal(restored.states.ties.phase,'done');assert.equal(selectionComplete(restored),false);restored.states.stones=finish(restored.states.stones);assert.equal(selectionComplete(restored),true);assert.throws(()=>selectionRestore({selected:'stones',history:{stones:[2],ties:[]}}));
});
