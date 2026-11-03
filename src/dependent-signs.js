export const dependentSignsLevel={id:'archive-dependent-signs',number:'1028',kind:'dependent-signs',name:'組になった二つの印',tag:'条件付き依存と特徴の積',title:'二つの印を一緒に見る',story:'鑑定士は二つの印が組になって現れる水晶を調べています。別々に数える鑑定法と、印の組も使う鑑定法を比べましょう。'};
export const dependentModels={naive:'ナイーブベイズ',linear:'印だけの線形スコア',cross:'印の積を加えたスコア'};
export function dependentResult(model,x,y){
 if(!Object.hasOwn(dependentModels,model)||![0,1].includes(x)||![0,1].includes(y))throw new RangeError('条件が不正です。');
 const actual=x!==y?'red':'blue',score=model==='naive'?0:-1+2*x+2*y-(model==='cross'?4*x*y:0),probability=1/(1+Math.exp(-score)),decision=score>0?'red':score<0?'blue':'tie';return {actual,score,probability,decision};
}
export function dependentCreate(){return {model:'naive',x:0,y:0,guess:null,seen:[],independence:null,feature:null};}
export function dependentCheck(q){if(!['red','blue','tie'].includes(q.guess))throw new RangeError('予測を選びましょう。');const result=dependentResult(q.model,q.x,q.y),ok=q.guess===result.decision,key=`${q.model}:${q.x}${q.y}`;if(ok&&!q.seen.includes(key))q.seen.push(key);return {...result,ok};}
export function dependentComplete(q){return Object.keys(dependentModels).every(m=>[0,1].every(x=>[0,1].every(y=>q.seen.includes(`${m}:${x}${y}`))))&&q.independence==='given-class'&&q.feature==='interaction';}
export function dependentRestore(q){const keys=Object.keys(dependentModels).flatMap(m=>[0,1].flatMap(x=>[0,1].map(y=>`${m}:${x}${y}`)));if(!q||!Object.hasOwn(dependentModels,q.model)||![0,1].includes(q.x)||![0,1].includes(q.y)||![null,'red','blue','tie'].includes(q.guess)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!keys.includes(k))||![null,'given-class','always-independent','no-data'].includes(q.independence)||![null,'interaction','guaranteed','no-effect'].includes(q.feature))throw new RangeError('途中記録が不正です。');return {...q,seen:[...q.seen]};}
