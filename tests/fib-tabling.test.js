import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fibActions,fibInitial,fibExpected,fibExecute,fibReplay,fibCreate,fibStep,fibCheck,fibComplete,fibRestore} from '../src/fib-tabling.js';

function oracle(n,memo,cache=new Map()){
 if(memo&&cache.has(n))return {value:cache.get(n),calls:1,computations:0,hits:1};
 let result;if(n<2)result={value:n,calls:1,computations:1,hits:0};else{const a=oracle(n-1,memo,cache),b=oracle(n-2,memo,cache);result={value:a.value+b.value,calls:1+a.calls+b.calls,computations:1+a.computations+b.computations,hits:a.hits+b.hits};}
 if(memo)cache.set(n,result.value);return result;
}
for(const mode of ['plain','memo'])test(`${mode}: recursive trace matches independent oracle and rejects invalid actions`,()=>{
 const s=fibInitial(mode),history=[];
 while(fibExpected(s)){const expected=fibExpected(s);for(const a of Object.keys(fibActions).filter(a=>a!==expected))assert.throws(()=>fibExecute(structuredClone(s),a));history.push(expected);fibExecute(s,expected);assert.deepEqual(fibReplay(mode,history),s);}
 const expected=oracle(5,mode==='memo');for(const key of Object.keys(expected))assert.equal(s[key==='value'?'result':key],expected[key]);
 assert.equal(s.result,5);assert.equal(s.computations,mode==='plain'?15:6);assert.equal(s.calls,mode==='plain'?15:9);assert.equal(s.hits,mode==='plain'?0:3);
 assert.throws(()=>fibExecute(s,'base'));
});
test('completion requires both verified runs and correct reflection; restore rejects forged progress',()=>{
 const q=fibCreate();assert.equal(fibCheck(q),false);assert.throws(()=>fibStep(q,'sum'));
 for(const mode of ['plain','memo']){q.selected=mode;let r=fibReplay(mode,q.trials[mode].history);while(fibExpected(r)){fibStep(q,fibExpected(r));r=fibReplay(mode,q.trials[mode].history);}q.trials[mode].guess=9;assert.equal(fibCheck(q),false);q.trials[mode].guess=r.computations;assert.equal(fibCheck(q),true);assert.deepEqual(fibRestore(q),q);}
 assert.equal(fibComplete(q),false);q.answer='reuse';assert.equal(fibComplete(q),true);
 const forged=structuredClone(q);forged.trials.plain.history=['sum'];assert.throws(()=>fibRestore(forged));
 forged.trials.plain.history=[];assert.throws(()=>fibRestore(forged));
});
