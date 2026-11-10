export const rleCases={
 encode:[{source:'RRRBBB'},{source:'RBR'}],
 decode:[{runs:[['R',3],['B',2],['R',1]]},{runs:[['B',1],['R',2]]}],
 compare:[{source:'RRRRRRRR'},{source:'RRRRBBBB'},{source:'RBRBRBRB'}],
};
export function replayRle(kind,history){
 const cases=rleCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,index=0,runs=[],output='',judged=false,done=false;
 const reset=()=>{index=0;runs=[];output='';judged=false;};
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(action==='reset'){reset();continue;}
  const c=cases[scene],source=kind==='decode'?c.runs.map(([color,n])=>color.repeat(n)).join(''):c.source;
  if(kind==='decode'){
   const m=/^emit:([RB])$/.exec(action);
   if(m&&index<source.length&&source[index]===m[1]){output+=m[1];index++;continue;}
  }else{
   const m=/^run:([RB]):([1-8])$/.exec(action);
   if(m&&index<source.length){const color=m[1],count=+m[2];let length=0;while(source[index+length]===color)length++;if(count!==length||source[index]!==color)return null;runs.push([color,count]);index+=count;continue;}
   const j=/^judge:(less|equal|more)$/.exec(action);
   if(kind==='compare'&&j&&index===source.length){const encoded=runs.length*4,original=source.length,result=encoded<original?'less':encoded===original?'equal':'more';if(j[1]===result){judged=true;continue;}return null;}
  }
  if(action==='check'&&index===source.length&&(kind!=='compare'||judged)){scene++;done=scene===cases.length;if(!done)reset();continue;}
  return null;
 }
 return {scene,index,runs,output,judged,done};
}
