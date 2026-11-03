export const vectorAngleLevel={id:'ruin-vector-angle-lab',number:'1069',kind:'vector-angle-lab',name:'二本の光と角度',tag:'ベクトルの演算と角度',title:'光の矢印を動かそう',story:'遺跡の２つの光源を動かし、矢印の和と向きの関係を調べましょう。角度が決まらない場合もあるようです。'};
export const angleMarkers=['same','acute','right','obtuse','opposite','zero'];
export function vectorAngle(a,b,k){
 if(!Array.isArray(a)||!Array.isArray(b)||a.length!==2||b.length!==2||![...a,...b,k].every(Number.isFinite))throw new RangeError('ベクトルの値が不正です。');
 const clean=x=>x===0?0:x;
 const dot=a[0]*b[0]+a[1]*b[1],cross=a[0]*b[1]-a[1]*b[0],lengthA=Math.hypot(...a),lengthB=Math.hypot(...b),sum=[a[0]+b[0],a[1]+b[1]],scaledSum=sum.map(x=>clean(k*x)),parts=[clean(k*a[0]+k*b[0]),clean(k*a[1]+k*b[1])];
 const type=!lengthA||!lengthB?'zero':cross===0?(dot>0?'same':'opposite'):dot===0?'right':dot>0?'acute':'obtuse';
 const angle=type==='zero'?null:Math.atan2(Math.abs(cross),dot)*180/Math.PI;
 return {dot,cross,lengthA,lengthB,sum,scaledSum,parts,type,angle};
}
export function vectorAngleCreate(){return {a:[1,0],b:[0,1],k:1,guess:null,seen:[],reflection:null};}
export function vectorAngleDone(q){return angleMarkers.every(x=>q.seen.includes(x))&&q.reflection==='undefined';}
export function vectorAngleRestore(q){
 const valid=v=>Array.isArray(v)&&v.length===2&&v.every(x=>Number.isInteger(x)&&x>=-2&&x<=2);
 if(!q||!valid(q.a)||!valid(q.b)||![-2,-1,0,1,2].includes(q.k)||![null,...angleMarkers].includes(q.guess)||!Array.isArray(q.seen)||q.seen.length>angleMarkers.length||new Set(q.seen).size!==q.seen.length||q.seen.some(x=>!angleMarkers.includes(x))||![null,'undefined','right'].includes(q.reflection))throw new RangeError('途中記録が不正です。');
 return {...q,a:[...q.a],b:[...q.b],seen:[...q.seen]};
}
