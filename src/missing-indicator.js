export const missingIndicatorLevel={id:'archive-missing-indicator',number:'699',kind:'missing-indicator',name:'欠けた記録の印',tag:'欠損値と前処理',title:'欠けた記録を見分けよう',story:'鑑定台の記録には、光の値が測れなかった水晶があります。値を補っても、元の記録に何が欠けていたか分かるようにしましょう。'};
export const missingIndicatorRows=[{value:0},{value:1},{value:2},{value:null}];
export function missingIndicatorEvaluation(village,method){
 if(!['north','south'].includes(village)||!['fill','flag'].includes(method))throw new RangeError('比較条件が不正です。');
 const present=missingIndicatorRows.filter(r=>r.value!==null).map(r=>r.value),mean=present.reduce((a,b)=>a+b,0)/present.length;
 const rows=missingIndicatorRows.map(r=>{const missing=r.value===null,filled=missing?mean:r.value,truth=missing&&village==='north'?1:0,prediction=method==='flag'&&missing?1:0;return {original:r.value,filled,missing,truth,prediction};});
 return {mean,rows,correct:rows.filter(r=>r.truth===r.prediction).length};
}
export function createMissingIndicator(){return {village:'north',method:'fill',observed:[],answer:null,checked:false};}
export function missingIndicatorComplete(s){return s.checked&&['north,fill','north,flag','south,fill','south,flag'].every(x=>s.observed.includes(x))&&s.answer==='depends';}
export function restoreMissingIndicator(s){
 if(!s||!['north','south'].includes(s.village)||!['fill','flag'].includes(s.method)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(x=>!['north,fill','north,flag','south,fill','south,flag'].includes(x))||![null,'depends','always','recover'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {...s,observed:[...s.observed]};
}
