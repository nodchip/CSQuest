export const guardLevel={id:'workshop-aspect-guard',number:'324',kind:'aspect-guard',name:'台帳を守る周囲の仕掛け',tag:'アスペクトの周囲の処理',title:'通してよい操作を選ぼう',story:'前の依頼で作った台帳に、許可のない引出を止める共通の仕掛けを取り付けます。'};
export const guardCases={allowed:{name:'許可証あり',allowed:true},denied:{name:'許可証なし',allowed:false}};
export function guardRun(id,action){
 if(!Object.hasOwn(guardCases,id)||!['proceed','block'].includes(action))throw new RangeError('操作が不正です');
 return {balance:action==='proceed'?7:10,executed:action==='proceed',authorized:guardCases[id].allowed};
}
export function createGuard(){return {trials:{allowed:null,denied:null},answer:null,checked:false};}
export function restoreGuard(saved){if(!saved||!saved.trials||!Object.keys(guardCases).every(k=>[null,'proceed','block'].includes(saved.trials[k]))||![null,'conditional','always'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です');return {trials:{allowed:saved.trials.allowed,denied:saved.trials.denied},answer:saved.answer,checked:saved.checked};}
export function guardComplete(s){return s.trials.allowed==='proceed'&&s.trials.denied==='block'&&s.answer==='conditional'&&s.checked;}
