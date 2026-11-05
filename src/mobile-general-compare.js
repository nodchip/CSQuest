export const compareCases={
 common:{name:'同じ道順の計算',detail:'端末でも、入力を受けて結果を出す別の道具でも、同じ地図と規則から道順を計算する。',answer:'common',explanation:'入力、処理、結果の考え方は両方に使えます。'},
 pause:{name:'端末を離れて戻る',detail:'画面が中断され、表示用の状態が失われる場合もある。利用者は途中の選択を続けたい。',answer:'restore',explanation:'保存・復元の方針を考えます。中断や復元は他の種類のプログラムでも必要になることがあります。'},
 permission:{name:'位置を許可しない',detail:'端末では位置の利用が拒否された。場所を手動で選べれば、位置なしでも経路計算はできます。',answer:'alternative',explanation:'拒否を扱い、位置を使わない代替を用意します。権限や代替もモバイルだけの問題ではありません。'}
};
export const compareChoices={common:'同じ計算の考え方を使う',restore:'必要な状態の保存・復元を考える',alternative:'拒否を扱い、手動選択も用意する'};
export function mobileCompareCreate(){return {caseId:'common',choice:null,seen:[],checked:false,reflection:null};}
export function mobileCompareCheck(q){if(!Object.hasOwn(compareCases,q.caseId)||!Object.hasOwn(compareChoices,q.choice))throw new RangeError('対応を選びましょう。');q.checked=true;const ok=q.choice===compareCases[q.caseId].answer;if(ok&&!q.seen.includes(q.caseId))q.seen.push(q.caseId);return ok;}
export function mobileCompareDone(q){return Object.keys(compareCases).every(k=>q.seen.includes(k))&&q.reflection==='context';}
export function mobileCompareRestore(q){if(!q||!Object.hasOwn(compareCases,q.caseId)||![null,...Object.keys(compareChoices)].includes(q.choice)||typeof q.checked!=='boolean'||q.checked&&q.choice===null||!Array.isArray(q.seen)||new Set(q.seen).size!==q.seen.length||q.seen.some(k=>!Object.hasOwn(compareCases,k))||![null,'context','exclusive','identical'].includes(q.reflection))throw new RangeError('比較の記録が不正です。');return {...q,seen:[...q.seen]};}
