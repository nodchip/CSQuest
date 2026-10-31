export const parallelAverageLevel={id:'forge-parallel-average',number:'419',kind:'parallel-average',name:'二つの村の光の平均',tag:'フィルター・写像・集約',title:'光の記録を集めよう',story:'二人の精霊が光の記録を分担します。４以上の記録だけを残し、全体の平均を求めましょう。'};
export const averageRecords=[2,4,6,8];
export const averageGroups=[[0,1],[2,3]];
export function pairFor(values){return {sum:values.reduce((a,b)=>a+b,0),count:values.length};}
export function combinePairs(a,b){return {sum:a.sum+b.sum,count:a.count+b.count};}
export function pairMean(p){return p.count?p.sum/p.count:null;}
export function averagePartials(selected){return averageGroups.map(g=>pairFor(g.filter(i=>selected.includes(i)).map(i=>averageRecords[i])));}
export function filterCorrect(selected){return selected.length===3&&[1,2,3].every(i=>selected.includes(i));}
export function createParallelAverage(){return {selected:[],filtered:false,mapping:null,mapped:false,naiveTried:false,combined:false,answer:null,checked:false};}
export function parallelAverageComplete(s){return s.filtered&&filterCorrect(s.selected)&&s.mapping==='pair'&&s.mapped&&s.naiveTried&&s.combined&&s.answer==='weighted'&&s.checked;}
export function restoreParallelAverage(s){if(!s||!Array.isArray(s.selected)||s.selected.length>4||new Set(s.selected).size!==s.selected.length||!s.selected.every(i=>Number.isInteger(i)&&i>=0&&i<4)||typeof s.filtered!=='boolean'||s.filtered&&!filterCorrect(s.selected)||![null,'pair','value','count'].includes(s.mapping)||typeof s.mapped!=='boolean'||s.mapped&&(!s.filtered||s.mapping!=='pair')||typeof s.naiveTried!=='boolean'||typeof s.combined!=='boolean'||(s.naiveTried||s.combined)&&!s.mapped||![null,'weighted','means','largest'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です');return {...s,selected:[...s.selected]};}
