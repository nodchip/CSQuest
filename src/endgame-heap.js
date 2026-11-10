export const heapCases={
 queue:[{items:[4,1,3]},{items:[2,5,3]}],
 insert:[{items:[2,5,3,9,7],value:1},{items:[2,4,3],value:5}],
 remove:[{items:[1,4,3,7,5]},{items:[1,3,4,5,6,7]}],
};
export function replayHeap(kind,history){
 const cases=heapCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,items=[],cursor=null,started=false,output=[],done=false;
 const reset=()=>{items=[...cases[scene].items];cursor=null;started=false;output=[];};reset();
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(action==='reset'){reset();continue;}
  const c=cases[scene];
  if(kind==='queue'){
   const m=/^take:([0-9]+)$/.exec(action);
   if(m&&items.length&&Number(m[1])===Math.min(...items)){const n=+m[1];items.splice(items.indexOf(n),1);output.push(n);continue;}
   if(action==='check'&&!items.length){scene++;done=scene===cases.length;if(!done)reset();continue;}
   return null;
  }
  if(kind==='insert'&&!started&&action==='add'){items.push(c.value);cursor=items.length-1;started=true;continue;}
  if(kind==='remove'&&!started&&action==='remove'){output.push(items[0]);const last=items.pop();if(items.length)items[0]=last;cursor=items.length?0:null;started=true;continue;}
  const m=/^swap:([0-9]+)$/.exec(action);
  if(started&&m&&cursor!==null){const chosen=+m[1];let target=null;
   if(kind==='insert'&&cursor>0){const parent=Math.floor((cursor-1)/2);if(items[cursor]<items[parent])target=parent;}
   if(kind==='remove'){const left=cursor*2+1,right=left+1;if(left<items.length){const child=right<items.length&&items[right]<items[left]?right:left;if(items[child]<items[cursor])target=child;}}
   if(target===null||target!==chosen)return null;
   [items[cursor],items[target]]=[items[target],items[cursor]];cursor=target;continue;
  }
  const valid=items.every((value,i)=>i===0||items[Math.floor((i-1)/2)]<=value);
  if(started&&action==='check'&&valid){scene++;done=scene===cases.length;if(!done)reset();continue;}
  return null;
 }
 return {scene,items,cursor,started,output,done};
}
