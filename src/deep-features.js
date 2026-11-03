export const deepFeatureLevel={id:'archive-deep-features',number:'1020',kind:'deep-features',name:'二層の鑑定鏡',tag:'深層ネットワークの特徴',title:'鏡が覚えた見分け方',story:'書庫の二段の魔法鏡が、二つの印から紋章を見分けます。訓練の前後で鏡の反応がどう変わるか調べましょう。'};
export const deepInputs=[[0,0],[0,1],[1,0],[1,1]];
export const deepLabels=[0,1,1,0];
export const deepInitial=[-0.527088949456811,-0.2614586525596678,0.008484064601361752,0.40976652735844254,-0.8989127427339554,-0.2609632913954556,0.5495259249582887,0.11237714113667607,-0.9670135285705328,0.27849207958206534,-0.4990977169945836,-0.15524446358904243,0.18138039484620094,0.6738673183135688,-0.5298481611534953];
const sigmoid=x=>1/(1+Math.exp(-x));
export function deepForward(p,input){
 if(!Array.isArray(p)||p.length!==15||p.some(x=>!Number.isFinite(x))||!Array.isArray(input)||input.length!==2||input.some(x=>!Number.isFinite(x)))throw new RangeError('入力が不正です。');
 const [x,y]=input,first=[Math.tanh(p[0]*x+p[1]*y+p[2]),Math.tanh(p[3]*x+p[4]*y+p[5])];
 const second=[Math.tanh(p[6]*first[0]+p[7]*first[1]+p[8]),Math.tanh(p[9]*first[0]+p[10]*first[1]+p[11])];
 const logit=p[12]*second[0]+p[13]*second[1]+p[14];return {first,second,output:sigmoid(logit),logit};
}
export function deepMetrics(p){
 let loss=0;const grad=Array(15).fill(0),rows=deepInputs.map((input,i)=>{const r=deepForward(p,input),target=deepLabels[i],delta=r.output-target;
 loss+=(Math.max(r.logit,0)+Math.log1p(Math.exp(-Math.abs(r.logit)))-target*r.logit)/4;
 grad[12]+=delta*r.second[0]/4;grad[13]+=delta*r.second[1]/4;grad[14]+=delta/4;
 const d2=[delta*p[12]*(1-r.second[0]**2),delta*p[13]*(1-r.second[1]**2)];
 for(let j=0;j<2;j++){const k=6+3*j;grad[k]+=d2[j]*r.first[0]/4;grad[k+1]+=d2[j]*r.first[1]/4;grad[k+2]+=d2[j]/4;}
 const d1=[(d2[0]*p[6]+d2[1]*p[9])*(1-r.first[0]**2),(d2[0]*p[7]+d2[1]*p[10])*(1-r.first[1]**2)];
 for(let j=0;j<2;j++){const k=3*j;grad[k]+=d1[j]*input[0]/4;grad[k+1]+=d1[j]*input[1]/4;grad[k+2]+=d1[j]/4;}
 return {...r,input,target};});return {loss,grad,rows};
}
export function deepTrain(steps){if(![0,100,1000,2000].includes(steps))throw new RangeError('訓練回数が不正です。');let p=[...deepInitial];for(let i=0;i<steps;i++){const g=deepMetrics(p).grad;p=p.map((v,j)=>v-g[j]);}return p;}
export const deepGridValues=[0,0.25,0.5,0.75,1];
export function deepProbe(p,xIndex,yIndex){if(!Number.isInteger(xIndex)||!Number.isInteger(yIndex)||xIndex<0||xIndex>=deepGridValues.length||yIndex<0||yIndex>=deepGridValues.length)throw new RangeError('試す入力が不正です。');return deepForward(p,[deepGridValues[xIndex],deepGridValues[yIndex]]);}
export function deepCreate(){return {step:0,layer:'first',seen:[],reflection:null,probe:[2,2]};}
export function deepInspect(q){const k=`${q.step}:${q.layer}`;if(![0,100,1000,2000].includes(q.step)||!['first','second'].includes(q.layer))throw new RangeError('条件が不正です。');if(!q.seen.includes(k))q.seen.push(k);}
export function deepComplete(q){return [0,1000,2000].every(n=>['first','second'].every(layer=>q.seen.includes(`${n}:${layer}`)))&&q.reflection==='limited';}
export function deepRestore(q){const valid=k=>/^(0|100|1000|2000):(first|second)$/.test(k),probe=q?.probe===undefined?[2,2]:q.probe;if(!q||![0,100,1000,2000].includes(q.step)||!['first','second'].includes(q.layer)||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>typeof k!=='string'||!valid(k))||![null,'limited','guarantee','same'].includes(q.reflection)||!Array.isArray(probe)||probe.length!==2||probe.some(n=>!Number.isInteger(n)||n<0||n>=deepGridValues.length))throw new RangeError('途中記録が不正です。');return {...q,seen:[...q.seen],probe:[...probe]};}
