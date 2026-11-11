const sequences={wrap:['put:A','put:B','put:C','take','put:D'],full:['put:A','put:B','put:C','put:D','take','put:D'],compare:[]};
export function replayRingParcels(kind,history){
 if(!Object.hasOwn(sequences,kind)||!Array.isArray(history)||history.length>10)return null;let slots=[null,null,null],head=0,count=0,seen=0,done=false,notice='';
 for(const action of history){if(typeof action!=='string'||done)return null;
  if(action==='answer:count'&&kind==='compare'){done=true;continue;}
  if(action==='check'&&kind!=='compare'&&seen===sequences[kind].length){done=true;continue;}
  if(action!==sequences[kind][seen])return null;
  if(action==='take'){if(count===0)return null;notice=`${slots[head]}を取り出しました。`;slots[head]=null;head=(head+1)%3;count--;}
  else {const item=action.slice(4);if(count===3){notice='満杯なので追加できません。';}else {slots[(head+count)%3]=item;count++;notice=`${item}を追加しました。`;}}
  seen++;
 }
 return {slots,head,count,write:(head+count)%3,order:Array.from({length:count},(_,i)=>slots[(head+i)%3]),seen,notice,done};
}
export function advanceRingParcels(kind,history,action){const p=replayRingParcels(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayRingParcels(kind,next)?next:null;}
