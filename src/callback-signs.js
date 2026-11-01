export const callbackSignsLevel={id:'guild-callback-signs',number:'594',kind:'callback-signs',name:'案内札と覚えた箱',tag:'イベントとクロージャ',title:'三つの札に案内を登録しよう',story:'ギルドの三つの札を押すと、それぞれ別の案内を出したいそうです。札を用意した後で押し、どの箱を参照するか調べましょう。'};
export const callbackModes={shared:'一つの箱を共有',separate:'札ごとに別の箱'};
export const callbackSigns={moon:'月',star:'星',sun:'太陽'};
export const callbackOrder=['moon','star','sun'];
export function callbackResult(mode,registered,sign){
 if(!Object.hasOwn(callbackModes,mode)||!Number.isInteger(registered)||registered<1||registered>3||!callbackOrder.slice(0,registered).includes(sign))throw new RangeError('札や登録が不正です。');
 return mode==='shared'?callbackOrder[registered-1]:sign;
}
const trial=()=>({registered:0,sign:null,guess:null,tested:[]});
export function createCallbackSigns(){return {mode:'shared',trials:{shared:trial(),separate:trial()},answer:null,checked:false,message:'札を順番に登録しましょう。'};}
export function callbackTest(s){
 const t=s.trials[s.mode];if(t.registered!==3||!callbackOrder.includes(t.sign)||!callbackOrder.includes(t.guess))throw new RangeError('準備ができていません。');
 const actual=callbackResult(s.mode,t.registered,t.sign);
 if(t.guess!==actual)return {...s,message:`この札が読む箱の案内は「${callbackSigns[actual]}」です。箱をたどって予想を選び直せます。`};
 return {...s,trials:{...s.trials,[s.mode]:{...t,tested:[...new Set([...t.tested,t.sign])]}},checked:false,message:`${callbackSigns[t.sign]}の札は「${callbackSigns[actual]}」を表示しました。`};
}
export function callbackSignsComplete(s){return Object.keys(callbackModes).every(m=>callbackOrder.every(sign=>s.trials[m].tested.includes(sign)))&&s.answer==='binding'&&s.checked;}
export function restoreCallbackSigns(saved){
 if(!saved||!Object.hasOwn(callbackModes,saved.mode)||!saved.trials||![null,'binding','copy','event'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 const s=createCallbackSigns();s.mode=saved.mode;s.answer=saved.answer;s.checked=saved.checked;
 for(const mode of Object.keys(callbackModes)){const t=saved.trials[mode];if(!t||!Number.isInteger(t.registered)||t.registered<0||t.registered>3||!(t.sign===null||callbackOrder.includes(t.sign))||!(t.guess===null||callbackOrder.includes(t.guess))||!Array.isArray(t.tested)||new Set(t.tested).size!==t.tested.length||t.tested.some(x=>!callbackOrder.includes(x))||(t.registered<3&&(t.sign!==null||t.guess!==null||t.tested.length)))throw new RangeError('試行が不正です。');s.trials[mode]={registered:t.registered,sign:t.sign,guess:t.guess,tested:[...t.tested]};}
 return s;
}
