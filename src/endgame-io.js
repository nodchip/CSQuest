// In this fixed clock model each work, poll or handler action consumes one tick.
const schedules={poll:['poll','work','poll','handle','work','check'],interrupt:['work','work','work','handle','work','check']};
export const ioSchedules=schedules;
const fresh=()=>({tick:0,work:0,polls:0,ready:false,seen:false,pending:false,handled:false,last:''});
export function replayIo(kind,history){
 if(!['poll','interrupt','compare'].includes(kind)||!Array.isArray(history))return null;
 const modes=kind==='compare'?['poll','interrupt']:[kind];let scene=0,state=fresh(),results=[],done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(scene===modes.length){if(kind==='compare'&&action==='answer:interrupt'){done=true;continue;}return null;}
  const mode=modes[scene],step=state.tick,expected=schedules[mode][step];
  if(action==='check'){
   if(expected!=='check'||!state.handled)return null;results.push({...state});scene++;if(scene<modes.length)state=fresh();else if(kind!=='compare')done=true;continue;
  }
  if(action!==expected)return null;
  if(action==='work'){if(mode==='interrupt'&&state.pending)return null;state.work++;state.tick++;state.last='別の仕事を１枠進めた';}
  else if(action==='poll'){state.polls++;state.tick++;state.last='装置の状態を確認';}
  else if(action==='handle'){if(!state.ready||(mode==='poll'&&!state.seen)||(mode==='interrupt'&&!state.pending))return null;state.tick++;state.handled=true;state.pending=false;state.last='結果を受け取り、元の仕事へ戻る準備';}
  else return null;
  if(state.tick>=3&&!state.handled){state.ready=true;if(mode==='interrupt')state.pending=true;}
  if(action==='poll')state.seen=state.ready;
 }
 return {scene,state,results,done,mode:modes[scene]??null};
}
