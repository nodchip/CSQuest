export const flickerStudyLevel={id:'ruin-flicker-study',number:'892',kind:'flicker-study',name:'ちらつく灯りの境界',tag:'視覚の時間分解能',title:'記録から境界を探そう',story:'遺跡の灯りが途切れず見える条件を調べます。観察記録を比べ、境界の決め方が結果にどう影響するか考えましょう。'};
export const flickerStudyRates=[80,90,100,110];
export const flickerStudyFields={small:{label:'小さい灯り',counts:[8,5,1,0]},large:{label:'大きい灯り',counts:[10,8,5,1]}};
export const flickerStudyCriteria={half:{label:'10回中５回以下',limit:5},rare:{label:'10回中１回以下',limit:1}};
export function flickerStudyThreshold(field,criterion){if(!Object.hasOwn(flickerStudyFields,field)||!Object.hasOwn(flickerStudyCriteria,criterion))throw new RangeError('条件が不正です。');const i=flickerStudyFields[field].counts.findIndex(n=>n<=flickerStudyCriteria[criterion].limit);return i<0?null:flickerStudyRates[i];}
const flickerStudyKeys=['small:half','small:rare','large:half','large:rare'];
export function flickerStudyCreate(){return {field:'small',criterion:'half',answers:{},reflection:null};}
export function flickerStudyChoose(q,rate){if(!flickerStudyRates.includes(rate))throw new RangeError('周波数が不正です。');const key=`${q.field}:${q.criterion}`;if(!flickerStudyKeys.includes(key))throw new RangeError('条件が不正です。');q.answers[key]=rate;}
export function flickerStudyComplete(q){return flickerStudyKeys.every(k=>{const [f,c]=k.split(':');return q.answers[k]===flickerStudyThreshold(f,c);})&&q.reflection==='depends';}
export function flickerStudyRestore(q){if(!q||!Object.hasOwn(flickerStudyFields,q.field)||!Object.hasOwn(flickerStudyCriteria,q.criterion)||!q.answers||typeof q.answers!=='object'||Array.isArray(q.answers)||Object.entries(q.answers).some(([k,v])=>!flickerStudyKeys.includes(k)||!flickerStudyRates.includes(v))||![null,'depends','universal','guarantee'].includes(q.reflection))throw new RangeError('記録が不正です。');return {field:q.field,criterion:q.criterion,answers:{...q.answers},reflection:q.reflection};}
