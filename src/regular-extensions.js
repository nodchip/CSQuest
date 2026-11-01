export const regularExtensionsLevel={id:'archive-regular-extensions',number:'647',kind:'regular-extensions',name:'二つの正規表現の門',tag:'正規言語と後方参照',title:'条件に合う印の門を作ろう',story:'書庫の二つの門は、印の並びを異なる規則で見分けます。表現の札を組み、もう一つの門の記憶する力と比べましょう。'};
export const formalCases={all:{name:'すべての列',target:'a と b だけからなる列すべて。空文字も含む。',suffix:'none'},endA:{name:'a で終わる',target:'a と b だけからなり、最後が a の列。',suffix:'a'},endB:{name:'b で終わる',target:'a と b だけからなり、最後が b の列。',suffix:'b'}};
export const formalGroups=['a','b','either'];
export const formalRepeats=['one','star'];
export const formalTails=['none','a','b'];
export const regularSamples=['','a','b','aa','ab','ba','bb'];
export const backrefWords=['','aa','abab','abba','abaaba','aab'];
export const backrefRequired=[0,1,2,3];
export function formalExpression(t){if(!formalGroups.includes(t.group)||!formalRepeats.includes(t.repeat)||!formalTails.includes(t.tail))throw new RangeError('表現の札が不正です。');return (t.group==='either'?'(a|b)':t.group)+(t.repeat==='star'?'*':'')+(t.tail==='none'?'':t.tail);}
export function formalMatch(t,word){
 formalExpression(t);if(typeof word!=='string'||!/^[ab]*$/.test(word))throw new RangeError('印が不正です。');
 let prefix=word;if(t.tail!=='none'){if(!word.endsWith(t.tail))return false;prefix=word.slice(0,-1);}
 if(t.repeat==='one'&&prefix.length!==1)return false;return [...prefix].every(ch=>t.group==='either'||ch===t.group);
}
export function formalTarget(id,word){if(!Object.hasOwn(formalCases,id)||typeof word!=='string'||!/^[ab]*$/.test(word))throw new RangeError('条件が不正です。');const suffix=formalCases[id].suffix;return suffix==='none'||word.endsWith(suffix);}
export function formalCorrect(id,t){return Object.hasOwn(formalCases,id)&&t.group==='either'&&t.repeat==='star'&&t.tail===formalCases[id].suffix;}
export function backrefMatch(word){if(!backrefWords.includes(word))throw new RangeError('印が不正です。');return /^([ab]*)\1$/u.test(word);}
export function createRegularExtensions(){return {selected:'all',trials:Object.fromEntries(Object.keys(formalCases).map(id=>[id,{group:'a',repeat:'one',tail:'none',checked:false}])),word:0,seen:[],answer:null,checked:false};}
export function regularExtensionsComplete(s){return Object.keys(formalCases).every(id=>s.trials[id].checked&&formalCorrect(id,s.trials[id]))&&backrefRequired.every(i=>s.seen.includes(i))&&s.answer==='extension'&&s.checked;}
export function restoreRegularExtensions(s){
 if(!s||!Object.hasOwn(formalCases,s.selected)||!s.trials||!Number.isInteger(s.word)||s.word<0||s.word>=backrefWords.length||!Array.isArray(s.seen)||new Set(s.seen).size!==s.seen.length||s.seen.some(n=>!Number.isInteger(n)||n<0||n>=backrefWords.length)||![null,'extension','same','automatic'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 const trials={};for(const id of Object.keys(formalCases)){const t=s.trials[id];if(!t||typeof t.checked!=='boolean')throw new RangeError('途中記録が不正です。');formalExpression(t);trials[id]={...t};}return {...s,trials,seen:[...s.seen]};
}
