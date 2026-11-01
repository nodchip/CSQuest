export const quantumKeyLevel={id:'castle-quantum-key',number:'605',kind:'quantum-key',name:'光の伝令と盗み見の影',tag:'量子鍵配送 BB84',title:'光の測り方を照らし合わせよう',story:'ミラとリオは光の伝令で鍵を分け合います。影の盗み見が、調べた欠片に現れるか確かめましょう。'};
export const quantumBits=[0,1,1,0,1,0];
export const aliceBases=['Z','X','Z','X','Z','X'];
export const bobBases=['Z','Z','Z','X','X','X'];
const eveBases=['X','Z','X','X','Z','X'];
const eveDifferent=[1,0,0,0,0,0];
const bobDifferent=[1,0,0,0,1,0];
export const siftedIndices=aliceBases.flatMap((basis,i)=>basis===bobBases[i]?[i]:[]);
export function quantumTransmission(intercept){
 if(typeof intercept!=='boolean')throw new RangeError('条件が不正です');
 return quantumBits.map((bit,i)=>{
  const eveBit=intercept?(aliceBases[i]===eveBases[i]?bit:eveDifferent[i]):null;
  const sentBit=intercept?eveBit:bit,sentBasis=intercept?eveBases[i]:aliceBases[i];
  const bobBit=bobBases[i]===sentBasis?sentBit:bobDifferent[i];
  return {number:i+1,aliceBit:bit,aliceBasis:aliceBases[i],bobBasis:bobBases[i],eveBasis:intercept?eveBases[i]:null,eveBit,bobBit,kept:aliceBases[i]===bobBases[i]};
 });
}
export function quantumSample(intercept,sample){
 if(!Array.isArray(sample)||sample.length!==2||new Set(sample).size!==2||sample.some(i=>!siftedIndices.includes(i)))throw new RangeError('標本が不正です');
 const rows=quantumTransmission(intercept),errors=sample.filter(i=>rows[i].aliceBit!==rows[i].bobBit),remaining=siftedIndices.filter(i=>!sample.includes(i));
 return {errors,remaining,remainingErrors:remaining.filter(i=>rows[i].aliceBit!==rows[i].bobBit)};
}
export function createQuantumKey(){return {selected:[],siftChecked:false,intercept:false,sample:[],sampleGuess:null,tested:[],answer:null,checked:false};}
export function quantumKeyComplete(s){return s.siftChecked&&['clean','detected','hidden'].every(k=>s.tested.includes(k))&&s.answer==='sample'&&s.checked;}
export function restoreQuantumKey(s){
 if(!s||!Array.isArray(s.selected)||new Set(s.selected).size!==s.selected.length||s.selected.some(i=>!Number.isInteger(i)||i<0||i>=6)||typeof s.siftChecked!=='boolean'||(s.siftChecked&&(s.selected.length!==siftedIndices.length||siftedIndices.some(i=>!s.selected.includes(i))))||typeof s.intercept!=='boolean'||!Array.isArray(s.sample)||s.sample.length>2||new Set(s.sample).size!==s.sample.length||s.sample.some(i=>!siftedIndices.includes(i))||![null,true,false].includes(s.sampleGuess)||!Array.isArray(s.tested)||new Set(s.tested).size!==s.tested.length||s.tested.some(k=>!['clean','detected','hidden'].includes(k))||![null,'sample','proof','encrypt'].includes(s.answer)||typeof s.checked!=='boolean'||(!s.siftChecked&&(s.sample.length||s.tested.length)))throw new RangeError('保存データが不正です');
 return {...s,selected:[...s.selected],sample:[...s.sample],tested:[...s.tested]};
}
