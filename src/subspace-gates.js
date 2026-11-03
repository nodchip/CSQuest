export const subspaceLevel={id:'ruin-subspace-gates',number:'1067',kind:'subspace-gates',name:'閉じた光の道',tag:'部分空間と反例',title:'光の道は閉じている？',story:'遺跡の４つの門は、光の矢印が作る集合を調べています。矢印を組み合わせ、門が部分空間か確かめましょう。'};
export const subspaceCases=[
 {name:'斜めの道',rule:'縦と横の値が等しい矢印',answer:'closed',proof:'任意の実数 a、b、c について (a,a) と (b,b) の和は (a+b,a+b)、c 倍は (ca,ca) です。原点も含むため、すべての実数について条件を満たします。'},
 {name:'ずれた道',rule:'縦の値が横の値より１大きい矢印',answer:'zero',proof:'原点 (0,0) は縦が横より１大きいという条件を満たしません。原点がないので部分空間ではありません。'},
 {name:'北東の広場',rule:'横と縦の値がどちらも０以上の矢印',answer:'scale',proof:'例えば (1,0) は広場にありますが、−1 倍の (−1,0) は広場の外です。実数倍に閉じていません。'},
 {name:'十字の道',rule:'横か縦の値の少なくとも一方が０の矢印',answer:'sum',proof:'(1,0) と (0,1) は道にありますが、和の (1,1) は道の外です。加算に閉じていません。'}
];
export function subspaceMember(index,[x,y]){if(!Number.isInteger(index)||index<0||index>=subspaceCases.length||![x,y].every(Number.isFinite))throw new RangeError('矢印が不正です。');return [()=>y===x,()=>y===x+1,()=>x>=0&&y>=0,()=>x===0||y===0][index]();}
export function subspaceObserve(index,p,q,k){const sum=[p[0]+q[0],p[1]+q[1]],scaled=[k*p[0],k*p[1]];return {zero:subspaceMember(index,[0,0]),p:subspaceMember(index,p),q:subspaceMember(index,q),sum:subspaceMember(index,sum),scaled:subspaceMember(index,scaled),sumVector:sum,scaledVector:scaled};}
export function subspaceEvidence(index,p,q,k,answer){const r=subspaceObserve(index,p,q,k);if(answer!==subspaceCases[index].answer)return false;if(answer==='zero')return !r.zero&&r.p;if(answer==='scale')return r.p&&!r.scaled;if(answer==='sum')return r.p&&r.q&&!r.sum;return r.p&&r.q&&(p[0]!==0||p[1]!==0)&&(q[0]!==0||q[1]!==0)&&r.sum&&r.scaled;}
export function subspaceCreate(){return {current:0,p:[0,0],q:[0,0],k:1,answers:[null,null,null,null],seen:[false,false,false,false],reflection:null};}
export function subspaceDone(q){return q.seen.every(Boolean)&&q.reflection==='proof';}
export function subspaceRestore(q){
 const validVector=v=>Array.isArray(v)&&v.length===2&&v.every(x=>Number.isInteger(x)&&x>=-1&&x<=1);
 if(!q||!Number.isInteger(q.current)||q.current<0||q.current>=4||!validVector(q.p)||!validVector(q.q)||![-1,0,1].includes(q.k)||!Array.isArray(q.answers)||q.answers.length!==4||q.answers.some(x=>![null,'closed','zero','sum','scale'].includes(x))||!Array.isArray(q.seen)||q.seen.length!==4||q.seen.some((x,i)=>typeof x!=='boolean'||(x&&q.answers[i]!==subspaceCases[i].answer))||![null,'proof','examples'].includes(q.reflection))throw new RangeError('記録が不正です。');
 return {...q,p:[...q.p],q:[...q.q],answers:[...q.answers],seen:[...q.seen]};
}
