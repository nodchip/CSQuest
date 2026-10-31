export const budgetLevel={id:'guild-error-budget',number:'239',kind:'error-budget',name:'伝令板の信頼性目標',tag:'サービス目標とエラーバジェット',title:'伝令を届けながら新機能を試そう',story:'冒険者ギルドの伝令板に新しい機能を試します。限られた期間の受け付け結果を記録し、目標を守りましょう。'};
export const budgetChoices={normal:'通常の受付',trial:'新機能を試す'};
export const budgetFailures={normal:[0,1,0,0,1],trial:[1,1,2,1,2]};
export function createBudget(){return {history:[],message:'最初の20件の扱い方を選びましょう。'};}
export function budgetStats(s){let failures=0,trials=0;for(let i=0;i<s.history.length;i++){const choice=s.history[i];failures+=budgetFailures[choice][i];if(choice==='trial')trials++;}return {batches:s.history.length,processed:s.history.length*20,failures,remaining:2-failures,trials,successes:s.history.length*20-failures};}
export function stepBudget(s,choice){if(!Object.hasOwn(budgetChoices,choice)||s.history.length>=5)throw new RangeError('操作が不正です。');const n={history:[...s.history,choice],message:`${s.history.length+1}組目は${budgetFailures[choice][s.history.length]}件が失敗しました。`};return n;}
export function budgetComplete(s){const r=budgetStats(s);return r.batches===5&&r.failures<=2&&r.trials>=1;}
export function restoreBudget(saved){if(!saved||!Array.isArray(saved.history)||saved.history.length>5)throw new RangeError('途中記録が不正です。');let s=createBudget();for(const action of saved.history)s=stepBudget(s,action);return s;}
