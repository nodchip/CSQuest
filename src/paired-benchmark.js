export const pairedBenchmarkLevel={id:'forge-paired-benchmark',number:'1054',kind:'paired-benchmark',name:'速さを比べる五つの試行',tag:'対応のある測定と信頼区間',title:'二つの運搬具を比べる',story:'工房の仲間が２つの運搬具の所要時間を比べています。対になる記録を集め、速さの差と不確かさを調べましょう。'};
// Illustrative data, not timings sampled from a real system.
export const pairedGroups={steady:{name:'ばらつきの小さい記録',a:[12,14,11,13,15],b:[9,10,9,10,12]},variable:{name:'ばらつきの大きい記録',a:[12,14,11,13,15],b:[10,11,12,10,13]}};
const critical={2:12.7062047364,3:4.3026527297,4:3.1824463053,5:2.7764451052};
export function pairedStats(group,count){
 if(!Object.hasOwn(pairedGroups,group)||!Number.isInteger(count)||count<0||count>5)throw new RangeError('測定記録が不正です。');
 const {a,b}=pairedGroups[group],pairs=Array.from({length:count},(_,i)=>({a:a[i],b:b[i],diff:a[i]-b[i]}));
 if(count===0)return {pairs,mean:null,sd:null,low:null,high:null};
 const mean=pairs.reduce((sum,p)=>sum+p.diff,0)/count;if(count===1)return {pairs,mean,sd:null,low:null,high:null};
 const sd=Math.sqrt(pairs.reduce((sum,p)=>sum+(p.diff-mean)**2,0)/(count-1)),margin=critical[count]*sd/Math.sqrt(count);
 return {pairs,mean,sd,low:mean-margin,high:mean+margin};
}
export function pairedCreate(){return {group:'steady',counts:{steady:0,variable:0},interpretation:null,design:null};}
export function pairedRestore(q){
 if(!q||!Object.hasOwn(pairedGroups,q.group)||!q.counts||Object.keys(pairedGroups).some(g=>!Number.isInteger(q.counts[g])||q.counts[g]<0||q.counts[g]>5)||![null,'uncertain','zero','guarantee'].includes(q.interpretation)||![null,'repeat','single','noise'].includes(q.design))throw new RangeError('途中記録が不正です。');
 return {group:q.group,counts:{steady:q.counts.steady,variable:q.counts.variable},interpretation:q.interpretation,design:q.design};
}
export function pairedDone(q){return Object.keys(pairedGroups).every(g=>q.counts[g]===5)&&q.interpretation==='uncertain'&&q.design==='repeat';}
