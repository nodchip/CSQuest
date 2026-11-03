export const underspecLevel={id:'workshop-underspecification',number:'1064',kind:'underspecification',name:'封印の見分け方',tag:'AI の仕様不足と評価',title:'同じ成績、異なる見分け方',story:'古文書の封印を見分ける二つの道具が届きました。背景を入れ替え、道具が新しい環境でも役立つか調べましょう。'};
export const underspecModels={shape:'封印の形を見る道具',background:'背景の色を見る道具'};
export function underspecEvaluate(model,mask){
 if(!Object.hasOwn(underspecModels,model)||!Number.isInteger(mask)||mask<0||mask>15)throw new RangeError('条件が不正です。');
 const rows=Array.from({length:4},(_,i)=>{const seal=i%2,background=seal^((mask>>i)&1),prediction=model==='shape'?seal:background;return {seal,background,prediction,correct:seal===prediction};});
 return {rows,correct:rows.filter(row=>row.correct).length};
}
export function underspecCreate(){return {model:'shape',mask:0,seen:[],answer:null,limits:null};}
export function underspecDone(q){return ['shape:0','background:0','shape:15','background:15'].every(x=>q.seen.includes(x))&&q.seen.some(x=>/^background:(?:[1-9]|1[0-4])$/.test(x))&&q.answer==='stress'&&q.limits==='monitor';}
export function underspecRestore(q){
 if(!q||!Object.hasOwn(underspecModels,q.model)||!Number.isInteger(q.mask)||q.mask<0||q.mask>15||!Array.isArray(q.seen)||q.seen.length>32||new Set(q.seen).size!==q.seen.length||q.seen.some(x=>typeof x!=='string'||!/^(shape|background):(?:[0-9]|1[0-5])$/.test(x))||![null,'stress','score'].includes(q.answer)||![null,'monitor','guarantee'].includes(q.limits))throw new RangeError('記録が不正です。');
 return {...q,seen:[...q.seen]};
}
