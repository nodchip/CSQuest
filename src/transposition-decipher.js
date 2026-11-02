import {transpose,transposeCases} from './transposition-route.js';
export const decipherLevel={id:'archive-transposition-decipher',number:'992',kind:'transposition-decipher',name:'転置された巻物を戻す',tag:'古典暗号・復号',title:'列に戻して巻物を読もう',story:'番人から列を読む順番を受け取りました。並べ替えられた印を元の列に戻しましょう。'};
export const decipherCases={
 unique:{name:'四つの列',rows:transposeCases.unique.rows,key:[2,0,3,1]},
 duplicate:{name:'同じ列を含む巻物',rows:transposeCases.duplicate.rows,key:[1,3,0,2]}
};
export function decipherGrid(cipher,placements){const grid=Array.from({length:2},()=>Array(4).fill(null));placements.forEach((column,i)=>{grid[0][column]=cipher[i*2];grid[1][column]=cipher[i*2+1];});return grid;}
export function decipherCorrect(id,t){const c=decipherCases[id];return !!c&&!!t&&Array.isArray(t.placements)&&t.placements.length===4&&t.placements.every((column,i)=>column===c.key[i]);}
export function decipherCreate(){return {selected:'unique',trials:Object.fromEntries(Object.keys(decipherCases).map(id=>[id,{placements:[],checked:false}])),reflection:null};}
export function decipherDone(id,t){return !!t&&t.checked&&decipherCorrect(id,t);}
export function decipherComplete(s){return s.reflection==='inverse'&&Object.keys(decipherCases).every(id=>decipherDone(id,s.trials[id]));}
export function decipherRestore(saved){if(!saved||!Object.hasOwn(decipherCases,saved.selected)||![null,'inverse','same','frequency'].includes(saved.reflection))throw new RangeError('途中記録が不正です');const s=decipherCreate();s.selected=saved.selected;s.reflection=saved.reflection;for(const id of Object.keys(decipherCases)){const t=saved.trials?.[id];if(!t||!Array.isArray(t.placements)||t.placements.length>4||t.placements.some(i=>![0,1,2,3].includes(i))||new Set(t.placements).size!==t.placements.length||typeof t.checked!=='boolean'||(t.checked&&t.placements.length!==4))throw new RangeError('途中記録が不正です');s.trials[id]={placements:[...t.placements],checked:t.checked};}return s;}
export function decipherCipher(id){const c=decipherCases[id];return transpose(c.rows,c.key);}
