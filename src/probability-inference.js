export const inferenceLevel={id:'village-probability-inference',number:'717',kind:'probability-inference',name:'灯りの予測と観測',tag:'確率と統計',title:'灯台の点灯を調べる',story:'灯台守は点灯する割合を考え、10回の記録を調べます。仮定からの予測と、記録に基づく候補の比較を試しましょう。'};
export const inferenceRates=[20,50,80],inferenceCounts=[3,7];
export function inferenceProbability(rate,count){if(!inferenceRates.includes(rate)||!inferenceCounts.includes(count))throw new RangeError('未知の条件です。');const p=rate/100;return 120*p**count*(1-p)**(10-count);}
export function inferenceCreate(){return {rate:50,count:3,seen:{3:[],7:[]},answers:{3:null,7:null},checked:false};}
export function inferenceReady(s){return inferenceCounts.every(k=>inferenceRates.every(p=>s.seen[k].includes(p)));}
export function inferenceComplete(s){return inferenceReady(s)&&s.checked&&s.answers[3]===20&&s.answers[7]===80;}
export function inferenceRestore(s){if(!s||!inferenceRates.includes(s.rate)||!inferenceCounts.includes(s.count)||!s.seen||!s.answers||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');const out=inferenceCreate();out.rate=s.rate;out.count=s.count;out.checked=s.checked;for(const k of inferenceCounts){const a=s.seen[k];if(!Array.isArray(a)||new Set(a).size!==a.length||a.some(p=>!inferenceRates.includes(p))||![null,...inferenceRates].includes(s.answers[k]))throw new RangeError('途中記録が不正です。');out.seen[k]=[...a];out.answers[k]=s.answers[k];}return out;}
