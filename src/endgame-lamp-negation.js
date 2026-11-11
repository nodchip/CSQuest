export const lampStates=[[false,false],[false,true],[true,false],[true,true]];
export function truthForLampNegation(kind,index){if(!Number.isInteger(index)||index<0||index>3)return null;const [p,q]=lampStates[index];if(kind==='and')return !(p&&q);if(kind==='or')return !(p||q);return null;}
export function replayLampNegation(kind,history){
 if(!['and','or','counter'].includes(kind)||!Array.isArray(history)||history.length>8)return null;let seen=[],done=false;
 for(const action of history){if(typeof action!=='string'||done)return null;const m=/^row:([0-3]):(yes|no)$/.exec(action);if(kind!=='counter'&&m&&!seen.includes(Number(m[1]))&&truthForLampNegation(kind,Number(m[1]))===(m[2]==='yes')){seen.push(Number(m[1]));continue;}if(kind!=='counter'&&seen.length===4&&action==='answer:equivalent'||kind==='counter'&&(action==='answer:1'||action==='answer:2')){done=true;continue;}return null;}
 return {seen,done};
}
export function advanceLampNegation(kind,history,action){const p=replayLampNegation(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayLampNegation(kind,next)?next:null;}
