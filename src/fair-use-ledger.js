export const fairUseLevel={id:'guild-fair-use-ledger',number:'957',kind:'fair-use-ledger',name:'引用の札を調べる',tag:'フェアユースと裁判例',title:'四つの観点を集める',story:'祭りの批評集に、他の工房の作品を引用したいという相談が届きました。事実を整理し、米国の制度と裁判例を調べましょう。'};
export const fairFactors={purpose:'利用の目的・性質',nature:'元の著作物の性質',amount:'利用した部分の量・重要性',market:'市場・価値への影響'};
// Each card is assigned to its primary statutory factor for this exercise;
// actual legal analysis can relate one fact to more than one factor.
export const fairCards={
 review:{text:'批評記事で作品を論じる目的で使う。',factor:'purpose'},
 sale:{text:'記事を販売する計画がある。',factor:'purpose'},
 fiction:{text:'元の作品は創作された物語である。',factor:'nature'},
 published:{text:'元の作品は既に公表されている。',factor:'nature'},
 portion:{text:'文章全体のうち一部を使う。',factor:'amount'},
 central:{text:'使う一節が作品の中心部分に当たるか調べる。',factor:'amount'},
 substitute:{text:'記事が元の作品の代替になるか調べる。',factor:'market'},
 license:{text:'通常の利用許諾の市場にどのような影響があるか調べる。',factor:'market'}
};
export function fairCreate(){return {card:'review',choice:null,checked:[],last:null,caseAnswer:null,reflection:null};}
export function fairInspect(q){if(!Object.hasOwn(fairCards,q.card)||!Object.hasOwn(fairFactors,q.choice))throw new RangeError('選択が不正です。');const correct=fairCards[q.card].factor===q.choice;q.last={card:q.card,choice:q.choice,correct};if(correct&&!q.checked.includes(q.card))q.checked.push(q.card);}
export function fairComplete(q){return Object.keys(fairCards).every(k=>q.checked.includes(k))&&q.caseAnswer==='specific'&&q.reflection==='context';}
export function fairRestore(q){if(!q||!Object.hasOwn(fairCards,q.card)||!(q.choice===null||Object.hasOwn(fairFactors,q.choice))||!Array.isArray(q.checked)||new Set(q.checked).size!==q.checked.length||q.checked.some(k=>!Object.hasOwn(fairCards,k))||![null,'specific','all','copyrightable'].includes(q.caseAnswer)||![null,'context','percent','credit'].includes(q.reflection))throw new RangeError('記録が不正です。');let last=null;if(q.last!==null){const l=q.last;if(!l||!Object.hasOwn(fairCards,l.card)||!Object.hasOwn(fairFactors,l.choice)||l.correct!==(fairCards[l.card].factor===l.choice))throw new RangeError('記録が不正です。');last={...l};}return {card:q.card,choice:q.choice,checked:[...q.checked],last,caseAnswer:q.caseAnswer,reflection:q.reflection};}
