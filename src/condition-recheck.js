export const conditionRecheckLevel={id:'forge-condition-recheck',number:'629',kind:'condition-recheck',name:'二人の精霊と届いた品',tag:'条件変数と再確認',title:'目覚めたら箱を確かめよう',story:'二人の精霊が空の箱に品が届くのを待っています。知らせを受けた後の取り扱いを比べましょう。'};
export const conditionModes={once:'一度だけ条件を確認',loop:'目覚めるたびに条件を確認'};
export const conditionActions={waitA:'A が空箱を確認して待つ',waitB:'B が空箱を確認して待つ',put:'品を１つ入れて知らせる',wakeA:'A が鍵を取って目覚める',takeA:'A が品を取って鍵を返す',wakeB:'B が鍵を取って目覚める',checkB:'B が目覚めた後を進める',takeB:'B が品を取って鍵を返す'};
export function conditionSequence(mode){if(!Object.hasOwn(conditionModes,mode))throw new RangeError('方式が不正です。');const first=['waitA','waitB','put','wakeA','takeA','wakeB','checkB'];return mode==='once'?first:[...first,'put','wakeB','checkB','takeB'];}
export function conditionReplay(mode,history){
 const seq=conditionSequence(mode);if(!Array.isArray(history)||history.length>seq.length||history.some((a,i)=>a!==seq[i]))throw new RangeError('操作履歴が不正です。');
 const s={items:0,a:'準備中',b:'準備中',lock:'空き',bReady:false,error:false,delivered:0};
 for(const action of history){switch(action){
  case 'waitA':s.a='待機中';break;case 'waitB':s.b='待機中';break;
  case 'put':s.items=1;s.delivered++;if(s.a==='待機中')s.a='通知済み・鍵待ち';if(s.b==='待機中'||s.b==='再び待機中')s.b='通知済み・鍵待ち';break;case 'wakeA':s.a='鍵を保持';s.lock='A';break;
  case 'takeA':s.items--;s.a='完了';s.lock='空き';break;case 'wakeB':s.b='鍵を保持';s.lock='B';break;
  case 'checkB':if(mode==='once'){s.b='空箱から取ろうとした';s.error=true;s.lock='空き';}else if(s.items===0){s.b='再び待機中';s.lock='空き';}else{s.b='品を取れる';s.bReady=true;}break;
  case 'takeB':s.items--;s.b='完了';s.lock='空き';s.bReady=false;break;
 }}return s;
}
export function createConditionRecheck(){return {selected:'once',histories:{once:[],loop:[]},answer:null,checked:false};}
export function conditionRecheckComplete(s){return Object.keys(conditionModes).every(id=>s.histories[id].length===conditionSequence(id).length)&&s.answer==='recheck'&&s.checked;}
export function restoreConditionRecheck(s){if(!s||!Object.hasOwn(conditionModes,s.selected)||!s.histories||![null,'recheck','notify','mutex'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const r=createConditionRecheck();r.selected=s.selected;r.answer=s.answer;r.checked=s.checked;for(const id of Object.keys(conditionModes)){conditionReplay(id,s.histories[id]);r.histories[id]=[...s.histories[id]];}return r;}
