export const searchBudgets={small:{name:'候補を最大４件',capacity:4},large:{name:'候補を最大８件',capacity:8},tight:{name:'候補を最大３件',capacity:3}};
export function budgetChoice(id,stats){
 if(!Object.hasOwn(searchBudgets,id))throw new RangeError('上限が不正です。');
 const feasible=['breadth','iterative'].filter(k=>stats[k].peak<=searchBudgets[id].capacity);
 if(!feasible.length)return 'neither';
 return feasible.reduce((best,k)=>stats[k].checks<stats[best].checks?k:best);
}
export function createSearchBudget(){return {selected:'small',answers:{small:null,large:null,tight:null},checked:{small:false,large:false,tight:false}};}
export function budgetCorrect(s,id,stats){return s.checked[id]&&s.answers[id]===budgetChoice(id,stats);}
export function budgetComplete(s,stats){return Object.keys(searchBudgets).every(id=>budgetCorrect(s,id,stats));}
export function restoreSearchBudget(s){if(!s||!Object.hasOwn(searchBudgets,s.selected)||!s.answers||!s.checked)throw new RangeError('記録が不正です。');const n=createSearchBudget();n.selected=s.selected;for(const id of Object.keys(searchBudgets)){const a=s.answers[id],c=s.checked[id];if(![null,'breadth','iterative','neither'].includes(a)||typeof c!=='boolean'||(c&&a===null))throw new RangeError('記録が不正です。');n.answers[id]=a;n.checked[id]=c;}return n;}
