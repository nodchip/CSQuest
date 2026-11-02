export const optimisticLevel={id:'village-optimistic-stock',number:'818',kind:'optimistic-stock',name:'二人の薬草注文',tag:'楽観的な競合検出',title:'古い台帳で注文を確定しないようにしよう',story:'二人の旅人が同じ薬草を一束ずつ注文します。台帳の版を確かめ、競合後の在庫を読み直しましょう。'};
export const optimisticPolicies={unchecked:'版を確認しない',versioned:'版を確認する'};
export const optimisticStocks={two:{name:'在庫２束',stock:2},one:{name:'在庫１束',stock:1}};
export const optimisticActions={readA:'A が在庫と版を読む',readB:'B が在庫と版を読む',commitA:'A の注文を確定',commitB:'B の注文を確定',refreshB:'B が台帳を読み直す',retryB:'B が読み直した内容で再試行',unavailableB:'B を在庫不足として終了'};
export function optimisticInitial(policy,stock){if(!Object.hasOwn(optimisticPolicies,policy)||!Object.hasOwn(optimisticStocks,stock))throw new RangeError('場面が不正です');return {policy,stockCase:stock,initial:optimisticStocks[stock].stock,stock:optimisticStocks[stock].stock,version:0,stage:'readA',snapshots:{A:null,B:null},orders:{A:'待機',B:'待機'},last:null};}
export function optimisticExecute(s,action){if(typeof action!=='string')throw new RangeError('操作が不正です');const [op,guess,...extra]=action.split(':');if(extra.length||op!==s.stage||s.stage==='done')throw new RangeError('次に行う仕事を確かめましょう。');
 if(['commitA','commitB','retryB'].includes(op)){
  if(!['accept','reject'].includes(guess))throw new RangeError('先に確定の結果を予想しましょう。');const who=op==='commitA'?'A':'B',snap=s.snapshots[who],accepted=snap.stock>0&&(s.policy==='unchecked'||snap.version===s.version);
  if(guess!==(accepted?'accept':'reject'))throw new RangeError('読み取った版と現在の版、在庫を見比べましょう。');s.last=accepted?'accept':'reject';
  if(accepted){s.stock=snap.stock-1;s.version++;s.orders[who]='確定';}else s.orders[who]='競合';
  if(op==='commitA')s.stage='commitB';else if(op==='commitB')s.stage=accepted?'done':'refreshB';else s.stage='done';
 }else{
  if(guess!==undefined)throw new RangeError('操作が不正です');
  if(op==='readA'){s.snapshots.A={stock:s.stock,version:s.version};s.stage='readB';}
  else if(op==='readB'){s.snapshots.B={stock:s.stock,version:s.version};s.stage='commitA';}
  else if(op==='refreshB'){s.snapshots.B={stock:s.stock,version:s.version};s.stage=s.stock>0?'retryB':'unavailableB';}
  else if(op==='unavailableB'){s.orders.B='在庫不足';s.stage='done';}
 }
 return s;}
export function optimisticReplay(policy,stock,history){if(!Array.isArray(history)||history.length>6)throw new RangeError('記録が不正です');const s=optimisticInitial(policy,stock);for(const a of history)optimisticExecute(s,a);return s;}
export function optimisticCreate(){return {policy:'unchecked',stock:'two',trials:Object.fromEntries(Object.keys(optimisticPolicies).flatMap(p=>Object.keys(optimisticStocks).map(s=>[`${p}:${s}`,[]]))),answer:null};}
export function optimisticStep(q,action){const h=q.trials[`${q.policy}:${q.stock}`];optimisticExecute(optimisticReplay(q.policy,q.stock,h),action);h.push(action);}
export function optimisticComplete(q){return Object.keys(optimisticPolicies).every(p=>Object.keys(optimisticStocks).every(s=>optimisticReplay(p,s,q.trials[`${p}:${s}`]).stage==='done'))&&q.answer==='retry';}
export function optimisticRestore(q){if(!q||!Object.hasOwn(optimisticPolicies,q.policy)||!Object.hasOwn(optimisticStocks,q.stock)||!q.trials||![null,'retry','force','always'].includes(q.answer))throw new RangeError('記録が不正です');const n=optimisticCreate();n.policy=q.policy;n.stock=q.stock;n.answer=q.answer;for(const p of Object.keys(optimisticPolicies))for(const s of Object.keys(optimisticStocks)){const k=`${p}:${s}`;optimisticReplay(p,s,q.trials[k]);n.trials[k]=[...q.trials[k]];}return n;}
