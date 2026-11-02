export const systolicLevel={id:'workshop-systolic-array',number:'875',kind:'systolic-array',name:'流れる鏡と四人の精霊',tag:'行列演算アクセラレータ',title:'数を流して鏡を重ねよう',story:'工房の四人の精霊が、隣へ数を渡しながら鏡を重ねます。二行と一行の依頼を比べましょう。'};
export const systolicCases={full:{name:'２行の鏡',a:[[1,2],[3,4]]},single:{name:'１行の鏡',a:[[1,2]]}};
export const systolicB=[[1,2],[2,1]];
export function systolicFrame(id,ticks){
 if(!Object.hasOwn(systolicCases,id)||!Number.isInteger(ticks)||ticks<0||ticks>4)throw new RangeError('場面または時刻が不正です。');
 const a=systolicCases[id].a,values=Array.from({length:2},()=>[0,0]),history=[];
 for(let time=0;time<ticks;time++){
  const events=[];
  for(let i=0;i<a.length;i++)for(let j=0;j<2;j++){const k=time-i-j;if(k>=0&&k<2){const left=a[i][k],top=systolicB[k][j],product=left*top;values[i][j]+=product;events.push({row:i,col:j,k,left,top,product});}}
  history.push(events);
 }
 return {values,history,active:history.reduce((n,e)=>n+e.length,0),idle:ticks*4-history.reduce((n,e)=>n+e.length,0),done:ticks===4};
}
export function systolicCreate(){return {scenario:'full',ticks:{full:0,single:0},flow:null,padding:null};}
export function systolicComplete(q){return Object.keys(systolicCases).every(id=>q.ticks[id]===4)&&q.flow==='neighbors'&&q.padding==='unused';}
export function systolicRestore(q){if(!q||!Object.hasOwn(systolicCases,q.scenario)||![null,'neighbors','remote','independent'].includes(q.flow)||![null,'unused','full','always'].includes(q.padding))throw new RangeError('記録が不正です。');for(const id of Object.keys(systolicCases))systolicFrame(id,q.ticks?.[id]);return {scenario:q.scenario,ticks:{...q.ticks},flow:q.flow,padding:q.padding};}
