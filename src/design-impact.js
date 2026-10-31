export const impactLevel={id:'village-design-impact',number:'225',kind:'design-impact',name:'倉庫の改修計画',tag:'変更の影響と責任の分担',title:'改修する部品を見つけよう',story:'村の倉庫に変更の知らせが届きました。二つの設計で、どの部品を直す必要があるか調べましょう。'};
export const impactParts={screen:'画面',request:'受付',warehouse:'倉庫'};
export const impactCases={
 directStorage:{name:'直接依存・記録形式を変更',answer:['screen','request','warehouse']},
 directPolicy:{name:'直接依存・受付条件を変更',answer:['screen','request']},
 hiddenStorage:{name:'責任を集約・記録形式を変更',answer:['warehouse']},
 hiddenPolicy:{name:'責任を集約・受付条件を変更',answer:['warehouse']}
};
export function impactCorrect(id,marks){if(!Object.hasOwn(impactCases,id)||!Array.isArray(marks)||new Set(marks).size!==marks.length||!marks.every(k=>Object.hasOwn(impactParts,k)))return false;const answer=impactCases[id].answer;return marks.length===answer.length&&answer.every(k=>marks.includes(k));}
export function createImpact(){return Object.fromEntries(Object.keys(impactCases).map(id=>[id,{marks:[],checked:false}]));}
export function impactComplete(s){return Object.keys(impactCases).every(id=>s[id].checked&&impactCorrect(id,s[id].marks));}
export function restoreImpact(saved){if(!saved||!Object.keys(impactCases).every(id=>saved[id]&&Array.isArray(saved[id].marks)&&new Set(saved[id].marks).size===saved[id].marks.length&&saved[id].marks.every(k=>Object.hasOwn(impactParts,k))&&typeof saved[id].checked==='boolean'))throw new RangeError('途中記録が不正です。');return Object.fromEntries(Object.keys(impactCases).map(id=>[id,{marks:[...saved[id].marks],checked:saved[id].checked}]));}
