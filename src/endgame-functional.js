export const functionalCases={
 map:[{input:[1,3,2],target:[2,4,3],operation:'inc'},{input:[0,2,4],target:[0,4,8],operation:'double'}],
 fold:[{input:[2,3,1],target:6},{input:[],target:0},{input:[3,-1],target:2}],
 pipeline:[{input:[1,3,2],target:7},{input:[1,2,4],target:8}]
};
export function replayFunctional(kind,history){
 const cases=functionalCases[kind];if(!cases||!Array.isArray(history))return null;
 let scene=0,ops=[],value=[...cases[0].input],index=0,total=0,done=false;
 function run(){let v=[...cases[scene].input];for(const op of ops){
  if(!Array.isArray(v))return null;
  if(op==='inc')v=v.map(x=>x+1);else if(op==='double')v=v.map(x=>x*2);else if(op==='filter')v=v.filter(x=>x>=2);else if(op==='sum')v=v.reduce((a,x)=>a+x,0);else return null;
 }return v;}
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='check'){
   const c=cases[scene];let ok=kind==='map'?ops.length===1&&ops[0]===c.operation:kind==='fold'?index===c.input.length&&total===c.target:ops.join(',')==='filter,inc,sum'&&value===c.target;
   if(!ok)return null;scene++;done=scene===cases.length;if(!done){ops=[];value=[...cases[scene].input];index=0;total=0;}continue;
  }
  if(kind==='fold'){
   if(action==='step'&&index<cases[scene].input.length){total+=cases[scene].input[index++];continue;}
   if(action==='reset'){index=0;total=0;continue;}return null;
  }
  if(action==='undo'&&ops.length){ops.pop();value=run();continue;}
  if(!action.startsWith('op:')||ops.length>=6)return null;const op=action.slice(3);
  if(!(kind==='map'?['inc','double']:['filter','inc','sum']).includes(op))return null;
  ops.push(op);value=run();if(value===null)return null;
 }
 return {scene,ops,value,index,total,done};
}
