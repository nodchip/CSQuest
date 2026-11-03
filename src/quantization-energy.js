export const quantEnergyLevel={id:'forge-quantization-energy',number:'1084',kind:'quantization-energy',name:'小さな札と丸めの代償',tag:'８ビット量子化と費用',title:'水晶の値を小さな札に写す',story:'工房は32ビットの値を８ビットの札に写して運びます。精度と運搬・変換の費用を比べましょう。'};
export const quantScales={'half':0.5,'one':1};
export const quantInputs=[-70,-0.8,1.2,70,-0.25,0.25];
export const quantOptions=[-128,-70,-2,-1,0,1,2,70,127];
export const quantKeys=Object.keys(quantScales).flatMap(s=>quantInputs.map((_,i)=>`${s}:${i}`));
export function quantEvaluate(scale,index){
 if(!Object.hasOwn(quantScales,scale)||!Number.isInteger(index)||index<0||index>=quantInputs.length)throw new RangeError('量子化の条件が不正です');
 const x=quantInputs[index],step=quantScales[scale],v=x/step,rounded=Math.sign(v)*Math.floor(Math.abs(v)+0.5)||0,encoded=Math.max(-128,Math.min(127,rounded)),reconstructed=encoded*step;
 return {rounded,encoded,reconstructed,error:Math.abs(reconstructed-x),clipped:encoded!==rounded};
}
export function quantEnergy(overhead){if(![1,4].includes(overhead))throw new RangeError('費用が不正です');return {fp32:4,int8:1+overhead};}
export function quantCreate(){return {scale:'half',index:0,guess:null,seen:[],overhead:1,energyGuess:null,energySeen:[],clip:null,limits:null};}
export function quantRestore(q){
 if(!q||!Object.hasOwn(quantScales,q.scale)||!Number.isInteger(q.index)||q.index<0||q.index>=quantInputs.length||![null,...quantOptions].includes(q.guess)||!Array.isArray(q.seen)||q.seen.length>quantKeys.length||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!quantKeys.includes(k))||![1,4].includes(q.overhead)||![null,'int8','fp32'].includes(q.energyGuess)||!Array.isArray(q.energySeen)||q.energySeen.length>2||new Set(q.energySeen).size!==q.energySeen.length||q.energySeen.some(x=>![1,4].includes(x))||![null,'range','exact'].includes(q.clip)||![null,'measure','guarantee'].includes(q.limits))throw new RangeError('途中記録が不正です');
 return {...q,seen:[...q.seen],energySeen:[...q.energySeen]};
}
export function quantDone(q){return quantKeys.every(k=>q.seen.includes(k))&&[1,4].every(x=>q.energySeen.includes(x))&&q.clip==='range'&&q.limits==='measure';}
