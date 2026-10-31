export const normalIntervalLevel={id:'village-normal-interval',number:'434',kind:'normal-interval',name:'薬師の調査と区間の幅',tag:'正規母集団の信頼区間',title:'調査の道具を選ぼう',story:'薬師は薬草の平均の長さを推定するため、調査に必要な本数を考えています。'};
export const normalCounts=[1,4,16];
export const normalMeans=[10,12];
export function normalInterval(mean,n){if(!normalMeans.includes(mean)||!normalCounts.includes(n))throw new RangeError('標本平均か本数が不正です');const margin=1.96*2/Math.sqrt(n);return {margin,low:mean-margin,high:mean+margin};}
export function createNormalInterval(){return {mean:10,n:1,seen:[],budget2:null,budget1:null,answer:null,checked:false};}
export function normalKey(mean,n){return `${mean},${n}`;}
export function normalReady(s){return normalMeans.every(m=>normalCounts.every(n=>s.seen.includes(normalKey(m,n))))&&s.budget2===4&&s.budget1===16;}
export function normalComplete(s){return normalReady(s)&&s.answer==='sampling'&&s.checked;}
export function restoreNormalInterval(s){if(!s||!normalMeans.includes(s.mean)||!normalCounts.includes(s.n)||!Array.isArray(s.seen)||s.seen.length>6||new Set(s.seen).size!==s.seen.length||!s.seen.every(k=>typeof k==='string'&&/^(10|12),(1|4|16)$/.test(k))||![null,...normalCounts].includes(s.budget2)||![null,...normalCounts].includes(s.budget1)||![null,'sampling','certain','unknown'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です');return {mean:s.mean,n:s.n,seen:[...s.seen],budget2:s.budget2,budget1:s.budget1,answer:s.answer,checked:s.checked};}
