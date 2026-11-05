export const capacityModes={small:'１人で固定',large:'３人で固定',auto:'前の刻の需要で自動調整'};
export const capacityDemand=[2,7,7,2];
export function capacityTrace(mode,ticks){if(!Object.hasOwn(capacityModes,mode)||!Number.isInteger(ticks)||ticks<0||ticks>4)throw new RangeError('試行が不正です。');let workers=mode==='large'?3:1;return capacityDemand.slice(0,ticks).map((d,i)=>{const row={tick:i+1,demand:d,workers,served:Math.min(d,workers*3),lost:Math.max(0,d-workers*3),cost:workers};if(mode==='auto')workers=Math.max(1,Math.ceil(d/3));return row;});}
export function capacityCreate(){return {mode:'small',ticks:{small:0,large:0,auto:0},answer:null};}
export function capacityComplete(s){return Object.keys(capacityModes).every(k=>s.ticks[k]===4)&&s.answer==='delay';}
export function capacityRestore(s){if(!s||!Object.hasOwn(capacityModes,s.mode)||!s.ticks||![null,'delay','perfect','free'].includes(s.answer))throw new RangeError('途中記録が不正です。');const out=capacityCreate();out.mode=s.mode;out.answer=s.answer;for(const k of Object.keys(capacityModes)){capacityTrace(k,s.ticks[k]);out.ticks[k]=s.ticks[k];}return out;}
