export const walLevel={id:'village-log-recovery',number:'136',kind:'walrecovery',name:'途切れた台帳と記録',tag:'先行ログと復旧',title:'台帳を立て直す',story:'薬師の送金の途中で装置が止まりました。残った変更記録を使って、二つの口座の値を復旧しましょう。'};
export const walValues={a:{name:'口座Ａ',before:10,after:7},b:{name:'口座Ｂ',before:2,after:5}};
export const walCases={uncommitted:{name:'確定前に中断',committed:false,disk:{a:7,b:2}},committed:{name:'確定後・台帳未反映',committed:true,disk:{a:10,b:2}},partial:{name:'確定後・一部だけ反映',committed:true,disk:{a:7,b:2}}};
export const walActions={before:'変更前に戻す',after:'変更後を反映'};
export function walDisk(id,c){if(!Object.hasOwn(walCases,id))throw new RangeError('試行が不正です。');return Object.fromEntries(Object.keys(walValues).map(key=>[key,c.actions[key]?walValues[key][c.actions[key]]:walCases[id].disk[key]]));}
export function walCorrect(id,c){const choice=walCases[id].committed?'after':'before';return c.checked&&Object.keys(walValues).every(key=>c.actions[key]===choice);}
export function createWal(){return {selected:'uncommitted',choices:Object.fromEntries(Object.keys(walCases).map(id=>[id,{actions:{a:'',b:''},checked:false}]))};}
export function restoreWal(s){if(!s||!Object.hasOwn(walCases,s.selected)||!s.choices)throw new RangeError('途中記録が不正です。');const r=createWal();r.selected=s.selected;for(const id of Object.keys(walCases)){const c=s.choices[id];if(!c||!c.actions||typeof c.checked!=='boolean'||Object.keys(walValues).some(key=>!['','before','after'].includes(c.actions[key])))throw new RangeError('復旧の記録が不正です。');r.choices[id]={actions:{a:c.actions.a,b:c.actions.b},checked:c.checked};}return r;}
export function walComplete(s){return Object.keys(walCases).every(id=>walCorrect(id,s.choices[id]));}
