export const composeSealsLevel={id:'workshop-compose-seals',number:'592',kind:'compose-seals',name:'魔法をつなぐ封印',tag:'高階関数と関数合成',title:'二つの魔法を封印に渡そう',story:'工房の装置に二つの魔法を渡すと、その順に魔法をかける新しい封印が生まれます。順番を変えた二つの封印を作り、使い比べましょう。'};
export const sealSpells={double:{name:'２倍',apply:x=>2*x},increment:{name:'１を足す',apply:x=>x+1},square:{name:'２乗',apply:x=>x*x}};
export const composeTrials={forward:{name:'２倍してから１を足す',first:'double',second:'increment'},reverse:{name:'１を足してから２倍',first:'increment',second:'double'}};
export const sealInputs=[1,3];
export function composeSeal(first,second){if(!Object.hasOwn(sealSpells,first)||!Object.hasOwn(sealSpells,second))throw new RangeError('魔法が不正です。');const f=sealSpells[first].apply,g=sealSpells[second].apply;return x=>g(f(x));}
export function sealValue(seal,input){if(!Array.isArray(seal)||seal.length!==2||!sealInputs.includes(input))throw new RangeError('入力が不正です。');return composeSeal(seal[0],seal[1])(input);}
const trial=()=>({first:'double',second:'double',seal:null,predictions:{1:null,3:null},tested:{1:false,3:false}});
export function createComposeSeals(){return {selected:'forward',trials:{forward:trial(),reverse:trial()},answer:null,checked:false};}
export function composeTrialComplete(key,t){const task=composeTrials[key];return !!task&&!!t.seal&&t.seal[0]===task.first&&t.seal[1]===task.second&&sealInputs.every(n=>t.tested[n]&&t.predictions[n]===sealValue(t.seal,n));}
export function composeSealsComplete(s){return Object.keys(composeTrials).every(key=>composeTrialComplete(key,s.trials[key]))&&s.answer==='functions'&&s.checked;}
export function restoreComposeSeals(saved){
 if(!saved||!Object.hasOwn(composeTrials,saved.selected)||!saved.trials||![null,'functions','number','commute'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 const s=createComposeSeals();s.selected=saved.selected;s.answer=saved.answer;s.checked=saved.checked;
 for(const key of Object.keys(composeTrials)){
  const t=saved.trials[key];if(!t||!Object.hasOwn(sealSpells,t.first)||!Object.hasOwn(sealSpells,t.second)||!(t.seal===null||(Array.isArray(t.seal)&&t.seal.length===2&&t.seal.every(x=>Object.hasOwn(sealSpells,x))))||!t.predictions||!t.tested)throw new RangeError('試行が不正です。');
  const restored=trial();restored.first=t.first;restored.second=t.second;restored.seal=t.seal&&[...t.seal];
  for(const n of sealInputs){const pred=t.predictions[n],tested=t.tested[n];if(!(pred===null||(Number.isInteger(pred)&&pred>=0&&pred<=81))||typeof tested!=='boolean'||(tested&&(!restored.seal||pred===null)))throw new RangeError('予想が不正です。');restored.predictions[n]=pred;restored.tested[n]=tested;}
  s.trials[key]=restored;
 }
 return s;
}
