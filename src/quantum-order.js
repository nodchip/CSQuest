export const quantumOrderLevel={id:'castle-quantum-order',number:'610',kind:'quantum-order',name:'周期の鏡と十五の封印',tag:'量子周期探索と因数分解',title:'周期の手がかりから封印を解こう',story:'十五の封印に周期の鏡を当てます。鏡の手がかりを確かめ、因数を探しましょう。'};
export const orderBases=[2,4,7,8,11,13,14];
const gcd=(a,b)=>{while(b)[a,b]=[b,a%b];return a;};
export function modularPower(a,n){let x=1;for(let i=0;i<n;i++)x=x*a%15;return x;}
export function orderExperiment(a){
 if(!orderBases.includes(a))throw new RangeError('印が不正です');
 const powers=Array.from({length:16},(_,i)=>modularPower(a,i));
 const order=powers.findIndex((v,i)=>i>0&&v===1);
 if(order<1||16%order!==0)throw new RangeError('この模型で扱えない周期です');
 return {powers,order,outcomes:Array.from({length:order},(_,i)=>i*16/order)};
}
export function orderSample(a,y){
 const {order,outcomes}=orderExperiment(a);
 if(!outcomes.includes(y))throw new RangeError('起こらない測定結果です');
 const denominator=16/gcd(y,16),power=modularPower(a,denominator),verified=power===1;
 let midpoint=null,factors=null;
 if(verified&&denominator%2===0){midpoint=modularPower(a,denominator/2);factors=[gcd(midpoint-1,15),gcd(midpoint+1,15)];}
 const nontrivial=factors!==null&&factors.every(x=>x>1&&x<15);
 return {order,denominator,power,verified,midpoint,factors,nontrivial};
}
export function createQuantumOrder(){return {base:2,outcome:null,guess:null,observed:[],answer:null,checked:false};}
export function quantumOrderComplete(s){return ['zero','partial','trivial','factors'].every(x=>s.observed.includes(x))&&s.answer==='quantum'&&s.checked;}
export function restoreQuantumOrder(s){
 if(!s||!orderBases.includes(s.base)||!(s.outcome===null||orderExperiment(s.base).outcomes.includes(s.outcome))||![null,1,2,4].includes(s.guess)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(x=>!['zero','partial','trivial','factors'].includes(x))||![null,'quantum','current','all'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('保存データが不正です');
 return {...s,observed:[...s.observed]};
}
