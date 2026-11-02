export const channelPressureLevel={id:'forest-channel-pressure',number:'996',kind:'channel-pressure',name:'満員の伝令路',tag:'通信路・バッファ・流量',title:'満員の伝令路を調べよう',story:'森の伝令所に手紙が次々と届きます。待ち場所と送信失敗時の扱いを変えて比べましょう。'};
export const channelPressureModes=['wait','drop'],channelPressureCapacities=[0,1],channelPressureJobs=['甲','乙','丙','丁','戊'];
export function channelPressureTrace(mode,capacity){
 if(!channelPressureModes.includes(mode)||!channelPressureCapacities.includes(capacity))throw new RangeError('不正な条件');
 const pending=[],buffer=[],completed=[],dropped=[],rows=[];let active=null,waits=0;
 for(let time=0;time<=20;time++){
  let finished=null,started=null,arrived=null,action='なし';
  if(active&&active.finish===time){finished=active.id;completed.push(finished);active=null;}
  if(!active&&buffer.length){started=buffer.shift();active={id:started,finish:time+2};}
  if(time<channelPressureJobs.length){arrived=channelPressureJobs[time];pending.push(arrived);}
  if(pending.length){const first=pending[0];if(!active){pending.shift();started=first;active={id:first,finish:time+2};action=`${first}を受け付け`;}else if(buffer.length<capacity){pending.shift();buffer.push(first);action=`${first}を待ち場所へ`;}else if(mode==='drop'){pending.shift();dropped.push(first);action=`${first}を破棄`;}else{waits++;action=`${first}は送信側で待つ`;}}
  rows.push({time,arrived,finished,started,active:active?.id??null,buffer:[...buffer],pending:[...pending],action,completed:[...completed],dropped:[...dropped]});
  if(time>=channelPressureJobs.length-1&&!active&&!buffer.length&&!pending.length)return {rows,completed,dropped,waits};
 }
 throw new Error('履歴が終了しません');
}
export function channelPressureCreate(){return {mode:'wait',capacity:0,trials:Object.fromEntries(channelPressureModes.flatMap(mode=>channelPressureCapacities.map(capacity=>[`${mode}:${capacity}`,{step:0,answer:null,checked:false}]))),reflection:null};}
export function channelPressureDone(mode,capacity,t){const trace=channelPressureTrace(mode,capacity);return !!t&&t.step===trace.rows.length&&t.checked&&t.answer===(trace.dropped.length?'dropped':'all');}
export function channelPressureComplete(s){return s.reflection==='tradeoff'&&channelPressureModes.every(mode=>channelPressureCapacities.every(capacity=>channelPressureDone(mode,capacity,s.trials[`${mode}:${capacity}`])));}
export function channelPressureRestore(saved){if(!saved||!channelPressureModes.includes(saved.mode)||!channelPressureCapacities.includes(saved.capacity)||![null,'tradeoff','automatic','unlimited'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const s=channelPressureCreate();s.mode=saved.mode;s.capacity=saved.capacity;s.reflection=saved.reflection;for(const mode of channelPressureModes)for(const capacity of channelPressureCapacities){const id=`${mode}:${capacity}`,t=saved.trials?.[id],length=channelPressureTrace(mode,capacity).rows.length;if(!t||!Number.isInteger(t.step)||t.step<0||t.step>length||![null,'all','dropped'].includes(t.answer)||typeof t.checked!=='boolean'||(t.checked&&t.step!==length))throw new RangeError('途中記録が不正です');s.trials[id]={step:t.step,answer:t.answer,checked:t.checked};}return s;}
