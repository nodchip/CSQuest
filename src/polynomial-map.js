export const polynomialMapLevel={id:'archive-polynomial-map',number:'1071',kind:'polynomial-map',name:'二乗の光を予測する',tag:'多項式回帰と事前分布',title:'二乗の曲線を記録に合わせる',story:'鑑定士は光源からの距離と水晶の明るさを記録しました。二乗の特徴を使う曲線を合わせ、事前の見通しの強さと別の記録を比べましょう。'};
export const polynomialSamples={noisy:{name:'ばらつきのある手本',train:[[-2,6],[-1,1],[0,0],[1,1],[2,6]],test:[[-3,10],[3,10]]},clean:{name:'二乗に沿う手本',train:[[-2,5],[-1,2],[0,1],[1,2],[2,5]],test:[[-3,10],[3,10]]}};
export const polynomialLambdas=[0,4,8,20];
export const polynomialRequirements=['noisy:0','noisy:4','noisy:8','noisy:20','clean:0','clean:8'];
export function polynomialFit(id,lambda){
 if(!Object.hasOwn(polynomialSamples,id)||!polynomialLambdas.includes(lambda))throw new RangeError('条件が不正です。');
 const {train,test}=polynomialSamples[id],n=train.length,z=train.map(([x])=>x*x),ys=train.map(([,y])=>y),meanZ=z.reduce((a,b)=>a+b,0)/n,meanY=ys.reduce((a,b)=>a+b,0)/n;
 const denominator=z.reduce((sum,t)=>sum+(t-meanZ)**2,0)+lambda,numerator=z.reduce((sum,t,i)=>sum+(t-meanZ)*(ys[i]-meanY),0),b=numerator/denominator,a=meanY-b*meanZ,predict=x=>a+b*x*x;
 const error=points=>points.reduce((sum,[x,y])=>sum+(y-predict(x))**2,0),trainError=error(train),testError=error(test),penalty=lambda*b*b;
 return {a,b,trainError,testError,penalty,objective:trainError+penalty,predictions:test.map(([x,y])=>({x,y,prediction:predict(x)}))};
}
export function polynomialCreate(){return {sample:'noisy',lambda:0,fitted:false,seen:[],reflection:null,prior:null};}
export function polynomialDone(q){return polynomialRequirements.every(x=>q.seen.includes(x))&&q.reflection==='context'&&q.prior==='coefficient';}
export function polynomialRestore(q){
 if(!q||!Object.hasOwn(polynomialSamples,q.sample)||!polynomialLambdas.includes(q.lambda)||typeof q.fitted!=='boolean'||!Array.isArray(q.seen)||q.seen.length>8||new Set(q.seen).size!==q.seen.length||q.seen.some(x=>typeof x!=='string'||!/^(noisy|clean):(0|4|8|20)$/.test(x))||![null,'context','always'].includes(q.reflection)||![null,'coefficient','intercept'].includes(q.prior))throw new RangeError('記録が不正です。');
 return {...q,seen:[...q.seen]};
}
