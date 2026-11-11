const answers={set:'answer:same',increment:'answer:two',key:'answer:one'};
export function replayRetryEffect(kind,history){
 if(!Object.hasOwn(answers,kind)||!Array.isArray(history)||history.length>25)return null;
 let step=0,done=false;
 const seq=['send','lose','retry',answers[kind]];
 for(const action of history){if(typeof action!=='string'||done)return null;if(action==='reset'){step=0;continue;}if(action!==seq[step])return null;step++;if(step===seq.length)done=true;}
 return {step,done,lamp:kind==='set'&&step>=1,number:kind==='set'?null:step===0?0:kind==='increment'&&step>=3?2:1,requests:step>=3?2:step>=1?1:0,keyRecorded:kind==='key'&&step>=1};
}
export function advanceRetryEffect(kind,history,action){const p=replayRetryEffect(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayRetryEffect(kind,next)?next:null;}
