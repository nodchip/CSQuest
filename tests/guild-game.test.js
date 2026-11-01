import test from 'node:test';
import assert from 'node:assert/strict';
import {guildPayoff,guildIndex,createGuildGame,guildGameComplete,restoreGuildGame} from '../src/guild-game.js';
import {createDecision,restoreDecision} from '../src/decision.js';
test('only mutual rest is a Nash equilibrium while mutual work maximizes the sum',()=>{
 const actions=['work','rest'],equilibria=[],sums=[];
 for(const a of actions)for(const b of actions){
  const p=guildPayoff(a,b);sums.push({a,b,sum:p[0]+p[1]});
  if(actions.every(alt=>guildPayoff(alt,b)[0]<=p[0])&&actions.every(alt=>guildPayoff(a,alt)[1]<=p[1]))equilibria.push([a,b]);
 }
 assert.deepEqual(equilibria,[['rest','rest']]);
 assert.deepEqual(sums.filter(x=>x.sum===Math.max(...sums.map(y=>y.sum))).map(x=>[x.a,x.b]),[['work','work']]);
 assert.deepEqual(actions.flatMap(a=>actions.map(b=>guildIndex(a,b))),[0,1,2,3]);
 const s=createGuildGame();Object.assign(s,{a:'rest',b:'rest',visited:15,last:3,equilibrium:'rest',welfare:'work',checked:true});assert.equal(guildGameComplete(s),true);
 const copy=restoreGuildGame(s);copy.welfare='rest';assert.equal(guildGameComplete(copy),false);
 assert.throws(()=>restoreGuildGame({...s,visited:0}));
});
test('older drafts keep choices and acquire an unplayed game',()=>{
 const {game,...old}=createDecision();old.choices.costly.alarm.broken=8;
 const r=restoreDecision(old);assert.equal(r.choices.costly.alarm.broken,8);assert.deepEqual(r.game,createGuildGame());
});
