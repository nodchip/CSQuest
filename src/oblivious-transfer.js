export const otLevel={id:'castle-oblivious-transfer',number:'989',kind:'oblivious-transfer',name:'二つの封書と見えない選択',tag:'暗号・秘匿転送',title:'封書を一つ選ぼう',story:'記録係は二つの封書を持ち、旅人はどちらか一方を読みたいと考えています。選択を伝えずに受け取る手順を試しましょう。'};
export const otN=55,otE=3,otD=27,otX=[1,2],otMessages=[12,34],otKeys=[3,7,12];
export function otPow(a,e){let out=1;for(let i=0;i<e;i++)out=out*a%otN;return out;}
export function otValues(b,k){
 if(![0,1].includes(b)||!Number.isInteger(k)||k<0||k>=otN)throw new RangeError('不正な選択');
 const request=(otX[b]+otPow(k,otE))%otN;
 const masks=otX.map(x=>otPow((request-x+otN)%otN,otD));
 const sealed=otMessages.map((m,i)=>(m+masks[i])%otN);
 return {request,masks,sealed,received:(sealed[b]-k+otN)%otN};
}
export function otBruteOther(b,request,sealed){const other=1-b,target=(request-otX[other]+otN)%otN;const key=Array.from({length:otN},(_,i)=>i).find(i=>otPow(i,otE)===target);return {key,message:(sealed[other]-key+otN)%otN};}
export function otRequestCounts(request){return [0,1].map(b=>Array.from({length:otN},(_,k)=>k).filter(k=>otValues(b,k).request===request).length);}
export function otCreate(){return {selected:0,trials:[{key:null,stage:0},{key:null,stage:0}],reflection:null};}
export function otComplete(s){return s.trials.every(t=>t.stage===4)&&s.reflection==='toy';}
export function otRestore(saved){if(!saved||![0,1].includes(saved.selected)||!Array.isArray(saved.trials)||saved.trials.length!==2||![null,'toy','secure','learns'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const trials=saved.trials.map(t=>{if(!t||!(t.key===null||otKeys.includes(t.key))||!Number.isInteger(t.stage)||t.stage<0||t.stage>4||(t.stage>0&&t.key===null))throw new RangeError('途中記録が不正です');return {key:t.key,stage:t.stage};});return {selected:saved.selected,trials,reflection:saved.reflection};}
