// Fixed schedules demonstrate possible interleavings, not a scheduler guarantee.
const aWait=['lock:A','empty:A','wait:A'];
const bWait=['lock:B','empty:B','wait:B'];
const deliver=['lock:P','put','broadcast','unlock:P'];
const aTake=['lock:A','full:A','take:A','unlock:A'];
const bEmpty=['lock:B','empty:B','wait:B'];
const bTake=['lock:B','full:B','take:B','unlock:B'];
export const conditionScripts={wait:[...aWait,...deliver,...aTake],notify:[...aWait,...bWait,...deliver,...aTake,...bEmpty],recheck:[...aWait,...bWait,...deliver,...aTake,...bEmpty,...deliver,...bTake]};
export function replayCondition(kind,history){
 const script=conditionScripts[kind];if(!script||!Array.isArray(history)||history.length>script.length)return null;
 const s={lock:null,items:0,waiting:[],ready:[],checked:null,taken:[],delivered:0};
 for(let i=0;i<history.length;i++){
  const action=history[i];if(action!==script[i])return null;const [op,who]=action.split(':');
  if(op==='lock'){if(s.lock!==null||who!=='P'&&s.waiting.includes(who)||who!=='P'&&s.taken.includes(who))return null;s.lock=who;s.ready=s.ready.filter(x=>x!==who);s.checked=null;}
  else if(op==='empty'||op==='full'){if(s.lock!==who||(s.items===0)!==(op==='empty'))return null;s.checked=op;}
  else if(op==='wait'){if(s.lock!==who||s.checked!=='empty')return null;s.lock=null;s.checked=null;s.waiting.push(who);}
  else if(op==='put'){if(s.lock!=='P'||s.items!==0)return null;s.items=1;s.delivered++;}
  else if(op==='broadcast'){if(s.lock!=='P')return null;s.ready.push(...s.waiting);s.waiting=[];}
  else if(op==='take'){if(s.lock!==who||s.checked!=='full'||s.items!==1)return null;s.items=0;s.taken.push(who);s.checked=null;}
  else if(op==='unlock'){if(s.lock!==who)return null;s.lock=null;s.checked=null;}
  else return null;
 }
 return {state:s,step:history.length,total:script.length,done:history.length===script.length};
}
