export const scopeLevel={id:'workshop-scope-resolution',number:'308',kind:'scope-resolution',name:'二つの光の名前',tag:'静的・動的スコープ',title:'精霊が読む箱を探そう',story:'工房と作業部屋に、同じ「光」という名前の箱があります。精霊をどこから呼ぶか、どの規則を使うかで、読む箱を調べましょう。'};
export const scopeRules={lexical:{name:'定義元をたどる（静的）'},dynamic:{name:'呼び出し元をたどる（動的）'}};
export const scopeCalls={direct:{name:'工房から呼ぶ'},room:{name:'作業部屋から呼ぶ'}};
export const scopeAnswers={workshop:{name:'工房の箱：１',value:1},room:{name:'作業部屋の箱：２',value:2}};
export function scopeResult(rule,call){if(!Object.hasOwn(scopeRules,rule)||!Object.hasOwn(scopeCalls,call))throw new RangeError('入力が不正です');return rule==='dynamic'&&call==='room'?'room':'workshop';}
export function createScope(){return {rule:'lexical',call:'direct',trials:Object.fromEntries(Object.keys(scopeRules).map(rule=>[rule,Object.fromEntries(Object.keys(scopeCalls).map(call=>[call,{choice:null,checked:false}]))]))};}
export function scopeCorrect(rule,call,t){return t.choice===scopeResult(rule,call);}
export function scopeComplete(s){return Object.keys(scopeRules).every(rule=>Object.keys(scopeCalls).every(call=>s.trials[rule][call].checked&&scopeCorrect(rule,call,s.trials[rule][call])));}
export function restoreScope(saved){if(!saved||!Object.hasOwn(scopeRules,saved.rule)||!Object.hasOwn(scopeCalls,saved.call)||!saved.trials)throw new RangeError('途中記録が不正です');const s=createScope();s.rule=saved.rule;s.call=saved.call;for(const rule of Object.keys(scopeRules))for(const call of Object.keys(scopeCalls)){const t=saved.trials[rule]?.[call];if(!t||!(t.choice===null||Object.hasOwn(scopeAnswers,t.choice))||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です');s.trials[rule][call]={choice:t.choice,checked:t.checked};}return s;}
