export const intentLevel={id:'workshop-goal-inference',number:'1274',kind:'goal-inference',name:'職人の向かう先',tag:'人の目的と推測',title:'どちらの棚を手伝う？',story:'工房の職人は赤か青の棚に向かいます。人形が観測から目的を推測し、手伝い方を選びます。'};
export const intentPriors=[50,10];
export const intentSignals={red:{name:'赤側へ動く',a:4,b:1},blue:{name:'青側へ動く',a:1,b:4},middle:{name:'中央で動く',a:5,b:5}};
export const intentRequired=['50:red','50:blue','50:middle','10:red'];
export function intentPosterior(prior,signal){if(!intentPriors.includes(prior)||!Object.hasOwn(intentSignals,signal))throw new RangeError('条件が不正です。');const s=intentSignals[signal],a=prior*s.a,b=(100-prior)*s.b;return {a,b,total:a+b};}
export function intentRecommendation(p){if(4*p.a>3*p.total)return 'red';if(4*p.b>3*p.total)return 'blue';return 'ask';}
export function intentCreate(){return {prior:50,signal:'red',observed:false,choice:null,seen:[],reflection:null};}
export function intentObserve(q){q.observed=true;q.choice=null;return intentPosterior(q.prior,q.signal);}
export function intentCheck(q){if(!q.observed||!['red','blue','ask'].includes(q.choice))return null;const p=intentPosterior(q.prior,q.signal),best=intentRecommendation(p),ok=q.choice===best,key=`${q.prior}:${q.signal}`;if(ok&&!q.seen.includes(key))q.seen.push(key);return {p,best,ok};}
export function intentDone(q){return intentRequired.every(k=>q.seen.includes(k))&&q.reflection==='uncertain';}
export function intentRestore(q){if(!q||!intentPriors.includes(q.prior)||!Object.hasOwn(intentSignals,q.signal)||typeof q.observed!=='boolean'||![null,'red','blue','ask'].includes(q.choice)||(!q.observed&&q.choice!==null)||![null,'uncertain','certain'].includes(q.reflection)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!intentPriors.some(p=>Object.keys(intentSignals).some(s=>k===`${p}:${s}`))))throw new RangeError('記録が不正です。');return {prior:q.prior,signal:q.signal,observed:q.observed,choice:q.choice,seen:[...q.seen],reflection:q.reflection};}
