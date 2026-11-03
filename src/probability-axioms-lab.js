export const probabilityAxiomsLevel={id:'village-probability-axioms',number:'1063',kind:'probability-axioms-lab',name:'六つの宝石と確率の約束',tag:'確率の公理と事象',title:'重なりを数え直す',story:'６つの宝石から１つを選ぶ儀式で、色の条件を組み合わせます。宝石を動かし、確率の約束がどう成り立つか調べましょう。'};
export const probabilityAxiomsColors=['赤','青','緑'];
export const probabilityAxiomsMarkers=['empty','whole','disjoint','overlap','changed'];
export function probabilityAxiomsValidCounts(counts){return Array.isArray(counts)&&counts.length===3&&counts.every(x=>Number.isInteger(x)&&x>=0)&&counts.reduce((a,b)=>a+b,0)===6;}
export function probabilityAxiomsMeasure(counts,mask){if(!probabilityAxiomsValidCounts(counts)||!Number.isInteger(mask)||mask<0||mask>7)throw new RangeError('宝石や条件が不正です。');return counts.reduce((sum,x,i)=>sum+((mask&(1<<i))?x:0),0);}
export function probabilityAxiomsCompare(counts,a,b){
 const pa=probabilityAxiomsMeasure(counts,a),pb=probabilityAxiomsMeasure(counts,b),intersection=probabilityAxiomsMeasure(counts,a&b),union=probabilityAxiomsMeasure(counts,a|b);
 return {a:pa,b:pb,intersection,union,sum:pa+pb,disjoint:(a&b)===0};
}
export function probabilityAxiomsObserved(q){
 const {counts,a,b}=q,r=probabilityAxiomsCompare(counts,a,b),found=[];
 if(a===0)found.push('empty');if(a===7)found.push('whole');
 if(a!==0&&b!==0&&r.disjoint&&r.a>0&&r.b>0)found.push('disjoint');
 const overlap=(a&b)!==0&&r.intersection>0&&probabilityAxiomsMeasure(counts,a&~b)>0&&probabilityAxiomsMeasure(counts,b&~a)>0;
 if(overlap){if(counts.every(x=>x===2))found.push('overlap');else found.push('changed');}return found;
}
export function probabilityAxiomsCreate(){return {counts:[2,2,2],a:0,b:0,seen:[],axioms:null,unionAnswer:null};}
export function probabilityAxiomsDone(q){return probabilityAxiomsMarkers.every(x=>q.seen.includes(x))&&q.axioms==='valid'&&q.unionAnswer==='subtract';}
export function probabilityAxiomsRestore(q){
 if(!q||!probabilityAxiomsValidCounts(q.counts)||!Number.isInteger(q.a)||q.a<0||q.a>7||!Number.isInteger(q.b)||q.b<0||q.b>7||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(x=>!probabilityAxiomsMarkers.includes(x))||![null,'valid','negative','positive'].includes(q.axioms)||![null,'subtract','add','intersection'].includes(q.unionAnswer))throw new RangeError('途中記録が不正です。');
 return {counts:[...q.counts],a:q.a,b:q.b,seen:[...q.seen],axioms:q.axioms,unionAnswer:q.unionAnswer};
}
