export const parallelVectorLevel={id:'forge-vector-add',number:'1083',kind:'parallel-vector-add',name:'八人の精霊と六組の宝石',tag:'並列ベクトル加算',title:'宝石の列を並列に足す',story:'２列の宝石を同じ位置どうしで足します。２組の精霊に役割を割り当て、列の終わりも確かめましょう。'};
export const vectorLeft=[1,2,4,3,5,7];
export const vectorRight=[2,4,1,5,2,3];
export const vectorKeys=Array.from({length:2},(_,b)=>Array.from({length:4},(_,l)=>`${b}:${l}`)).flat();
export function vectorAssignment(block,lane){if(!Number.isInteger(block)||block<0||block>1||!Number.isInteger(lane)||lane<0||lane>3)throw new RangeError('精霊の番号が不正です');const index=block*4+lane;return {index,value:index<vectorLeft.length?vectorLeft[index]+vectorRight[index]:null};}
export function vectorCreate(){return {block:0,lane:0,index:null,answer:null,seen:[],reflection:null};}
export function vectorRestore(q){
 if(!q||!Number.isInteger(q.block)||q.block<0||q.block>1||!Number.isInteger(q.lane)||q.lane<0||q.lane>3||![null,0,1,2,3,4,5,6,7].includes(q.index)||![null,'3','5','6','7','8','10','skip'].includes(q.answer)||!Array.isArray(q.seen)||q.seen.length>8||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!vectorKeys.includes(k))||![null,'independent','ordered'].includes(q.reflection))throw new RangeError('途中記録が不正です');
 return {...q,seen:[...q.seen]};
}
export function vectorDone(q){return vectorKeys.every(k=>q.seen.includes(k))&&q.reflection==='independent';}
