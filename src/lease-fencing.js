export const fencingLevel={id:'forest-lease-fencing',number:'817',kind:'lease-fencing',name:'遅れて届いた書込み',tag:'分散リースとフェンシング',title:'古い鍵の書込みを見分けよう',story:'二人の配達人が離れた台帳を更新します。期限が切れた鍵と、保存先に届く番号の順序を調べましょう。'};
export const fencingPolicies={open:'保存先は番号を検査しない',fenced:'保存先は古い番号を拒否'};
export const fencingOrders={oldFirst:'古い A の要求が先',newFirst:'新しい B の要求が先'};
export const fencingActions={issueA:'受付が A に鍵と番号１を渡す',expire:'A の鍵が期限切れ',issueB:'受付が B に鍵と番号２を渡す',deliverA:'A の要求を保存先へ届ける',deliverB:'B の要求を保存先へ届ける'};
export function fencingInitial(policy,order){if(!Object.hasOwn(fencingPolicies,policy)||!Object.hasOwn(fencingOrders,order))throw new RangeError('場面が不正です');return {policy,order,stage:'issueA',holder:null,highest:0,value:'初期',responses:{A:null,B:null},history:[]};}
export function fencingExecute(s,action){if(typeof action!=='string')throw new RangeError('操作が不正です');const [op,guess,...extra]=action.split(':');if(extra.length||op!==s.stage||s.stage==='done')throw new RangeError('次に届ける仕事と順序を確認しましょう。');
 if(op==='issueA'){if(guess!==undefined)throw new RangeError('操作が不正です');s.holder='A';s.stage='expire';}
 else if(op==='expire'){if(guess!==undefined)throw new RangeError('操作が不正です');s.holder=null;s.stage='issueB';}
 else if(op==='issueB'){if(guess!==undefined)throw new RangeError('操作が不正です');s.holder='B';s.stage=s.order==='oldFirst'?'deliverA':'deliverB';}
 else{if(!['accept','reject'].includes(guess))throw new RangeError('先に保存先の結果を予想しましょう。');const who=op==='deliverA'?'A':'B',token=who==='A'?1:2,accepted=s.policy==='open'||token>=s.highest;if(guess!==(accepted?'accept':'reject'))throw new RangeError('保存先が受理済みの最大番号と検査方針を確かめましょう。');s.responses[who]=accepted?'accept':'reject';if(accepted){s.highest=Math.max(s.highest,token);s.value=who;}s.stage=s.responses.A!==null&&s.responses.B!==null?'done':who==='A'?'deliverB':'deliverA';}
 s.history.push(action);return s;}
export function fencingReplay(policy,order,history){if(!Array.isArray(history)||history.length>5)throw new RangeError('記録が不正です');const s=fencingInitial(policy,order);for(const action of history)fencingExecute(s,action);return s;}
export function fencingCreate(){return {policy:'open',order:'newFirst',trials:Object.fromEntries(Object.keys(fencingPolicies).flatMap(p=>Object.keys(fencingOrders).map(o=>[`${p}:${o}`,[]]))),answer:null};}
export function fencingStep(q,action){const h=q.trials[`${q.policy}:${q.order}`];fencingExecute(fencingReplay(q.policy,q.order,h),action);h.push(action);}
export function fencingComplete(q){return Object.keys(fencingPolicies).every(p=>Object.keys(fencingOrders).every(o=>fencingReplay(p,o,q.trials[`${p}:${o}`]).stage==='done'))&&q.answer==='seen';}
export function fencingRestore(q){if(!q||!Object.hasOwn(fencingPolicies,q.policy)||!Object.hasOwn(fencingOrders,q.order)||!q.trials||![null,'seen','instant','always'].includes(q.answer))throw new RangeError('記録が不正です');const n=fencingCreate();n.policy=q.policy;n.order=q.order;n.answer=q.answer;for(const p of Object.keys(fencingPolicies))for(const o of Object.keys(fencingOrders)){const k=`${p}:${o}`;fencingReplay(p,o,q.trials[k]);n.trials[k]=[...q.trials[k]];}return n;}
