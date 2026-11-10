export const thresholds=[2,3,4];
export const trainingCases=[[[1,'blue'],[3,'red']],[[2,'blue'],[4,'red']]];
export const evaluationCases=[{threshold:3,data:[[1,'blue'],[2,'red'],[4,'red']]},{threshold:2,data:[[1,'blue'],[3,'red'],[4,'red']]}];
export const selectionCases=[
 {train:[[1,'blue'],[3,'red']],validation:[[2,'red']],test:[[2,'blue']]},
 {train:[[1,'blue'],[4,'red']],validation:[[3,'blue']],test:[[5,'red']]}
];
export const classify=(x,t)=>x>=t?'red':'blue';
export const errors=(data,t)=>data.filter(([x,label])=>classify(x,t)!==label).length;
export function replaySupervised(kind,history){
 if(!['train','evaluate','separate'].includes(kind)||!Array.isArray(history))return null;
 let scene=0,tried=[],chosen=null,predicted=0,revealed=false,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){tried=[];chosen=null;predicted=0;revealed=false;continue;}
  if(kind==='train'){
   const m=/^try:([234])$/.exec(action);
   if(m){const t=Number(m[1]);if(!tried.includes(t))tried.push(t);continue;}
   const pick=/^choose:([234])$/.exec(action),data=trainingCases[scene];
   if(pick&&thresholds.every(t=>tried.includes(t))&&errors(data,Number(pick[1]))===Math.min(...thresholds.map(t=>errors(data,t)))){scene++;done=scene===trainingCases.length;tried=[];continue;}
   return null;
  }
  if(kind==='separate'&&chosen===null){
   const m=/^try:([234])$/.exec(action);
   if(m){const t=Number(m[1]);if(!tried.includes(t))tried.push(t);continue;}
   const pick=/^choose:([234])$/.exec(action),c=selectionCases[scene];
   if(pick&&thresholds.every(t=>tried.includes(t))){const t=Number(pick[1]),trainMin=Math.min(...thresholds.map(x=>errors(c.train,x))),eligible=thresholds.filter(x=>errors(c.train,x)===trainMin),validationMin=Math.min(...eligible.map(x=>errors(c.validation,x)));if(eligible.includes(t)&&errors(c.validation,t)===validationMin){chosen=t;continue;}}
   return null;
  }
  const c=kind==='evaluate'?evaluationCases[scene]:selectionCases[scene],data=kind==='evaluate'?c.data:c.test,t=kind==='evaluate'?c.threshold:chosen;
  if(action==='predict'&&predicted<data.length&&!revealed){predicted++;continue;}
  if(action==='reveal'&&predicted===data.length&&!revealed){revealed=true;continue;}
  if(action===`answer:${errors(data,t)}`&&revealed){scene++;done=scene===2;tried=[];chosen=null;predicted=0;revealed=false;continue;}
  return null;
 }
 return {scene,tried,chosen,predicted,revealed,done};
}
