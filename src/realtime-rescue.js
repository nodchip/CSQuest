export const realTimeRescueLevel={id:'forge-realtime-rescue',number:'763',kind:'realtime-rescue',name:'水門を守る二つの約束',tag:'期限・優先度・頁管理の応用',title:'急ぎの合図で水門を閉じる',story:'水位が上がり、時刻２に急ぎの閉門指示が届きます。仕事の切替えと頁の準備を選び、水門を時刻４までに閉じましょう。'};
function freshRun(){return {time:0,low:4,urgent:'waiting',resident:true,loadUntil:null,allowHigh:false,finished:null,steps:[]};}
export function rescueCreate(){return {policy:'cooperative',pin:false,run:freshRun(),succeeded:false,failed:false,history:[],answer:'',checked:false};}
export function rescueAct(s,event){
 if(!event||!['policy','pin','yield','tick','restart'].includes(event.type)||s.history.length>=80)throw new RangeError('操作が不正です。');
 const r=s.run;
 if(event.type==='policy'){if(!['preempt','cooperative'].includes(event.value))throw new RangeError('設定が不正です。');if(r.time!==0)return false;s.policy=event.value;}
 else if(event.type==='pin'){if(typeof event.value!=='boolean')throw new RangeError('設定が不正です。');if(r.time!==0)return false;s.pin=event.value;}
 else if(event.type==='restart'){if(r.time===0)return false;s.run=freshRun();}
 else if(event.type==='yield'){if(s.policy!=='cooperative'||r.time<2||r.low===0||r.urgent!=='ready'||r.allowHigh||r.finished!==null)return false;r.allowHigh=true;}
 else{
  if(r.finished!==null||r.time>=12)return false;
  const canHigh=r.urgent==='ready'&&(s.policy==='preempt'||r.low===0||r.allowHigh);
  let running='idle';
  if(canHigh&&!r.resident){r.urgent='loading';r.loadUntil=r.time+3;r.allowHigh=false;}
  else if(canHigh){running='high';r.urgent='done';r.finished=r.time+1;r.allowHigh=false;}
  if(running==='idle'&&r.low>0){running='low';r.low--;}
  r.steps.push(running);r.time++;
  if(r.time===1&&!s.pin)r.resident=false;
  if(r.time===2&&r.urgent==='waiting')r.urgent='ready';
  if(r.urgent==='loading'&&r.time>=r.loadUntil){r.resident=true;r.urgent='ready';}
  if(r.finished!==null){if(r.finished<=4)s.succeeded=true;else s.failed=true;}
 }
 s.history.push({...event});return true;
}
export function rescueComplete(s){return s.succeeded&&s.failed&&s.answer==='both'&&s.checked;}
export function rescueRestore(s){if(!s||!Array.isArray(s.history)||s.history.length>80||!['','both','priority','page'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const out=rescueCreate();for(const e of s.history)if(!rescueAct(out,e))throw new RangeError('途中記録が不正です。');out.answer=s.answer;out.checked=s.checked;return out;}
