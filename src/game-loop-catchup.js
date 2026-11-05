// Elapsed intervals before successive draws, in milliseconds; total is one second.
export const catchupIntervals=[100,100,350,100,100,250];
export const catchupModes={one:{name:'描画ごと最大１回',cap:1},three:{name:'描画ごと最大３回',cap:3}};
export function catchupMeasure(mode,frames){
 if(!Object.hasOwn(catchupModes,mode)||!Number.isInteger(frames)||frames<0||frames>catchupIntervals.length)throw new RangeError('更新の記録が不正です。');
 let elapsed=0,backlog=0,updates=0,lastUpdates=0;
 for(const delta of catchupIntervals.slice(0,frames)){
  elapsed+=delta;backlog+=delta;lastUpdates=Math.min(catchupModes[mode].cap,Math.floor(backlog/100));
  updates+=lastUpdates;backlog-=lastUpdates*100;
 }
 return {frames,elapsed,updates,backlog,lastUpdates,position:updates*6};
}
