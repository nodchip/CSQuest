import {gfMultiply} from './aes-mix.js';
export const aesDifferentialLevel={id:'castle-aes-differential',number:'614',kind:'aes-differential',name:'差分を映す置換の鏡',tag:'AES S-box と差分',title:'二つの印の差を追いかけよう',story:'魔導炉の前に、印を別の印に変える鏡があります。二つの入力の差が、鏡の後にどう現れるか調べましょう。'};
export const differentialInputs=[0,1,0x1b,0x80];
const rotate=(x,n)=>((x<<n)|(x>>(8-n)))&255;
function sboxValue(x){
 let inverse=0;if(x){inverse=1;for(let i=0;i<254;i++)inverse=gfMultiply(inverse,x);}
 return inverse^rotate(inverse,1)^rotate(inverse,2)^rotate(inverse,3)^rotate(inverse,4)^0x63;
}
export const aesSbox=Array.from({length:256},(_,i)=>sboxValue(i));
export function differentialRow(dx){
 if(!Number.isInteger(dx)||dx<0||dx>255)throw new RangeError('入力差が不正です');
 const counts=Array(256).fill(0);for(let x=0;x<256;x++)counts[aesSbox[x]^aesSbox[x^dx]]++;return counts;
}
export function differentialCandidates(dx){
 if(!differentialInputs.includes(dx))throw new RangeError('入力差が不正です');
 const counts=differentialRow(dx);return (dx===0?[counts.indexOf(256),counts.indexOf(0)]:[0,2,4].map(n=>counts.indexOf(n))).sort((a,b)=>a-b);
}
export function differentialExperiment(dx,dy){
 if(!differentialInputs.includes(dx)||!Number.isInteger(dy)||dy<0||dy>255)throw new RangeError('差が不正です');
 const matches=[];for(let x=0;x<256;x++){const other=x^dx;if((aesSbox[x]^aesSbox[other])===dy)matches.push({x,other,left:aesSbox[x],right:aesSbox[other]});}
 return {count:matches.length,matches};
}
export const requiredDifferentials=()=>[...differentialCandidates(0).filter(dy=>dy===0).map(dy=>`0:${dy}`),...differentialInputs.filter(dx=>dx!==0).flatMap(dx=>differentialCandidates(dx).map(dy=>`${dx}:${dy}`))];
export function createAesDifferential(){return {dx:1,dy:null,guess:null,tested:[],answer:null,checked:false};}
export function aesDifferentialComplete(s){return requiredDifferentials().every(id=>s.tested.includes(id))&&s.answer==='limited'&&s.checked;}
export function restoreAesDifferential(s){
 if(!s||!differentialInputs.includes(s.dx)||!(s.dy===null||differentialCandidates(s.dx).includes(s.dy))||![null,0,2,4,256].includes(s.guess)||!Array.isArray(s.tested)||new Set(s.tested).size!==s.tested.length||s.tested.some(id=>!differentialInputs.some(dx=>differentialCandidates(dx).some(dy=>`${dx}:${dy}`===id)))||![null,'limited','break','equal'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('保存データが不正です');
 return {...s,tested:[...s.tested]};
}
