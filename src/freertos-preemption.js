export const freeRtosLevel={id:'forge-freertos-preemption',number:'761',kind:'freertos-preemption',name:'鐘を聞く二人の精霊',tag:'FreeRTOS の優先度と切替え',title:'急ぎの仕事をいつ始める？',story:'工房の低い優先度の精霊が働く間に、急ぎの精霊が鐘で目覚めます。切替えの設定と譲る操作を比べましょう。'};
export const freeRtosModes=['preempt','cooperative','yield'];
export function freeRtosTrial(){return {time:0,lowRemaining:4,highRemaining:1,running:'low',highFinished:null,yielded:false,steps:[],history:[]};}
export function freeRtosStep(t,mode,action){
 if(!freeRtosModes.includes(mode)||!['tick','yield'].includes(action))throw new RangeError('操作が不正です。');
 if(action==='yield'){if(mode==='preempt'||t.time<2||t.highRemaining===0||t.running!=='low'||t.lowRemaining===0)return false;t.running='high';t.yielded=true;t.history.push('yield');return true;}
 if(t.time>=5)return false;
 if(mode==='preempt'&&t.time>=2&&t.highRemaining>0)t.running='high';
 const active=t.running;
 if(active==='low'){if(t.lowRemaining<=0)return false;t.lowRemaining--;}
 else{if(t.time<2||t.highRemaining<=0)return false;t.highRemaining--;}
 t.steps.push(active);t.time++;
 if(active==='high'&&t.highRemaining===0){t.highFinished=t.time;t.running='low';}
 if(active==='low'&&t.lowRemaining===0&&t.time>=2&&t.highRemaining>0)t.running='high';
 if(mode==='preempt'&&t.time>=2&&t.highRemaining>0)t.running='high';
 t.history.push('tick');return true;
}
export function freeRtosCorrect(t,mode){if(!freeRtosModes.includes(mode))throw new RangeError('場面が不正です。');return t.time===5&&t.lowRemaining===0&&t.highRemaining===0&&(mode==='cooperative'?t.highFinished===5&&!t.yielded:t.highFinished===3&&(mode==='preempt'||t.yielded));}
export function freeRtosCreate(){return {mode:'preempt',trials:Object.fromEntries(freeRtosModes.map(m=>[m,freeRtosTrial()])),answer:'',checked:false};}
export function freeRtosComplete(s){return freeRtosModes.every(m=>freeRtosCorrect(s.trials[m],m))&&s.answer==='setting'&&s.checked;}
export function freeRtosRestore(s){if(!s||!freeRtosModes.includes(s.mode)||!s.trials||!['','setting','always','same'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const out=freeRtosCreate();out.mode=s.mode;out.answer=s.answer;out.checked=s.checked;for(const m of freeRtosModes){const saved=s.trials[m];if(!saved||!Array.isArray(saved.history)||saved.history.length>6)throw new RangeError('途中記録が不正です。');for(const action of saved.history)if(!freeRtosStep(out.trials[m],m,action))throw new RangeError('途中記録が不正です。');}return out;}
