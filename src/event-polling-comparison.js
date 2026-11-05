export const eventComparisonModes={poll:'現在の状態を見回る',pollLatch:'変化の控えを見回る',event:'登録済みの係へ通知',eventLate:'通知後に係を登録'};
export const eventComparisonSignals={pulse:'１刻だけの信号',held:'時刻２まで続く信号'};
export function createEventComparison(){return {mode:'poll',signal:'pulse',steps:Object.fromEntries(Object.keys(eventComparisonModes).flatMap(mode=>Object.keys(eventComparisonSignals).map(signal=>[`${mode}:${signal}`,0]))),answer:null};}
export function eventComparisonState(mode,signal,steps){
 if(!Object.hasOwn(eventComparisonModes,mode)||!Object.hasOwn(eventComparisonSignals,signal)||!Number.isInteger(steps)||steps<0||steps>3)throw new RangeError('記録が不正です');
 const tick=steps-1,high=tick===1||(signal==='held'&&tick===2),checks=mode.startsWith('poll')?(steps>=3?2:steps>=1?1:0):0;
 const queued=mode==='event'&&steps===2,latched=mode==='pollLatch'&&steps===2;
 const observed=steps>=3&&(mode==='pollLatch'||mode==='event'||(mode==='poll'&&signal==='held'));
 return {tick,high,checks,queued,latched,observed};
}
export function restoreEventComparison(s){if(!s||!Object.hasOwn(eventComparisonModes,s.mode)||!Object.hasOwn(eventComparisonSignals,s.signal)||!s.steps||![null,'assumptions','always','never'].includes(s.answer))throw new RangeError('途中記録が不正です');const restored=createEventComparison();restored.mode=s.mode;restored.signal=s.signal;restored.answer=s.answer;for(const mode of Object.keys(eventComparisonModes))for(const signal of Object.keys(eventComparisonSignals)){const key=`${mode}:${signal}`,steps=s.steps[key]??((mode==='pollLatch'||mode==='eventLate')?0:undefined);eventComparisonState(mode,signal,steps);restored.steps[key]=steps;}return restored;}
