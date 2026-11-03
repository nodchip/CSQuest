import {majorityColumns} from './memory-majority.js';
export const maskRelayLevel={id:'forest-mask-relay',number:'1024',kind:'mask-relay',name:'二つの塔と灯りの門',tag:'記憶内演算とバス',title:'紋章を作り門へ届ける',story:'遺跡と森の知らせを合わせ、通行を許された場所だけを灯して門へ届けます。塔の中の演算と、門への伝達をつなぎましょう。'};
export const maskRows={A:[1,0,1,0],B:[1,1,0,0],C:[0,1,1,0],U:[1,1,1,0]};
export const maskRowNames={A:'遺跡 A',B:'森 B',C:'許可 C',U:'統合 U'};
export function maskRelayCreate(){return {stage:0,passed:[],left:'A',right:'B',constant:0,bus:'address',reflection:null};}
const available=stage=>stage===0?['A','B','C']:['A','B','C','U'];
export function maskRelayApply(q){
 if(![0,1].includes(q.stage)||!available(q.stage).includes(q.left)||!available(q.stage).includes(q.right)||![0,1].includes(q.constant))throw new RangeError('操作が不正です。');
 const result=majorityColumns(maskRows[q.left],maskRows[q.right],Array(4).fill(q.constant)),pair=[q.left,q.right].sort().join(':'),expected=q.stage===0?'A:B':'C:U',constant=q.stage===0?1:0;
 if(pair!==expected||q.constant!==constant)return {ok:false,result,message:'この結果では依頼の２枚と操作を満たしません。使う札と定数を見直しましょう。'};
 if(q.stage===0){q.passed.push(0);q.stage=1;q.left='U';q.right='C';q.constant=1;return {ok:true,result,message:'遺跡と森を合わせた U を作りました。次は許可 C を重ねます。'};}
 q.passed.push(1);q.stage=2;return {ok:true,result,message:'許可された灯り 0 1 1 0 ができました。門へ届けましょう。'};
}
export function maskRelaySend(q){if(q.stage!==2||!['address','data','control'].includes(q.bus))throw new RangeError('操作が不正です。');if(q.bus!=='data')return {ok:false,message:'門へ送るのは番地や操作の合図ではなく、作った札の内容です。'};q.passed.push(2);q.stage=3;return {ok:true,message:'札の内容が門へ届き、灯りがともりました。'};}
export function maskRelayComplete(q){return q.stage===3&&q.reflection==='result';}
export function maskRelayRestore(q){if(!q||![0,1,2,3].includes(q.stage)||!Array.isArray(q.passed)||q.passed.length!==q.stage||q.passed.some((v,i)=>v!==i)||!available(q.stage).includes(q.left)||!available(q.stage).includes(q.right)||![0,1].includes(q.constant)||!['address','data','control'].includes(q.bus)||![null,'result','constant','address'].includes(q.reflection))throw new RangeError('遠征記録が不正です。');return {...q,passed:[...q.passed]};}
