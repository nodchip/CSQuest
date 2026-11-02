export const hlsScheduleLevel={id:'workshop-hls-schedule',number:'925',kind:'hls-schedule',name:'二つの積を鍛える',tag:'高位合成と演算器',title:'演算器と刻を組み合わせる',story:'鍛冶場に二つの積を足す依頼が届きました。演算器の数に合わせて、処理を刻に割り当てましょう。'};
export const hlsScheduleModes={one:{name:'乗算器１台',count:1,target:3},two:{name:'乗算器２台',count:2,target:2}};
export const hlsScheduleOps={left:'左の積：２×３',right:'右の積：４×５',sum:'二つの積を足す'};
export function hlsScheduleState(mode,history){
 if(!Object.hasOwn(hlsScheduleModes,mode)||!Array.isArray(history)||history.length>6)throw new RangeError('記録が不正です。');
 const completed={},queue=[],cycles=[];
 for(const action of history){
  if(action==='tick'){
   if(queue.length===0||Object.hasOwn(completed,'sum'))throw new RangeError('刻を進められません。');
   for(const op of queue)completed[op]=op==='left'?6:op==='right'?20:completed.left+completed.right;
   cycles.push([...queue]);queue.length=0;
  }else{
   if(!Object.hasOwn(hlsScheduleOps,action)||Object.hasOwn(completed,action)||queue.includes(action)||Object.hasOwn(completed,'sum'))throw new RangeError('操作が不正です。');
   if(action==='sum'&&(!Object.hasOwn(completed,'left')||!Object.hasOwn(completed,'right')))throw new RangeError('二つの積がまだありません。');
   if(action!=='sum'&&queue.filter(x=>x!=='sum').length>=hlsScheduleModes[mode].count)throw new RangeError('乗算器が足りません。');
   queue.push(action);
  }
 }
 return {queue,completed,cycles,done:Object.hasOwn(completed,'sum'),optimal:Object.hasOwn(completed,'sum')&&cycles.length===hlsScheduleModes[mode].target};
}
export function hlsScheduleCreate(){return {mode:'one',histories:{one:[],two:[]},reflection:null};}
export function hlsScheduleStep(q,a){if(!['left','right','sum','tick'].includes(a))throw new RangeError('操作が不正です。');const h=q.histories[q.mode];try{hlsScheduleState(q.mode,[...h,a]);h.push(a);return true;}catch{return false;}}
export function hlsScheduleComplete(q){return Object.keys(hlsScheduleModes).every(m=>hlsScheduleState(m,q.histories[m]).optimal)&&q.reflection==='resource';}
export function hlsScheduleRestore(q){if(!q||!Object.hasOwn(hlsScheduleModes,q.mode)||!q.histories||![null,'resource','dependence','guarantee'].includes(q.reflection))throw new RangeError('記録が不正です。');const histories={};for(const m of Object.keys(hlsScheduleModes)){hlsScheduleState(m,q.histories[m]);histories[m]=[...q.histories[m]];}return {mode:q.mode,histories,reflection:q.reflection};}
