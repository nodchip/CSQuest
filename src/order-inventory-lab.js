import {herbNames,orderInventoryReplayCase} from './order-inventory.js';
export const orderInventoryLabLevel={id:'village-order-inventory-lab',number:'1126',kind:'order-inventory-lab',name:'薬師の試験工房',tag:'注文と在庫の組立て',title:'自分で注文と薬棚を試す',story:'薬師の道具に入れる注文と在庫を札で作り、空の列、未登録、在庫の使い切りを試しましょう。'};
export function orderLabCreate(){return {orders:[],stock:{sun:1,moon:1},history:[],seen:{empty:false,missing:false,depleted:false},answer:null,checked:false};}
export function orderLabReplay(q){return orderInventoryReplayCase({orders:q.orders,stock:q.stock},q.history);}
export function orderLabEdit(q,action,value){
 if(q.history.length)throw new RangeError('処理中の場面です。新しい場面を作ってから変更しましょう。');
 if(action==='append'&&Object.hasOwn(herbNames,value)&&q.orders.length<4)q.orders.push(value);
 else if(action==='remove'&&q.orders.length)q.orders.pop();
 else if(action==='stock'&&value&&Object.hasOwn(herbNames,value.key)&&['missing','0','1','2'].includes(value.amount)){if(value.amount==='missing')delete q.stock[value.key];else q.stock[value.key]=Number(value.amount);}
 else throw new RangeError('注文は４件までです。操作を確認しましょう。');
}
export function orderLabAct(q,a){const h=[...q.history,a],s=orderInventoryReplayCase({orders:q.orders,stock:q.stock},h);q.history=h;if(s.done){q.seen.empty||=q.orders.length===0;q.seen.missing||=s.results.some(r=>r.result==='missing');q.seen.depleted||=s.results.some((r,i)=>r.result==='empty'&&s.results.slice(0,i).some(prev=>prev.key===r.key&&prev.result==='take'));}return s;}
export function orderLabNew(q){q.orders=[];q.history=[];q.stock={sun:1,moon:1};q.checked=false;}
export function orderLabDone(q){return Object.values(q.seen).every(Boolean)&&q.answer==='cases'&&q.checked;}
export function orderLabRestore(q){if(!q||!q.seen||!['empty','missing','depleted'].every(k=>typeof q.seen[k]==='boolean')||![null,'cases','one','missingZero'].includes(q.answer)||typeof q.checked!=='boolean')throw new RangeError('試験の記録が不正です。');orderLabReplay(q);return {orders:[...q.orders],stock:{...q.stock},history:[...q.history],seen:{empty:q.seen.empty,missing:q.seen.missing,depleted:q.seen.depleted},answer:q.answer,checked:q.checked};}
