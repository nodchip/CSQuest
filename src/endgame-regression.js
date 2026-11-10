export const regressionObservations=[1,3,5];
export const regressionComparison=[0,0,9];
export function totalError(observations,prediction,mode){if(!Array.isArray(observations)||!Number.isFinite(prediction)||!['absolute','square'].includes(mode))throw Error('invalid');return observations.reduce((s,value)=>s+(mode==='absolute'?Math.abs(value-prediction):(value-prediction)**2),0);}
export function replayRegression(kind,history){
 if(!['absolute','square','compare'].includes(kind)||!Array.isArray(history))return null;
 let index=0,total=0,observed={},answers=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){index=0;total=0;observed={};answers=[];continue;}
  if(kind!=='compare'){
   if(index<3){const d=Math.abs(regressionObservations[index]-2),expected=kind==='absolute'?d:d*d;if(action!==`error:${expected}`)return null;index++;total+=expected;continue;}
   if(action!==`mean:${total}/3`)return null;done=true;continue;
  }
  const m=/^measure:(absolute|square):(0|3)$/.exec(action);
  if(m){observed[`${m[1]}:${m[2]}`]=totalError(regressionComparison,Number(m[2]),m[1]);continue;}
  if(Object.keys(observed).length!==4)return null;
  if(answers.length===0&&action==='choose:absolute:0'){answers.push(action);continue;}
  if(answers.length===1&&action==='choose:square:3'){answers.push(action);done=true;continue;}
  return null;
 }
 return {index,total,observed,answers,done};
}
