export const actorLevel={id:'village-actor-mailbox',number:'829',kind:'actor-mailbox',name:'伝言を受ける薬草庫',tag:'アクターと伝言の順序',title:'受付の伝言を順に処理しよう',story:'薬草庫の精霊は、届いた伝言を一通ずつ処理します。二人からの到着順を変えて、在庫の確認と受渡しがどう変わるか調べましょう。'};
export const actorOrders={first:{name:'預入れが最後',sequence:['Q','W','D']},middle:{name:'預入れが途中',sequence:['Q','D','W']},early:{name:'預入れが最初',sequence:['D','Q','W']}};
export const actorLabels={Q:'A の在庫確認',W:'A の１束受取り',D:'B の１束預入れ'};
export function actorReplay(id,history){
 if(!Object.hasOwn(actorOrders,id)||!Array.isArray(history)||history.length>6)throw new RangeError('記録が不正です。');const order=actorOrders[id].sequence,mailbox=[],responses=[];let stock=0;
 for(let i=0;i<history.length;i++){
  if(i<3){if(history[i]!==`arrive:${order[i]}`)throw new RangeError('選んだ到着順を確かめましょう。');mailbox.push(order[i]);continue;}
  const m=mailbox[0],out=m==='Q'?`stock${stock}`:m==='W'?(stock?'accept':'reject'):'deposit';if(history[i]!==`process:${out}`)throw new RangeError('先頭の伝言と現在の在庫を確かめましょう。');mailbox.shift();if(m==='W'&&stock)stock--;if(m==='D')stock++;responses.push({message:m,result:out});
 }
 return {stock,mailbox,responses,next:history.length<3?`arrive:${order[history.length]}`:history.length<6?'process':null};
}
export function actorCreate(){return {order:'first',histories:{first:[],middle:[],early:[]},answer:null};}
export function actorStep(q,action){const h=q.histories[q.order];actorReplay(q.order,[...h,action]);h.push(action);}
export function actorComplete(q){return Object.keys(actorOrders).every(id=>q.histories[id].length===6&&actorReplay(id,q.histories[id]).next===null)&&q.answer==='arrival';}
export function actorRestore(q){if(!q||!Object.hasOwn(actorOrders,q.order)||!q.histories||![null,'arrival','simultaneous','guaranteed'].includes(q.answer))throw new RangeError('記録が不正です。');const n=actorCreate();n.order=q.order;n.answer=q.answer;for(const id of Object.keys(actorOrders)){actorReplay(id,q.histories[id]);n.histories[id]=[...q.histories[id]];}return n;}
