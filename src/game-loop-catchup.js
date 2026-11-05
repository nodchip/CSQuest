// Elapsed intervals before successive draws, in milliseconds; total is one second.
export const catchupIntervals=[100,100,350,100,100,250];
export const catchupModes={one:{name:'最大１回・持ち越す',cap:1,discard:false},three:{name:'最大３回・持ち越す',cap:3,discard:false},drop:{name:'最大１回・余りの全更新分を捨てる',cap:1,discard:true}};
export function catchupMeasure(mode,frames){
 if(!Object.hasOwn(catchupModes,mode)||!Number.isInteger(frames)||frames<0||frames>catchupIntervals.length)throw new RangeError('更新の記録が不正です。');
 let elapsed=0,backlog=0,updates=0,lastUpdates=0,discarded=0;
 for(const delta of catchupIntervals.slice(0,frames)){
  elapsed+=delta;backlog+=delta;lastUpdates=Math.min(catchupModes[mode].cap,Math.floor(backlog/100));
  updates+=lastUpdates;backlog-=lastUpdates*100;
  if(catchupModes[mode].discard){const skipped=Math.floor(backlog/100)*100;discarded+=skipped;backlog-=skipped;}
 }
 return {frames,elapsed,updates,backlog,discarded,lastUpdates,position:updates*6};
}
