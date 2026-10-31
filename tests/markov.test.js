import test from 'node:test';
import assert from 'node:assert/strict';
import {markovCases,markovFlow,markovStep,createMarkov,restoreMarkov,markovComplete} from '../src/markov.js';

test('both two-step distributions match independently enumerated transition paths',()=>{
  for(const [id,item] of Object.entries(markovCases)){
    let state=createMarkov().states[id],paths={[item.initial===100?'clear':'mist']:1};
    for(let day=0;day<2;day++){
      const next={clear:0,mist:0};for(const [weather,weight] of Object.entries(paths)){const p=weather==='clear'?0.8:0.5;next.clear+=weight*p;next.mist+=weight*(1-p);}paths=next;
      const flow=markovFlow(state.clear);state=markovStep(state,flow.fromClear,flow.fromMist);
      assert.ok(Math.abs(state.clear/100-paths.clear)<1e-12);assert.ok(Math.abs((100-state.clear)/100-paths.mist)<1e-12);
    }
    assert.equal(state.clear,id==='clear'?74:65);
  }
});
test('wrong contributions preserve progress and validated histories restore',()=>{
  const set=createMarkov();for(const id of Object.keys(markovCases)){let state=set.states[id];while(state.round<2){const flow=markovFlow(state.clear),wrong=flow.fromClear===0?10:0;assert.equal(markovStep(state,wrong,flow.fromMist).round,state.round);state=markovStep(state,flow.fromClear,flow.fromMist);}set.states[id]=state;}assert.equal(markovComplete(set),true);
  const saved={selected:'clear',histories:Object.fromEntries(Object.entries(set.states).map(([id,s])=>[id,s.history])),choices:{fromClear:null,fromMist:null}};assert.deepEqual(restoreMarkov(saved),set);assert.throws(()=>restoreMarkov({...saved,histories:{...saved.histories,clear:[[0,0]]}}),RangeError);assert.throws(()=>markovStep(set.states.clear,0,0),RangeError);
});
