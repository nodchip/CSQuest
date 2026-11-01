export const deliveryNetworkLevel={id:'forest-delivery-network',number:'667',kind:'delivery-network',name:'森の地図と二つの届け方',tag:'クライアント・サーバーと P2P',title:'切れた通信を越えて地図を届けよう',story:'森の旅人に新しい道の地図を届けます。中央の書庫と、地図を持つ仲間の拠点を選び、通信が切れた場面を調べましょう。'};
export function createDeliveryNetwork(){return {source:'server',serverUp:true,peerUp:true,peerRevision:1,synced:false,seen:[],report:null,answer:null,checked:false,history:[]};}
export function deliveryNetworkAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=100)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,seen:[...s.seen],history:[...s.history],checked:false};let message='';const mark=k=>{if(!n.seen.includes(k))n.seen.push(k);};
 if(['source:server','source:peer'].includes(action)){n.source=action.slice(7);message='受け取る先を選びました。';}
 else if(action==='server:toggle'){n.serverUp=!s.serverUp;message=`中央書庫との通信を${n.serverUp?'つなぎました':'切りました'}。`;}
 else if(action==='peer:toggle'){n.peerUp=!s.peerUp;message=`仲間の拠点との通信を${n.peerUp?'つなぎました':'切りました'}。`;}
 else if(action==='sync'){
  if(!s.serverUp||!s.peerUp)return {ok:false,message:'仲間が書庫の最新版を受け取るには、両方との通信が必要です。'};
  n.peerRevision=2;n.synced=true;message='旅人が書庫の版２を仲間の拠点へ届けました。';
 }
 else if(action==='request'){
  const reachable=s.source==='server'?s.serverUp:s.peerUp,revision=reachable?(s.source==='server'?2:s.peerRevision):null;
  n.report={source:s.source,reachable,revision};
  if(s.source==='server'&&s.serverUp)mark('central-live');
  if(s.source==='peer'&&s.peerUp&&s.serverUp&&s.peerRevision===1)mark('peer-stale');
  if(s.source==='server'&&!s.serverUp&&s.peerUp)mark('central-down');
  if(s.source==='peer'&&!s.serverUp&&s.peerUp&&s.peerRevision===1)mark('peer-survival');
  if(s.source==='peer'&&!s.serverUp&&!s.peerUp)mark('all-down');
  if(s.source==='peer'&&!s.serverUp&&s.peerUp&&s.peerRevision===2&&s.synced)mark('peer-fresh');
  message=reachable?`地図の版 ${revision} を受け取りました。`:'選んだ先と通信できず、地図を受け取れません。';
 }
 else if(['answer:tradeoff','answer:always','answer:identical'].includes(action)){n.answer=action.slice(7);message='振り返りを選びました。';}
 else if(action==='check'){n.checked=true;message='旅の記録と答えを確認しました。';}
 else return {ok:false,message:'届け方と通信の状態を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreDeliveryNetwork(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>100)throw new RangeError('途中記録が不正です。');let s=createDeliveryNetwork();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=deliveryNetworkAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function deliveryNetworkComplete(s){return ['central-live','peer-stale','central-down','peer-survival','all-down','peer-fresh'].every(k=>s.seen.includes(k))&&s.answer==='tradeoff'&&s.checked;}
