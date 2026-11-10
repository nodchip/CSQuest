export const varianceCases={
 deviation:[{values:[1,1,3,3]},{values:[0,2,2,4]}],
 variance:[{values:[1,1,3,3]},{values:[0,2,2,4]},{values:[2,2,2,2]}],
 compare:[{a:[1,1,3,3],b:[0,2,2,4]},{a:[0,2,2,4],b:[1,1,3,3]},{a:[2,2,2,2],b:[1,1,3,3]},{a:[1,3,1,3],b:[3,1,3,1]}],
};
export const mean=values=>values.reduce((a,b)=>a+b,0)/values.length;
export const populationVariance=values=>values.reduce((sum,x)=>sum+(x-mean(values))**2,0)/values.length;
export function replayVariance(kind,history){
 const cases=varianceCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,answers=[],judged=false,done=false;
 const reset=()=>{answers=[];judged=false;};
 for(const action of history){
  if(done||typeof action!=='string')return null;
  if(action==='reset'){reset();continue;}
  const c=cases[scene];
  if(kind==='deviation'&&answers.length<c.values.length){const expected=c.values[answers.length]-mean(c.values);if(action===`diff:${expected}`){answers.push(expected);continue;}}
  if(kind==='variance'&&answers.length<c.values.length){const expected=(c.values[answers.length]-mean(c.values))**2;if(action===`square:${expected}`){answers.push(expected);continue;}}
  if(kind==='variance'&&answers.length===c.values.length&&action===`answer:${populationVariance(c.values)}`){judged=true;continue;}
  if(kind==='compare'){const a=populationVariance(c.a),b=populationVariance(c.b),result=a>b?'A':a<b?'B':'equal';if(action===`compare:${result}`){judged=true;continue;}}
  if(action==='check'&&(kind==='deviation'?answers.length===c.values.length:judged)){scene++;done=scene===cases.length;if(!done)reset();continue;}
  return null;
 }
 return {scene,answers,judged,done};
}
