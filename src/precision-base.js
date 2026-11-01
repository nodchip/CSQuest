export const precisionBaseLevel={id:'archive-precision-base',number:'704',kind:'precision-base',name:'警報と伝令の割合',tag:'適合率・再現率と集団の構成',title:'警報の中身を確かめよう',story:'二つの街道では、妨害の割合が異なります。同じ見張り方でも警報の中身がどう変わるか調べましょう。'};
export const precisionBasePopulations={rare:10,balanced:50};
export const precisionBaseRules={none:{tp:0,fp:0},strict:{tp:.5,fp:.1},wide:{tp:.9,fp:.4}};
export function precisionBaseResult(population,rule){
 if(!Object.hasOwn(precisionBasePopulations,population)||!Object.hasOwn(precisionBaseRules,rule))throw new RangeError('条件が不正です。');
 const positive=precisionBasePopulations[population],negative=100-positive,rate=precisionBaseRules[rule],tp=positive*rate.tp,fp=negative*rate.fp,fn=positive-tp,tn=negative-fp;
 return {positive,negative,tp,fp,fn,tn,recall:tp/positive,fpr:fp/negative,precision:tp+fp===0?null:tp/(tp+fp),accuracy:(tp+tn)/100};
}
export function createPrecisionBase(){return {population:'rare',rule:'none',observed:[],answer:null,checked:false};}
export function precisionBaseComplete(s){return s.checked&&['rare,none','rare,strict','rare,wide','balanced,none','balanced,strict','balanced,wide'].every(k=>s.observed.includes(k))&&s.answer==='composition';}
export function restorePrecisionBase(s){if(!s||!Object.hasOwn(precisionBasePopulations,s.population)||!Object.hasOwn(precisionBaseRules,s.rule)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>! /^(rare|balanced),(none|strict|wide)$/.test(k))||![null,'composition','same','zero'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,observed:[...s.observed]};}
