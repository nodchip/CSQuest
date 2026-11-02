export const groverLevel={id:'ruin-grover-search',number:'820',kind:'grover-search',name:'四つの扉の量子探索',tag:'量子探索と干渉',title:'位相の反転で正しい扉を見つけよう',story:'四つの扉のうち一つだけに灯りがあります。目印の反転と平均を中心とした反転を使い、光の集まり方を調べましょう。'};
export const groverTargets=['00','01','10','11'];
export const groverSteps=['oracle','diffuse','predict:100','oracle','diffuse','predict:25'];
export function groverReplay(target,history){
 if(!groverTargets.includes(target)||!Array.isArray(history)||history.length>groverSteps.length)throw new RangeError('記録が不正です。');
 let amplitudes=[0.5,0.5,0.5,0.5];const marked=groverTargets.indexOf(target);
 for(let i=0;i<history.length;i++){
  if(history[i]!==groverSteps[i])throw new RangeError('次の操作や測定確率を確かめましょう。');
  if(history[i]==='oracle')amplitudes=amplitudes.map((x,j)=>j===marked?-x:x);
  if(history[i]==='diffuse'){const mean=amplitudes.reduce((a,b)=>a+b,0)/4;amplitudes=amplitudes.map(x=>2*mean-x);}
 }
 return {amplitudes,probabilities:amplitudes.map(x=>x*x),next:groverSteps[history.length]??null};
}
export function groverCreate(){return {target:'00',histories:Object.fromEntries(groverTargets.map(x=>[x,[]])),answer:null};}
export function groverStep(q,action){const h=q.histories[q.target];groverReplay(q.target,[...h,action]);h.push(action);}
export function groverComplete(q){return groverTargets.every(t=>q.histories[t].length===groverSteps.length&&groverReplay(t,q.histories[t]).next===null)&&q.answer==='rotate';}
export function groverRestore(q){if(!q||!groverTargets.includes(q.target)||!q.histories||![null,'rotate','always','readall'].includes(q.answer))throw new RangeError('記録が不正です。');const n=groverCreate();n.target=q.target;n.answer=q.answer;for(const t of groverTargets){groverReplay(t,q.histories[t]);n.histories[t]=[...q.histories[t]];}return n;}
