export const dependentVectorLevel={id:'workshop-dependent-vectors',number:'769',kind:'dependent-vectors',name:'長さを刻む石箱',tag:'依存型と長さ付きの列',title:'石の数に合わせて箱を作ろう',story:'工房の箱には、入る石の数が型の印として刻まれています。箱をつなぎ、数を添えて届け、範囲を守って石を取り出しましょう。'};
export const vectorStones={moon:'月',star:'星'};
export const vectorFlags=['rep0','rep2','rep3','packMismatch','packEmpty','packFilled','opened','appendEmpty','appendBoth','indexValid','indexInvalid'];
const validItems=x=>Array.isArray(x)&&x.length<=3&&x.every(v=>Object.hasOwn(vectorStones,v));
const pick=(x,low,high)=>Number.isInteger(x)&&x>=low&&x<=high;
export function vectorCreate(){return {left:[],right:[],count:0,stone:'moon',resultLength:null,witness:null,index:null,repLength:null,pack:null,flags:[],answer:'',checked:false};}
export function vectorAdd(s,side,stone){if(!['left','right'].includes(side)||!Object.hasOwn(vectorStones,stone)||s[side].length>=3)return false;s[side].push(stone);return true;}
export function vectorRemove(s,side){if(!['left','right'].includes(side)||!s[side].length)return false;s[side].pop();return true;}
const mark=(s,id)=>{if(!s.flags.includes(id))s.flags.push(id);};
export function vectorReplicate(s){if(!pick(s.count,0,3)||!Object.hasOwn(vectorStones,s.stone)||!pick(s.repLength,0,3))return {ok:false,message:'石の個数と、できる列の長さの印を選びましょう。'};const result=Array(s.count).fill(s.stone);if(s.repLength!==result.length)return {ok:false,message:`石は ${result.length} 個です。列の型の長さの印を確かめましょう。`};if([0,2,3].includes(s.count))mark(s,`rep${s.count}`);return {ok:true,items:result,message:`${s.count} 個の列を作りました。選んだ数に応じて、結果の型の長さも ${s.count} です。`};}
export function vectorPackage(s){if(!pick(s.witness,0,3))return {ok:false,message:'箱に添える長さの数を選びましょう。'};if(s.witness!==s.left.length){mark(s,'packMismatch');return {ok:false,message:`数 ${s.witness} と列の長さ ${s.left.length} が違うため、箱にはできません。`};}s.pack={length:s.witness,items:[...s.left]};mark(s,s.witness===0?'packEmpty':'packFilled');return {ok:true,message:`数 ${s.witness} と、その長さの列を一緒に箱にしました。`};}
export function vectorOpen(s){if(!s.pack)return {ok:false,message:'先に長さの数と列を箱にしましょう。'};mark(s,'opened');return {ok:true,length:s.pack.length,items:[...s.pack.items],message:`箱を開くと数 ${s.pack.length} と、その長さに合う列を一緒に取り出せます。`};}
export function vectorAppend(s){if(!pick(s.resultLength,0,6))return {ok:false,message:'連結した列の長さの印を選びましょう。'};const items=[...s.left,...s.right];if(s.resultLength!==items.length)return {ok:false,message:`二つの列をつなぐと ${items.length} 個です。長さの印を確かめましょう。`};mark(s,s.left.length&&s.right.length?'appendBoth':'appendEmpty');return {ok:true,items,message:`列をつなぎ、長さ ${items.length} の列にしました。`};}
export function vectorIndex(s){if(!pick(s.index,1,4))return {ok:false,message:'取り出す位置を選びましょう。'};if(s.index>s.left.length){mark(s,'indexInvalid');return {ok:false,message:`位置 ${s.index} は長さ ${s.left.length} の列の外です。この位置の印は使えません。`};}mark(s,'indexValid');return {ok:true,item:s.left[s.index-1],message:`位置 ${s.index} の ${vectorStones[s.left[s.index-1]]} を取り出しました。`};}
export function vectorComplete(s){return vectorFlags.every(flag=>s.flags.includes(flag))&&s.answer==='depends'&&s.checked;}
export function vectorRestore(s){
 if(!s||!validItems(s.left)||!validItems(s.right)||!pick(s.count,0,3)||!Object.hasOwn(vectorStones,s.stone)||!(s.resultLength===null||pick(s.resultLength,0,6))||!(s.repLength===null||pick(s.repLength,0,3))||!(s.witness===null||pick(s.witness,0,3))||!(s.index===null||pick(s.index,1,4))||!Array.isArray(s.flags)||new Set(s.flags).size!==s.flags.length||s.flags.some(x=>!vectorFlags.includes(x))||!['','depends','elements-only','length-hidden'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 if(s.pack!==null&&(!s.pack||!validItems(s.pack.items)||!pick(s.pack.length,0,3)||s.pack.length!==s.pack.items.length))throw new RangeError('箱の記録が不正です。');
 return {...vectorCreate(),...s,left:[...s.left],right:[...s.right],flags:[...s.flags],pack:s.pack?{length:s.pack.length,items:[...s.pack.items]}:null};
}
