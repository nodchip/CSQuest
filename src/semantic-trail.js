export const semanticLevel = {id:'village-semantic-trail',number:'1048',kind:'semantic-trail',name:'知識をつなぐ水晶',tag:'意味ネットワークと RDF',title:'水晶に関係を結ぶ',story:'別々の書庫の記録を結び、薬師に必要な情報を探しましょう。'};

// These are readable labels for a fixed RDF-like example, not actual RDF terms.
export const semanticCards = [
  {id:'a',text:'ミナ → 採集した → 月草',correct:true},
  {id:'b',text:'月草 → 採集した → ミナ',correct:false},
  {id:'c',text:'月草 → 育つ場所 → 北の森',correct:true},
  {id:'d',text:'北の森 → 育つ場所 → 月草',correct:false},
  {id:'e',text:'ミナ → 住む場所 → 北の森',correct:false}
];
export const semanticQuestions = [
  {text:'ミナが採集したものは北の森に育ちますか？',answer:'yes',explain:'ミナ → 採集した → 月草 → 育つ場所 → 北の森、と２つの関係をたどれます。'},
  {text:'月草がミナを採集しましたか？',answer:'unknown',explain:'矢印を逆にした関係は記録されていません。逆向きも真とは限らず、偽とも決められません。'},
  {text:'ミナは北の森に住んでいますか？',answer:'unknown',explain:'採集物が森に育つことから、採集者の住む場所は分かりません。記録がないことは偽の証明ではありません。'}
];
export function semanticCreate(){return {cards:[],answers:[null,null,null]};}
export function semanticRestore(value){
  if(!value||!Array.isArray(value.cards)||new Set(value.cards).size!==value.cards.length||value.cards.some(id=>!['a','c'].includes(id))||!Array.isArray(value.answers)||value.answers.length!==semanticQuestions.length||value.answers.some(a=>![null,'yes','unknown','no'].includes(a))||(value.cards.length!==2&&value.answers.some(a=>a!==null)))throw new RangeError('記録が不正です。');
  return {cards:[...value.cards],answers:[...value.answers]};
}
export function semanticComplete(q){return q.cards.length===2&&semanticQuestions.every((x,i)=>q.answers[i]===x.answer);}
