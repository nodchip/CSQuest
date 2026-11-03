export const eventOriginsLevel={id:'village-event-origins',number:'1092',kind:'event-origins',name:'二つの灯りと届く知らせ',tag:'イベントの発生源と引数',title:'灯りへ届く知らせをたどる',story:'村の青と赤の灯りに知らせが届きます。外からの印と仕組みが予約する知らせの順番を調べましょう。'};
export const originCases={queued:{name:'２つの印を先に送る',expected:['left','right','timer']},interleaved:{name:'青を先に処理する',expected:['left','timer','right']}};
export const originNames={left:'青い板',right:'赤い板',timer:'仕組み'};
export function originReplay(history){
 if(!Array.isArray(history)||history.length>5)throw new RangeError('知らせの記録が不正です');
 const s={sent:[],queue:[],processed:[],left:0,right:0};
 for(const a of history){
  if(a==='left'||a==='right'){if(s.sent.includes(a))throw new RangeError('この板からの印は送信済みです');s.sent.push(a);s.queue.push({source:a,target:a,amount:1});continue;}
  if(a==='dispatch'){if(!s.queue.length)throw new RangeError('待っている知らせはありません');const e=s.queue.shift();s[e.target]+=e.amount;s.processed.push(e);if(e.source==='left')s.queue.push({source:'timer',target:'left',amount:2});continue;}
  throw new RangeError('知らせの操作が不正です');
 }
 return s;
}
export function originCaseDone(id,history){if(!Object.hasOwn(originCases,id))throw new RangeError('場面が不正です');const s=originReplay(history);return s.sent.length===2&&s.queue.length===0&&s.left===3&&s.right===1&&s.processed.map(e=>e.source).join(':')===originCases[id].expected.join(':');}
export function originCreate(){return {case:'queued',histories:{queued:[],interleaved:[]},sender:null,order:null};}
export function originDone(q){return Object.keys(originCases).every(id=>originCaseDone(id,q.histories[id]))&&q.sender==='source'&&q.order==='different';}
export function originRestore(q){if(!q||!Object.hasOwn(originCases,q.case)||!q.histories||![null,'source','target'].includes(q.sender)||![null,'different','same'].includes(q.order))throw new RangeError('途中記録が不正です');const histories={};for(const k of Object.keys(originCases)){originReplay(q.histories[k]);histories[k]=[...q.histories[k]];}return {case:q.case,histories,sender:q.sender,order:q.order};}
