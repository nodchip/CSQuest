import {createReinforcement,reinforcementStep} from './reinforcement.js';
export function replayRewardRoute(kind,history){
 if(!['safe','room','compare'].includes(kind)||!Array.isArray(history))return null;
 let state=createReinforcement(),ready=false,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(ready){if(action==='answer:door'){done=true;continue;}return null;}
  if(action==='reset'){state=createReinforcement();continue;}
  const q=state.q,finished=state.place==='start'&&(kind==='safe'?q.safe===1:kind==='room'?q.door===2&&q.treasure===4:q.safe===1&&q.door===2&&q.treasure===4);
  if(action==='check'){if(!finished)return null;if(kind==='compare')ready=true;else done=true;continue;}
  const m=/^act:(safe|door|treasure)$/.exec(action);if(!m)return null;const next=reinforcementStep(state,m[1]);if(!next)return null;state=next;
 }
 return {state,ready,done};
}
