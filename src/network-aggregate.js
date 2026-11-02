export const netAggLevel={id:'forest-network-aggregate',number:'876',kind:'network-aggregate',name:'中継塔で集める報告',tag:'ネットワーク内集約',title:'中継塔で報告をまとめよう',story:'四つの村からギルドへ収穫の報告を届けます。中継塔で合計を作る方法と、一通ずつ運ぶ方法を比べましょう。'};
export const netAggReports={A:2,B:5,C:3,D:6};
export const netAggModes={direct:'一通ずつ転送',aggregate:'塔で合計して転送'};
export function netAggReplay(mode,actions){
 if(!Object.hasOwn(netAggModes,mode)||!Array.isArray(actions))throw new RangeError('条件が不正です。');
 const received=[],delivered=[];let combined=false;
 for(const action of actions){
  if(action.startsWith('receive:')){const id=action.slice(8);if(!Object.hasOwn(netAggReports,id)||received.includes(id))throw new RangeError('未着の村を選びましょう。');received.push(id);}
  else if(action==='combine'){if(mode!=='aggregate'||received.length!==4||combined)throw new RangeError('４村すべての報告を受け取ってから合計します。');combined=true;}
  else if(action.startsWith('send:')){const id=action.slice(5);if(mode!=='direct'||!received.includes(id)||delivered.includes(id))throw new RangeError('届いていて未転送の報告を選びましょう。');delivered.push(id);}
  else if(action==='send-sum'){if(mode!=='aggregate'||!combined||delivered.length)throw new RangeError('先に４村の合計を作りましょう。');delivered.push('sum');}
  else throw new RangeError('操作が不正です。');
 }
 const sum=Object.values(netAggReports).reduce((a,b)=>a+b,0),done=mode==='direct'?delivered.length===4:delivered.includes('sum');
 return {received,delivered,combined,sum,upstream:received.length,downstream:delivered.length,done};
}
export function netAggCreate(){return {mode:'direct',trials:{direct:[],aggregate:[]},flow:null,information:null};}
export function netAggComplete(q){return Object.keys(netAggModes).every(m=>netAggReplay(m,q.trials[m]).done)&&q.flow==='link'&&q.information==='lost';}
export function netAggRestore(q){if(!q||!Object.hasOwn(netAggModes,q.mode)||![null,'link','all','guaranteed'].includes(q.flow)||![null,'lost','same','none'].includes(q.information))throw new RangeError('記録が不正です。');const r=netAggCreate();r.mode=q.mode;r.flow=q.flow;r.information=q.information;for(const m of Object.keys(netAggModes)){netAggReplay(m,q.trials?.[m]);r.trials[m]=[...q.trials[m]];}return r;}
