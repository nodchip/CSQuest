export const serialLevel={id:'ledger-order',number:'39',kind:'serial',name:'二人の仕事と台帳の順番',tag:'直列化可能性',title:'交互に進む仕事を比べよう',story:'二人の書記が台帳に印を加えます。交互に作業しても、順番に仕事を終えた場合と矛盾しないか調べましょう。'};
export const serialModes={shared:'同じ台帳',separate:'別々の台帳'};
export const serialAnswers={a:'Ａを先に終える順番',b:'Ｂを先に終える順番',either:'どちらの順番でもよい',neither:'どちらの順番とも一致しない'};
export function serialRun(mode,history){
  if(!Object.hasOwn(serialModes,mode)||!Array.isArray(history)||history.length>4||history.some(id=>id!=='A'&&id!=='B'))throw new RangeError('試行が不正です。');
  const workers={A:{stage:0,local:null},B:{stage:0,local:null}},values={X:0,Y:0},operations=[];
  for(const id of history){
    const worker=workers[id];if(worker.stage>=2)throw new RangeError('この仕事は終わっています。');
    const item=id==='B'&&mode==='separate'?'Y':'X',type=worker.stage===0?'read':'write';
    if(type==='read')worker.local=values[item];else values[item]=worker.local+1;
    worker.stage++;operations.push({id,item,type,value:type==='read'?worker.local:values[item]});
  }
  const edges=[];
  for(let i=0;i<operations.length;i++)for(let j=i+1;j<operations.length;j++){
    const a=operations[i],b=operations[j],edge=a.id+b.id;
    if(a.id!==b.id&&a.item===b.item&&(a.type==='write'||b.type==='write')&&!edges.includes(edge))edges.push(edge);
  }
  const classification=edges.includes('AB')?(edges.includes('BA')?'neither':'a'):(edges.includes('BA')?'b':'either');
  return {values,workers,operations,edges,done:history.length===4,classification};
}
export function serialGoal(mode,history){
  const run=serialRun(mode,history);if(!run.done)return null;
  if(mode==='shared')return run.classification==='neither'?'conflict':'ordered';
  return history[0]!==history[1]?'independent':null;
}
export function createSerial(){return {mode:'shared',history:[],witnesses:{ordered:null,conflict:null,independent:null},message:'書記を選んで、一つずつ仕事を進めましょう。'};}
export function restoreSerial(saved){
  if(!saved||!Object.hasOwn(serialModes,saved.mode)||!saved.witnesses)throw new RangeError('途中記録が不正です。');
  serialRun(saved.mode,saved.history);const state=createSerial();state.mode=saved.mode;state.history=saved.history.slice();
  for(const key of Object.keys(state.witnesses)){
    const witness=saved.witnesses[key];if(witness!==null){if(!witness||serialGoal(witness.mode,witness.history)!==key)throw new RangeError('途中記録が不正です。');state.witnesses[key]={mode:witness.mode,history:witness.history.slice()};}
  }
  return state;
}
export function serialComplete(state){return Object.values(state.witnesses).every(Boolean);}
