export const counterLevel={id:'workshop-two-bit-counter',number:'267',kind:'two-bit-counter',name:'二つの記憶石で数える',tag:'状態遷移と同期カウンター',title:'四つの状態を巡ろう',story:'二つの記憶石に規則を与え、合図のたびに０から３まで数えます。'};
export const counterLowRules={hold:'右はそのまま',toggle:'右を毎回反転'};
export const counterHighRules={hold:'左はそのまま',toggle:'左を毎回反転',carry:'以前の右が１なら左を反転'};
export function counterNext(state,low,high){if(!Number.isInteger(state)||state<0||state>3||!Object.hasOwn(counterLowRules,low)||!Object.hasOwn(counterHighRules,high))throw new RangeError('状態か規則が不正です。');const oldLow=state&1,oldHigh=state>>1;const nextLow=low==='toggle'?oldLow^1:oldLow,nextHigh=high==='toggle'?oldHigh^1:high==='carry'?oldHigh^oldLow:oldHigh;return nextHigh*2+nextLow;}
export function counterTrace(low,high,ticks){if(!Number.isInteger(ticks)||ticks<0||ticks>4)throw new RangeError('合図の回数が不正です。');const states=[0];for(let i=0;i<ticks;i++)states.push(counterNext(states.at(-1),low,high));return states;}
export function createCounter(){return {low:'hold',high:'hold',ticks:0};}
export function counterComplete(s){return s.ticks===4&&counterTrace(s.low,s.high,s.ticks).join(',')==='0,1,2,3,0';}
export function restoreCounter(saved){if(!saved||!Object.hasOwn(counterLowRules,saved.low)||!Object.hasOwn(counterHighRules,saved.high)||!Number.isInteger(saved.ticks)||saved.ticks<0||saved.ticks>4)throw new RangeError('途中記録が不正です。');return {low:saved.low,high:saved.high,ticks:saved.ticks};}
