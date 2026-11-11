import {eulerGrowth} from './euler-growth.js';
const counts={coarse:1,half:2,fine:4};
export function replayEulerLantern(kind,history){if(!Object.hasOwn(counts,kind)||!Array.isArray(history)||history.length>6)return null;const n=counts[kind];let steps=0,done=false;for(const action of history){if(typeof action!=='string'||done)return null;if(action==='step'&&steps<n){steps++;continue;}if(steps===n&&action===`answer:${{coarse:'2',half:'2.25',fine:'closer'}[kind]}`){done=true;continue;}return null;}return {steps,n,done,...eulerGrowth(n,steps)};}
export function advanceEulerLantern(kind,history,action){const p=replayEulerLantern(kind,history);if(!p||p.done)return null;const next=action==='reset'?[]:[...history,action];return replayEulerLantern(kind,next)?next:null;}
