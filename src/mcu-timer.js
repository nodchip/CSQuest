export const mcuTimerLevel={id:'workshop-mcu-timer',number:'919',kind:'mcu-timer',name:'時を刻む灯り',tag:'マイコンと割込み',title:'時を刻む灯りを調べる',story:'工房の小さな機械がセンサーに合わせて灯りを変えます。タイマーの知らせと処理の関係を調べましょう。'};
export const mcuTimerCases={enabled:'初めから割込みを許可',masked:'２回の通知まで割込みを禁止'};
const actions=['tick','enable','enter','read','write','clear','return'];
export function mcuTimerState(id,history){
 if(!Object.hasOwn(mcuTimerCases,id)||!Array.isArray(history)||history.length>20)throw new RangeError('記録が不正です。');
 const s={enabled:id==='enabled',events:0,pending:false,sensor:null,sample:null,lamp:0,phase:'main',handled:[]};
 for(const a of history){let ok=false;
  if(a==='tick'&&s.phase==='main'&&s.events<2&&(!s.enabled||!s.pending)){s.sensor=[1,0][s.events++];s.pending=true;ok=true;}
  else if(a==='enable'&&s.phase==='main'&&!s.enabled&&s.events===2){s.enabled=true;ok=true;}
  else if(a==='enter'&&s.phase==='main'&&s.enabled&&s.pending){s.phase='read';ok=true;}
  else if(a==='read'&&s.phase==='read'){s.sample=s.sensor;s.phase='write';ok=true;}
  else if(a==='write'&&s.phase==='write'){s.lamp=s.sample;s.phase='clear';ok=true;}
  else if(a==='clear'&&s.phase==='clear'){s.pending=false;s.phase='return';ok=true;}
  else if(a==='return'&&s.phase==='return'){s.handled.push(s.sample);s.phase='main';ok=true;}
  if(!ok)throw new RangeError('その操作はできません。');
 }
 s.done=s.events===2&&s.enabled&&!s.pending&&s.phase==='main'&&s.handled.length===(id==='enabled'?2:1);
 return s;
}
export function mcuTimerCreate(){return {selected:'enabled',histories:{enabled:[],masked:[]},reflection:null};}
export function mcuTimerStep(q,a){if(!actions.includes(a))throw new RangeError('操作が不正です。');const h=q.histories[q.selected];try{mcuTimerState(q.selected,[...h,a]);h.push(a);return true;}catch{return false;}}
export function mcuTimerComplete(q){return Object.keys(mcuTimerCases).every(id=>mcuTimerState(id,q.histories[id]).done)&&q.reflection==='coalesce';}
export function mcuTimerRestore(q){if(!q||!Object.hasOwn(mcuTimerCases,q.selected)||!q.histories||![null,'coalesce','twice','stop'].includes(q.reflection))throw new RangeError('記録が不正です。');const histories={};for(const id of Object.keys(mcuTimerCases)){mcuTimerState(id,q.histories[id]);histories[id]=[...q.histories[id]];}return {selected:q.selected,histories,reflection:q.reflection};}
