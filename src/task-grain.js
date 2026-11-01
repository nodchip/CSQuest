export const grainCases={free:{name:'準備がかからない場合',overhead:0},costly:{name:'袋ごとに準備が必要な場合',overhead:1}};
export const grainCounts=[1,2,4,8];
export function grainResult(id,count){if(!Object.hasOwn(grainCases,id)||!grainCounts.includes(count))throw new RangeError('条件が不正です。');const items=8/count,waves=Math.ceil(count/2),perBag=items+grainCases[id].overhead;return {items,waves,perBag,time:waves*perBag};}
export function grainBest(id){const times=grainCounts.map(n=>[n,grainResult(id,n).time]),min=Math.min(...times.map(x=>x[1]));return times.filter(x=>x[1]===min).map(x=>x[0]).join(',');}
export function createGrain(){return Object.fromEntries(Object.keys(grainCases).map(id=>[id,{visited:[],answer:'',checked:false}]));}
export function grainCorrect(id,t){return !!t?.checked&&grainCounts.every(n=>t.visited.includes(n))&&t.answer===grainBest(id);}
export function grainComplete(s){return Object.keys(grainCases).every(id=>grainCorrect(id,s[id]));}
export function restoreGrain(saved){if(saved===undefined)return createGrain();if(!saved||typeof saved!=='object')throw new RangeError('途中記録が不正です。');const r=createGrain();for(const id of Object.keys(r)){const t=saved[id];if(!t||!Array.isArray(t.visited)||new Set(t.visited).size!==t.visited.length||t.visited.some(n=>!grainCounts.includes(n))||!['','1','2','4','8','2,4,8'].includes(t.answer)||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です。');r[id]={visited:[...t.visited],answer:t.answer,checked:t.checked};}return r;}
