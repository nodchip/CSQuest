import {modularPower} from './homomorphic-product.js';
export const rsaGuessLevel={id:'castle-rsa-guess',number:'260',kind:'rsa-guess',name:'封じた数を見破る',tag:'決定的な公開鍵暗号の弱点',title:'同じ封を探そう',story:'依頼259の封じ方を知る鑑定士が、公開された封から元の数を探します。'};
export const rsaGuessCases={first:{name:'第一の封',ciphertext:27},second:{name:'第二の封',ciphertext:9}};
export function rsaGuessResult(id,guess){if(!Object.hasOwn(rsaGuessCases,id)||![1,2,3,4].includes(guess))throw new RangeError('封か候補が不正です。');const ciphertext=modularPower(guess,3,55);return {ciphertext,match:ciphertext===rsaGuessCases[id].ciphertext};}
export function createRsaGuess(){return {selected:'first',guess:1,history:{first:[],second:[]}};}
export function rsaGuessComplete(s){return Object.keys(rsaGuessCases).every(id=>s.history[id].some(guess=>rsaGuessResult(id,guess).match));}
export function restoreRsaGuess(saved){if(!saved||!Object.hasOwn(rsaGuessCases,saved.selected)||![1,2,3,4].includes(saved.guess)||!saved.history||!Object.keys(rsaGuessCases).every(id=>Array.isArray(saved.history[id])&&saved.history[id].length<=20&&saved.history[id].every(n=>[1,2,3,4].includes(n))))throw new RangeError('途中記録が不正です。');return {selected:saved.selected,guess:saved.guess,history:{first:[...saved.history.first],second:[...saved.history.second]}};}
