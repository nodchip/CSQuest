export const embeddedHearthLevel={id:'workshop-embedded-hearth',number:'642',kind:'embedded-hearth',name:'精霊炉の見張り番',tag:'組込み機器の機能単位と記憶',title:'見張り番と炉をつなごう',story:'精霊の温室を守る見張り番が目覚めました。温度を読み、炉を動かすまでの部品を正しい順に働かせましょう。'};
export const hearthStages=['fetch','read','compare','output'];
export const hearthLabels={fetch:'不揮発の記憶から手順を読む',read:'センサーの値を RAM に置く',compare:'演算部で20°Cと比べる',output:'出力から炉を操作する'};
export function createEmbeddedHearth(){return {temperature:16,stage:0,observed:[],answer:null,checked:false};}
export function hearthSnapshot(s){
 if(![16,24].includes(s.temperature)||!Number.isInteger(s.stage)||s.stage<0||s.stage>4)throw new RangeError('炉の状態が不正です。');
 return {firmware:true,loaded:s.stage>=1,ram:s.stage>=2?s.temperature:null,comparison:s.stage>=3?s.temperature<20:null,heater:s.stage>=4&&s.temperature<20};
}
export function hearthAdvance(s,action){hearthSnapshot(s);if(!hearthStages.includes(action)||hearthStages[s.stage]!==action)return false;s.stage++;s.checked=false;return true;}
export function hearthObserve(s){const r=hearthSnapshot(s);if(s.stage!==4)return false;const key=r.heater?'cold':'warm';if(!s.observed.includes(key))s.observed.push(key);s.checked=false;return true;}
export function hearthPowerCycle(s){const r=hearthSnapshot(s);if(r.heater&&!s.observed.includes('reset'))s.observed.push('reset');s.stage=0;s.checked=false;}
export function embeddedHearthComplete(s){return ['cold','warm','reset'].every(k=>s.observed.includes(k))&&s.answer==='memory'&&s.checked;}
export function restoreEmbeddedHearth(s){
 if(!s||![16,24].includes(s.temperature)||!Number.isInteger(s.stage)||s.stage<0||s.stage>4||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!['cold','warm','reset'].includes(k))||![null,'memory','everything','nothing'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');return {...s,observed:[...s.observed]};
}
