export const creditLevel={id:'guild-credit-scrolls',number:'270',kind:'credit-scrolls',name:'知恵の出どころを記す',tag:'出典と貢献の表示',title:'巻物の記録を正そう',story:'ギルドで集めた知恵の巻物を、出どころと共に整理します。'};
export const creditChoices={quote:'引用部分を示し、出典を記す',paraphrase:'言い換えた考えの出典を記す',team:'合意した共同執筆者を記す',keep:'この表示を保つ'};
export const creditCases={
 direct:{name:'文をそのまま',text:'イオの報告から一文をそのまま使い、自分の文として出典なしで掲載しました。引用と出典の表示が認められる場面です。',answer:'quote'},
 paraphrase:{name:'考えを言い換え',text:'イオの独自の説明を自分の言葉に直し、出典なしで掲載しました。',answer:'paraphrase'},
 team:{name:'共同の記録',text:'二人で大きく寄与し、二人を執筆者とすることで合意した報告に、一人の名前だけを載せました。',answer:'team'},
 attributed:{name:'出典のある引用',text:'利用が認められた一文を引用部分と分かるよう示し、出典も記しています。',answer:'keep'}
};
export function createCredit(){return {selected:'direct',answers:Object.fromEntries(Object.keys(creditCases).map(id=>[id,{choice:null,checked:false}]))};}
export function creditCorrect(s,id){if(!Object.hasOwn(creditCases,id))throw new RangeError('巻物が不正です。');return s.answers[id].checked&&s.answers[id].choice===creditCases[id].answer;}
export function creditComplete(s){return Object.keys(creditCases).every(id=>creditCorrect(s,id));}
export function restoreCredit(saved){if(!saved||!Object.hasOwn(creditCases,saved.selected)||!saved.answers)throw new RangeError('途中記録が不正です。');const s=createCredit();s.selected=saved.selected;for(const id of Object.keys(creditCases)){const a=saved.answers[id];if(!a||!(a.choice===null||Object.hasOwn(creditChoices,a.choice))||typeof a.checked!=='boolean')throw new RangeError('途中記録が不正です。');s.answers[id]={choice:a.choice,checked:a.checked};}return s;}
