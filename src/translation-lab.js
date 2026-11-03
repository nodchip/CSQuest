export const translationLabLevel={id:'forest-translation-scroll',number:'1079',kind:'translation-lab',name:'二つの言葉の伝言',tag:'機械翻訳と評価',title:'森の伝言を訳す',story:'旅人が古い森語の伝言を持ってきました。交易語の札を並べ、訳とその評価を比べましょう。'};
export const translationWords={mira:'ミラ',cross:'わたる',river:'かわ',visit:'おとずれる',bank:'ぎんこう'};
export const translationScenes={cross:{source:'mira kala luma',reference:['mira','cross','river']},visit:{source:'mira kala taka',reference:['mira','visit','bank']}};
export const translationRequired=['cross:correct','cross:order','cross:sense','visit:correct'];
export function translationEvaluate(scene,words){
 if(!Object.hasOwn(translationScenes,scene)||!Array.isArray(words)||words.length!==3||words.some(w=>!Object.hasOwn(translationWords,w)))throw new RangeError('訳の条件が不正です');
 const ref=translationScenes[scene].reference;
 const overlap=(n)=>{const counts=new Map();for(let i=0;i<=ref.length-n;i++){const k=ref.slice(i,i+n).join('|');counts.set(k,(counts.get(k)||0)+1);}let total=0;for(let i=0;i<=words.length-n;i++){const k=words.slice(i,i+n).join('|'),c=counts.get(k)||0;if(c){total++;counts.set(k,c-1);}}return total;};
 return {unigrams:overlap(1),bigrams:overlap(2),exact:words.every((w,i)=>w===ref[i])};
}
export function translationMarker(scene,words){const k=words.join(':');if(scene==='cross'&&k==='mira:cross:river')return 'cross:correct';if(scene==='cross'&&k==='river:cross:mira')return 'cross:order';if(scene==='cross'&&k==='mira:cross:bank')return 'cross:sense';if(scene==='visit'&&k==='mira:visit:bank')return 'visit:correct';return null;}
export function translationCreate(){return {scene:'cross',slots:[null,null,null],seen:[],reflection:null,limits:null};}
export function translationRestore(q){
 if(!q||!Object.hasOwn(translationScenes,q.scene)||!Array.isArray(q.slots)||q.slots.length!==3||q.slots.some(w=>w!==null&&!Object.hasOwn(translationWords,w))||!Array.isArray(q.seen)||q.seen.length>4||new Set(q.seen).size!==q.seen.length||q.seen.some(x=>!translationRequired.includes(x))||![null,'order','bag'].includes(q.reflection)||![null,'human','perfect'].includes(q.limits))throw new RangeError('翻訳の記録が不正です');
 return {...q,slots:[...q.slots],seen:[...q.seen]};
}
export function translationDone(q){return translationRequired.every(x=>q.seen.includes(x))&&q.reflection==='order'&&q.limits==='human';}
