export const complementLevel={id:'archive-complement-recognizers',number:'863',kind:'complement-recognizers',name:'二つの認識器と判定の門',tag:'認識可能性と判定可能性',title:'二人の番人で門を判定しよう',story:'書庫の門には「仲間」と「仲間でない」の証を探す二人の番人がいます。片方を待ち続けず、二人を交互に働かせましょう。'};
export const complementCases={moon:{name:'月の札',positive:3,negative:Infinity},star:{name:'星の札',positive:Infinity,negative:4},cloud:{name:'雲の札',positive:Infinity,negative:Infinity}};
export function complementReplay(id,ticks){
 if(!Object.hasOwn(complementCases,id)||!Number.isInteger(ticks)||ticks<0||ticks>10)throw new RangeError('記録が不正です。');
 const c=complementCases[id],steps=[0,0];let result=null;
 for(let i=0;i<ticks;i++){if(result)throw new RangeError('判定後の操作はできません。');const side=i%2;steps[side]++;if(steps[side]>=(side===0?c.positive:c.negative))result=side===0?'inside':'outside';}
 return {steps,result,finished:!!result||ticks===10};
}
export function complementCreate(){return {selected:'moon',ticks:{moon:0,star:0,cloud:0},answers:{moon:null,star:null,cloud:null},reflection:null};}
export function complementAdvance(q,count){if(![1,2].includes(count))throw new RangeError('刻数が不正です。');for(let i=0;i<count;i++){if(complementReplay(q.selected,q.ticks[q.selected]).finished)break;q.ticks[q.selected]++;}}
export function complementComplete(q){return Object.keys(complementCases).every(id=>complementReplay(id,q.ticks[id]).finished&&q.answers[id]===({moon:'inside',star:'outside',cloud:'pending'})[id])&&q.reflection==='both';}
export function complementRestore(q){
 if(!q||!Object.hasOwn(complementCases,q.selected)||!q.ticks||!q.answers||![null,'both','either','timeout'].includes(q.reflection))throw new RangeError('記録が不正です。');const copy=complementCreate();copy.selected=q.selected;copy.reflection=q.reflection;
 for(const id of Object.keys(complementCases)){complementReplay(id,q.ticks[id]);if(![null,'inside','outside','pending'].includes(q.answers[id]))throw new RangeError('回答が不正です。');copy.ticks[id]=q.ticks[id];copy.answers[id]=q.answers[id];}
 return copy;
}
