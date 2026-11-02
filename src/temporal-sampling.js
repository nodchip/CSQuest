export const temporalSamplingLevel={id:'ruin-temporal-sampling',number:'951',kind:'temporal-sampling',name:'揺れる光の記録',tag:'時間の標本化とエイリアシング',title:'速い光を記録する',story:'祭りの灯りには、ゆっくり揺れるものと速く揺れるものがあります。水晶の記録を比べ、動きを取り違える理由を探しましょう。'};
export const samplingFrequencies=[1,5];
export const samplingRates=[4,8,12];
// Both signals use the same phase and vary smoothly between brightness 0 and 10.
export function samplingValue(f,t){if(!samplingFrequencies.includes(f)||!Number.isFinite(t))throw new RangeError('光の条件が不正です。');return 5+5*Math.sin(2*Math.PI*f*t);}
export function samplingValues(f,rate){if(!samplingRates.includes(rate))throw new RangeError('記録の速さが不正です。');return Array.from({length:rate},(_,i)=>Math.round(samplingValue(f,i/rate)*1000)/1000);}
export function samplingCreate(){return {frequency:1,rate:4,seen:[],comparison:null,rateAnswer:null};}
export function samplingObserve(q){if(!samplingFrequencies.includes(q.frequency)||!samplingRates.includes(q.rate))throw new RangeError('記録の条件が不正です。');const key=`${q.frequency}:${q.rate}`;if(!q.seen.includes(key))q.seen.push(key);}
export function samplingComplete(q){return samplingFrequencies.every(f=>samplingRates.every(r=>q.seen.includes(`${f}:${r}`)))&&q.comparison==='same4'&&q.rateAnswer==='twelve';}
export function samplingRestore(q){const keys=samplingFrequencies.flatMap(f=>samplingRates.map(r=>`${f}:${r}`));if(!q||!samplingFrequencies.includes(q.frequency)||!samplingRates.includes(q.rate)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!keys.includes(k))||![null,'same4','always','same12'].includes(q.comparison)||![null,'twelve','eight','any'].includes(q.rateAnswer))throw new RangeError('記録が不正です。');return {frequency:q.frequency,rate:q.rate,seen:[...q.seen],comparison:q.comparison,rateAnswer:q.rateAnswer};}
