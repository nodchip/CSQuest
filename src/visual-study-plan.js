export const visualStudyQuestions={
 task:{title:'比較する課題',options:{compare:'同じ収穫データで、２村の差を読み取る',decoration:'図を見ずに壁の色だけを選ぶ'},correct:'compare',hint:'図を使って収穫の差を読み取るという目的に合わせましょう。'},
 participants:{title:'参加者の集め方',options:{audience:'想定する旅人に協力を求め、キーボードなど異なる操作も考慮する',builders:'制作者１人だけが試し、全旅人を代表すると決める'},correct:'audience',hint:'実際に使う人や異なる操作方法に目を向けましょう。'},
 measures:{title:'記録するもの',options:{both:'差の回答の正誤・所要時間・迷った箇所を記録する',speed:'速さだけを記録し、回答の正しさを確認しない'},correct:'both',hint:'正しく差を読めたかと、時間や困りごとを合わせて調べましょう。'},
 order:{title:'試す順序',options:{balance:'Ａ→ＢとＢ→Ａの両順序を用意する',fixed:'必ずＡだけを先に試し、順序の影響はないと決める'},correct:'balance',hint:'順序を変えても練習の影響は残り得ますが、偏りを減らす手がかりになります。'},
 result:{title:'結果の扱い',options:{limited:'参加者・課題・条件を明記し、困りごとを改善して再評価する',proof:'数人が成功したら、すべての図と利用者で最良と宣言する'},correct:'limited',hint:'少数の固定課題の結果を、すべての人や状況へ広げないようにしましょう。'}
};
export function visualStudyCreate(){return {answers:Object.fromEntries(Object.keys(visualStudyQuestions).map(k=>[k,''])),checked:false};}
export function visualStudyCorrect(s){return Object.entries(visualStudyQuestions).every(([k,q])=>s.answers[k]===q.correct);}
export function visualStudyRestore(s){if(!s||!s.answers||typeof s.checked!=='boolean'||!Object.entries(visualStudyQuestions).every(([k,q])=>s.answers[k]===''||Object.hasOwn(q.options,s.answers[k])))throw new RangeError('評価計画の記録が不正です');return {answers:{...s.answers},checked:s.checked};}
