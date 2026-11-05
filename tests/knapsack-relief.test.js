import test from 'node:test';
import assert from 'node:assert/strict';
import {knapsackItems,knapsackCases,knapsackPack,knapsackRows,knapsackExplore,knapsackBoundState,knapsackChoices,knapsackCreate,knapsackGreedyCorrect,knapsackOptimal,knapsackAdvance,knapsackTrialDone,knapsackDone,knapsackRestore} from '../src/knapsack-relief.js';
test('all table cells match independent enumeration of every available subset',()=>{assert.deepEqual(knapsackItems.map(x=>[x.weight,x.value]),[[2,6],[3,8],[4,9]]);for(let capacity=0;capacity<=7;capacity++){const rows=knapsackRows(capacity);for(let n=0;n<=3;n++)for(let c=0;c<=capacity;c++){let best=0;for(let mask=0;mask<(1<<n);mask++){let w=0,v=0;for(let i=0;i<n;i++)if(mask&(1<<i)){w+=[2,3,4][i];v+=[6,8,9][i];}if(w<=c)best=Math.max(best,v);}assert.equal(rows[n][c],best,`n=${n} c=${c}`);}}for(let mask=0;mask<8;mask++){assert.equal(knapsackGreedyCorrect(mask),mask===3);assert.equal(knapsackOptimal('small',mask),mask===3);assert.equal(knapsackOptimal('large',mask),mask===6);}assert.deepEqual(knapsackPack(6),{weight:7,value:17});});
test('three decisions, two optimal loads and reflection are required',()=>{const q=knapsackCreate();for(const id of Object.keys(knapsackCases)){const t=q.trials[id];assert(!knapsackAdvance(id,t,'take'));t.greedyMask=3;t.greedyChecked=true;for(let n=0;n<3;n++){const x=knapsackChoices(id,n),good=x.take===x.best?'take':'skip',bad=good==='take'?'skip':'take';assert(!knapsackAdvance(id,t,bad));assert.equal(t.dpSteps,n);assert(knapsackAdvance(id,t,good));}t.optimalMask=id==='small'?3:6;t.optimalChecked=true;assert(knapsackTrialDone(id,t));}q.answer='counterexample';assert(!knapsackDone(q));q.checked=true;assert(knapsackDone(q));const copy=knapsackRestore(q);copy.trials.small.optimalMask=0;assert(!knapsackDone(copy));assert(knapsackDone(q));assert.throws(()=>knapsackRestore(copy));const bad=knapsackCreate();bad.trials.large.dpSteps=1;assert.throws(()=>knapsackRestore(bad));});
test('capacity exploration compares greedy choices and all optimal packs',()=>{
 const greedy=[0,0,6,6,6,14,14,14],best=[0,0,6,8,9,14,15,17];
 for(let c=0;c<=7;c++){const r=knapsackExplore(c);assert.equal(r.greedy.value,greedy[c]);assert.equal(r.best,best[c]);assert.deepEqual(r.optimalMasks,Array.from({length:8},(_,mask)=>mask).filter(mask=>{const p=knapsackPack(mask);return p.weight<=c&&p.value===best[c];}));}
 assert.throws(()=>knapsackExplore(8));
 const old=knapsackCreate();delete old.exploreCapacity;assert.equal(knapsackRestore(old).exploreCapacity,5);
 assert.equal(knapsackRestore({...old,exploreCapacity:0}).exploreCapacity,0);
 assert.throws(()=>knapsackRestore({...old,exploreCapacity:8}));
 delete old.exploreGuess;delete old.exploreChecked;
 assert.equal(knapsackRestore(old).exploreChecked,false);
 assert.equal(knapsackRestore({...old,exploreGuess:'better',exploreChecked:true}).exploreGuess,'better');
 assert.throws(()=>knapsackRestore({...old,exploreChecked:true}));
 assert.throws(()=>knapsackRestore({...old,exploreGuess:'other'}));
});

test('branch and bound rejects unsafe pruning and finds the enumerated optimum',()=>{
 let actions=[],state=knapsackBoundState(actions);assert.throws(()=>knapsackBoundState(['prune']));assert.throws(()=>knapsackBoundState(['visit']));
 while(state.node){const node=state.node,action=state.pack.weight>7||state.upper<=state.best?'prune':node.depth===3?'visit':'expand';actions.push(action);state=knapsackBoundState(actions);}
 assert.equal(state.best,17);assert.equal(state.bestMask,6);assert.ok(state.pruned>0);assert.equal(state.pending,0);assert.throws(()=>knapsackBoundState([...actions,'visit']));
 const old=knapsackCreate();delete old.boundActions;assert.deepEqual(knapsackRestore(old).boundActions,[]);const q=knapsackCreate();q.boundActions=actions;const copy=knapsackRestore(q);assert.equal(knapsackBoundState(copy.boundActions).best,17);copy.boundActions.pop();assert.equal(q.boundActions.length,actions.length);assert.throws(()=>knapsackRestore({...q,boundActions:['prune']}));
});

test('every legal expand or prune path preserves the optimum',()=>{
 let complete=0;function visit(actions){const state=knapsackBoundState(actions);if(!state.node){assert.equal(state.best,17);complete++;return;}for(const action of ['expand','visit','prune']){const next=[...actions,action];try{knapsackBoundState(next);}catch{continue;}visit(next);}}visit([]);assert.ok(complete>1);
});
