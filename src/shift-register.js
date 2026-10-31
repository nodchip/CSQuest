export const shiftRegisterLevel={id:'workshop-shift-register',number:'266',kind:'shift-register',name:'三つの記憶石をつなぐ',tag:'シフトレジスタと同時更新',title:'灯りを一つずつ送ろう',story:'依頼265の記憶石を三つつなぎ、合図のたびに灯りを送ります。'};
export const shiftRegisterActions={zero:'入力を０にする',one:'入力を１にする',clock:'クロックの立上り'};
export function shiftRegisterNext(bits,input){if(!Array.isArray(bits)||bits.length!==3||!bits.every(x=>x===0||x===1)||(input!==0&&input!==1))throw new RangeError('値が不正です。');return [input,bits[0],bits[1]];}
export function shiftRegisterRun(history){
 if(!Array.isArray(history)||history.length>50||!history.every(a=>Object.hasOwn(shiftRegisterActions,a)))throw new RangeError('操作が不正です。');
 let input=0,bits=[0,0,0],stage=0;const events=[];
 for(const action of history){let discarded=null;if(action==='zero')input=0;else if(action==='one')input=1;else{discarded=bits[2];bits=shiftRegisterNext(bits,input);if(stage!==2){if(stage===1&&bits.join('')==='010'&&input===0)stage=2;else stage=bits.join('')==='101'?1:0;}}
  events.push({action,input,bits:[...bits],discarded});}
 return {input,bits,stage,events};
}
export function createShiftRegister(){return {history:[]};}
export function shiftRegisterComplete(s){return shiftRegisterRun(s.history).stage===2;}
export function restoreShiftRegister(saved){if(!saved)throw new RangeError('途中記録が不正です。');shiftRegisterRun(saved.history);return {history:[...saved.history]};}
