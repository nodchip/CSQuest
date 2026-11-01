export const discreteDistributionsLevel={id:'crystal-discrete-distributions',number:'653',kind:'discrete-distributions',name:'四つの数え方',tag:'ベルヌーイ・二項・幾何・ポアソン分布',title:'精霊の数え方を見分けよう',story:'宝石工房には、札の成功や手紙の到着を数える四つの仕掛けがあります。何を数えるかと分布を比べ、精霊に合う名前を選びましょう。'};
export const discreteCases={
 single:{name:'一度の札',description:'公平な札を１回投げ、表なら１、裏なら０。',answers:['bernoulli','binomial'],mean:0.5,variance:0.25,support:'０または１'},
 batch:{name:'四度の札',description:'公平な札を独立に４回投げ、表が出た回数を数える。',answers:['binomial'],mean:2,variance:1,support:'０〜４'},
 wait:{name:'初めての表',description:'公平な札を独立に投げ、初めて表が出るまでの回数を数える。成功した回も含める。',answers:['geometric'],mean:2,variance:2,support:'１以上の整数'},
 arrivals:{name:'手紙の到着',description:'手紙は一定の発生率のポアソン過程に従うと仮定する。１刻の平均到着数が２のとき、１刻に来る手紙の数を調べる。',answers:['poisson'],mean:2,variance:2,support:'０以上の整数'}
};
export const discreteNames={bernoulli:'ベルヌーイ分布',binomial:'二項分布',geometric:'幾何分布',poisson:'ポアソン分布'};
export function discreteMass(id){
 if(!Object.hasOwn(discreteCases,id))throw new RangeError('仕掛けが不正です。');
 let values;if(id==='single')values=[0.5,0.5,0,0,0,0,0];else if(id==='batch')values=[1,4,6,4,1,0,0].map(n=>n/16);else if(id==='wait')values=Array.from({length:7},(_,k)=>k===0?0:2**(-k));else {values=[Math.exp(-2)];for(let k=1;k<=6;k++)values.push(values[k-1]*2/k);}
 const tail=id==='wait'?1/64:id==='arrivals'?Math.max(0,1-values.reduce((a,b)=>a+b,0)):0;return {values,tail};
}
export function discreteSample(id,bytes){
 if(!Object.hasOwn(discreteCases,id)||!(bytes instanceof Uint8Array)||bytes.length!==64)throw new RangeError('抽選が不正です。');
 if(id==='single')return bytes[0]&1;
 if(id==='batch')return [...bytes.slice(0,4)].reduce((a,b)=>a+(b&1),0);
 if(id==='wait'){const i=bytes.findIndex(v=>(v&1)===1);return i<0?65:i+1;}
 const number=((bytes[0]*256+bytes[1])*256+bytes[2])*256+bytes[3],u=(number+0.5)/4294967296;let p=Math.exp(-2),sum=p,k=0;while(u>=sum&&k<64){k++;p*=2/k;sum+=p;}return k;
}
export function discreteTrialCorrect(id,t){return Object.hasOwn(discreteCases,id)&&t.checked&&t.samples.length>0&&discreteCases[id].answers.includes(t.answer);}
export function createDiscreteDistributions(){return {selected:'single',trials:Object.fromEntries(Object.keys(discreteCases).map(k=>[k,{samples:[],answer:null,checked:false}])),compare:null,convention:null,checked:false};}
export function discreteDistributionsComplete(s){return Object.keys(discreteCases).every(k=>discreteTrialCorrect(k,s.trials[k]))&&s.compare==='different'&&s.convention==='include'&&s.checked;}
export function restoreDiscreteDistributions(s){
 if(!s||!Object.hasOwn(discreteCases,s.selected)||!s.trials||![null,'different','same','equal-zero'].includes(s.compare)||![null,'include','exclude','zero'].includes(s.convention)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 const trials={};for(const id of Object.keys(discreteCases)){const t=s.trials[id],valid=id==='single'?n=>n===0||n===1:id==='batch'?n=>Number.isInteger(n)&&n>=0&&n<=4:id==='wait'?n=>Number.isInteger(n)&&n>=1&&n<=65:n=>Number.isInteger(n)&&n>=0&&n<=64;if(!t||!Array.isArray(t.samples)||t.samples.length>10||t.samples.some(n=>!valid(n))||![null,...Object.keys(discreteNames)].includes(t.answer)||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です。');trials[id]={...t,samples:[...t.samples]};}return {...s,trials};
}
