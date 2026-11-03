export const sequenceLimitLevel={id:'crystal-sequence-limit',number:'1093',kind:'sequence-limit',name:'果てまで続く灯りの列',tag:'数列の極限と ε・N',title:'灯りの列の近づき方を調べよう',story:'水晶の道には、番号が進むほど中心へ近づく灯りが並びます。守りの幅に応じて、どこから先を守れるか調べましょう。'};
export const limitWidths=[2,5,10];
export function limitCandidates(k){if(!limitWidths.includes(k))throw new RangeError('幅が不正です');return [k,k+1,k+2];}
export function limitCheck(k,n){if(!limitCandidates(k).includes(n))throw new RangeError('番号が不正です');return n>k;}
export function limitCreate(){return {k:2,choices:{},reflection:null};}
export function limitRestore(q){if(!q||!limitWidths.includes(q.k)||!q.choices||typeof q.choices!=='object'||Array.isArray(q.choices)||![null,'every','one'].includes(q.reflection))throw new RangeError('途中記録が不正です');const choices={};for(const k of limitWidths){const n=q.choices[k];if(n!==undefined){if(!limitCandidates(k).includes(n))throw new RangeError('途中記録が不正です');choices[k]=n;}}return {k:q.k,choices,reflection:q.reflection};}
export function limitDone(q){return limitWidths.every(k=>limitCheck(k,q.choices[k]??k))&&q.reflection==='every';}
