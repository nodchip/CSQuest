export const resolutionInitial=[['P'],['!P','Q'],['!Q']];
export function resolveClauses(a,b,pivot){
 if(!['P','Q'].includes(pivot)||!Array.isArray(a)||!Array.isArray(b))throw new RangeError('札が不正です。');
 const positive=pivot,negative='!'+pivot;
 if(!((a.includes(positive)&&b.includes(negative))||(a.includes(negative)&&b.includes(positive))))throw new RangeError('選んだ２枚に、同じ印の肯定と否定が必要です。');
 return [...new Set([...a.filter(x=>x!==positive&&x!==negative),...b.filter(x=>x!==positive&&x!==negative)])].sort();
}
export function replayResolution(history){
 if(!Array.isArray(history)||history.length>4)throw new RangeError('履歴が不正です。');const clauses=resolutionInitial.map(c=>[...c]);
 for(const h of history){if(!h||!Number.isInteger(h.a)||!Number.isInteger(h.b)||h.a===h.b||h.a<0||h.b<0||h.a>=clauses.length||h.b>=clauses.length||clauses.some(c=>c.length===0))throw new RangeError('札の選択が不正です。');const result=resolveClauses(clauses[h.a],clauses[h.b],h.pivot);if(clauses.some(c=>c.length===result.length&&c.every(x=>result.includes(x))))throw new RangeError('すでにある札です。');clauses.push(result);}
 return clauses;
}
export function createResolution(){return {history:[],selected:[],pivot:null};}
export function restoreResolution(s){if(!s||!Array.isArray(s.selected)||s.selected.length>2||new Set(s.selected).size!==s.selected.length||![null,'P','Q'].includes(s.pivot))throw new RangeError('途中記録が不正です。');const clauses=replayResolution(s.history);if(s.selected.some(i=>!Number.isInteger(i)||i<0||i>=clauses.length))throw new RangeError('札が不正です。');return {history:s.history.map(h=>({...h})),selected:[...s.selected],pivot:s.pivot};}
export function resolutionComplete(s){return replayResolution(s.history).some(c=>c.length===0);}
