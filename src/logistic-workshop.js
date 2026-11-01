export const logisticWorkshopLevel={id:'archive-logistic-workshop',number:'707',kind:'logistic-workshop',name:'確率を学ぶ鑑定の水晶',tag:'ロジスティック回帰',title:'水晶の見込みを更新しよう',story:'精霊は水晶の特徴から、赤い種類である見込みを予測します。手本の誤差を使って係数を更新し、規則の複雑さも比べましょう。'};
export const logisticWorkshopData={ordered:[[-2,0],[-1,0],[1,1],[2,1]],mixed:[[-2,0],[-1,1],[1,0],[2,1]]};
export function logisticWorkshopMetrics(data,lambda,w,b){
 if(!Object.hasOwn(logisticWorkshopData,data)||![0,.2].includes(lambda)||![w,b].every(Number.isFinite))throw new RangeError('設定が不正です。');
 const rows=logisticWorkshopData[data].map(([x,y])=>{const z=w*x+b,p=1/(1+Math.exp(-z));return {x,y,p};});
 const logLoss=rows.reduce((a,r)=>a-Math.log(r.y?r.p:1-r.p),0)/rows.length,penalty=lambda*w*w/2;
 const dw=rows.reduce((a,r)=>a+(r.p-r.y)*r.x,0)/rows.length+lambda*w,db=rows.reduce((a,r)=>a+r.p-r.y,0)/rows.length;
 return {rows,logLoss,penalty,objective:logLoss+penalty,dw,db};
}
export function logisticWorkshopTrace(data,lambda,steps){
 if(!Number.isInteger(steps)||steps<0||steps>6)throw new RangeError('更新回数が不正です。');
 let w=0,b=0;const history=[];for(let i=0;i<=steps;i++){const m=logisticWorkshopMetrics(data,lambda,w,b);history.push({step:i,w,b,...m});w-=.5*m.dw;b-=.5*m.db;}return history;
}
export function createLogisticWorkshop(){return {data:'ordered',lambda:0,steps:{'ordered,0':0,'ordered,0.2':0,'mixed,0':0,'mixed,0.2':0},answer:null,checked:false};}
export function logisticWorkshopComplete(s){return s.checked&&Object.values(s.steps).every(n=>n===6)&&s.answer==='limited';}
export function restoreLogisticWorkshop(s){const keys=['ordered,0','ordered,0.2','mixed,0','mixed,0.2'];if(!s||!Object.hasOwn(logisticWorkshopData,s.data)||![0,.2].includes(s.lambda)||!s.steps||Object.keys(s.steps).length!==4||keys.some(k=>!Number.isInteger(s.steps[k])||s.steps[k]<0||s.steps[k]>6)||![null,'limited','guarantee','linear'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,steps:{...s.steps}};}
