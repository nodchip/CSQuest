export const naiveLinearLevel={id:'archive-naive-linear',number:'1027',kind:'naive-linear',name:'二つの印と鑑定式',tag:'ナイーブベイズと線形模型',title:'二つの道で鑑定する',story:'鑑定士は二つの印から水晶の種類を推測します。条件ごとの記録を掛け合わせる道と、点数を足す道を比べましょう。'};
export const naivePriors={equal:{name:'赤と青が同数',negativeFactor:1},rare:{name:'赤が４分の１',negativeFactor:3}};
export const naiveAnswers=['1/28','1/10','1/4','1/2','3/4','9/10'];
const gcd=(a,b)=>b?gcd(b,a%b):a;
export function naiveLinearResult(prior,x,y){
 if(!Object.hasOwn(naivePriors,prior)||![0,1].includes(x)||![0,1].includes(y))throw new RangeError('条件が不正です。');
 const positive=(x?3:1)*(y?3:1),negative=(x?1:3)*(y?1:3)*naivePriors[prior].negativeFactor,total=positive+negative,d=gcd(positive,total),power=2*(x+y)-(prior==='equal'?2:3),odds=3**power;
 return {positive,negative,fraction:`${positive/d}/${total/d}`,probability:positive/total,power,logOdds:power*Math.log(3),linearProbability:odds/(1+odds)};
}
export function naiveLinearCreate(){return {prior:'equal',x:0,y:0,guess:null,seen:[],relation:null,assumption:null};}
export function naiveLinearCheck(q){if(!naiveAnswers.includes(q.guess))throw new RangeError('確率を選びましょう。');const result=naiveLinearResult(q.prior,q.x,q.y),ok=q.guess===result.fraction,key=`${q.prior}:${q.x}${q.y}`;if(ok&&!q.seen.includes(key))q.seen.push(key);return {...result,ok};}
export function naiveLinearComplete(q){return Object.keys(naivePriors).every(p=>[0,1].every(x=>[0,1].every(y=>q.seen.includes(`${p}:${x}${y}`))))&&q.relation==='log-odds'&&q.assumption==='conditional';}
export function naiveLinearRestore(q){const keys=Object.keys(naivePriors).flatMap(p=>[0,1].flatMap(x=>[0,1].map(y=>`${p}:${x}${y}`)));if(!q||!Object.hasOwn(naivePriors,q.prior)||![0,1].includes(q.x)||![0,1].includes(q.y)||!(q.guess===null||naiveAnswers.includes(q.guess))||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!keys.includes(k))||![null,'log-odds','same-training','linear-probability'].includes(q.relation)||![null,'conditional','marginal','always'].includes(q.assumption))throw new RangeError('途中記録が不正です。');return {...q,seen:[...q.seen]};}
