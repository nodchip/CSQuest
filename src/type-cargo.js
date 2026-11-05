import {createProductLab,restoreProductLab} from './product-rules.js';
export const typeCargoLevel={id:'village-type-cargo',number:'595',kind:'type-cargo',name:'二つを結ぶ箱と選ぶ箱',tag:'積型とタグ付き和型',title:'灯りと魔石の荷物を作ろう',story:'薬師の村へ、灯りと魔石を組にして届ける箱と、どちらか一つを届ける箱を用意します。同じ「月」の印も、種類を見分けられるでしょうか。'};
export const cargoKinds={light:{name:'灯り',values:['moon','sun']},stone:{name:'魔石',values:['moon','star','rain']}};
export const cargoNames={moon:'月',sun:'太陽',star:'星',rain:'雨'};
export function cargoValues(mode){if(mode==='pair')return cargoKinds.light.values.flatMap(a=>cargoKinds.stone.values.map(b=>`pair:${a}:${b}`));if(mode==='sum')return Object.entries(cargoKinds).flatMap(([kind,info])=>info.values.map(value=>`sum:${kind}:${value}`));throw new RangeError('箱が不正です。');}
export function cargoLabel(id){const [mode,a,b]=id.split(':');if(!cargoValues(mode).includes(id))throw new RangeError('荷物が不正です。');return mode==='pair'?`灯り ${cargoNames[a]} ＋ 魔石 ${cargoNames[b]}`:`${cargoKinds[a].name} ${cargoNames[b]}`;}
export function createTypeCargo(){return {mode:'pair',pair:{light:null,stone:null,delivered:[]},sum:{kind:null,value:null,delivered:[]},answer:null,checked:false,message:'箱の中身を選びましょう。',productRules:createProductLab()};}
export function sendTypeCargo(s){
 let id;if(s.mode==='pair'){if(!s.pair.light||!s.pair.stone)return {...s,message:'灯りと魔石の両方を選びましょう。'};id=`pair:${s.pair.light}:${s.pair.stone}`;}
 else if(s.mode==='sum'){if(!s.sum.kind||!s.sum.value)return {...s,message:'種類と中身を選びましょう。'};id=`sum:${s.sum.kind}:${s.sum.value}`;}else throw new RangeError('箱が不正です。');
 if(!cargoValues(s.mode).includes(id))throw new RangeError('荷物が不正です。');
 const section=s[s.mode];if(section.delivered.includes(id))return {...s,message:'その荷物はすでに届けました。別の荷物を作れます。'};
 return {...s,[s.mode]:{...section,delivered:[...section.delivered,id]},checked:false,message:`${cargoLabel(id)} を届けました。`};
}
export function typeCargoComplete(s){return ['pair','sum'].every(m=>s[m].delivered.length===cargoValues(m).length)&&s.answer==='tag'&&s.checked;}
export function restoreTypeCargo(saved){
 if(!saved||!['pair','sum'].includes(saved.mode)||!saved.pair||!saved.sum||![null,'tag','same','both'].includes(saved.answer)||typeof saved.checked!=='boolean')throw new RangeError('記録が不正です。');
 const s=createTypeCargo();s.mode=saved.mode;s.answer=saved.answer;s.checked=saved.checked;
 for(const mode of ['pair','sum']){const delivered=saved[mode].delivered;if(!Array.isArray(delivered)||new Set(delivered).size!==delivered.length||delivered.some(id=>!cargoValues(mode).includes(id)))throw new RangeError('荷物の記録が不正です。');s[mode].delivered=[...delivered];}
 for(const kind of ['light','stone']){const value=saved.pair[kind];if(!(value===null||cargoKinds[kind].values.includes(value)))throw new RangeError('組の記録が不正です。');s.pair[kind]=value;}
 const {kind,value}=saved.sum;if(!(kind===null||Object.hasOwn(cargoKinds,kind))||!(value===null||(kind!==null&&cargoKinds[kind].values.includes(value))))throw new RangeError('選択の記録が不正です。');s.sum.kind=kind;s.sum.value=value;s.productRules=saved.productRules===undefined?createProductLab():restoreProductLab(saved.productRules);return s;
}
