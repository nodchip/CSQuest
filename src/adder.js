import {gate} from './circuit.js';
import {readBits} from './binary.js';

export const adderLevel={id:'lantern-adder',number:'37',kind:'adder',name:'繰り上がりの回路',tag:'加算回路',title:'灯りで足し算を組み立てる',story:'遺跡の計算台が壊れています。以前作った「片方だけ」の回路を使い、繰り上がりを隣の桁へ渡しましょう。'};
export const adderGates={XOR:'片方だけ（XOR）',AND:'両方（AND）',OR:'少なくとも一方（OR）'};
export const slots=[
  {key:'p',label:'A と B から途中の信号 P を作る'},
  {key:'sum',label:'P と前の桁からの繰り上がりで、この桁の結果を作る'},
  {key:'ab',label:'A と B から繰り上がりの候補を作る'},
  {key:'pc',label:'P と繰り上がりから別の候補を作る'},
  {key:'carry',label:'二つの候補から次の桁への繰り上がりを作る'}
];
export function applyGate(kind,a,b){
  if(!Object.hasOwn(adderGates,kind))throw new RangeError('未知の部品です。');
  // XOR is the circuit built in quest 06: (A OR B) AND (A NAND B).
  return kind==='XOR'?gate('AND',gate('OR',a,b),gate('NAND',a,b)):gate(kind,a,b);
}
export function fullAdder(parts,a,b,carryIn){
  if(!parts||slots.some(({key})=>!Object.hasOwn(adderGates,parts[key])))throw new RangeError('回路部品が不正です。');
  if(![a,b,carryIn].every(x=>x===0||x===1))throw new RangeError('信号は０か１です。');
  const p=applyGate(parts.p,a,b),ab=applyGate(parts.ab,a,b),pc=applyGate(parts.pc,p,carryIn);
  return {sum:applyGate(parts.sum,p,carryIn),carry:applyGate(parts.carry,ab,pc)};
}
export function testAdder(parts){
  return [0,1].flatMap(a=>[0,1].flatMap(b=>[0,1].map(c=>{
    const actual=fullAdder(parts,a,b,c),total=a+b+c;
    return {a,b,c,...actual,expectedSum:total%2,expectedCarry:Math.floor(total/2),correct:actual.sum===total%2&&actual.carry===Math.floor(total/2)};
  })));
}
export function addFour(parts,a,b){
  readBits(a);readBits(b);
  let carry=0;const result=[0,0,0,0],steps=[];
  for(let i=3;i>=0;i--){const input=carry,output=fullAdder(parts,a[i],b[i],carry);result[i]=output.sum;carry=output.carry;steps.push({position:i,a:a[i],b:b[i],input,...output});}
  const signedOverflow=a[0]===b[0]&&result[0]!==a[0];
  return {result,carry,steps,values:readBits(result),signedOverflow};
}
export function createAdder(){return {parts:Object.fromEntries(slots.map(({key})=>[key,'AND'])),tested:false,operands:{a:[0,1,1,1],b:[0,0,0,1]}};}
export function restoreAdder(saved){
  if(!saved||!saved.parts||typeof saved.tested!=='boolean'||slots.some(({key})=>!Object.hasOwn(adderGates,saved.parts[key])))throw new RangeError('途中記録が不正です。');
  const operands=saved.operands===undefined?createAdder().operands:saved.operands;
  if(!operands)throw new RangeError('途中記録が不正です。');
  readBits(operands.a);readBits(operands.b);
  return {parts:Object.fromEntries(slots.map(({key})=>[key,saved.parts[key]])),tested:saved.tested,operands:{a:operands.a.slice(),b:operands.b.slice()}};
}
export function adderComplete(state){return state.tested&&testAdder(state.parts).every(row=>row.correct);}
