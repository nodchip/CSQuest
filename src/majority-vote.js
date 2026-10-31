export const majorityLevel={id:'village-majority-vote',number:'240',kind:'majority-vote',name:'三つの水位計',tag:'多数決による冗長化と限界',title:'水位の知らせを選ぼう',story:'薬師の村の三つの水位計が、それぞれ水位を知らせます。多数決で知らせを決め、その結果を後で確かめましょう。'};
export const majorityCases={first:{name:'第一の測定',values:[3,3,2],truth:3},second:{name:'第二の測定',values:[2,2,3],truth:3},third:{name:'第三の測定',values:[1,2,3],truth:3},fourth:{name:'第四の測定',values:[2,2,2],truth:3}};
export const majorityChoices={one:'１を知らせる',two:'２を知らせる',three:'３を知らせる',hold:'一致する二つがないので知らせを保留'};
const names={1:'one',2:'two',3:'three'};
export function majorityDecision(id){if(!Object.hasOwn(majorityCases,id))throw new RangeError('測定が不正です。');const values=majorityCases[id].values;for(const value of [1,2,3])if(values.filter(v=>v===value).length>=2)return names[value];return 'hold';}
export function createMajority(){return Object.fromEntries(Object.keys(majorityCases).map(id=>[id,{choice:null,checked:false}]));}
export function majorityTrialCorrect(s,id){return s.checked&&s.choice===majorityDecision(id);}
export function majorityComplete(s){return Object.keys(majorityCases).every(id=>majorityTrialCorrect(s[id],id));}
export function restoreMajority(saved){if(!saved||!Object.keys(majorityCases).every(id=>saved[id]&&(saved[id].choice===null||Object.hasOwn(majorityChoices,saved[id].choice))&&typeof saved[id].checked==='boolean'))throw new RangeError('途中記録が不正です。');return Object.fromEntries(Object.keys(majorityCases).map(id=>[id,{choice:saved[id].choice,checked:saved[id].checked}]));}
