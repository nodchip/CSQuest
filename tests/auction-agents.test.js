import test from 'node:test';
import assert from 'node:assert/strict';
import {auctionBids,auctionRivals,auctionModes,auctionResult,auctionCreate,auctionRestore,auctionRequired,auctionDone} from '../src/auction-agents.js';
test('both payment rules agree with independent outcome table, including ties',()=>{
 const expected={second:{4:[[false,0,0],[true,4,2],[true,4,2],[true,4,2]],6:[[false,0,0],[false,0,0],[false,0,0],[true,6,0]],8:[[false,0,0],[false,0,0],[false,0,0],[true,8,-2]]},first:{4:[[false,0,0],[true,5,1],[true,6,0],[true,10,-4]],6:[[false,0,0],[false,0,0],[false,0,0],[true,10,-4]],8:[[false,0,0],[false,0,0],[false,0,0],[true,10,-4]]}};
 for(const mode of Object.keys(auctionModes))for(const rival of auctionRivals)for(const [i,bid] of auctionBids.entries()){
  const {win,payment,utility}=auctionResult(mode,rival,bid);assert.deepEqual([win,payment,utility],expected[mode][rival][i]);
 }
 assert.throws(()=>auctionResult('constructor',4,6));
});
test('truthful bidding is weakly best against each modeled rival in second-price auction',()=>{
 for(const rival of auctionRivals){const truthful=auctionResult('second',rival,6).utility;for(const bid of auctionBids)assert.ok(truthful>=auctionResult('second',rival,bid).utility);}
 assert.ok(auctionResult('first',4,5).utility>auctionResult('first',4,6).utility);
});
test('all observations and correct reflections are required; restoration checks records',()=>{
 const q=auctionCreate();q.seen=[...auctionRequired];q.reflection='weak';q.comparison='five';assert.equal(auctionDone(q),true);
 for(const key of auctionRequired)assert.equal(auctionDone({...q,seen:q.seen.filter(x=>x!==key)}),false);
 assert.equal(auctionDone({...q,reflection:'always'}),false);assert.equal(auctionDone({...q,comparison:'six'}),false);
 const restored=auctionRestore(q);restored.seen.pop();assert.equal(q.seen.length,auctionRequired.length);
 assert.throws(()=>auctionRestore({...q,seen:['second:4:6','second:4:6']}));assert.throws(()=>auctionRestore({...q,seen:['constructor:4:6']}));
});
