export const orderInventoryLevel={id:'village-order-inventory',number:'1125',kind:'order-inventory',name:'注文の列と薬棚の辞書',tag:'複数のデータ構造',title:'順番に注文を確かめる',story:'薬師は届いた注文を順に処理し、薬草ごとの在庫帳を更新します。登録がない薬草と在庫０個も区別しましょう。'};
export const herbNames={sun:'太陽草',moon:'月草',star:'星草'};
export const orderInventoryCases={mixed:{name:'同じ薬草が再び届く',orders:['sun','moon','sun'],stock:{sun:1,moon:1}},missing:{name:'登録のない薬草',orders:['moon','star','moon'],stock:{sun:2,moon:0}},empty:{name:'注文のない朝',orders:[],stock:{sun:1,moon:1}}};
export function orderInventoryReplay(id,history){
 if(!Object.hasOwn(orderInventoryCases,id)||!Array.isArray(history)||history.length>12)throw new RangeError('注文の記録が不正です。');
 const c=orderInventoryCases[id],s={index:0,stock:{...c.stock},reading:false,results:[],done:false,last:''};
 for(const a of history){if(s.done)throw new RangeError('この注文列は終わっています。');const key=c.orders[s.index];
  if(a==='read'&&!s.reading&&key!==undefined){s.reading=true;s.last=`${herbNames[key]}の注文を読みました。`;}
  else if(['take','empty','missing'].includes(a)&&s.reading){const exists=Object.hasOwn(s.stock,key),expected=!exists?'missing':s.stock[key]>0?'take':'empty';if(a!==expected)throw new RangeError(!exists?'この薬草は在庫帳に登録されていません。':s.stock[key]===0?'在庫は０個です。':'在庫があるので１個を渡せます。');if(a==='take')s.stock[key]--;s.results.push({key,result:a});s.index++;s.reading=false;s.last=a==='take'?`${herbNames[key]}を１個渡しました。`:a==='empty'?`${herbNames[key]}は在庫切れです。`:`${herbNames[key]}は未登録として確認を依頼します。`;}
  else if(a==='finish'&&s.index===c.orders.length&&!s.reading){s.done=true;s.last='注文の列を最後まで処理しました。';}
  else throw new RangeError('今の注文を読み、在庫を確認してから対応しましょう。');
 }
 return s;
}
export function orderInventoryCreate(){return {selected:'mixed',runs:{mixed:[],missing:[],empty:[]},answer:null,checked:false};}
export function orderInventoryAct(q,a){const h=[...q.runs[q.selected],a],s=orderInventoryReplay(q.selected,h);q.runs[q.selected]=h;return s;}
export function orderInventoryDone(q){return Object.keys(orderInventoryCases).every(k=>orderInventoryReplay(k,q.runs[k]).done)&&q.answer==='structures'&&q.checked;}
export function orderInventoryRestore(q){if(!q||!Object.hasOwn(orderInventoryCases,q.selected)||!q.runs||![null,'structures','zero','unordered'].includes(q.answer)||typeof q.checked!=='boolean')throw new RangeError('注文の記録が不正です。');const r=orderInventoryCreate();r.selected=q.selected;r.answer=q.answer;r.checked=q.checked;for(const k of Object.keys(orderInventoryCases)){orderInventoryReplay(k,q.runs[k]);r.runs[k]=[...q.runs[k]];}return r;}
