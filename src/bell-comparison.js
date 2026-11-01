export const bellComparisonLevel={id:'workshop-bell-comparison',number:'676',kind:'bell-comparison',name:'離れた二つの水晶',tag:'量子・もつれ・測定',title:'二つの水晶のつながりを調べよう',story:'離れた水晶 A と B の記録は、同じ色ばかりです。ふたつの作り方を別の見方でも調べ、相関の違いと B に届く情報を確かめましょう。'};

// States are density matrices in the order 00, 01, 10, 11.  Both preparations
// have identical Z-basis distributions; only the Bell state has coherence.
export function bellDistribution(preparation,flip,basis){
 if(!['bell','mixture'].includes(preparation)||typeof flip!=='boolean'||!['Z','X'].includes(basis))throw new RangeError('実験条件が不正です。');
 let rho=Array.from({length:4},()=>Array(4).fill(0));
 rho[0][0]=rho[3][3]=0.5;
 if(preparation==='bell')rho[0][3]=rho[3][0]=0.5;
 if(flip)rho=rho.map((_,i)=>rho[i^2].map((_,j)=>rho[i^2][j^2]));
 const h=[[1,1],[1,-1]].map(row=>row.map(x=>x/Math.sqrt(2)));
 const rotation=basis==='Z'?Array.from({length:4},(_,i)=>Array.from({length:4},(_,j)=>+(i===j))):Array.from({length:4},(_,i)=>Array.from({length:4},(_,j)=>h[i>>1][j>>1]*h[i&1][j&1]));
 const probabilities=rotation.map(row=>row.reduce((sum,x,i)=>sum+row.reduce((inner,y,j)=>inner+x*rho[i][j]*y,0),0));
 return {joint:probabilities,marginalB:[probabilities[0]+probabilities[2],probabilities[1]+probabilities[3]]};
}
export function createBellComparison(){return {preparation:'bell',flip:false,basis:'Z',seen:[],report:null,answer:null,checked:false,history:[]};}
export function bellComparisonAct(s,action){
 if(!s||!Array.isArray(s.history)||s.history.length>=100)return {ok:false,message:'操作記録がいっぱいです。最初からやり直してください。'};
 const n={...s,seen:[...s.seen],history:[...s.history],checked:false};let message='';
 if(action==='prep:bell'||action==='prep:mixture'){n.preparation=action.slice(5);message='水晶の作り方を選びました。';}
 else if(action==='flip'){n.flip=!s.flip;message='A 側の反転操作を切り替えました。';}
 else if(action==='basis:Z'||action==='basis:X'){n.basis=action.slice(6);message='二つの水晶の見方を選びました。';}
 else if(action==='observe'){
  n.report={...bellDistribution(s.preparation,s.flip,s.basis),preparation:s.preparation,flip:s.flip,basis:s.basis};
  const key=`${s.preparation}:${s.flip?'flip':'same'}:${s.basis}`;if(!n.seen.includes(key))n.seen.push(key);
  message='二つの結果の組と、B だけの割合を記録しました。';
 }
 else if(['answer:coherence','answer:identical','answer:signal'].includes(action)){n.answer=action.slice(7);message='振り返りの答えを選びました。';}
 else if(action==='check'){n.checked=true;message='観察記録と答えを確認しました。';}
 else return {ok:false,message:'操作を確認しましょう。'};
 n.history.push(action);return {ok:true,state:n,message};
}
export function restoreBellComparison(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>100)throw new RangeError('途中記録が不正です。');let s=createBellComparison();for(const a of saved.history){if(typeof a!=='string')throw new RangeError('途中記録が不正です。');const r=bellComparisonAct(s,a);if(!r.ok)throw new RangeError('途中記録が不正です。');s=r.state;}return s;}
export function bellComparisonComplete(s){return ['bell:same:Z','bell:same:X','mixture:same:Z','mixture:same:X','bell:flip:Z','bell:flip:X'].every(k=>s.seen.includes(k))&&s.answer==='coherence'&&s.checked;}
