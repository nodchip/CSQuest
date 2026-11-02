export const configCountLevel={id:'archive-configuration-count',number:'868',kind:'configuration-count',name:'限られた印と構成の数',tag:'PSPACE と EXP',title:'同じ構成に戻るか調べよう',story:'書庫の箱は少数の印で状態を記録します。印の数を変え、停止する箱と回り続ける箱の構成をたどりましょう。'};
export const configSizes=[2,3,4];
export const configModes={halt:'最後で止まる',cycle:'繰り返す'};
export function configCountReplay(bits,mode,tick){
 if(!configSizes.includes(bits)||!Object.hasOwn(configModes,mode)||!Number.isInteger(tick)||tick<0)throw new RangeError('条件が不正です。');
 const total=2**bits,limit=mode==='halt'?total-1:total;if(tick>limit)throw new RangeError('試行は終了しています。');
 return {total,value:tick%total,visited:Math.min(tick+1,total),status:tick===limit?(mode==='halt'?'halt':'repeat'):'running',bits:(tick%total).toString(2).padStart(bits,'0')};
}
export function configCountCreate(){return {bits:2,mode:'halt',ticks:Object.fromEntries(configSizes.map(n=>[n,{halt:0,cycle:0}])),countAnswer:null,relationAnswer:null};}
export function configCountAdvance(q,count){if(![1,4].includes(count))throw new RangeError('刻数が不正です。');for(let i=0;i<count;i++){if(configCountReplay(q.bits,q.mode,q.ticks[q.bits][q.mode]).status!=='running')break;q.ticks[q.bits][q.mode]++;}}
export function configCountComplete(q){return configSizes.every(bits=>Object.keys(configModes).every(mode=>configCountReplay(bits,mode,q.ticks[bits][mode]).status!=='running'))&&q.countAnswer==='power'&&q.relationAnswer==='subset';}
export function configCountRestore(q){
 if(!q||!configSizes.includes(q.bits)||!Object.hasOwn(configModes,q.mode)||!q.ticks||![null,'power','linear','fixed'].includes(q.countAnswer)||![null,'subset','equal','reverse'].includes(q.relationAnswer))throw new RangeError('記録が不正です。');
 const copy=configCountCreate();copy.bits=q.bits;copy.mode=q.mode;copy.countAnswer=q.countAnswer;copy.relationAnswer=q.relationAnswer;
 for(const bits of configSizes)for(const mode of Object.keys(configModes)){const tick=q.ticks[bits]?.[mode];configCountReplay(bits,mode,tick);copy.ticks[bits][mode]=tick;}return copy;
}
