export const instructionCardsLevel={id:'workshop-instruction-cards',number:'643',kind:'instruction-cards',name:'門番の命令札',tag:'条件分岐と機械語の対応',title:'門番の約束を命令札にしよう',story:'門番は、封印が０ならそのまま、それ以外なら２を足す約束です。命令札を並べ替え、０と３の両方で確かめましょう。'};
export const instructionCards={load:{label:'封印を読む',op:'読む',code:0,arg:12},jump:{label:'０なら４番へ進む',op:'０なら分岐',code:3,arg:4},add:{label:'２を足す',op:'足す',code:1,arg:13},store:{label:'封印に書き戻す',op:'書戻し',code:2,arg:12},halt:{label:'止まる',op:'停止',code:4,arg:0}};
export const instructionInitial=['load','add','jump','store','halt'];
export function instructionEncode(id){if(!Object.hasOwn(instructionCards,id))throw new RangeError('命令札が不正です。');const c=instructionCards[id];return (c.code<<5)|c.arg;}
export function instructionBits(id){const n=instructionEncode(id);return `${(n>>>5).toString(2).padStart(3,'0')} ${(n&31).toString(2).padStart(5,'0')}`;}
export function instructionOrderValid(order){return Array.isArray(order)&&order.length===5&&new Set(order).size===5&&order.every(k=>Object.hasOwn(instructionCards,k));}
export function instructionExecute(order,input,steps){
 if(!instructionOrderValid(order)||![0,3].includes(input)||!Number.isInteger(steps)||steps<0||steps>20)throw new RangeError('機関の状態が不正です。');
 const cells=Array(32).fill(0);order.forEach((id,i)=>{cells[i]=instructionEncode(id);});cells[12]=input;cells[13]=2;
 let pc=0,acc=0,status='running',last=null;
 for(let i=0;i<steps;i++){
  if(status!=='running')throw new RangeError('停止後の操作はできません。');
  const at=pc,byte=cells[pc],opcode=byte>>>5,arg=byte&31;pc++;
  if(opcode===0)acc=cells[arg];else if(opcode===1)acc=(acc+cells[arg])%256;else if(opcode===2)cells[arg]=acc;else if(opcode===3){if(acc===0)pc=arg;}else if(opcode===4)status='halt';else status='fault';
  last={at,byte,opcode,arg};if(status==='running'&&(pc<0||pc>=order.length))status='fault';if(i===19&&status==='running')status='limit';
 }
 return {pc,acc,value:cells[12],constant:cells[13],status,last};
}
export function instructionFullRun(order,input){let steps=0,state=instructionExecute(order,input,0);while(state.status==='running'){steps++;state=instructionExecute(order,input,steps);}return {...state,steps};}
export function createInstructionCards(){return {order:[...instructionInitial],input:0,run:null,passed:[],answer:null,checked:false};}
export function instructionCardsComplete(s){return [0,3].every(n=>s.passed.includes(n))&&s.answer==='encoding'&&s.checked;}
export function restoreInstructionCards(s){
 if(!s||!instructionOrderValid(s.order)||![0,3].includes(s.input)||!Array.isArray(s.passed)||new Set(s.passed).size!==s.passed.length||s.passed.some(n=>![0,3].includes(n))||![null,'encoding','random','same'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 if(s.run!==null){if(!s.run||s.run.input!==s.input)throw new RangeError('実行記録が不正です。');instructionExecute(s.order,s.run.input,s.run.steps);}
 for(const n of s.passed){const r=instructionFullRun(s.order,n);if(r.status!=='halt'||r.value!==(n===0?0:5))throw new RangeError('達成記録が不正です。');}
 return {...s,order:[...s.order],passed:[...s.passed],run:s.run&&{...s.run}};
}
