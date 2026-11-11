const sequences={entry:['open','focus:confirm'],cycle:['open','focus:confirm','tab','tab','shift-tab','escape','return:opener'],fallback:['open','focus:confirm','remove','escape','return:heading']};
export function replayDialogRoute(kind,history){
 if(!Object.hasOwn(sequences,kind)||!Array.isArray(history)||history.length>25)return null;
 let step=0,done=false;
 for(const action of history){if(typeof action!=='string'||done)return null;if(action==='reset'){step=0;continue;}if(action!==sequences[kind][step])return null;step++;if(step===sequences[kind].length)done=true;}
 return {step,done};
}
export function advanceDialogRoute(kind,history,action){const p=replayDialogRoute(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayDialogRoute(kind,next)?next:null;}
