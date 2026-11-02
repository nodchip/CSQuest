export const edgeLevel={id:'forest-edge-control',number:'877',kind:'edge-control',name:'川辺の小さな見張り台',tag:'エッジと遠隔の制御',title:'水門に間に合う知らせを届けよう',story:'川辺の見張り台は水位を読み、必要なら水門へ閉鎖を伝えます。近くと遠く、通信があるときと切れたときを比べましょう。'};
export const edgeModes={local:'川辺で判断',remote:'遠方で判断'};
export const edgeLinks={online:'通信あり',offline:'通信なし'};
export const edgeActions={read:'水位を読む',local:'川辺で判断',send:'遠方へ送る',compute:'遠方で判断',return:'結果を戻す',act:'水門へ伝える'};
export function edgeReplay(mode,link,actions){
 if(!Object.hasOwn(edgeModes,mode)||!Object.hasOwn(edgeLinks,link)||!Array.isArray(actions))throw new RangeError('条件が不正です。');
 let phase='read',time=0,messages=0,reading=null,decision=null;
 for(const action of actions){
  if(action!==phase)throw new RangeError('次に必要な手順を確かめましょう。');
  if(action==='read'){reading=8;phase=mode==='local'?'local':'send';}
  else if(action==='local'){time+=2;decision=reading>=6?'close':'open';phase='act';}
  else if(action==='send'){if(link==='offline')phase='unavailable';else{messages++;time+=3;phase='compute';}}
  else if(action==='compute'){time++;decision=reading>=6?'close':'open';phase='return';}
  else if(action==='return'){time+=3;messages++;phase='act';}
  else if(action==='act'){time++;phase='done';}
  else throw new RangeError('試行は終了しています。');
 }
 return {phase,time,messages,reading,decision,finished:phase==='done'||phase==='unavailable',met:phase==='done'&&time<=4};
}
export function edgeCreate(){return {mode:'local',link:'online',trials:{local:{online:[],offline:[]},remote:{online:[],offline:[]}},timing:null,limits:null};}
export function edgeComplete(q){return Object.keys(edgeModes).every(m=>Object.keys(edgeLinks).every(l=>edgeReplay(m,l,q.trials[m][l]).finished))&&q.timing==='conditional'&&q.limits==='needs';}
export function edgeRestore(q){if(!q||!Object.hasOwn(edgeModes,q.mode)||!Object.hasOwn(edgeLinks,q.link)||![null,'conditional','always','same'].includes(q.timing)||![null,'needs','secure','cloud'].includes(q.limits))throw new RangeError('記録が不正です。');const r=edgeCreate();r.mode=q.mode;r.link=q.link;r.timing=q.timing;r.limits=q.limits;for(const m of Object.keys(edgeModes))for(const l of Object.keys(edgeLinks)){edgeReplay(m,l,q.trials?.[m]?.[l]);r.trials[m][l]=[...q.trials[m][l]];}return r;}
