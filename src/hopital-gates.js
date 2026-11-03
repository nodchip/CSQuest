export const hopitalLevel={id:'ruin-hopital-gates',number:'1099',kind:'hopital-gates',name:'極限を見分ける四つの門',tag:'不定形とロピタルの定理',title:'門の比を調べよう',story:'遺跡の四つの門には変化する数の比が刻まれています。形と条件を調べ、使える道具と別の道を選びましょう。'};
export const hopitalCases={
 zero:{name:'差の門',expression:'x → 1： (x² − 1) / (x − 1)',form:'zero',method:'try',answer:'two',explanation:'分子・分母はともに０へ。近くで微分でき、分母の導関数は１です。導関数の比 2x / 1 は２へ向かうため、元の極限も２です。'},
 infinity:{name:'遠い塔の門',expression:'x → +∞： ln x / x',form:'infinity',method:'try',answer:'zero',explanation:'分子・分母はともに +∞ へ。x > 0 で微分でき、分母の導関数は１です。導関数の比 (1/x) / 1 は０へ向かうので、元の極限も０です。'},
 ordinary:{name:'片側で分かれる門',expression:'x → 0： (x + 1) / x',form:'onezero',method:'avoid',answer:'none',explanation:'分子は１、分母は０へ向かうので、０/０でも∞/∞でもありません。1 + 1/x と分けると右側は +∞、左側は −∞ へ向かい、両側の極限は存在しません。'},
 oscillate:{name:'揺れる印の門',expression:'x → 0： x² sin(1/x) / x （x ≠ 0）',form:'zero',method:'try',answer:'squeeze',explanation:'分子・分母は０へ向かいますが、導関数の比 2x sin(1/x) − cos(1/x) は振動して極限を持ちません。この定理だけでは結論できません。元の比 x sin(1/x) は絶対値が |x| 以下なので０へ向かいます。'}
};
export const hopitalForms={zero:'０ / ０',infinity:'∞ / ∞',onezero:'１ / ０'};
export const hopitalMethods={try:'条件を確認し、導関数の比を調べる',avoid:'この形に直接は使わず、別の方法を使う'};
export const hopitalAnswers={two:'極限は２',zero:'極限は０（導関数の比から）',none:'両側の極限は存在しない',squeeze:'導関数の比からは結論できず、別の方法で元の極限は０'};
export function hopitalCreate(){return {selected:'zero',trials:Object.fromEntries(Object.keys(hopitalCases).map(id=>[id,{form:null,method:null,answer:null,checked:false}])),reflection:null};}
export function hopitalPass(id,trial){if(!Object.hasOwn(hopitalCases,id)||!trial)return false;const c=hopitalCases[id];return trial.checked&&trial.form===c.form&&trial.method===c.method&&trial.answer===c.answer;}
export function hopitalDone(q){return Object.keys(hopitalCases).every(id=>hopitalPass(id,q.trials[id]))&&q.reflection==='not-converse';}
export function hopitalRestore(q){if(!q||!Object.hasOwn(hopitalCases,q.selected)||!q.trials||![null,'not-converse','converse'].includes(q.reflection))throw new RangeError('途中記録が不正です');const s=hopitalCreate();s.selected=q.selected;s.reflection=q.reflection;for(const id of Object.keys(hopitalCases)){const t=q.trials[id];if(!t||![null,...Object.keys(hopitalForms)].includes(t.form)||![null,...Object.keys(hopitalMethods)].includes(t.method)||![null,...Object.keys(hopitalAnswers)].includes(t.answer)||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です');s.trials[id]={form:t.form,method:t.method,answer:t.answer,checked:t.checked};}return s;}
