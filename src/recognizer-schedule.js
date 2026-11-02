export const recogLevel={id:'archive-recognizer-schedule',number:'862',kind:'recognizer-schedule',name:'止まらない巻物と認識',tag:'認識可能性と並行探索',title:'三つの巻物を少しずつ調べよう',story:'書庫の３つの巻物は、封印が解けるまで何刻かかるか分かりません。１冊ずつ待つ方法と、少しずつ交互に調べる方法を比べましょう。'};
export const recogModes={serial:'一冊ずつ待つ',round:'交互に進める'};
export function recogReplay(mode,ticks){
 if(!Object.hasOwn(recogModes,mode)||!Number.isInteger(ticks)||ticks<0||ticks>18)throw new RangeError('記録が不正です。');
 const steps=[0,0,0],limits=[3,Infinity,6];let cursor=0;const history=[];
 for(let t=0;t<ticks;t++){
  let i;if(mode==='serial')i=steps.findIndex((n,j)=>n<limits[j]);else {while(steps[cursor]>=limits[cursor])cursor=(cursor+1)%3;i=cursor;cursor=(cursor+1)%3;}
  steps[i]++;history.push(i);
 }
 return {steps,accepted:steps.map((n,i)=>n>=limits[i]),history};
}
export function recogCreate(){return {mode:'serial',ticks:{serial:0,round:0},answers:{finite:null,fair:null}};}
export function recogAdvance(q,count){if(![1,3].includes(count))throw new RangeError('刻数が不正です。');q.ticks[q.mode]=Math.min(18,q.ticks[q.mode]+count);}
export function recogComplete(q){return q.ticks.serial===18&&q.ticks.round===18&&q.answers.finite==='unknown'&&q.answers.fair==='progress';}
export function recogRestore(q){
 if(!q||!Object.hasOwn(recogModes,q.mode)||!q.ticks||!q.answers)throw new RangeError('記録が不正です。');const copy=recogCreate();copy.mode=q.mode;
 for(const mode of Object.keys(recogModes)){recogReplay(mode,q.ticks[mode]);copy.ticks[mode]=q.ticks[mode];}
 if(![null,'unknown','reject','endless'].includes(q.answers.finite)||![null,'progress','decide','instant'].includes(q.answers.fair))throw new RangeError('回答が不正です。');copy.answers={...q.answers};return copy;
}
