export const categoryEncodingLevel={id:'workshop-category-encoding',number:'621',kind:'category-encoding',name:'色の札と灯り',tag:'カテゴリの符号化',title:'色の記録を灯りに変えよう',story:'精霊の鑑定装置は数字しか読めません。色の札を、意味が伝わる灯りの列に変えましょう。'};
export const encodingModes={zero:'３灯：未登録と欠損は消灯',reserved:'５灯：未登録と欠損を分ける'};
export const encodingRows={red:'赤',blue:'青',green:'緑',purple:'紫（未登録）',missing:'色が欠損'};
export const encodingColumns=['赤','青','緑','未登録','欠損'];
export function encodeCategory(mode,row){
 if(!Object.hasOwn(encodingModes,mode)||!Object.hasOwn(encodingRows,row))throw new RangeError('札か変換方法が不正です。');
 const index={red:0,blue:1,green:2,purple:3,missing:4}[row],length=mode==='zero'?3:5;
 return Array.from({length},(_,i)=>Number(i===index));
}
export function createCategoryEncoding(){return {mode:'zero',row:'red',bits:0,observed:[],answer:null,checked:false};}
export function categoryEncodingComplete(s){return Object.keys(encodingModes).every(m=>Object.keys(encodingRows).every(r=>s.observed.includes(`${m}:${r}`)))&&s.answer==='limits'&&s.checked;}
export function restoreCategoryEncoding(s){
 const valid=new Set(Object.keys(encodingModes).flatMap(m=>Object.keys(encodingRows).map(r=>`${m}:${r}`)));
 if(!s||!Object.hasOwn(encodingModes,s.mode)||!Object.hasOwn(encodingRows,s.row)||!Number.isInteger(s.bits)||s.bits<0||s.bits>=(s.mode==='zero'?8:32)||!Array.isArray(s.observed)||new Set(s.observed).size!==s.observed.length||s.observed.some(k=>!valid.has(k))||![null,'limits','zero','order'].includes(s.answer)||typeof s.checked!=='boolean')throw new RangeError('途中記録が不正です。');
 return {...s,observed:[...s.observed]};
}
