export const kernelRepairLevel={id:'archive-kernel-repair',number:'846',kind:'kernel-repair',name:'二つの水晶と公開された修繕',tag:'オープンソース OS と更新',title:'水晶の核を直そう',story:'書庫の水晶には、外側の仕組みとその中で動く別の仕組みがあります。核の修繕についての知らせを読み、両方を確かめましょう。'};
export const kernelRepairActions={notice:'修繕の知らせを読む',testHost:'外側の修繕を試す',testGuest:'内側の修繕を試す',applyHost:'外側に修繕を適用',applyGuest:'内側に修繕を適用'};
export function kernelRepairReplay(history){
 if(!Array.isArray(history)||history.length>50)throw new RangeError('記録が不正です。');
 const s={notice:false,testHost:false,testGuest:false,applyHost:false,applyGuest:false,message:'知らせを確認しましょう。'};
 for(const action of history){
  if(!Object.hasOwn(kernelRepairActions,action))throw new RangeError('操作が不正です。');
  if(action==='notice'){s.notice=true;s.message='知らせには両方が対象で、それぞれ対応する修繕があると書かれています。';}
  else if(action==='testHost'||action==='testGuest'){
   if(!s.notice)s.message='先に知らせを読み、対象と修繕を確認しましょう。';
   else{s[action]=true;s.message=action==='testHost'?'外側の控えで修繕後の動作を試しました。':'内側の控えで修繕後の動作を試しました。';}
  }else{
   const host=action==='applyHost',tested=host?'testHost':'testGuest';
   if(!s[tested])s.message=host?'先に外側の控えで修繕を試しましょう。':'先に内側の控えで修繕を試しましょう。';
   else{s[action]=true;s.message=host?'外側に修繕を適用しました。内側の状態は変わりません。':'内側に修繕を適用しました。外側の状態は変わりません。';}
  }
 }
 return s;
}
export function kernelRepairCreate(){return {history:[],answer:null};}
export function kernelRepairStep(q,action){if(q.history.length>=50||!Object.hasOwn(kernelRepairActions,action))throw new RangeError('操作が不正です。');q.history.push(action);return kernelRepairReplay(q.history);}
export function kernelRepairComplete(q){const s=kernelRepairReplay(q.history);return s.applyHost&&s.applyGuest&&q.answer==='review';}
export function kernelRepairRestore(q){if(!q||![null,'review','automatic','secret'].includes(q.answer))throw new RangeError('記録が不正です。');kernelRepairReplay(q.history);return {history:[...q.history],answer:q.answer};}
