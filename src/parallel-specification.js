export const parallelSpecLevel={id:'forge-parallel-specification',number:'1104',kind:'parallel-specification',name:'二つの工房と旅の記録',tag:'並列化と仕様の見直し',title:'順番を守って記録を届ける',story:'旅の記録を二つの工房に分けて写します。早く届いた順に並べても、元の旅の順序が守られるでしょうか。'};
export const specNames=['森','橋','城','村'];
export const specMethods={arrival:'届いた順に並べる',position:'元の番号順に並べる'};
export const specActions={A:'工房甲の写しを受け取る',B:'工房乙の写しを受け取る',publish:'今ある写しを公開する'};
export function specReplay(method,history){
 if(!Object.hasOwn(specMethods,method)||!Array.isArray(history)||history.length>3)throw new RangeError('記録が不正です。');
 const received=[],items=[];let published=null;
 for(const a of history){if(a==='publish'){if(published!==null)throw new RangeError('公開後は操作できません。');const ordered=method==='position'?[...items].sort((x,y)=>x-y):items;published=ordered.map(i=>specNames[i]);}else if(['A','B'].includes(a)){if(published!==null||received.includes(a))throw new RangeError('その写しは受け取れません。');received.push(a);items.push(...(a==='A'?[0,1]:[2,3]));}else throw new RangeError('操作が不正です。');}
 return {received,published,correct:published!==null&&published.length===4&&published.every((v,i)=>v===specNames[i])};
}
export function specKey(method,history){const s=specReplay(method,history);if(s.published===null)return null;if(history.length===2&&method==='position'&&history[0]==='A')return 'early';if(history.length===3&&history[0]==='B'&&history[1]==='A')return method==='arrival'?'arrivalBA':'positionBA';if(history.length===3&&history[0]==='A'&&history[1]==='B'&&method==='position')return 'positionAB';return null;}
export function specCreate(){return {method:'arrival',history:[],seen:[],rules:[],checked:false};}
export function specAct(q,action){specReplay(q.method,[...q.history,action]);q.history.push(action);const k=specKey(q.method,q.history);if(k&&!q.seen.includes(k))q.seen.push(k);}
export function specDone(q){return ['arrivalBA','positionBA','positionAB','early'].every(k=>q.seen.includes(k))&&q.checked&&q.rules.length===3&&['once','order','wait'].every(x=>q.rules.includes(x));}
export function specRestore(q){const keys=['arrivalBA','positionBA','positionAB','early'],rules=['once','order','wait','fast'];if(!q||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!keys.includes(k))||!Array.isArray(q.rules)||new Set(q.rules).size!==q.rules.length||q.rules.some(k=>!rules.includes(k))||typeof q.checked!=='boolean')throw new RangeError('途中記録が不正です。');specReplay(q.method,q.history);const k=specKey(q.method,q.history);if(k&&!q.seen.includes(k))throw new RangeError('確認記録が不正です。');return {method:q.method,history:[...q.history],seen:[...q.seen],rules:[...q.rules],checked:q.checked};}
