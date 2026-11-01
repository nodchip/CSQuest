export const treePruningLevel={id:'archive-tree-pruning',number:'702',kind:'tree-pruning',name:'鑑定の樹を剪定する',tag:'決定木の枝刈りと過学習',title:'余分な枝を見直そう',story:'精霊が手本にぴったり合う鑑定の樹を育てました。別の記録と照らし合わせ、枝を残すか考えましょう。'};
export const treePruningData={train:[{warm:0,mark:'moon',label:0},{warm:0,mark:'sun',label:0},{warm:0,mark:'spiral',label:0},{warm:1,mark:'moon',label:1},{warm:1,mark:'sun',label:1},{warm:1,mark:'spiral',label:0}],validation:[{warm:0,mark:'moon',label:0},{warm:1,mark:'moon',label:1},{warm:1,mark:'sun',label:1},{warm:1,mark:'spiral',label:1}]};
export function treePruningResult(pruned,split){
 if(typeof pruned!=='boolean'||!Object.hasOwn(treePruningData,split))throw new RangeError('樹または記録が不正です。');
 const train=treePruningData.train,majority=rs=>rs.filter(r=>r.label===1).length>rs.length/2?1:0;
 const rows=treePruningData[split].map(r=>{const leaf=train.filter(t=>t.warm===r.warm&&(pruned||r.warm===0||(t.mark==='spiral')===(r.mark==='spiral'))),prediction=majority(leaf);return {...r,prediction,correct:prediction===r.label};});
 return {rows,correct:rows.filter(r=>r.correct).length,total:rows.length};
}
export function createTreePruning(){return {pruned:false,split:'train',observed:[],answer:null,checked:false};}
export function treePruningComplete(s){return s.checked&&['full,train','full,validation','pruned,train','pruned,validation'].every(k=>s.observed.includes(k))&&s.answer==='validation';}
export function restoreTreePruning(s){if(!s||typeof s.pruned!=='boolean'||!['train','validation'].includes(s.split)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!['full,train','full,validation','pruned,train','pruned,validation'].includes(k))||![null,'validation','always','test'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,observed:[...s.observed]};}
