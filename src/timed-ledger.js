export const timedLedgerLevel={id:'archive-timed-ledger',number:'1074',kind:'timed-ledger',name:'時をまたぐ取引の集計',tag:'時系列結合と実体化ビュー',title:'遅れて届いた取引を数える',story:'書庫の取引と価格の記録を時刻で結びます。集計を保存した後、遅れて届いた取引が結果にどう影響するか調べましょう。'};
export const timedOrders=[{id:'A',time:1,qty:2},{id:'B',time:2,qty:3},{id:'C',time:4,qty:4}];
export const timedLate={id:'D',time:2,qty:1};
export const timedPrices=[{time:0,price:2},{time:3,price:3}];
export const timedMarkers=['exact','before-raw','before-view','after-raw','stale','fresh'];
export function timedAggregate(orders,mode){
 if(!Array.isArray(orders)||!['exact','asof'].includes(mode))throw new RangeError('集計条件が不正です。');
 const buckets=[{qty:0,revenue:0},{qty:0,revenue:0}],rows=orders.map(order=>{
  if(!order||!Number.isInteger(order.time)||order.time<0||order.time>=6||!Number.isInteger(order.qty)||order.qty<0)throw new RangeError('取引が不正です。');
  const prices=timedPrices.filter(p=>mode==='exact'?p.time===order.time:p.time<=order.time),p=prices.at(-1)??null;
  if(p){const bucket=buckets[order.time<3?0:1];bucket.qty+=order.qty;bucket.revenue+=order.qty*p.price;}
  return {id:order.id,time:order.time,qty:order.qty,price:p?.price??null};
 });
 return {rows,buckets,reads:orders.length};
}
export function timedQuery(state,mode){
 if(!['exact','raw','view'].includes(mode))throw new RangeError('問い合わせが不正です。');
 if(mode==='view')return {rows:[],buckets:state.cache.map(b=>({...b})),reads:2};
 return timedAggregate(state.orders,mode==='exact'?'exact':'asof');
}
export function timedReplay(events){
 if(!Array.isArray(events)||events.length>40)throw new RangeError('記録が不正です。');
 const state={orders:timedOrders.map(x=>({...x})),cache:timedAggregate(timedOrders,'asof').buckets,inserted:false,refreshed:false,seen:[],last:null};
 for(const event of events){
  if(!event||typeof event!=='object')throw new RangeError('操作が不正です。');
  if(event.type==='query'){
   const result=timedQuery(state,event.mode);if(![0,5,6].includes(event.guess)||result.buckets[0].qty!==event.guess)throw new RangeError('確認結果が不正です。');
   const mark=event.mode==='exact'&&!state.inserted?'exact':event.mode==='raw'&&!state.inserted?'before-raw':event.mode==='view'&&!state.inserted?'before-view':event.mode==='raw'&&state.inserted&&!state.refreshed?'after-raw':event.mode==='view'&&state.inserted&&!state.refreshed?'stale':event.mode==='view'&&state.refreshed?'fresh':null;
   if(mark&&!state.seen.includes(mark))state.seen.push(mark);state.last={mode:event.mode,...result};
  }else if(event.type==='insert'){
   if(state.inserted||!['exact','before-raw','before-view'].every(x=>state.seen.includes(x)))throw new RangeError('追加前の比較を先に確かめましょう。');
   state.orders.push({...timedLate});state.inserted=true;state.last=null;
  }else if(event.type==='refresh'){
   if(!state.inserted||state.refreshed||!['after-raw','stale'].every(x=>state.seen.includes(x)))throw new RangeError('追加後の元データと保存済み集計を先に比較しましょう。');
   state.cache=timedAggregate(state.orders,'asof').buckets;state.refreshed=true;state.last=null;
  }else throw new RangeError('操作が不正です。');
 }
 return state;
}
export function timedCreate(){return {mode:'exact',guess:null,events:[],reflection:null};}
export function timedDone(q){return timedMarkers.every(x=>timedReplay(q.events).seen.includes(x))&&q.reflection==='stale';}
export function timedRestore(q){
 if(!q||!['exact','raw','view'].includes(q.mode)||![null,0,5,6].includes(q.guess)||![null,'stale','automatic'].includes(q.reflection))throw new RangeError('途中記録が不正です。');
 timedReplay(q.events);return {...q,events:q.events.map(e=>({...e}))};
}
