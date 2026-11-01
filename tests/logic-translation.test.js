import test from 'node:test';
import assert from 'node:assert/strict';
import {logicStatements,logicCards,logicCardValue,logicCounterexample,createLogicTranslation,logicTranslationAct,restoreLogicTranslation,logicTranslationComplete} from '../src/logic-translation.js';
const act=(s,a)=>{const r=logicTranslationAct(s,a);assert.equal(r.ok,true,r.message);return r.state;};
test('all sixteen villages agree with independent truth conditions, including empty A',()=>{
 for(let x=0;x<4;x++)for(let y=0;y<4;y++){
  const rows=[x,y].map(v=>({a:v>=2,b:v%2===1})),p=[x,y];
  assert.equal(logicCardValue('allAB',p),rows.filter(r=>r.a).every(r=>r.b));
  assert.equal(logicCardValue('allBA',p),rows.filter(r=>r.b).every(r=>r.a));
  assert.equal(logicCardValue('everyBoth',p),rows.every(r=>r.a&&r.b));
  assert.equal(logicCardValue('someBoth',p),rows.some(r=>r.a&&r.b));
  assert.equal(logicCardValue('noBoth',p),rows.every(r=>!r.a||!r.b));
  assert.equal(logicCardValue('someAwithoutB',p),rows.some(r=>r.a&&!r.b));
 }
 assert.equal(logicCardValue('allAB',[0,1]),true);
 assert.equal(logicCardValue('someBoth',[0,1]),false);
});
test('each wrong card has a real counterexample for every statement',()=>{
 for(const [id,c] of Object.entries(logicStatements))for(const card of Object.keys(logicCards)){
  const witness=logicCounterexample(id,card);
  if(card===c.answer)assert.equal(witness,null);else {assert.notEqual(witness,null);assert.notEqual(witness.expected,witness.actual);}
 }
 assert.throws(()=>logicCardValue('allAB',[4,0]),RangeError);
});
test('observation is required, wrong answers produce witnesses, and progress restores',()=>{
 let s=createLogicTranslation();assert.equal(logicTranslationAct(s,'check').ok,false);
 for(const a of ['card:allBA','observe','check'])s=act(s,a);assert.equal(s.report.type,'counterexample');
 for(const [id,c] of Object.entries(logicStatements))for(const a of [`target:${id}`,`card:${c.answer}`,'observe','check'])s=act(s,a);
 assert.equal(logicTranslationComplete(s),true);assert.deepEqual(restoreLogicTranslation(JSON.parse(JSON.stringify(s))),s);
 assert.throws(()=>restoreLogicTranslation({history:['card:bad']}),RangeError);
});
