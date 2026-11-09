// Fixed two-door model: a guard checks a person's existing read permission.
export function replayPaths(history){
 if(!Array.isArray(history))return null;
 const guarded={front:true,back:false};let sawLeak=false,tested=[],last=null,done=false;
 for(const action of history){
  if(done||typeof action!=='string')return null;
  const [kind,who,door,...extra]=action.split(':');
  if(kind==='guard'&&['front','back'].includes(who)&&door===undefined){guarded[who]=!guarded[who];tested=[];last=null;continue;}
  if(kind!=='test'||!['guest','keeper'].includes(who)||!['front','back'].includes(door)||extra.length)return null;
  const allowed=!guarded[door]||who==='keeper';last={who,door,allowed};
  if(who==='guest'&&door==='back'&&allowed)sawLeak=true;
  if(sawLeak&&guarded.front&&guarded.back){const key=`${who}:${door}`;if(!tested.includes(key))tested.push(key);}
  if(sawLeak&&guarded.front&&guarded.back&&tested.length===4)done=true;
 }
 return {guarded,sawLeak,tested,last,done};
}
