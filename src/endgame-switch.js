// A discrete teaching model, not an electrical simulation.
const bounce={name:'揺れる押下',physical:'１回押して離す',samples:[0,1,0,1,1,1,0,0,0]};
const clean={name:'揺れない押下',physical:'１回押して離す',samples:[0,1,1,1,0,0,0,0,0]};
const short={name:'短い押下',physical:'１回短く押して離す',samples:[0,1,1,0,0,0,0,0,0]};
const longBounce={name:'長く揺れる押下',physical:'１回押している間に信号が２回分だけ０に戻る',samples:[0,1,1,0,0,1,1,1,0,0,0]};
export const switchCases={raw:[bounce,clean],filter:[bounce,short],compare:[bounce,short,longBounce]};
const fresh=()=>({index:0,raw:0,stable:0,candidate:null,streak:0,count:0,accepted:[]});
export function replaySwitch(kind,history){
 if(!Object.hasOwn(switchCases,kind)||!Array.isArray(history))return null;
 let scene=0,state=fresh(),threshold=kind==='filter'?3:null,observed={},results=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===switchCases[kind].length){if(kind==='compare'&&action==='answer:depends'){done=true;continue;}return null;}
  const samples=switchCases[kind][scene].samples;
  if(kind==='compare'&&(action==='choose:2'||action==='choose:3')){threshold=Number(action.slice(-1));state=fresh();continue;}
  if(action==='reset'){state=fresh();if(kind==='compare')threshold=null;observed={};continue;}
  if(action==='next'){
   if(state.index>=samples.length||(kind==='compare'&&threshold===null))return null;
   const value=samples[state.index];state.index++;
   if(kind==='raw'){if(state.raw===0&&value===1){state.count++;state.accepted.push(state.index);}state.raw=value;}
   else {if(state.candidate===value)state.streak++;else {state.candidate=value;state.streak=1;}state.raw=value;if(state.streak>=threshold&&state.stable!==value){state.stable=value;if(value===1){state.count++;state.accepted.push(state.index);}}}
   if(kind==='compare'&&state.index===samples.length)observed[threshold]={count:state.count,accepted:[...state.accepted]};
   continue;
  }
  if(action==='check'||(kind!=='compare'&&/^answer:[0-9]+$/.test(action))){
   if(kind==='compare'?action!=='check'||!observed[2]||!observed[3]:!/^answer:[0-9]+$/.test(action)||state.index!==samples.length||Number(action.slice(7))!==state.count)return null;
   results.push(kind==='compare'?{...observed}:{count:state.count,accepted:[...state.accepted]});scene++;state=fresh();threshold=kind==='filter'?3:null;observed={};if(scene===switchCases[kind].length&&kind!=='compare')done=true;continue;
  }
  return null;
 }
 return {scene,state,threshold,observed,results,done};
}
