export const contextGrammarLevel={id:'archive-context-grammar',number:'698',kind:'context-grammar',name:'三色の文法の工房',tag:'文脈依存文法',title:'書き換えの札で巻物を作ろう',story:'書庫には三色を同数並べるための書き換え札が残されています。隣の文字も見ながら札を使い、門に通る巻物を作りましょう。'};
export const contextGrammarRules=[['S','aSBC'],['S','aBC'],['CB','BC'],['aB','ab'],['bB','bb'],['bC','bc'],['cC','cc']];
export function grammarApply(word,rule,position){
 if(typeof word!=='string'||word.length>12||!Number.isInteger(rule)||!contextGrammarRules[rule]||!Number.isInteger(position)||position<0||position>=word.length)throw new RangeError('札または位置が不正です。');
 const [left,right]=contextGrammarRules[rule];
 if(word.slice(position,position+left.length)!==left)throw new RangeError('選んだ位置には、この札の左側がありません。');
 const next=word.slice(0,position)+right+word.slice(position+left.length);
 if(next.length>12)throw new RangeError('この工房で扱えるのは12文字までです。');
 return next;
}
export function grammarReplay(history){
 if(!Array.isArray(history)||history.length>20)throw new RangeError('手順が不正です。');
 let word='S';for(const move of history){if(!move||!Number.isInteger(move.rule)||!Number.isInteger(move.position))throw new RangeError('手順が不正です。');word=grammarApply(word,move.rule,move.position);}return word;
}
export function createContextGrammar(){return {history:[],observed:[],answer:null,checked:false};}
export function contextGrammarComplete(s){return s.checked&&['abc','aabbcc'].every(x=>s.observed.includes(x))&&s.answer==='context';}
export function restoreContextGrammar(s){
 if(!s||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(x=>!['abc','aabbcc','aaabbbccc','aaaabbbbcccc'].includes(x))||![null,'context','free','shorter'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 grammarReplay(s.history);return {...s,observed:[...s.observed],history:s.history.map(m=>({rule:m.rule,position:m.position}))};
}
