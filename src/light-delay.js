export const lightSpeed=299792458;
export const lightCases={near:{name:'近い塔',metres:0.3,cycles:1},middle:{name:'谷の塔',metres:3,cycles:10},far:{name:'遠い塔',metres:30,cycles:100}};
export function lightNanoseconds(metres){if(!Number.isFinite(metres)||metres<0)throw new RangeError('距離が不正です。');return metres/lightSpeed*1e9;}
export function createLightDelay(){return {selected:'near',choices:{near:null,middle:null,far:null},checked:{near:false,middle:false,far:false},answer:null,confirmed:false};}
export function lightTrialCorrect(s,id){return s.checked[id]&&s.choices[id]===lightCases[id].cycles;}
export function lightComplete(s){return Object.keys(lightCases).every(id=>lightTrialCorrect(s,id))&&s.answer==='twice'&&s.confirmed;}
export function restoreLightDelay(saved){if(!saved||!Object.hasOwn(lightCases,saved.selected)||!saved.choices||!saved.checked||![null,'twice','same','half'].includes(saved.answer)||typeof saved.confirmed!=='boolean')throw new RangeError('途中記録が不正です。');const n=createLightDelay();n.selected=saved.selected;n.answer=saved.answer;n.confirmed=saved.confirmed;for(const id of Object.keys(lightCases)){if(![null,1,10,100].includes(saved.choices[id])||typeof saved.checked[id]!=='boolean')throw new RangeError('途中記録が不正です。');n.choices[id]=saved.choices[id];n.checked[id]=saved.checked[id];}return n;}
