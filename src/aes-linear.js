import {aesSbox} from './aes-differential.js';
export const aesLinearLevel={id:'castle-aes-linear',number:'615',kind:'aes-linear',name:'灯りの組と置換の偏り',tag:'AES S-box と線形近似',title:'入力と出力の灯りを比べよう',story:'鏡を通る印の灯りを、決められた組ごとに比べます。一致が半分より多いか、少ないかを調べましょう。'};
export const linearInputs=[0,1,15,128];
export function bitParity(x){x^=x>>4;x^=x>>2;x^=x>>1;return x&1;}
export function linearRow(inputMask){
 if(!Number.isInteger(inputMask)||inputMask<0||inputMask>255)throw new RangeError('入力の組が不正です');
 const counts=Array(256).fill(0);for(let b=0;b<256;b++)for(let x=0;x<256;x++)if(bitParity(x&inputMask)===bitParity(aesSbox[x]&b))counts[b]++;return counts;
}
export function linearCandidates(a){
 if(!linearInputs.includes(a))throw new RangeError('入力の組が不正です');
 if(a===0)return [0,1];
 const row=linearRow(a),min=Math.min(...row),max=Math.max(...row);
 return [min,128,max].map(value=>row.findIndex((v,i)=>i>0&&v===value)).sort((x,y)=>x-y);
}
export function linearExperiment(a,b){
 if(!linearInputs.includes(a)||!Number.isInteger(b)||b<0||b>255)throw new RangeError('灯りの組が不正です');
 const count=linearRow(a)[b],examples=Array.from({length:4},(_,x)=>({x,y:aesSbox[x],input:bitParity(x&a),output:bitParity(aesSbox[x]&b)}));
 return {count,bias:count-128,examples};
}
export const requiredLinearCases=()=>[...linearCandidates(0).filter(b=>b===0).map(b=>`0:${b}`),...linearInputs.filter(a=>a!==0).flatMap(a=>linearCandidates(a).map(b=>`${a}:${b}`))];
export function createAesLinear(){return {inputMask:1,outputMask:null,guess:null,tested:[],answer:null,checked:false};}
export function aesLinearComplete(s){return requiredLinearCases().every(id=>s.tested.includes(id))&&s.answer==='limited'&&s.checked;}
export function restoreAesLinear(s){
 if(!s||!linearInputs.includes(s.inputMask)||!(s.outputMask===null||linearCandidates(s.inputMask).includes(s.outputMask))||![null,'low','equal','high'].includes(s.guess)||!Array.isArray(s.tested)||new Set(s.tested).size!==s.tested.length||s.tested.some(id=>!linearInputs.some(a=>linearCandidates(a).some(b=>`${a}:${b}`===id)))||![null,'limited','key','always'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('保存データが不正です');
 return {...s,tested:[...s.tested]};
}
