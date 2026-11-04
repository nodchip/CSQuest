export const boundLevel={id:'archive-asymptotic-bound',number:'335',kind:'asymptotic-bound',name:'小さな書庫と大きな書庫',tag:'定数と漸近的な上限',title:'二つの作業を比べよう',story:'鑑定士は一つの石を８回調べる道具と、石同士の全組合せを調べる道具を比べます。書庫の大きさによって作業の順序は変わるでしょうか。'};
export const boundSizes=[4,8,16];
export const boundProofOptions=[1,2,4,8];
export function boundProof(c,start){
 if(!boundProofOptions.includes(c)||!boundProofOptions.includes(start))throw new RangeError('定数または開始点が不正です。');
 return {valid:c*start>=8,left:8*start,right:c*start*start};
}
export function boundLowerCounterexample(c,start){
 if(!boundProofOptions.includes(c)||!boundProofOptions.includes(start))throw new RangeError('定数または開始点が不正です。');
 const n=Math.max(start,Math.floor(8/c)+1);
 return {n,left:8*n,right:c*n*n};
}
export function boundCounts(n){if(!boundSizes.includes(n))throw new RangeError('石の数が不正です');let linear=0,pairs=0;for(let i=0;i<n;i++){for(let j=0;j<8;j++)linear++;for(let j=0;j<n;j++)pairs++;}return {linear,pairs};}
export function boundWinner(n){const {linear,pairs}=boundCounts(n);return linear<pairs?'linear':linear>pairs?'pairs':'same';}
export function createBound(){return {size:4,trials:Object.fromEntries(boundSizes.map(n=>[n,{guess:null,checked:false}])),answer:null,checked:false,proofC:1,proofStart:1};}
export function boundComplete(s){return boundSizes.every(n=>s.trials[n].checked&&s.trials[n].guess===boundWinner(n))&&s.answer==='upper'&&s.checked;}
export function restoreBound(saved){if(!saved||!boundSizes.includes(saved.size)||!saved.trials||![null,'upper','equal'].includes(saved.answer)||typeof saved.checked!=='boolean'||saved.proofC!==undefined&&!boundProofOptions.includes(saved.proofC)||saved.proofStart!==undefined&&!boundProofOptions.includes(saved.proofStart))throw new RangeError('途中記録が不正です');const s=createBound();s.size=saved.size;s.answer=saved.answer;s.checked=saved.checked;s.proofC=saved.proofC??1;s.proofStart=saved.proofStart??1;for(const n of boundSizes){const t=saved.trials[n];if(!t||![null,'linear','pairs','same'].includes(t.guess)||typeof t.checked!=='boolean')throw new RangeError('予想が不正です');s.trials[n]={guess:t.guess,checked:t.checked};}return s;}
