import test from 'node:test';
import assert from 'node:assert/strict';
import {createMcts,mctsScores,mctsAllowed,mctsBestMoves,mctsStep,mctsComplete,restoreMcts} from '../src/mcts.js';

test('selection, simulated games and backpropagation preserve game and tree invariants',()=>{
 let s=createMcts();assert.deepEqual(mctsAllowed(s),[1,2]);
 for(let i=0;i<32;i++){
  const scores=mctsScores(s),allowed=mctsAllowed(s),unvisited=scores.filter(x=>x.visits===0);
  if(unvisited.length)assert.deepEqual(allowed,unvisited.map(x=>x.move));else{const independent=scores.map(x=>({move:x.move,score:x.wins/x.visits+Math.sqrt(2*Math.log(i)/x.visits)})),max=Math.max(...independent.map(x=>x.score));assert.deepEqual(allowed,independent.filter(x=>Math.abs(x.score-max)<1e-12).map(x=>x.move));}
  const previous=s.root.visits,r=mctsStep(s,allowed[0]);assert.equal(r.ok,true);s=r.state;assert.equal(s.root.visits,previous+1);
  let stones=7,turn='player';for(const take of s.last.treeMoves){assert.ok(take>=1&&take<=Math.min(2,stones));stones-=take;turn=turn==='player'?'guardian':'player';}for(const {turn:who,take} of s.last.rollout){assert.equal(who,turn);assert.ok(take>=1&&take<=Math.min(2,stones));stones-=take;turn=turn==='player'?'guardian':'player';}assert.equal(stones,0);assert.equal(s.last.winner,turn==='player'?'guardian':'player');
  const check=node=>{assert.ok(node.wins>=0&&node.wins<=node.visits);assert.ok(node.children.reduce((n,c)=>n+c.node.visits,0)<=node.visits);for(const child of node.children){assert.equal(child.node.stones,node.stones-child.move);assert.notEqual(child.node.turn,node.turn);check(child.node);}};check(s.root);
 }
 assert.equal(mctsStep(s,mctsAllowed(s)[0]).ok,false);assert.deepEqual(restoreMcts(s),s);
});
test('short samples and false certainty do not finish, and invalid histories are rejected',()=>{
 let s=createMcts();s.best=1;s.answer='sample';s.checked=true;assert.equal(mctsComplete(s),false);
 for(let i=0;i<12;i++)s=mctsStep(s,mctsAllowed(s)[0]).state;s.best=mctsBestMoves(s)[0];s.answer='guaranteed';s.checked=true;assert.equal(mctsComplete(s),false);s.answer='sample';assert.equal(mctsComplete(s),true);
 assert.throws(()=>restoreMcts({...s,history:[1,1]}),RangeError);
});
test('within the tree the guardian favors its own simulated wins, with unvisited children first',()=>{
 let s=createMcts();for(let i=0;i<32;i++){
  const rootMove=mctsAllowed(s)[0],before=s,r=mctsStep(s,rootMove);assert.equal(r.ok,true);let node=before.root.children.find(c=>c.move===rootMove).node;
  for(const move of r.state.last.treeMoves.slice(1)){
   assert.ok(node.visits>0&&node.stones>0);
   if(node.children.length===0){assert.equal(move,1);break;}
   const unvisited=node.children.filter(c=>c.node.visits===0);
   const expected=unvisited.length?unvisited[0]:node.children.reduce((best,c)=>{const score=x=>{const mean=x.node.wins/x.node.visits;return (node.turn==='player'?mean:1-mean)+Math.sqrt(2*Math.log(node.visits)/x.node.visits);};return score(c)>score(best)?c:best;});
   assert.equal(move,expected.move);node=expected.node;
  }
  s=r.state;
 }
});
