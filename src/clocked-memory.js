export const clockMemoryLevel={id:'workshop-clocked-memory',number:'265',kind:'clocked-memory',name:'刻を待つ記憶石',tag:'クロックと状態の保持',title:'合図で灯りを記憶しよう',story:'工房の記憶石は入力をすぐには写さず、刻の合図で覚えます。'};
export const clockMemoryActions={zero:'入力を０にする',one:'入力を１にする',clock:'クロックの立上り'};
export function clockMemoryRun(history){
 if(!Array.isArray(history)||history.length>40||!history.every(a=>Object.hasOwn(clockMemoryActions,a)))throw new RangeError('操作が不正です。');
 let input=0,output=0,stage=0;const events=[];
 for(const action of history){if(action==='one')input=1;else if(action==='zero')input=0;else output=input;
  if(stage===0&&action==='one'&&output===0)stage=1;
  else if(stage===1&&action==='clock'&&output===1)stage=2;
  else if(stage===2&&action==='zero'&&output===1)stage=3;
  else if(stage===3&&action==='clock'&&output===0)stage=4;
  events.push({action,input,output});
 }
 return {input,output,stage,events};
}
export function createClockMemory(){return {history:[]};}
export function clockMemoryComplete(s){return clockMemoryRun(s.history).stage===4;}
export function restoreClockMemory(saved){if(!saved)throw new RangeError('途中記録が不正です。');clockMemoryRun(saved.history);return {history:[...saved.history]};}
