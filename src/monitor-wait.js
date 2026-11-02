export const monitorLevel={id:'forge-monitor-wait',number:'832',kind:'monitor-wait',name:'鍵を預ける待合室',tag:'モニタと条件待ち',title:'待っている間に鍵を渡そう',story:'品を待つ精霊 A と品を届ける精霊 B が一つの箱を使います。鍵と知らせを操作して、二人が進めるか調べましょう。'};
export const monitorModes={hold:'鍵を持ったまま待つ仮想の方式',release:'条件待ちで鍵を預ける方式'};
export const monitorActions={enterA:'A が鍵を取る',wait:'A が空箱を見て待つ',enterB:'B が鍵を取ろうとする',put:'B が品を入れる',signal:'B が A に知らせる',wake:'A が鍵を取り直そうとする',leaveB:'B が鍵を返す',check:'A が箱を再確認する',take:'A が品を取る',leaveA:'A が鍵を返す'};
export const monitorSequences={hold:['enterA','wait','enterB'],release:['enterA','wait','enterB','put','signal','wake','leaveB','wake','check','take','leaveA']};
export function monitorReplay(mode,history){
 if(!Object.hasOwn(monitorModes,mode)||!Array.isArray(history)||history.length>monitorSequences[mode].length)throw new RangeError('記録が不正です。');
 const s={lock:'空き',a:'準備中',b:'準備中',items:0,checked:false,notice:false,message:'',next:null};
 for(let i=0;i<history.length;i++){
  const action=history[i]; if(action!==monitorSequences[mode][i])throw new RangeError('今の鍵の持ち主と、待っている精霊を確かめましょう。');
  switch(action){
   case 'enterA':s.lock='A';s.a='鍵を保持';s.message='A が鍵を取りました。';break;
   case 'wait':s.a='条件待ち';if(mode==='release')s.lock='空き';s.message=mode==='release'?'A は待つとき鍵を預けました。':'A は鍵を持ったまま待っています。';break;
   case 'enterB':if(s.lock==='空き'){s.lock='B';s.b='鍵を保持';s.message='B が鍵を取りました。';}else{s.b='鍵待ち';s.message='B は鍵を取れず、品を入れられません。';}break;
   case 'put':s.items=1;s.message='B が品を入れました。';break;
   case 'signal':s.notice=true;s.a='通知済み・鍵待ち';s.message='通知しても B は鍵を持ったままです。';break;
   case 'wake':if(s.lock==='空き'){s.lock='A';s.a='鍵を保持';s.message='A は鍵を取り直しました。';}else{s.message='B が鍵を返すまで A は進めません。';}break;
   case 'leaveB':s.lock='空き';s.b='完了';s.message='B が鍵を返しました。';break;
   case 'check':s.checked=true;s.message='A は品があることを確かめました。';break;
   case 'take':s.items=0;s.message='A が品を取りました。';break;
   case 'leaveA':s.lock='空き';s.a='完了';s.message='A が鍵を返しました。';break;
  }
 }
 s.next=monitorSequences[mode][history.length]??null;return s;
}
export function monitorCreate(){return {mode:'hold',histories:{hold:[],release:[]},answer:null};}
export function monitorStep(q,action){const h=q.histories[q.mode];monitorReplay(q.mode,[...h,action]);h.push(action);}
export function monitorComplete(q){return Object.keys(monitorModes).every(m=>monitorReplay(m,q.histories[m]).next===null)&&q.answer==='release';}
export function monitorRestore(q){if(!q||!Object.hasOwn(monitorModes,q.mode)||!q.histories||![null,'release','signal','hold'].includes(q.answer))throw new RangeError('記録が不正です。');const r=monitorCreate();r.mode=q.mode;r.answer=q.answer;for(const m of Object.keys(monitorModes)){monitorReplay(m,q.histories[m]);r.histories[m]=[...q.histories[m]];}return r;}
