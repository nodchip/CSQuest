export const binary32FieldsLevel={id:'workshop-binary32-fields',number:'712',kind:'binary32-fields',name:'三つの欄の浮動小数点',tag:'IEEE 754 binary32',title:'32の灯りを読み解こう',story:'工房の計測器は32個の灯りに数を記録します。符号・指数・小数部の札を選び、特別な値も含めて読み解きましょう。'};
export const binary32Exponents=[0,1,123,127,254,255];
export const binary32Fractions=[0,1,4194304,5033165,8388607];
export function binary32Interpret(sign,exponent,fraction){
 if(![0,1].includes(sign)||!Number.isInteger(exponent)||exponent<0||exponent>255||!Number.isInteger(fraction)||fraction<0||fraction>8388607)throw new RangeError('欄の値が不正です。');
 const word=((sign<<31)|(exponent<<23)|fraction)>>>0,bits=word.toString(2).padStart(32,'0');let kind,value,realExponent=null;
 if(exponent===255){kind=fraction===0?'infinity':'nan';value=fraction===0?(sign?-Infinity:Infinity):NaN;}
 else if(exponent===0){realExponent=-126;if(fraction===0){kind='zero';value=sign?-0:0;}else{kind='subnormal';value=(sign?-1:1)*(fraction/8388608)*2**-126;}}
 else{kind='normal';realExponent=exponent-127;value=(sign?-1:1)*(1+fraction/8388608)*2**realExponent;}
 return {word,hex:word.toString(16).padStart(8,'0').toUpperCase(),bits,kind,value,realExponent};
}
export function createBinary32Fields(){return {sign:0,exponent:127,fraction:0,observed:[],answer:null,checked:false};}
export function binary32FieldsComplete(s){return s.checked&&['0,0,0','1,0,0','0,0,1','0,1,0','0,123,5033165','0,255,0','0,255,1'].every(k=>s.observed.includes(k))&&s.answer==='special';}
export function restoreBinary32Fields(s){if(!s||![0,1].includes(s.sign)||!binary32Exponents.includes(s.exponent)||!binary32Fractions.includes(s.fraction)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>{const m=/^([01]),(\d+),(\d+)$/.exec(k);return !m||!binary32Exponents.includes(Number(m[2]))||!binary32Fractions.includes(Number(m[3]))||`${Number(m[1])},${Number(m[2])},${Number(m[3])}`!==k;})||![null,'special','allNormal','sameZero'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,observed:[...s.observed]};}
