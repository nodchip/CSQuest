export const nestedDictionaries={red:['赤','青'],blue:['青','赤']};
export const nestedCodes={first:[0,1,0,0,1],reverse:[1,0,1,1,0],other:[0,1,1,0,1]};
export const dictionaryOffsets=[0,2,3,3,5];
export function decodeDictionary(dictId,codeId){
 if(!Object.hasOwn(nestedDictionaries,dictId)||!Object.hasOwn(nestedCodes,codeId))throw new RangeError('辞書の選択が不正です。');
 const dict=nestedDictionaries[dictId],values=nestedCodes[codeId].map(i=>dict[i]);
 return dictionaryOffsets.slice(0,-1).map((start,i)=>values.slice(start,dictionaryOffsets[i+1]));
}
export function dictionaryCorrect(dictId,codeId){return JSON.stringify(decodeDictionary(dictId,codeId))===JSON.stringify([['赤','青'],['赤'],[],['赤','青']]);}
export function createNestedDictionary(){return {dictionary:'red',codes:null,checked:false};}
export function restoreNestedDictionary(saved){
 if(saved===undefined)return createNestedDictionary();
 if(!saved||!Object.hasOwn(nestedDictionaries,saved.dictionary)||!(saved.codes===null||Object.hasOwn(nestedCodes,saved.codes))||typeof saved.checked!=='boolean'||(saved.checked&&!saved.codes))throw new RangeError('辞書の記録が不正です。');
 return {dictionary:saved.dictionary,codes:saved.codes,checked:saved.checked};
}
