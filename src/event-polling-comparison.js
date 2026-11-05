export const eventComparisonModes={poll:'時刻０と２に状態を確認',event:'時刻１の通知を記録'};
export const eventComparisonSignals={pulse:'１刻だけの信号',held:'時刻２まで続く信号'};
export function createEventComparison(){return {mode:'poll',signal:'pulse',steps:{'poll:pulse':0,'event:pulse':0,'poll:held':0,'event:held':0},answer:null};}
export function eventComparisonState(mode,signal,steps){
 if(!Object.hasOwn(eventComparisonModes,mode)||!Object.hasOwn(eventComparisonSignals,signal)||!Number.isInteger(steps)||steps<0||steps>3)throw new RangeError('記録が不正です');
 const tick=steps-1,high=tick===1||(signal==='held'&&tick===2),checks=mode==='poll'?(steps>=3?2:steps>=1?1:0):0;
 const queued=mode==='event'&&steps===2,observed=steps>=3&&(mode==='event'||signal==='held');
 return {tick,high,checks,queued,observed};
}
export function restoreEventComparison(s){if(!s||!Object.hasOwn(eventComparisonModes,s.mode)||!Object.hasOwn(eventComparisonSignals,s.signal)||!s.steps||![null,'assumptions','always','never'].includes(s.answer))throw new RangeError('途中記録が不正です');const restored=createEventComparison();restored.mode=s.mode;restored.signal=s.signal;restored.answer=s.answer;for(const mode of Object.keys(eventComparisonModes))for(const signal of Object.keys(eventComparisonSignals)){const key=`${mode}:${signal}`;eventComparisonState(mode,signal,s.steps[key]);restored.steps[key]=s.steps[key];}return restored;}
