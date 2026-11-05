export const deadlockModelLevel={id:'forge-deadlock-checking',number:'244',kind:'deadlock-checking',name:'二つの鍵の行き止まり',tag:'状態探索とデッドロック',title:'鍵を待つ道を調べよう',story:'二人の精霊が二つの鍵を使って作業します。鍵を取る順序を変え、誰も進めなくなる状態がないか調べましょう。'};
export const deadlockOrders={opposite:'Ａは赤→青、Ｂは青→赤',same:'ＡもＢも赤→青'};
export const retryModes={together:'二人とも譲って同時に再挑戦',yield:'Ｂが譲り、Ａの終了を待つ'};
// Each step in this deliberately synchronized schedule may represent two actions.
export function retryState(mode,step){
 if(!Object.hasOwn(retryModes,mode)||!Number.isInteger(step)||step<0||step>8)throw new RangeError('再挑戦の記録が不正です。');
 const start={a:'なし',b:'なし',finished:0,message:'二人とも鍵を持たず、作業は未完了です。'};
 const conflict={a:'赤',b:'青',finished:0,message:'Ａは赤、Ｂは青を持ち、互いの鍵が必要です。'};
 if(mode==='together')return step===0?start:step%2?conflict:{...start,message:'二人とも鍵を返し、同じ初期状態に戻りました。'};
 return [start,conflict,{a:'赤',b:'なし',finished:0,message:'Ｂが青を返し、Ａの終了を待ちます。'},
 {a:'赤・青',b:'なし',finished:0,message:'Ａが青も取得しました。'},
 {a:'なし',b:'なし',finished:1,message:'Ａが作業を終えて両方を返しました。'},
 {a:'なし',b:'青',finished:1,message:'Ｂが青を取得しました。'},
 {a:'なし',b:'赤・青',finished:1,message:'Ｂが赤も取得しました。'},
 {a:'なし',b:'なし',finished:2,message:'Ｂも作業を終えて両方を返しました。'}][Math.min(step,7)];
}
const order=(mode,who)=>who==='b'&&mode==='opposite'?['青','赤']:['赤','青'];
const stateKey=s=>`${s.a},${s.b}`;
export function deadlockHeld(mode,state,who){if(!Object.hasOwn(deadlockOrders,mode)||!['a','b'].includes(who))throw new RangeError('設定が不正です。');const step=state[who];return step===1?[order(mode,who)[0]]:step===2?order(mode,who):[];}
// One selected spirit acts at a time; a failed second acquisition releases its first key.
export function manualRetryNext(state,who){
 if(!state||!['a','b'].includes(who)||![0,1,2,3].includes(state.a)||![0,1,2,3].includes(state.b)||state.a===2&&[1,2].includes(state.b)||state.b===2&&state.a===1)throw new RangeError('行動の状態が不正です。');
 const other=who==='a'?'b':'a',stage=state[who],name=who.toUpperCase(),keys=order('opposite',who),held=deadlockHeld('opposite',state,other);
 if(stage===3||stage===0&&held.includes(keys[0]))return null;
 const next={a:state.a,b:state.b,message:''};
 if(stage===0){next[who]=1;next.message=`${name}が${keys[0]}を取りました。`;}
 else if(stage===1&&held.includes(keys[1])){next[who]=0;next.message=`${name}は${keys[1]}を取れず、${keys[0]}を返しました。`;}
 else if(stage===1){next[who]=2;next.message=`${name}が${keys[1]}も取りました。`;}
 else{next[who]=3;next.message=`${name}が作業を終え、両方の鍵を返しました。`;}
 return next;
}
export function manualRetryReplay(history){
 if(!Array.isArray(history)||history.length>80)throw new RangeError('行動の記録が不正です。');
 let state={a:0,b:0,message:'二人とも鍵を持っていません。'};
 for(const who of history){const next=manualRetryNext(state,who);if(!next)throw new RangeError('その行動はできません。');state=next;}
 return state;
}
// Identify a repeated current state and the actual actions between the two visits.
export function manualRetryCycle(history){
 const current=manualRetryReplay(history),key=stateKey(current);
 for(let i=0;i<history.length;i++){
  if(stateKey(manualRetryReplay(history.slice(0,i)))===key)return {start:i,end:history.length,actions:history.slice(i)};
 }
 return null;
}
export function deadlockNext(mode,state){const result=[];for(const who of ['a','b']){const other=who==='a'?'b':'a',step=state[who];if(step===3)continue;const needed=step<2?order(mode,who)[step]:null;if(needed&&deadlockHeld(mode,state,other).includes(needed))continue;const next={a:state.a,b:state.b,path:[...state.path,step===2?`${who.toUpperCase()}：両方の鍵を返す`:`${who.toUpperCase()}：${needed}の鍵を取る`]};next[who]++;result.push(next);}return result;}
export function createDeadlockTrial(mode){if(!Object.hasOwn(deadlockOrders,mode))throw new RangeError('順序が不正です。');const initial={a:0,b:0,path:[]};return {mode,queue:[initial],seen:[stateKey(initial)],current:null,status:'searching',counterexample:null,steps:0};}
export function expandDeadlock(s){if(s.status!=='searching'||!s.queue.length)throw new RangeError('探索は終了しています。');const [current,...rest]=s.queue,queue=[...rest],seen=[...s.seen],next=deadlockNext(s.mode,current);if(next.length===0&&(current.a!==3||current.b!==3))return {...s,current,queue,seen,status:'deadlock',counterexample:current,steps:s.steps+1};for(const n of next){const key=stateKey(n);if(!seen.includes(key)){seen.push(key);queue.push(n);}}return {...s,current,queue,seen,status:queue.length?'searching':'safe',steps:s.steps+1};}
export function createDeadlockCheck(){return {selected:'opposite',trials:Object.fromEntries(Object.keys(deadlockOrders).map(mode=>[mode,createDeadlockTrial(mode)])),retryMode:'together',retrySteps:{together:0,yield:0},manualHistory:[]};}
export function deadlockCheckComplete(s){return s.trials.opposite.status==='deadlock'&&s.trials.same.status==='safe';}
export function restoreDeadlockCheck(saved){if(!saved||!Object.hasOwn(deadlockOrders,saved.selected)||!saved.trials||!Object.hasOwn(retryModes,saved.retryMode??'together'))throw new RangeError('途中記録が不正です。');const n=createDeadlockCheck();n.selected=saved.selected;n.retryMode=saved.retryMode??'together';manualRetryReplay(saved.manualHistory??[]);n.manualHistory=[...(saved.manualHistory??[])];for(const mode of Object.keys(retryModes)){const steps=saved.retrySteps?.[mode]??0;retryState(mode,steps);n.retrySteps[mode]=steps;}for(const mode of Object.keys(deadlockOrders)){const steps=saved.trials[mode]?.steps;if(!Number.isInteger(steps)||steps<0||steps>30)throw new RangeError('途中記録が不正です。');for(let i=0;i<steps;i++)n.trials[mode]=expandDeadlock(n.trials[mode]);}return n;}
