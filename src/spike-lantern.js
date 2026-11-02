export const spikeLevel={id:'workshop-spike-lantern',number:'878',kind:'spike-lantern',name:'合図を覚える灯火',tag:'スパイクと減衰',title:'合図の間隔を変えて灯そう',story:'精霊の灯火は届いた合図をため、十分にたまると光を返します。合図の間隔と、たまった力の減衰を比べましょう。'};
export const spikeModes={leak:'毎刻み半分に減る',hold:'減らずに残る'};
export function spikeFrame(pattern,mode,ticks){
 if(!Array.isArray(pattern)||pattern.length!==4||pattern.some(x=>x!==0&&x!==1)||!Object.hasOwn(spikeModes,mode)||!Number.isInteger(ticks)||ticks<0||ticks>4)throw new RangeError('条件が不正です。');
 let value=0;const history=[];
 for(let i=0;i<ticks;i++){const previous=value,retained=mode==='leak'?value/2:value,before=retained+pattern[i],fired=before>=1.5;value=fired?0:before;history.push({previous,retained,input:pattern[i],before,fired,after:value});}
 return {value,history,spikes:history.filter(x=>x.fired).length};
}
export function spikeCreate(){return {pattern:[1,1,0,0],mode:'leak',ticks:0,observed:[],answer:null};}
export function spikeKey(pattern,mode){spikeFrame(pattern,mode,0);return mode+':'+pattern.join('');}
export function spikeAdvance(q){if(q.ticks>=4)throw new RangeError('４刻みが終わりました。');q.ticks++;if(q.ticks===4){const key=spikeKey(q.pattern,q.mode);if(!q.observed.includes(key))q.observed.push(key);}}
export function spikeComplete(q){return ['leak:1100','leak:1001','hold:1100','hold:1001'].every(k=>q.observed.includes(k))&&q.answer==='timing';}
export function spikeRestore(q){if(!q||!Array.isArray(q.observed)||new Set(q.observed).size!==q.observed.length||q.observed.some(k=>typeof k!=='string'||!/^(leak|hold):[01]{4}$/.test(k))||![null,'timing','count','always'].includes(q.answer))throw new RangeError('記録が不正です。');spikeFrame(q.pattern,q.mode,q.ticks);return {pattern:[...q.pattern],mode:q.mode,ticks:q.ticks,observed:[...q.observed],answer:q.answer};}
