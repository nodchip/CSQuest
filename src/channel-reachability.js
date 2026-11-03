export const channelReachabilityLevel={id:'forge-channel-reachability',number:'1000',kind:'channel-reachability',name:'伝令の待ち合わせを調べる',tag:'通信路・状態空間・デッドロック',title:'二人の手順を調べよう',story:'二人の精霊が互いに手紙を届けます。待ち合わせの仕組みと手順から、進める状態を調べましょう。'};
export const channelKinds=['sync','buffer'],channelOrders=['send','receive'];
export function channelInitial(){return {a:0,b:0,ab:0,ba:0};}
function operation(person,step,order){if(step===2)return 'done';return person==='A'||order==='send'?(step===0?'send':'receive'):(step===0?'receive':'send');}
export function channelEnabled(kind,order,s){
 if(!channelKinds.includes(kind)||!channelOrders.includes(order))throw new RangeError('不正な条件');const a=operation('A',s.a,order),b=operation('B',s.b,order);
 if(kind==='sync'){const actions=[];if(a==='send'&&b==='receive')actions.push('ab');if(a==='receive'&&b==='send')actions.push('ba');return actions;}
 const actions=[];if(a==='send'&&!s.ab)actions.push('a-send');if(a==='receive'&&s.ba)actions.push('a-receive');if(b==='send'&&!s.ba)actions.push('b-send');if(b==='receive'&&s.ab)actions.push('b-receive');return actions;
}
export function channelAdvance(kind,order,s,action){if(!channelEnabled(kind,order,s).includes(action))throw new RangeError('進めない操作');const n={...s};if(kind==='sync'){n.a++;n.b++;}else if(action==='a-send'){n.a++;n.ab=1;}else if(action==='a-receive'){n.a++;n.ba=0;}else if(action==='b-send'){n.b++;n.ba=1;}else{n.b++;n.ab=0;}return n;}
export function channelReplay(kind,order,history){if(!Array.isArray(history)||history.length>4)throw new RangeError('不正な履歴');let state=channelInitial();for(const action of history)state=channelAdvance(kind,order,state,action);return state;}
export function channelStatus(kind,order,s){return s.a===2&&s.b===2?'complete':channelEnabled(kind,order,s).length===0?'deadlock':'running';}
export function channelAnalyze(kind,order){
 const start=channelInitial(),seen=new Set(),queue=[{state:start,path:[]}];let complete=null,deadlock=null;
 for(let i=0;i<queue.length;i++){const {state,path}=queue[i],key=JSON.stringify(state);if(seen.has(key))continue;seen.add(key);const status=channelStatus(kind,order,state);if(status==='complete'&&!complete)complete=path;if(status==='deadlock'&&!deadlock)deadlock=path;for(const action of channelEnabled(kind,order,state))queue.push({state:channelAdvance(kind,order,state,action),path:[...path,action]});}
 return {states:seen.size,complete,deadlock};
}
export function channelReachabilityCreate(){return {kind:'sync',order:'send',trials:Object.fromEntries(channelKinds.flatMap(kind=>channelOrders.map(order=>[`${kind}:${order}`,{history:[],analyzed:false}]))),reflection:null};}
export function channelReachabilityDone(kind,order,t){return !!t&&t.analyzed&&channelStatus(kind,order,channelReplay(kind,order,t.history))!=='running';}
export function channelReachabilityComplete(s){return s.reflection==='scope'&&channelKinds.every(kind=>channelOrders.every(order=>channelReachabilityDone(kind,order,s.trials[`${kind}:${order}`])));}
export function channelReachabilityRestore(saved){if(!saved||!channelKinds.includes(saved.kind)||!channelOrders.includes(saved.order)||![null,'scope','universal','complete'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const s=channelReachabilityCreate();s.kind=saved.kind;s.order=saved.order;s.reflection=saved.reflection;for(const kind of channelKinds)for(const order of channelOrders){const id=`${kind}:${order}`,t=saved.trials?.[id];if(!t||typeof t.analyzed!=='boolean')throw new RangeError('途中記録が不正です');channelReplay(kind,order,t.history);s.trials[id]={history:[...t.history],analyzed:t.analyzed};}return s;}
export function channelNextOperation(person,step,order){return operation(person,step,order);}
