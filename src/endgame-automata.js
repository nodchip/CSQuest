export const automataSpecs={
 even:{states:['偶数','奇数'],start:0,accept:0,correct:[1,0,0,1],tests:[[],['red'],['red','red'],['blue','red','red']]},
 last:{states:['末尾が青ではない','末尾が青'],start:0,accept:1,correct:[0,1,0,1],tests:[[],['red','blue'],['blue','red'],['blue']]}
};
export const intersectionTests=[['red','red','blue'],['red','blue'],[]];
const symbolIndex=s=>s==='red'?0:s==='blue'?1:-1;
function run(spec,config,sequence){let state=spec.start;for(const symbol of sequence){state=config[state*2+symbolIndex(symbol)];}return state===spec.accept;}
export function replayAutomata(kind,history){
 if(!['even','last','both'].includes(kind)||!Array.isArray(history))return null;
 let config=[null,null,null,null],tests={},scene=0,index=0,evenState=0,lastState=0,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(kind!=='both'){
   const m=/^set:([01]):(red|blue):([01])$/.exec(action);if(m){const slot=Number(m[1])*2+symbolIndex(m[2]);config[slot]=Number(m[3]);tests={};continue;}
   const trial=/^test:([0-3])$/.exec(action);if(trial&&config.every(x=>x!==null)){const n=Number(trial[1]),spec=automataSpecs[kind],seq=spec.tests[n];tests[n]=run(spec,config,seq);continue;}
   if(action==='finish'&&config.every((x,i)=>x===automataSpecs[kind].correct[i])&&automataSpecs[kind].tests.every((_,i)=>Object.hasOwn(tests,i))){done=true;continue;}
   return null;
  }
  const seq=intersectionTests[scene];
  if(action==='step'&&index<seq.length){const symbol=seq[index++],j=symbolIndex(symbol);evenState=automataSpecs.even.correct[evenState*2+j];lastState=automataSpecs.last.correct[lastState*2+j];continue;}
  if(action==='reset'){index=0;evenState=0;lastState=0;continue;}
  if(index===seq.length&&action===`answer:${evenState===0&&lastState===1?'accept':'reject'}`){scene++;done=scene===intersectionTests.length;if(!done){index=0;evenState=0;lastState=0;}continue;}
  return null;
 }
 return {config,tests,scene,index,evenState,lastState,done};
}
