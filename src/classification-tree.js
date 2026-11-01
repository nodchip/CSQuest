export const classificationTreeLevel={id:'archive-classification-tree',number:'701',kind:'classification-tree',name:'二つの印と鑑定の樹',tag:'決定木と分岐',title:'手本を分ける樹を作ろう',story:'書庫の精霊は、二つの印を頼りに水晶の種類を見分けたいようです。問いを分岐に置き、手本をどこまで分けられるか試しましょう。'};
export const classificationTreeRows=[{x:0,y:0},{x:0,y:1},{x:1,y:0},{x:1,y:1}];
export function classificationTreeResult(dataset,root,branches){
 if(!['and','xor'].includes(dataset)||!['x','y'].includes(root)||!Array.isArray(branches)||branches.length!==2||branches.some(v=>typeof v!=='boolean'))throw new RangeError('樹の設定が不正です。');
 const data=classificationTreeRows.map(r=>({...r,label:dataset==='and'?r.x&r.y:r.x^r.y})),other=root==='x'?'y':'x';
 const gini=rows=>{const p=rows.reduce((sum,r)=>sum+r.label,0)/rows.length;return 2*p*(1-p);};
 const groups=[0,1].map(v=>data.filter(r=>r[root]===v));
 const rootImpurity=gini(data),after=groups.reduce((sum,group)=>sum+group.length/data.length*gini(group),0);
 const rows=data.map(r=>{const group=groups[r[root]].filter(q=>!branches[r[root]]||q[other]===r[other]);const positive=group.reduce((sum,q)=>sum+q.label,0),prediction=positive>group.length-positive?1:0;return {...r,prediction,correct:prediction===r.label};});
 return {rows,correct:rows.filter(r=>r.correct).length,rootImpurity,after,gain:rootImpurity-after};
}
export function createClassificationTree(){return {dataset:'and',root:'x',branches:[false,false],observed:[],answer:null,checked:false};}
export function classificationTreeComplete(s){return s.checked&&['and,00','and,11','xor,00','xor,11'].every(k=>s.observed.includes(k))&&s.answer==='limits';}
export function restoreClassificationTree(s){
 if(!s||!['and','xor'].includes(s.dataset)||!['x','y'].includes(s.root)||!Array.isArray(s.branches)||s.branches.length!==2||s.branches.some(v=>typeof v!=='boolean')||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>! /^(and|xor),[01]{2}$/.test(k))||![null,'limits','perfect','impossible'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {...s,branches:[...s.branches],observed:[...s.observed]};
}
