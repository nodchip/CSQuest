export const analysisSteps=[
 {stage:'目的を確かめる',question:'薬師は翌日の配達員を準備したいそうです。まず何を確認しますか？',choices:{goal:'いつ・どの村の配達数を見積もり、何の準備に使うか聞く',deploy:'予測値だけで配達員を自動的に解雇する',secret:'本人の病歴を全て集める'},correct:'goal',hint:'使う目的と予測が外れたときの影響を先に考えましょう。'},
 {stage:'データを理解する',question:'記録は晴れの日が多く、雨の日の配達件数が一部欠けています。次は？',choices:{inspect:'村・天候ごとの件数と欠けを調べる',erase:'欠けを見ずに全記録を正確だと決める',future:'翌日の実績を入力に混ぜる'},correct:'inspect',hint:'記録の偏りや欠けを把握しましょう。'},
 {stage:'データを準備する',question:'未記録の雨の日は実際に０件だったか不明です。どう扱いますか？',choices:{unknown:'未記録として区別し、使う範囲と補完の方針を決める',zero:'確認せず０件として保存する',test:'検証用の答えを学習用に混ぜる'},correct:'unknown',hint:'記録なしと０件は別の状態です。'},
 {stage:'模型を作る',question:'まず簡単な比較をします。２つの予測方法は？',choices:{models:'直近の同じ村の平均と、村・天候別の平均を作る',perfect:'検証結果を見る前に必ず当たると宣言する',identity:'予測に不要な病歴で並べ替える'},correct:'models',hint:'目的に沿った入力で、比べられる方法を用意します。'},
 {stage:'結果を評価する',question:'使っていない日の記録では、雨の日に誤差が大きく、雨の日の検証例も少数でした。どうしますか？',choices:{revisit:'弱点を記録し、雨の日のデータや準備を見直す',success:'平均だけで全条件に十分正確と決める',hide:'雨の日の結果を報告から除く'},correct:'revisit',hint:'少数の検証と条件別の誤差は、見直す手がかりです。'},
 {stage:'試用と現場の確認',question:'配達係は雨の日の予測が不安で、理由も確認したいそうです。次の試用は？',choices:{trial:'不確かさを示して係が見直せる形で試し、意見を集める',automatic:'意見を聞かず予測だけで人員を自動決定する',ignore:'不安を無視し検証結果を隠す'},correct:'trial',hint:'利用者の確認と、予測が外れる可能性を残しましょう。'}
];
export function createAnalysisCycle(){return {actions:[],feedback:''};}
export function chooseAnalysisCycle(s,choice){const step=analysisSteps[s.actions.length];if(!step||!Object.hasOwn(step.choices,choice))throw new RangeError('操作が不正です。');if(choice!==step.correct)return {...s,feedback:step.hint};return {actions:[...s.actions,choice],feedback:''};}
export function restoreAnalysisCycle(saved){if(!Array.isArray(saved)||saved.length>analysisSteps.length||saved.some((choice,i)=>choice!==analysisSteps[i].correct))throw new RangeError('途中記録が不正です。');return {actions:[...saved],feedback:''};}
export function analysisCycleComplete(s){return s.actions.length===analysisSteps.length;}
