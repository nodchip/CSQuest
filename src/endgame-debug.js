export const debugInputs=[['赤','青','赤'],['青','赤']];
export const debugTests=[{input:['赤','青','赤'],expected:2},{input:['青','青'],expected:0},{input:[],expected:0}];
const count=(input,rule)=>input.filter(x=>rule==='all'||x===rule).length;
export function replayDebug(kind,history){
 if(!['trace','breakpoint','repair'].includes(kind)||!Array.isArray(history))return null;
 let scene=0,index=0,actual=0,expected=0,marked=false,phase='choose',point=null,rule=null,tests={},done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(kind==='repair'){
   if(action.startsWith('rule:')){const chosen=action.slice(5);if(!['赤','青','all'].includes(chosen))return null;rule=chosen;tests={};continue;}
   if(action.startsWith('test:')){const match=/^test:([0-2])$/.exec(action);if(!match||!rule)return null;const n=Number(match[1]);tests[n]=count(debugTests[n].input,rule);continue;}
   if(action==='finish'&&rule==='赤'&&debugTests.every((t,i)=>tests[i]===t.expected)){done=true;continue;}
   return null;
  }
  const input=debugInputs[scene];
  if(action==='reset'){index=0;actual=0;expected=0;marked=false;phase='choose';point=null;continue;}
  if(action==='next'&&marked){scene++;done=scene===debugInputs.length;if(!done){index=0;actual=0;expected=0;marked=false;phase='choose';point=null;}continue;}
  if(kind==='trace'){
   if(action==='step'&&index<input.length&&!marked){actual++;if(input[index]==='赤')expected++;index++;continue;}
   if(action==='mark'&&!marked&&index>0&&actual!==expected&&input.slice(0,index-1).every(x=>x==='赤')){marked=true;continue;}
   return null;
  }
  if(action.startsWith('point:')&&phase==='choose'){const m=/^point:([1-3])$/.exec(action);if(!m||Number(m[1])>input.length)return null;point=Number(m[1]);continue;}
  if(action==='run'&&phase==='choose'&&point!==null){index=point-1;actual=index;expected=count(input.slice(0,index),'赤');phase='paused';continue;}
  if(action==='step'&&phase==='paused'){actual++;if(input[index]==='赤')expected++;index++;phase='stepped';continue;}
  if(action==='mark'&&phase==='stepped'&&input[point-1]==='青'&&actual!==expected){marked=true;phase='marked';continue;}
  return null;
 }
 return {scene,index,actual,expected,marked,phase,point,rule,tests,done};
}
