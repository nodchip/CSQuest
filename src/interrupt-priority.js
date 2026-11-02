export const priorityInterruptLevel={id:'workshop-interrupt-priority',number:'984',kind:'interrupt-priority',name:'二つの鐘と割込みの順番',tag:'割込み・優先順位・ベクタ',title:'二つの知らせに応じよう',story:'工房の水鐘と火鐘が順に鳴りました。処理を中断できるかどうかで、知らせへの応答と戻り先を比べましょう。'};
export const priorityInterruptModes={flat:'処理中は新しい割込みを受けない',nested:'高い優先度なら処理中でも受ける',queued:'受付を止めて２件を待機させる'};
export const priorityInterruptDevices={low:{name:'水鐘',vector:32,priority:1},high:{name:'火鐘',vector:48,priority:2}};
export function priorityInterruptReplay(mode,history){
 if(!Object.hasOwn(priorityInterruptModes,mode)||!Array.isArray(history)||history.length>(mode==='queued'?8:7))throw new RangeError('記録が不正です');
 const s={arrived:[],pending:[],stack:[],finished:[],prediction:null,events:[],masked:mode==='queued'};
 for(const action of history){
  if(action==='arrive:low'&&!s.arrived.length){s.arrived.push('low');s.pending.push('low');s.events.push('水鐘が鳴り、待機に入る');}
  else if(action==='arrive:high'&&!s.arrived.includes('high')&&((s.stack.length===1&&s.stack[0]==='low')||(mode==='queued'&&s.masked&&s.arrived.includes('low')&&!s.stack.length))){s.arrived.push('high');s.pending.push('high');s.events.push(mode==='queued'?'受付を止めている間に火鐘が鳴る':'水鐘の処理中に火鐘が鳴る');}
  else if(action==='unmask'&&mode==='queued'&&s.masked&&s.arrived.length===2){s.masked=false;s.events.push('受付を再開する');}
  else if(['predict:low','predict:high'].includes(action)&&s.arrived.includes('high')&&!s.masked&&!s.prediction&&action===`predict:${mode==='flat'?'low':'high'}`){s.prediction=action.slice(8);s.events.push('先に終わる処理を予測');}
  else if(/^vector:(32|48)$/.test(action)&&s.pending.length&&!s.masked&&(!s.arrived.includes('high')||s.prediction)){
   const candidate=s.pending.reduce((a,b)=>priorityInterruptDevices[a].priority>priorityInterruptDevices[b].priority?a:b),running=s.stack.at(-1),canEnter=!running||(mode==='nested'&&priorityInterruptDevices[candidate].priority>priorityInterruptDevices[running].priority);
   if(!canEnter||Number(action.slice(7))!==priorityInterruptDevices[candidate].vector)throw new RangeError('優先順位またはベクタが不正です');
   s.pending.splice(s.pending.indexOf(candidate),1);s.stack.push(candidate);s.events.push(`${priorityInterruptDevices[candidate].name}の処理に入る`);
  }
  else if(action==='finish'&&s.stack.length&&s.arrived.includes('high')&&s.prediction){
   const running=s.stack.at(-1);if(mode==='nested'&&running==='low'&&s.pending.includes('high'))throw new RangeError('高優先の割込みを先に受けます');
   s.stack.pop();s.finished.push(running);s.events.push(`${priorityInterruptDevices[running].name}の処理を終え、${s.stack.length?priorityInterruptDevices[s.stack.at(-1)].name+'へ':'元の仕事へ'}戻る`);
  }else throw new RangeError('操作の順序が不正です');
 }
 return {...s,done:s.finished.length===2&&s.stack.length===0&&s.pending.length===0};
}
export function priorityInterruptStep(mode,history,action){try{const s=priorityInterruptReplay(mode,[...history,action]);return {ok:true,history:[...history,action],message:s.events.at(-1)};}catch{return {ok:false,message:'待機中の鐘、優先順位、現在の処理とベクタ表を確認しましょう。'};}}
export function priorityInterruptCreate(){return {selected:'flat',trials:{flat:[],nested:[],queued:[]},reflection:null};}
export function priorityInterruptComplete(q){return q.reflection==='scope'&&Object.keys(priorityInterruptModes).every(id=>priorityInterruptReplay(id,q.trials[id]).done);}
export function priorityInterruptRestore(saved){if(!saved||!Object.hasOwn(priorityInterruptModes,saved.selected)||![null,'scope','same','lost'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const q=priorityInterruptCreate();q.selected=saved.selected;q.reflection=saved.reflection;for(const id of Object.keys(priorityInterruptModes)){if(id==='queued'&&saved.trials&&!Object.hasOwn(saved.trials,id))continue;priorityInterruptReplay(id,saved.trials?.[id]);q.trials[id]=[...saved.trials[id]];}return q;}
