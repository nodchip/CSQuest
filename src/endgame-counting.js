export const countingCases={
 gear:[{mode:'product',a:2,b:3},{mode:'product',a:3,b:2},{mode:'sum',a:2,b:3}],
 roles:[{n:3,ordered:true},{n:3,ordered:false},{n:4,ordered:true},{n:4,ordered:false}],
 pigeon:[{boxes:3,marks:4,guaranteed:true},{boxes:3,marks:3,guaranteed:false},{boxes:2,marks:3,guaranteed:true}],
};

export function replayCounting(kind,history){
 const cases=countingCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,selected=[],assignment=[],done=false;
 const reset=()=>{selected=[];assignment=[];};
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(action==='reset'){reset();continue;}
  const c=cases[scene];
  if(kind==='gear'){
   const m=/^pick:([AB]):([0-9]+)(?::([0-9]+))?$/.exec(action);
   if(m){const i=+m[2],j=m[3]===undefined?null:+m[3];
    const valid=c.mode==='product'?m[1]==='A'&&j!==null&&i<c.a&&j<c.b:j===null&&i<(m[1]==='A'?c.a:c.b);
    const key=c.mode==='product'?`A:${i}:${j}`:`${m[1]}:${i}`;if(!valid||selected.includes(key))return null;selected.push(key);continue;
   }
  }
  if(kind==='roles'){
   const m=/^pair:([0-9]+):([0-9]+)$/.exec(action);
   if(m){let a=+m[1],b=+m[2];if(a>=c.n||b>=c.n||a===b)return null;if(!c.ordered&&a>b)[a,b]=[b,a];const key=`${a}:${b}`;if(selected.includes(key))return null;selected.push(key);continue;}
  }
  if(kind==='pigeon'){
   const m=/^put:([0-9]+)$/.exec(action);
   if(m&&assignment.length<c.marks&&+m[1]<c.boxes){assignment.push(+m[1]);continue;}
  }
  const overlap=new Set(assignment).size<assignment.length;
  const ready=kind==='gear'?selected.length===(c.mode==='product'?c.a*c.b:c.a+c.b):kind==='roles'?selected.length===c.n*(c.n-1)/(c.ordered?1:2):assignment.length===c.marks&&(c.guaranteed||!overlap);
  if(action==='check'&&ready){scene++;done=scene===cases.length;if(!done)reset();continue;}
  return null;
 }
 return {scene,selected,assignment,done};
}
