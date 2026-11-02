export const arbitrationLevel={id:'workshop-bus-arbitration',number:'819',kind:'bus-arbitration',name:'一本橋の通行調停',tag:'バスの調停',title:'複数の装置に橋をゆずろう',story:'三台の荷車が一本の橋を使います。要求に応じて通す順を決め、待ち時間の違いを調べましょう。'};
export const arbitrationPolicies={fixed:'固定優先順位',round:'順番を回す'};
export const requests=[['A','B','C'],['A','B','C'],['A','B','C'],['B','C']];
export function arbitrationWinner(policy,history){
 if(!Object.hasOwn(arbitrationPolicies,policy)||!Array.isArray(history)||history.length>requests.length)throw new RangeError('記録が不正です');
 let start=0;
 for(let i=0;i<history.length;i++){
  const candidates=policy==='fixed'?['A','B','C']:[0,1,2].map(n=>['A','B','C'][(start+n)%3]);
  const expected=candidates.find(x=>requests[i].includes(x));
  if(history[i]!==expected)throw new RangeError('選択が方針と違います。要求と次に優先する荷車を確かめましょう。');
  if(policy==='round')start=('ABC'.indexOf(expected)+1)%3;
 }
 if(history.length===requests.length)return null;
 const candidates=policy==='fixed'?['A','B','C']:[0,1,2].map(n=>['A','B','C'][(start+n)%3]);
 return candidates.find(x=>requests[history.length].includes(x));
}
export function arbitrationCreate(){return {policy:'fixed',histories:{fixed:[],round:[]},answer:null};}
export function arbitrationStep(q,choice){const h=q.histories[q.policy];arbitrationWinner(q.policy,[...h,choice]);h.push(choice);}
export function arbitrationComplete(q){return Object.keys(arbitrationPolicies).every(p=>q.histories[p].length===requests.length&&arbitrationWinner(p,q.histories[p])===null)&&q.answer==='waiting';}
export function arbitrationRestore(q){if(!q||!Object.hasOwn(arbitrationPolicies,q.policy)||!q.histories||![null,'waiting','always','simultaneous'].includes(q.answer))throw new RangeError('記録が不正です');const n=arbitrationCreate();n.policy=q.policy;n.answer=q.answer;for(const p of Object.keys(arbitrationPolicies)){arbitrationWinner(p,q.histories[p]);n.histories[p]=[...q.histories[p]];}return n;}
