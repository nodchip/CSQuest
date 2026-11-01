export const fixedPointLevel={id:'workshop-fixed-point',number:'710',kind:'fixed-point',name:'小数の目盛りと８つの灯り',tag:'固定小数点と丸め',title:'限られた灯りで小数を記そう',story:'工房の計測器は８つの灯りに小数を記録します。目盛りと表せる範囲を調べ、値をどう記録するか考えましょう。'};
// Inputs are exact multiples of 1/100000, avoiding floating-point tie decisions.
export const fixedPointCases={ordinary:130000,negative:-130000,tieZero:3125,tieTwo:9375,upper:796875,lowerTie:-803125,lowerOverflow:-809375};
export function fixedPointEncode(key){
 if(!Object.hasOwn(fixedPointCases,key))throw new RangeError('値が不正です。');
 const units=fixedPointCases[key],numerator=units*16,base=100000,lower=Math.floor(numerator/base),remainder=numerator-lower*base,tie=remainder*2===base;
 const integer=remainder*2<base?lower:remainder*2>base?lower+1:lower%2===0?lower:lower+1,inRange=integer>=-128&&integer<=127;
 return {input:units/base,integer,tie,inRange,byte:inRange?(integer+256)%256:null,value:inRange?integer/16:null,error:inRange?integer/16-units/base:null};
}
export function fixedPointRead(byte){if(!Number.isInteger(byte)||byte<0||byte>255)throw new RangeError('ビット列が不正です。');return {bits:byte.toString(2).padStart(8,'0'),signed:(byte>=128?byte-256:byte)/16,unsigned:byte/16};}
export function createFixedPoint(){return {selected:'ordinary',byte:0,observed:[],inspected:[],answer:null,checked:false};}
export function fixedPointComplete(s){return s.checked&&['ordinary','tieZero','tieTwo','upper','lowerTie','lowerOverflow'].every(k=>s.observed.includes(k))&&[127,128].every(b=>s.inspected.includes(b))&&s.answer==='rounded';}
export function restoreFixedPoint(s){if(!s||!Object.hasOwn(fixedPointCases,s.selected)||!Number.isInteger(s.byte)||s.byte<0||s.byte>255||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!Object.hasOwn(fixedPointCases,k))||!Array.isArray(s.inspected)||new Set(s.inspected).size!==s.inspected.length||s.inspected.some(b=>!Number.isInteger(b)||b<0||b>255)||![null,'rounded','infinite','same'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,observed:[...s.observed],inspected:[...s.inspected]};}
