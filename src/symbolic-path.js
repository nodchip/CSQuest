export const symbolicLevel={id:'workshop-symbolic-path',number:'282',kind:'symbolic-path',name:'未知の数と二つの道',tag:'記号実行と経路条件',title:'未知の値のまま道をたどろう',story:'精霊は箱の中身をまだ決めずに、二つの道がどんな条件で開くか調べています。'};
export const symbolicCases={yes:{name:'条件が成り立つ道',constraint:'ge2',result:'plus2'},no:{name:'条件が成り立たない道',constraint:'le1',result:'doublePlus2'}};
export const symbolicConstraints={ge2:'X ≥ 2',le1:'X ≤ 1',ge3:'X ≥ 3',le2:'X ≤ 2'};
export const symbolicResults={plus2:'X + 2',doublePlus2:'2 × X + 2',plus1:'X + 1',double:'2 × X'};
export function symbolicConcrete(x){const initial=x+1;return {yes:initial>=3,value:initial>=3?initial+1:2*initial};}
export function createSymbolic(){return {selected:'yes',probe:0,answers:{yes:{constraint:null,result:null,checked:false},no:{constraint:null,result:null,checked:false}}};}
export function symbolicCorrect(id,answer){const c=symbolicCases[id];return Boolean(c)&&answer.constraint===c.constraint&&answer.result===c.result;}
export function symbolicComplete(s){return Object.keys(symbolicCases).every(id=>s.answers[id].checked&&symbolicCorrect(id,s.answers[id]));}
export function restoreSymbolic(saved){if(!saved||!Object.hasOwn(symbolicCases,saved.selected)||![-1,0,1,2,3].includes(saved.probe)||!saved.answers)throw new RangeError('途中記録が不正です');const s=createSymbolic();s.selected=saved.selected;s.probe=saved.probe;for(const id of Object.keys(symbolicCases)){const a=saved.answers[id];if(!a||![null,...Object.keys(symbolicConstraints)].includes(a.constraint)||![null,...Object.keys(symbolicResults)].includes(a.result)||typeof a.checked!=='boolean')throw new RangeError('途中記録が不正です');s.answers[id]={constraint:a.constraint,result:a.result,checked:a.checked};}return s;}
