export const machineLevel={id:'instruction-engine',number:'73',kind:'machine',name:'命令を読む魔導機関',tag:'命令の取出し・解読・実行',title:'機関の中をたどろう',story:'魔導機関は一つの記憶から命令と数を読みます。命令を一つずつ取り出し、意味を解いて実行しましょう。'};
export const machineProgram=[{op:'LOAD',arg:6},{op:'JZ',arg:4},{op:'ADD',arg:7},{op:'STORE',arg:6},{op:'HALT',arg:null}];
export const machineCases={zero:{name:'入力０',input:0},three:{name:'入力３',input:3}};
export const machineOps={LOAD:'記憶から読み込む',JZ:'０なら指定位置へ進む',ADD:'記憶の値を足す',STORE:'記憶へ書き戻す',HALT:'停止する'};
export function createMachine(id){if(!Object.hasOwn(machineCases,id))throw new RangeError('未知の入力です。');return {id,cells:[...machineProgram.map(x=>({...x})),null,machineCases[id].input,2],pc:0,reg:0,ir:null,phase:'fetch',history:[],message:'命令位置の示す場所から命令を取り出しましょう。'};}
function expectedEffect(state){const instruction=state.ir;if(instruction.op==='LOAD')return state.cells[instruction.arg];if(instruction.op==='JZ')return state.reg===0?instruction.arg:state.pc;if(instruction.op==='ADD')return state.reg+state.cells[instruction.arg];if(instruction.op==='STORE')return state.reg;return 'stop';}
export function machineStep(state,action){
  if(state.phase==='done'||typeof action!=='string'||!(/^(fetch:[0-4]|decode:(LOAD|JZ|ADD|STORE|HALT)|exec:(0|2|3|4|5|stop))$/.test(action)))throw new RangeError('操作できません。');
  if(state.phase==='fetch'){
    if(action!==`fetch:${state.pc}`)return {...state,message:'命令位置が示す番地を選びましょう。'};
    const ir={...state.cells[state.pc]},pc=state.pc+1;return {...state,ir,pc,phase:'decode',history:[...state.history,action],message:'命令を取り出し、命令位置を次へ進めました。'};
  }
  if(state.phase==='decode'){
    if(action!==`decode:${state.ir.op}`)return {...state,message:'取り出した命令の印と操作の意味を比べましょう。'};
    return {...state,phase:'execute',history:[...state.history,action],message:`${machineOps[state.ir.op]}命令です。実行後を予測しましょう。`};
  }
  const effect=expectedEffect(state);if(action!==`exec:${effect}`)return {...state,message:'命令の種類、対象番地と今の値を見直しましょう。'};
  const next={...state,cells:state.cells.slice(),history:[...state.history,action]},op=state.ir.op;
  if(op==='LOAD'||op==='ADD')next.reg=effect;if(op==='JZ')next.pc=effect;if(op==='STORE')next.cells[state.ir.arg]=effect;
  next.phase=op==='HALT'?'done':'fetch';next.message=op==='HALT'?'機関が停止しました。':op==='JZ'?`次の命令位置は ${next.pc} です。`:op==='STORE'?`番地 ${state.ir.arg} に ${effect} を書き戻しました。`:`レジスタは ${next.reg} になりました。`;return next;
}
export function createMachineSet(){return {selected:'zero',states:{zero:createMachine('zero'),three:createMachine('three')}};}
export function restoreMachineCycle(saved){
  if(!saved||!Object.hasOwn(machineCases,saved.selected)||!saved.history)throw new RangeError('途中記録が不正です。');const result=createMachineSet();result.selected=saved.selected;
  for(const id of Object.keys(machineCases)){const history=saved.history[id];if(!Array.isArray(history)||history.length>15)throw new RangeError('途中記録が不正です。');let s=createMachine(id);for(const action of history){const next=machineStep(s,action);if(next.history.length!==s.history.length+1)throw new RangeError('途中記録が不正です。');s=next;}result.states[id]=s;}return result;
}
export function machineComplete(value){return Object.values(value.states).every(s=>s.phase==='done');}
