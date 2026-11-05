export const roiMonths={'3':'３か月','6':'６か月'};
export const roiSavings={'1':'月１時間','2':'月２時間'};
export const roiAnswers={'-50':'−50％','0':'０％','100':'100％'};
export function roiResult(months,saving){if(!Object.hasOwn(roiMonths,months)||!Object.hasOwn(roiSavings,saving))throw new RangeError('条件が不正です');const cost=6,benefit=Number(months)*Number(saving);return {cost,benefit,net:benefit-cost,percent:(benefit-cost)/cost*100};}
export function roiCreate(){return {months:'3',saving:'1',guess:'',checked:false,seen:[],reflection:'',reflectionChecked:false};}
export function roiRestore(s){const keys=Object.keys(roiMonths).flatMap(m=>Object.keys(roiSavings).map(v=>`${m}:${v}`));if(!s||!Object.hasOwn(roiMonths,s.months)||!Object.hasOwn(roiSavings,s.saving)||!['',...Object.keys(roiAnswers)].includes(s.guess)||typeof s.checked!=='boolean'||s.checked&&!s.guess||!Array.isArray(s.seen)||new Set(s.seen).size!==s.seen.length||!s.seen.every(k=>keys.includes(k))||!['','limits','only','certain'].includes(s.reflection)||typeof s.reflectionChecked!=='boolean')throw new RangeError('記録が不正です');return {...s,seen:[...s.seen]};}
