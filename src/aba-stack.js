export const abaLevel={id:'forge-aba-stack',number:'815',kind:'aba-stack',name:'戻ってきた先頭札',tag:'ABA 問題と更新番号',title:'古い目印で札を戻さないようにしよう',story:'二人の精霊が札の山から取り出します。先頭の札が入れ替わって戻ったとき、古い目印がどうなるか調べましょう。'};
export const abaCases={plain:'先頭の札だけを比較',tagged:'先頭と更新番号を比較'};
export const abaActions={observe:'精霊１が先頭を読む',next:'精霊１が次の札を読む',popA:'精霊２が A を取る',popB:'精霊２が B を取る',pushA:'精霊２が A を戻す',compare:'精霊１が古い目印で比較交換',refresh:'精霊１が先頭と次を読み直す',compare2:'精霊１が新しい目印で比較交換'};
export function abaInitial(id){if(!Object.hasOwn(abaCases,id))throw new RangeError('方式が不正です');return {id,stage:'observe',head:'A',nextA:'B',stamp:0,seen:null,seenNext:null,seenStamp:null,held:[],firstResult:null,finalResult:null};}
export function abaExecute(s,action){if(typeof action!=='string')throw new RangeError('操作が不正です');const [op,guess,...extra]=action.split(':');if(extra.length||op!==s.stage||s.stage==='done')throw new RangeError('次の仕事を確かめましょう。');
 if(op==='compare'||op==='compare2'){
  if(!['success','fail'].includes(guess))throw new RangeError('先に比較交換の結果を予想しましょう。');
  const success=s.head===s.seen&&(s.id==='plain'||s.stamp===s.seenStamp);
  if(guess!==(success?'success':'fail'))throw new RangeError('先頭と、番号を使う方式では番号も見比べましょう。');
  if(success){s.head=s.seenNext;s.stamp++;}
  if(op==='compare'){s.firstResult=success?'success':'fail';s.stage=success?'done':'refresh';}else{s.finalResult=success?'success':'fail';s.stage='done';}
 }else{
  if(guess!==undefined)throw new RangeError('操作が不正です');
  if(op==='observe'){s.seen=s.head;s.seenStamp=s.stamp;s.stage='next';}
  else if(op==='next'){s.seenNext=s.nextA;s.stage='popA';}
  else if(op==='popA'){s.head='B';s.stamp++;s.held.push('A');s.stage='popB';}
  else if(op==='popB'){s.head=null;s.stamp++;s.held.push('B');s.stage='pushA';}
  else if(op==='pushA'){s.nextA=null;s.head='A';s.stamp++;s.held=s.held.filter(x=>x!=='A');s.stage='compare';}
  else if(op==='refresh'){s.seen=s.head;s.seenStamp=s.stamp;s.seenNext=s.nextA;s.stage='compare2';}
 }
 return s;}
export function abaReplay(id,history){if(!Array.isArray(history)||history.length>8)throw new RangeError('記録が不正です');const s=abaInitial(id);for(const action of history)abaExecute(s,action);return s;}
export function abaCreate(){return {selected:'plain',trials:{plain:[],tagged:[]},answer:null};}
export function abaStep(q,action){const h=q.trials[q.selected];abaExecute(abaReplay(q.selected,h),action);h.push(action);}
export function abaComplete(q){return Object.keys(abaCases).every(id=>abaReplay(id,q.trials[id]).stage==='done')&&q.answer==='history';}
export function abaRestore(q){if(!q||!Object.hasOwn(abaCases,q.selected)||!q.trials||![null,'history','same','universal'].includes(q.answer))throw new RangeError('記録が不正です');const n=abaCreate();n.selected=q.selected;n.answer=q.answer;for(const id of Object.keys(abaCases)){abaReplay(id,q.trials[id]);n.trials[id]=[...q.trials[id]];}return n;}
