export const archLearnLevel={id:'workshop-architecture-learner',number:'880',kind:'architecture-learner',name:'仕事を読む二つの工房',tag:'機械学習による構成選択',title:'仕事の特徴から道具を選ぼう',story:'精霊たちは仕事の記録を使い、汎用の工房と専用の工房のどちらを選ぶか学びます。知らない仕事でも予測が当たるか試しましょう。'};
export const archGoals={time:'時間を短く',energy:'消費を少なく'};
export const archTrain=[4,8,12,16,24,32].map((ops,i)=>({id:`訓練${i+1}`,ops,bytes:4}));
export const archTest=[{id:'検査1',ops:16,bytes:10},{id:'検査2',ops:24,bytes:8},{id:'検査3',ops:8,bytes:1},{id:'検査4',ops:4,bytes:1}];
export const archThresholds=[1.5,2.5,3.5,5,7];
export function archMeasures(w){if(!w||!Number.isFinite(w.ops)||w.ops<=0||!Number.isFinite(w.bytes)||w.bytes<=0)throw new RangeError('仕事の値が不正です。');const {ops,bytes}=w;return {intensity:ops/bytes,time:{general:ops/2,special:ops/8+bytes/2+2},energy:{general:ops/2+1,special:ops*0.3+bytes/2+2}};}
export function archBest(w,goal){if(!Object.hasOwn(archGoals,goal))throw new RangeError('目的が不正です。');const m=archMeasures(w)[goal];return m.general<=m.special?'general':'special';}
export function archPredict(w,threshold){return archMeasures(w).intensity>=threshold?'special':'general';}
export function archFit(goal){if(!Object.hasOwn(archGoals,goal))throw new RangeError('目的が不正です。');const scores=archThresholds.map(threshold=>({threshold,correct:archTrain.filter(w=>archPredict(w,threshold)===archBest(w,goal)).length}));const best=scores.reduce((a,b)=>b.correct>a.correct?b:a);return {threshold:best.threshold,correct:best.correct,scores};}
export function archEvaluate(goal){const model=archFit(goal),rows=archTest.map(w=>({id:w.id,prediction:archPredict(w,model.threshold),actual:archBest(w,goal)}));return {model,rows,correct:rows.filter(r=>r.prediction===r.actual).length};}
export function archLearnCreate(){return {goal:'time',stages:{time:0,energy:0},generalization:null,tradeoff:null};}
export function archLearnComplete(q){return Object.keys(archGoals).every(g=>q.stages[g]===2)&&q.generalization==='holdout'&&q.tradeoff==='objective';}
export function archLearnRestore(q){if(!q||!Object.hasOwn(archGoals,q.goal)||![null,'holdout','guarantee','training'].includes(q.generalization)||![null,'objective','same','energy'].includes(q.tradeoff))throw new RangeError('記録が不正です。');for(const g of Object.keys(archGoals))if(!Number.isInteger(q.stages?.[g])||q.stages[g]<0||q.stages[g]>2)throw new RangeError('記録が不正です。');return {goal:q.goal,stages:{time:q.stages.time,energy:q.stages.energy},generalization:q.generalization,tradeoff:q.tradeoff};}
