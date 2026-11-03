export const heapFileLevel={id:'archive-heap-file',number:'1201',kind:'heap-file',name:'順不同の薬草台帳',tag:'ヒープファイルと全走査',title:'空いた頁に札を収めよう',story:'薬草書庫には番号順に並んでいない札があります。空きの案内を見て札を収め、必要な番号を探しましょう。'};
export function heapFileCreate(){return {actions:[]};}
export function heapFileState(actions){
 const pages=[[8,2],[6,null],[3,7]],scanned=[];let stage=0;
 if(!Array.isArray(actions)||actions.length>6)throw new RangeError('操作の記録が不正です。');
 for(const a of actions){
  if(!a||!Number.isInteger(a.page)||a.page<0||a.page>2)throw new RangeError('頁が不正です。');
  const p=pages[a.page];
  if(stage===0&&a.type==='insert'&&p.includes(null)){p[p.indexOf(null)]=5;stage=1;}
  else if(stage===1&&a.type==='delete'&&p.includes(8)){p[p.indexOf(8)]=null;stage=2;}
  else if(stage===2&&a.type==='insert'&&p.includes(null)){p[p.indexOf(null)]=9;stage=3;}
  else if(stage===3&&a.type==='scan'&&!scanned.includes(a.page)){scanned.push(a.page);if(scanned.length===3)stage=4;}
  else throw new RangeError('この操作は現在の台帳ではできません。');
 }
 return {pages,scanned,stage,found:scanned.flatMap(i=>pages[i].filter(n=>n===3).map(n=>({page:i,value:n})))};
}
export function heapFileAct(q,type,page){const next=[...q.actions,{type,page}];try{heapFileState(next);return {actions:next};}catch{return null;}}
export function heapFileRestore(q){if(!q||!Array.isArray(q.actions))throw new RangeError('記録が不正です。');heapFileState(q.actions);return {actions:q.actions.map(({type,page})=>({type,page}))};}
export function heapFileDone(q){return heapFileState(q.actions).stage===4;}
