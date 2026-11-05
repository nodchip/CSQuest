import test from 'node:test';
import assert from 'node:assert/strict';
import {ipPrefixCases,ipPrefixRoutes,ipPrefixResult,prefixRoutes,prefixCases,matchingRoutes,longestRoute,createPrefix,prefixResult,restorePrefix,prefixComplete} from '../src/prefix.js';
test('all 256 addresses match independently calculated numeric ranges',()=>{
  for(let n=0;n<256;n++){const bits=n.toString(2).padStart(8,'0'),expected=['default',...(n>=128?['one']:[]),...(n>=160&&n<=191?['three']:[]),...(n>=176&&n<=191?['four']:[])];assert.deepEqual(matchingRoutes(bits),expected);assert.equal(longestRoute(bits),expected.at(-1));}
});
test('all matching entries and the longest match are both required',()=>{
  const ids=Object.keys(prefixRoutes);for(const [id,task] of Object.entries(prefixCases))for(let mask=0;mask<16;mask++)for(const route of ids){const matches=ids.filter((_,i)=>mask&(1<<i)),r=prefixResult(id,{matches,route});assert.equal(r.matches,matchingRoutes(task.bits).every(x=>matches.includes(x))&&matches.length===matchingRoutes(task.bits).length);assert.equal(r.route,route===longestRoute(task.bits));}
});
test('completion needs checked valid cases and restoration rejects invalid selections',()=>{
  const s=createPrefix();for(const [id,task] of Object.entries(prefixCases))s.choices[id]={matches:matchingRoutes(task.bits),route:longestRoute(task.bits),checked:true};assert.equal(prefixComplete(restorePrefix(s)),true);
  s.choices.hill.checked=false;assert.equal(prefixComplete(s),false);assert.throws(()=>restorePrefix({...s,choices:{...s.choices,hill:{matches:['default','default'],route:'',checked:false}}}),RangeError);
});

test('documentation IPv4 examples select the longest matching range and restore legacy drafts',()=>{const expected={west:'half',east:'quarter'};for(const [id,item] of Object.entries(ipPrefixCases)){const last=Number(item.address.split('.').at(-1));assert.equal(Number.parseInt(item.lastBits,2),last);const oracle=last>=192?'quarter':last>=128?'half':'net';assert.equal(oracle,expected[id]);for(const route of Object.keys(ipPrefixRoutes))assert.equal(ipPrefixResult(id,route),route===oracle);}const old=createPrefix();delete old.ipSelected;delete old.ipAnswers;assert.deepEqual(restorePrefix(old).ipAnswers,{west:'',east:''});old.ipSelected='east';old.ipAnswers={west:'net',east:'quarter'};assert.deepEqual(restorePrefix(old).ipAnswers,old.ipAnswers);old.ipAnswers.west='wrong';assert.throws(()=>restorePrefix(old),RangeError);});
