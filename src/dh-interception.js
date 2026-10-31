import {modularPower} from './homomorphic-product.js';
export const dhLevel={id:'castle-dh-interception',number:'261',kind:'dh-interception',name:'二つの塔の鍵交換',tag:'鍵交換と相手の認証',title:'伝令の差し替えを見抜こう',story:'二つの塔が公開の道を通して共通の秘密を作ります。'};
export const dhModes={direct:'直接交換',intercept:'途中で差し替え',authenticated:'認証して差し替えを検出'};
export function dhScenario(mode){
 if(!Object.hasOwn(dhModes,mode))throw new RangeError('場面が不正です。');
 const p=23,g=5,a=6,b=15,e=7,A=modularPower(g,a,p),B=modularPower(g,b,p),E=modularPower(g,e,p);
 if(mode==='authenticated')return {A,B,E,rejected:true};
 const changed=mode==='intercept',alice=modularPower(changed?E:B,a,p),bob=modularPower(changed?E:A,b,p);
 return {A,B,E,rejected:false,alice,bob,attackerAlice:changed?modularPower(A,e,p):null,attackerBob:changed?modularPower(B,e,p):null};
}
export function createDh(){return {selected:'direct',tested:[]};}
export function dhComplete(s){return Object.keys(dhModes).every(id=>s.tested.includes(id));}
export function restoreDh(saved){if(!saved||!Object.hasOwn(dhModes,saved.selected)||!Array.isArray(saved.tested)||saved.tested.length>3||new Set(saved.tested).size!==saved.tested.length||!saved.tested.every(id=>Object.hasOwn(dhModes,id)))throw new RangeError('途中記録が不正です。');return {selected:saved.selected,tested:[...saved.tested]};}
