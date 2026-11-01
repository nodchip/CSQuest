export const realTimeMemoryLevel={id:'forge-realtime-memory',number:'758',kind:'realtime-memory',name:'刻限と消える頁',tag:'リアルタイム処理とメモリ管理',title:'急ぎの合図に頁を備える',story:'灯台に届く合図は３刻以内に処理しなければなりません。必要な頁を事前に用意し、記憶の圧迫に備えましょう。'};
export const realTimeMemoryModes=['demand','preload','locked'];
export function memoryTrial(){return {phase:'prepare',resident:false,locked:false,pressure:false,preparation:0,response:null,fault:false,history:[]};}
export function memoryCreate(){return {mode:'demand',trials:Object.fromEntries(realTimeMemoryModes.map(m=>[m,memoryTrial()])),answer:'',checked:false};}
export function memoryStep(t,action){
 if(!['load','lock','pressure','release','run'].includes(action))throw new RangeError('操作が不正です。');
 if(action==='load'){if(t.phase!=='prepare'||t.resident||t.pressure)return false;t.resident=true;t.preparation+=3;}
 else if(action==='lock'){if(t.phase!=='prepare'||!t.resident||t.locked||t.pressure)return false;t.locked=true;}
 else if(action==='pressure'){if(t.phase!=='prepare'||t.pressure)return false;t.pressure=true;if(!t.locked)t.resident=false;}
 else if(action==='release'){if(t.phase!=='prepare'||!t.pressure)return false;t.phase='ready';}
 else{if(t.phase!=='ready')return false;t.fault=!t.resident;t.response=t.fault?4:1;t.resident=true;t.phase='done';}
 t.history.push(action);return true;
}
export function memoryTrialCorrect(t,mode){if(!realTimeMemoryModes.includes(mode))throw new RangeError('場面が不正です。');if(t.phase!=='done'||!t.pressure)return false;return mode==='demand'?t.preparation===0&&!t.locked&&t.response===4:mode==='preload'?t.preparation===3&&!t.locked&&t.response===4:t.preparation===3&&t.locked&&t.response===1;}
export function memoryComplete(s){return realTimeMemoryModes.every(m=>memoryTrialCorrect(s.trials[m],m))&&s.answer==='limited'&&s.checked;}
export function memoryRestore(s){if(!s||!realTimeMemoryModes.includes(s.mode)||!s.trials||!['','limited','always','free'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const out=memoryCreate();out.mode=s.mode;out.answer=s.answer;out.checked=s.checked;for(const m of realTimeMemoryModes){const x=s.trials[m];if(!x||!Array.isArray(x.history)||x.history.length>5)throw new RangeError('途中記録が不正です。');for(const action of x.history)if(!memoryStep(out.trials[m],action))throw new RangeError('途中記録が不正です。');}return out;}
