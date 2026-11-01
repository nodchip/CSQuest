export const ellipticGardenLevel={id:'castle-elliptic-garden',number:'611',kind:'elliptic-garden',name:'十七の庭の楕円曲線',tag:'有限体の点加算と鍵交換',title:'曲線上の印を組み合わせよう',story:'王城の庭に十七の印で描かれた曲線があります。点を組み合わせ、二つの塔が同じ印にたどり着く仕組みを調べましょう。'};
const p=17,mod=n=>((n%p)+p)%p;
const inverse=n=>{const x=mod(n);for(let i=1;i<p;i++)if(mod(i*x)===1)return i;throw new RangeError('逆数がありません');};
export const curveGenerator={x:5,y:1};
export const pointId=q=>q===null?'O':`${q.x},${q.y}`;
export function curvePoints(){
 const points=[null];for(let x=0;x<p;x++)for(let y=0;y<p;y++)if(mod(y*y)===mod(x*x*x+2*x+2))points.push({x,y});return points;
}
export function addCurvePoints(a,b){
 if(a===null)return {point:b,kind:'identity',slope:null};
 if(b===null)return {point:a,kind:'identity',slope:null};
 if(a.x===b.x&&mod(a.y+b.y)===0)return {point:null,kind:'inverse',slope:null};
 const doubling=a.x===b.x&&a.y===b.y,numerator=doubling?3*a.x*a.x+2:b.y-a.y,denominator=doubling?2*a.y:b.x-a.x;
 const slope=mod(numerator*inverse(denominator)),x=mod(slope*slope-a.x-b.x),y=mod(slope*(a.x-x)-a.y);
 return {point:{x,y},kind:doubling?'doubling':'generic',slope};
}
export function curveMultiple(n,point=curveGenerator){
 if(!Number.isInteger(n)||n<0||n>361)throw new RangeError('回数が不正です');
 let result=null;for(let i=0;i<n;i++)result=addCurvePoints(result,point).point;return result;
}
export function curveExchange(a,b){
 if(!Number.isInteger(a)||!Number.isInteger(b)||a<1||a>18||b<1||b>18)throw new RangeError('秘密の回数が不正です');
 const publicA=curveMultiple(a),publicB=curveMultiple(b);
 return {publicA,publicB,sharedA:curveMultiple(a,publicB),sharedB:curveMultiple(b,publicA)};
}
export function createEllipticGarden(){return {m:1,n:1,additionGuess:null,discreteGuess:null,a:3,b:5,sharedGuess:null,observed:[],answer:null,checked:false};}
export function ellipticGardenComplete(s){return ['identity','inverse','doubling','generic','discrete','shared'].every(x=>s.observed.includes(x))&&s.answer==='small'&&s.checked;}
export function restoreEllipticGarden(s){
 const scalar=n=>Number.isInteger(n)&&n>=0&&n<19,secret=n=>Number.isInteger(n)&&n>=1&&n<19,ids=curvePoints().map(pointId);
 if(!s||!scalar(s.m)||!scalar(s.n)||!(s.additionGuess===null||ids.includes(s.additionGuess))||!(s.discreteGuess===null||secret(s.discreteGuess))||!secret(s.a)||!secret(s.b)||!(s.sharedGuess===null||ids.includes(s.sharedGuess))||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!['identity','inverse','doubling','generic','discrete','shared'].includes(k))||![null,'small','coordinates','public'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('保存データが不正です');
 return {...s,observed:[...s.observed]};
}
