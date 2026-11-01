export const budgetCases={fits:{pages:4,buffers:4},small:{pages:8,buffers:3},medium:{pages:12,buffers:4},large:{pages:16,buffers:3}};
export const budgetFields={runs:'最初の列数',merges:'併合の回数',io:'読み書きの合計頁数'};
export const budgetOptions={runs:[1,2,3,4,5,6],merges:[0,1,2,3],io:[8,16,24,32,48,64,72,96,128]};
export function externalBudget(pages,buffers){
  if(!Number.isInteger(pages)||pages<1||!Number.isInteger(buffers)||buffers<3)throw new RangeError('頁数が不正です。');
  const levels=[Math.ceil(pages/buffers)];
  while(levels.at(-1)>1)levels.push(Math.ceil(levels.at(-1)/(buffers-1)));
  return {runs:levels[0],merges:levels.length-1,io:2*pages*levels.length,levels};
}
export function createExternalBudget(){return {selected:'fits',choices:Object.fromEntries(Object.keys(budgetCases).map(k=>[k,{runs:null,merges:null,io:null,checked:false}]))};}
export function externalBudgetCorrect(id,choice){const c=budgetCases[id];if(!c)return false;const expected=externalBudget(c.pages,c.buffers);return choice.checked&&Object.keys(budgetFields).every(k=>choice[k]===expected[k]);}
export function externalBudgetComplete(s){return Object.keys(budgetCases).every(id=>externalBudgetCorrect(id,s.choices[id]));}
export function restoreExternalBudget(saved){if(!saved||!Object.hasOwn(budgetCases,saved.selected)||!saved.choices)throw new RangeError('見積りの記録が不正です。');const s=createExternalBudget();s.selected=saved.selected;for(const id of Object.keys(budgetCases)){const c=saved.choices[id];if(!c||typeof c.checked!=='boolean'||Object.keys(budgetFields).some(k=>c[k]!==null&&!budgetOptions[k].includes(c[k])))throw new RangeError('見積りが不正です。');s.choices[id]={runs:c.runs,merges:c.merges,io:c.io,checked:c.checked};}return s;}
