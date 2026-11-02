export const sensorAdapterLevel={id:'workshop-sensor-adapter',number:'920',kind:'sensor-adapter',name:'薬窯と二つの温度計',tag:'装置とアダプター',title:'二つの温度計を薬窯につなぐ',story:'工房の薬窯は摂氏の温度を受け取ります。温度計ごとの報告を合わせ、読み取れない場合も調べましょう。'};
export const sensorAdapterDevices={a:{name:'温度計 A',raw:[18,22,null]},b:{name:'温度計 B',raw:[46,54,null]}};
export const sensorAdapterCases={cold:{name:'涼しい',index:0},warm:{name:'温かい',index:1},missing:{name:'報告なし',index:2}};
export const sensorAdapterConversions={direct:'そのまま',adapt:'10 を引いて２で割る',half:'２で割る',wrong:'２で割ってから10 を引く'};
export function sensorAdapterEvaluate(device,scene,conversion,missing){
 if(!Object.hasOwn(sensorAdapterDevices,device)||!Object.hasOwn(sensorAdapterCases,scene)||!Object.hasOwn(sensorAdapterConversions,conversion)||!['stop','zero'].includes(missing))throw new RangeError('設定が不正です。');
 const raw=sensorAdapterDevices[device].raw[sensorAdapterCases[scene].index];let value=raw;
 if(value===null){if(missing==='zero')value=0;}
 else if(conversion==='adapt')value=(value-10)/2;else if(conversion==='half')value/=2;else if(conversion==='wrong')value=value/2-10;
 const output=value===null?'unknown':value<20?'heat':'off',expectedValue=[18,22,null][sensorAdapterCases[scene].index],expectedOutput=expectedValue===null?'unknown':expectedValue<20?'heat':'off';
 return {raw,value,output,correct:value===expectedValue&&output===expectedOutput};
}
export function sensorAdapterCreate(){return {device:'a',scene:'cold',conversion:'direct',missing:'stop',seen:[],last:null,reflection:null};}
export function sensorAdapterCheck(q){const r=sensorAdapterEvaluate(q.device,q.scene,q.conversion,q.missing),key=`${q.device}:${q.scene}`;q.last={device:q.device,scene:q.scene,conversion:q.conversion,missing:q.missing,...r};if(r.correct&&!q.seen.includes(key))q.seen.push(key);}
export function sensorAdapterComplete(q){return Object.keys(sensorAdapterDevices).every(d=>Object.keys(sensorAdapterCases).every(c=>q.seen.includes(`${d}:${c}`)))&&q.reflection==='contract';}
export function sensorAdapterRestore(q){if(!q||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!Object.keys(sensorAdapterDevices).some(d=>Object.keys(sensorAdapterCases).some(c=>k===`${d}:${c}`)))||![null,'contract','hardware','always'].includes(q.reflection))throw new RangeError('記録が不正です。');sensorAdapterEvaluate(q.device,q.scene,q.conversion,q.missing);if(q.last!==null){if(!q.last||typeof q.last!=='object')throw new RangeError('記録が不正です。');const r=sensorAdapterEvaluate(q.last.device,q.last.scene,q.last.conversion,q.last.missing);if(Object.keys(r).some(k=>r[k]!==q.last[k]))throw new RangeError('記録が不正です。');}return {device:q.device,scene:q.scene,conversion:q.conversion,missing:q.missing,seen:[...q.seen],last:q.last&&{...q.last},reflection:q.reflection};}
