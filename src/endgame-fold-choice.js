export const foldScores={A:[2,3,1],B:[3,2,3]};
export function replayFoldChoice(kind,history){
 if(!['fold','compare','test'].includes(kind)||!Array.isArray(history)||history.length>30)return null;
 let recorded={A:[],B:[]},locked=false,tested=false,done=false;
 for(const action of history){
  if(typeof action!=='string'||done)return null;
  if(action==='reset'){recorded={A:[],B:[]};locked=false;tested=false;continue;}
  const m=/^fold:(A|B):([1-3])$/.exec(action);
  if(m&&!locked){const method=m[1],n=Number(m[2]);if(kind==='fold'&&method!=='A'||kind==='compare'&&method!=='B'||recorded[method].includes(n))return null;recorded[method].push(n);continue;}
  if(action==='check'&&kind==='fold'&&recorded.A.length===3){done=true;continue;}
  if(action==='choose:B'&&kind==='compare'&&recorded.B.length===3){done=true;continue;}
  if(action==='choose:B'&&kind==='test'&&recorded.A.length===3&&recorded.B.length===3&&!locked){locked=true;continue;}
  if(action==='test'&&kind==='test'&&locked&&!tested){tested=true;continue;}
  if(action==='check'&&kind==='test'&&tested){done=true;continue;}
  return null;
 }
 return {recorded,locked,tested,done};
}
export function advanceFoldChoice(kind,history,action){const p=replayFoldChoice(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayFoldChoice(kind,next)?next:null;}
